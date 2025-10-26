-- ============================================================================
-- 🔧 SOLUÇÃO ALTERNATIVA - Sem Trigger em auth.users
-- ============================================================================
-- Como não temos permissão para criar trigger em auth.users,
-- vamos usar uma abordagem alternativa:
-- 1. Criar as funções necessárias
-- 2. Configurar via Database Webhooks do Supabase (via Dashboard)
-- ============================================================================

-- ============================================================================
-- PASSO 1: Limpar funções antigas
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '🧹 Limpando funções antigas...';
END $$;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user_on_signup(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.auto_grant_access_on_signup() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_on_signup(UUID, TEXT, TEXT) CASCADE;

DO $$
BEGIN
    RAISE NOTICE '✅ Limpeza concluída!';
END $$;


-- ============================================================================
-- PASSO 2: Garantir que coluna plan_type aceita 'blocked'
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '🔧 Configurando coluna plan_type...';

    -- Se plan_type for ENUM, adicionar 'blocked'
    IF EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'plan_type_enum'
    ) THEN
        ALTER TYPE plan_type_enum ADD VALUE IF NOT EXISTS 'blocked';
        RAISE NOTICE '✅ Valor "blocked" adicionado ao ENUM';
    ELSE
        RAISE NOTICE '✅ Coluna plan_type está ok (TEXT)';
    END IF;
END $$;


-- ============================================================================
-- PASSO 3: Garantir constraints UNIQUE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '🔧 Configurando constraints...';

    -- Constraint em user_streaks
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_streaks_user_id_key'
    ) THEN
        ALTER TABLE public.user_streaks
        ADD CONSTRAINT user_streaks_user_id_key UNIQUE (user_id);
        RAISE NOTICE '✅ Constraint UNIQUE adicionada em user_streaks';
    ELSE
        RAISE NOTICE '✅ Constraint em user_streaks já existe';
    END IF;

    -- Constraint em subscriptions
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'subscriptions_user_id_key'
    ) THEN
        ALTER TABLE public.subscriptions
        ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
        RAISE NOTICE '✅ Constraint UNIQUE adicionada em subscriptions';
    ELSE
        RAISE NOTICE '✅ Constraint em subscriptions já existe';
    END IF;
END $$;


-- ============================================================================
-- PASSO 4: Criar FUNÇÃO para ser chamada no signup
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '🔧 Criando função create_user_on_signup()...';
END $$;

CREATE OR REPLACE FUNCTION public.create_user_on_signup(
    p_user_id UUID,
    p_email TEXT,
    p_name TEXT DEFAULT 'Usuário'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_has_pending_token BOOLEAN := FALSE;
    v_result JSONB;
BEGIN
    RAISE NOTICE '🔔 Criando usuário: % (ID: %)', p_email, p_user_id;

    -- 1️⃣ INSERIR USUÁRIO (BLOQUEADO até pagar)
    BEGIN
        INSERT INTO public.users (
            id,
            email,
            name,
            created_at,
            last_login,
            plan_type,
            has_active_token
        ) VALUES (
            p_user_id,
            p_email,
            p_name,
            NOW(),
            NOW(),
            'blocked',
            FALSE
        )
        ON CONFLICT (id) DO UPDATE
        SET
            last_login = NOW(),
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            updated_at = NOW();

        RAISE NOTICE '✅ Usuário inserido em public.users';

    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING '❌ Erro ao inserir usuário: %', SQLERRM;
            RETURN jsonb_build_object(
                'success', FALSE,
                'error', SQLERRM
            );
    END;

    -- 2️⃣ CRIAR STREAK INICIAL
    BEGIN
        INSERT INTO public.user_streaks (
            user_id,
            current_streak,
            longest_streak,
            last_meditation_date,
            updated_at
        ) VALUES (
            p_user_id,
            0,
            0,
            NULL,
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;

        RAISE NOTICE '✅ Streak criada';

    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING '⚠️ Erro ao criar streak: %', SQLERRM;
    END;

    -- 3️⃣ VERIFICAR TOKEN PENDENTE
    BEGIN
        SELECT EXISTS (
            SELECT 1 FROM public.access_tokens
            WHERE email = p_email
            AND token = 'rsmplzhq7p9'
            AND is_active = TRUE
        ) INTO v_has_pending_token;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING '⚠️ Erro ao verificar token: %', SQLERRM;
            v_has_pending_token := FALSE;
    END;

    -- 4️⃣ SE TEM TOKEN PENDENTE, LIBERAR ACESSO PREMIUM
    IF v_has_pending_token THEN
        BEGIN
            RAISE NOTICE '🎉 Token pendente encontrado! Liberando acesso premium...';

            -- Vincular token
            UPDATE public.access_tokens
            SET user_id = p_user_id, updated_at = NOW()
            WHERE email = p_email
            AND token = 'rsmplzhq7p9'
            AND is_active = TRUE;

            -- Atualizar usuário
            UPDATE public.users
            SET
                has_active_token = TRUE,
                token_granted_at = NOW(),
                plan_type = 'premium',
                updated_at = NOW()
            WHERE id = p_user_id;

            -- Criar assinatura premium
            INSERT INTO public.subscriptions (
                user_id,
                plan,
                price,
                status,
                start_date,
                expiration_date,
                created_at
            ) VALUES (
                p_user_id,
                'premium',
                19.90,
                'active',
                NOW(),
                NOW() + INTERVAL '1 month',
                NOW()
            )
            ON CONFLICT (user_id) DO UPDATE
            SET
                plan = 'premium',
                status = 'active',
                price = 19.90,
                expiration_date = NOW() + INTERVAL '1 month',
                updated_at = NOW();

            RAISE NOTICE '✅ Usuário atualizado para PREMIUM!';

            v_result := jsonb_build_object(
                'success', TRUE,
                'user_id', p_user_id,
                'email', p_email,
                'plan', 'premium',
                'has_access', TRUE
            );

        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING '⚠️ Erro ao liberar premium: %', SQLERRM;
                v_result := jsonb_build_object(
                    'success', TRUE,
                    'user_id', p_user_id,
                    'email', p_email,
                    'plan', 'blocked',
                    'has_access', FALSE
                );
        END;
    ELSE
        RAISE NOTICE 'ℹ️ Sem token pendente. Usuário fica BLOQUEADO até pagar.';

        v_result := jsonb_build_object(
            'success', TRUE,
            'user_id', p_user_id,
            'email', p_email,
            'plan', 'blocked',
            'has_access', FALSE
        );
    END IF;

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'error', SQLERRM
        );
END;
$$;

DO $$
BEGIN
    RAISE NOTICE '✅ Função create_user_on_signup() criada!';
END $$;


-- ============================================================================
-- PASSO 5: Criar função grant_access_after_purchase
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '🔧 Criando função grant_access_after_purchase()...';
END $$;

CREATE OR REPLACE FUNCTION public.grant_access_after_purchase(
    p_email TEXT,
    p_customer_name TEXT DEFAULT NULL,
    p_order_id TEXT DEFAULT NULL,
    p_subscription_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_token TEXT := 'rsmplzhq7p9';
    v_result JSONB;
BEGIN
    SELECT id INTO v_user_id
    FROM public.users
    WHERE email = p_email
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        -- Usuário existe: liberar acesso

        INSERT INTO public.access_tokens (
            user_id, email, token, is_active,
            kiwify_order_id, kiwify_subscription_id, granted_by
        ) VALUES (
            v_user_id, p_email, v_token, TRUE,
            p_order_id, p_subscription_id, 'kiwify_purchase'
        )
        ON CONFLICT (token) DO UPDATE
        SET
            user_id = EXCLUDED.user_id,
            is_active = TRUE,
            kiwify_order_id = COALESCE(EXCLUDED.kiwify_order_id, public.access_tokens.kiwify_order_id),
            kiwify_subscription_id = COALESCE(EXCLUDED.kiwify_subscription_id, public.access_tokens.kiwify_subscription_id),
            updated_at = NOW();

        UPDATE public.users
        SET
            has_active_token = TRUE,
            token_granted_at = NOW(),
            plan_type = 'premium',
            kiwify_subscription_id = p_subscription_id,
            kiwify_subscription_status = 'active',
            updated_at = NOW()
        WHERE id = v_user_id;

        INSERT INTO public.subscriptions (
            user_id, plan, price, status, start_date, expiration_date, created_at
        ) VALUES (
            v_user_id, 'premium', 19.90, 'active', NOW(), NOW() + INTERVAL '1 month', NOW()
        )
        ON CONFLICT (user_id) DO UPDATE
        SET
            plan = 'premium',
            status = 'active',
            price = 19.90,
            start_date = NOW(),
            expiration_date = NOW() + INTERVAL '1 month',
            updated_at = NOW();

        v_result := jsonb_build_object(
            'success', TRUE,
            'message', 'Acesso liberado!',
            'user_id', v_user_id,
            'email', p_email,
            'has_access', TRUE,
            'plan', 'premium'
        );
    ELSE
        -- Usuário não existe: criar token pendente

        INSERT INTO public.access_tokens (
            email, token, is_active,
            kiwify_order_id, kiwify_subscription_id, granted_by
        ) VALUES (
            p_email, v_token, TRUE,
            p_order_id, p_subscription_id, 'kiwify_purchase_pending'
        )
        ON CONFLICT (token) DO UPDATE
        SET
            email = EXCLUDED.email,
            is_active = TRUE,
            kiwify_order_id = COALESCE(EXCLUDED.kiwify_order_id, public.access_tokens.kiwify_order_id),
            kiwify_subscription_id = COALESCE(EXCLUDED.kiwify_subscription_id, public.access_tokens.kiwify_subscription_id),
            updated_at = NOW();

        v_result := jsonb_build_object(
            'success', TRUE,
            'message', 'Token pendente criado',
            'email', p_email,
            'has_access', FALSE,
            'pending', TRUE
        );
    END IF;

    RETURN v_result;

EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'error', SQLERRM
        );
END;
$$;

DO $$
BEGIN
    RAISE NOTICE '✅ Função grant_access_after_purchase() criada!';
END $$;


-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================
DO $$
DECLARE
    func_create BOOLEAN;
    func_grant BOOLEAN;
BEGIN
    RAISE NOTICE '🔍 Verificando funções criadas...';

    SELECT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'create_user_on_signup'
        AND pronamespace = 'public'::regnamespace
    ) INTO func_create;

    SELECT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'grant_access_after_purchase'
        AND pronamespace = 'public'::regnamespace
    ) INTO func_grant;

    IF func_create AND func_grant THEN
        RAISE NOTICE '';
        RAISE NOTICE '═══════════════════════════════════════════════';
        RAISE NOTICE '✅ FUNÇÕES CRIADAS COM SUCESSO!';
        RAISE NOTICE '═══════════════════════════════════════════════';
        RAISE NOTICE '';
        RAISE NOTICE '✅ create_user_on_signup() → ATIVA';
        RAISE NOTICE '✅ grant_access_after_purchase() → ATIVA';
        RAISE NOTICE '';
        RAISE NOTICE '⚠️ PRÓXIMO PASSO: ATUALIZAR O CÓDIGO DO FRONTEND';
        RAISE NOTICE '';
        RAISE NOTICE 'No arquivo src/lib/supabase.ts, a função signUpWithEmail()';
        RAISE NOTICE 'precisa chamar create_user_on_signup() após o signup.';
        RAISE NOTICE '';
        RAISE NOTICE '═══════════════════════════════════════════════';
    ELSE
        RAISE WARNING '❌ ERRO: Funções não foram criadas!';
        IF NOT func_create THEN
            RAISE WARNING '  ❌ create_user_on_signup NÃO EXISTE';
        END IF;
        IF NOT func_grant THEN
            RAISE WARNING '  ❌ grant_access_after_purchase NÃO EXISTE';
        END IF;
    END IF;
END $$;

-- Comentários
COMMENT ON FUNCTION public.create_user_on_signup IS 'Cria usuário BLOQUEADO em public.users após signup (chamada pelo frontend)';
COMMENT ON FUNCTION public.grant_access_after_purchase IS 'Libera acesso após pagamento na Kiwify';
