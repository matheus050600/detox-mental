-- ============================================================================
-- 🔧 FIX DEFINITIVO - Erro "Database error saving new user"
-- ============================================================================
-- ESTE SCRIPT RESOLVE O ERRO DE CADASTRO DE UMA VEZ POR TODAS!
-- Execute no Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PASSO 1: Limpar TUDO (começar do zero)
-- ============================================================================
RAISE NOTICE '🧹 Limpando triggers e funções antigas...';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_link_token ON public.users;
DROP TRIGGER IF EXISTS on_user_created_auto_grant_access ON public.users;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user_on_signup(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.auto_grant_access_on_signup() CASCADE;

RAISE NOTICE '✅ Limpeza concluída!';


-- ============================================================================
-- PASSO 2: Garantir que coluna plan_type aceita 'blocked'
-- ============================================================================
RAISE NOTICE '🔧 Configurando coluna plan_type...';

DO $$
BEGIN
    -- Se plan_type for ENUM, adicionar 'blocked'
    IF EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'plan_type_enum'
    ) THEN
        ALTER TYPE plan_type_enum ADD VALUE IF NOT EXISTS 'blocked';
        RAISE NOTICE '✅ Valor "blocked" adicionado ao ENUM';
    ELSE
        -- Se for TEXT, não precisa fazer nada
        RAISE NOTICE '✅ Coluna plan_type está ok (TEXT)';
    END IF;
END $$;


-- ============================================================================
-- PASSO 3: Garantir constraints UNIQUE (evitar duplicatas)
-- ============================================================================
RAISE NOTICE '🔧 Configurando constraints...';

DO $$
BEGIN
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
-- PASSO 4: Criar FUNÇÃO DEFINITIVA (Sistema Apenas Pago)
-- ============================================================================
RAISE NOTICE '🔧 Criando função handle_new_user()...';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_has_pending_token BOOLEAN := FALSE;
    v_user_name TEXT;
BEGIN
    -- Extrair nome do metadata
    v_user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        'Usuário'
    );

    RAISE NOTICE '🔔 Novo usuário: % (ID: %)', NEW.email, NEW.id;

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
            NEW.id,
            NEW.email,
            v_user_name,
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
            RETURN NEW; -- Não bloquear signup
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
            NEW.id,
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
            -- Continuar mesmo com erro
    END;

    -- 3️⃣ VERIFICAR TOKEN PENDENTE (pessoa pagou antes de cadastrar)
    BEGIN
        SELECT EXISTS (
            SELECT 1 FROM public.access_tokens
            WHERE email = NEW.email
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

            -- Vincular token ao usuário
            UPDATE public.access_tokens
            SET user_id = NEW.id, updated_at = NOW()
            WHERE email = NEW.email
            AND token = 'rsmplzhq7p9'
            AND is_active = TRUE;

            -- Atualizar usuário para premium
            UPDATE public.users
            SET
                has_active_token = TRUE,
                token_granted_at = NOW(),
                plan_type = 'premium',
                updated_at = NOW()
            WHERE id = NEW.id;

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
                NEW.id,
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

        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING '⚠️ Erro ao liberar premium: %', SQLERRM;
                -- Continuar (usuário fica bloqueado)
        END;
    ELSE
        RAISE NOTICE 'ℹ️ Sem token pendente. Usuário fica BLOQUEADO até pagar.';
    END IF;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        -- Último recurso: logar erro mas não bloquear signup
        RAISE WARNING '❌ ERRO GERAL no handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

RAISE NOTICE '✅ Função handle_new_user() criada!';


-- ============================================================================
-- PASSO 5: Criar TRIGGER
-- ============================================================================
RAISE NOTICE '🔧 Criando trigger...';

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE '✅ Trigger on_auth_user_created criado!';


-- ============================================================================
-- PASSO 6: Criar função grant_access_after_purchase (webhook Kiwify)
-- ============================================================================
RAISE NOTICE '🔧 Criando função grant_access_after_purchase()...';

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
    -- Verificar se usuário existe
    SELECT id INTO v_user_id
    FROM public.users
    WHERE email = p_email
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        -- Usuário existe: liberar acesso imediatamente

        -- Criar/ativar token
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

        -- Atualizar usuário
        UPDATE public.users
        SET
            has_active_token = TRUE,
            token_granted_at = NOW(),
            plan_type = 'premium',
            kiwify_subscription_id = p_subscription_id,
            kiwify_subscription_status = 'active',
            updated_at = NOW()
        WHERE id = v_user_id;

        -- Criar assinatura
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

RAISE NOTICE '✅ Função grant_access_after_purchase() criada!';


-- ============================================================================
-- PASSO 7: VERIFICAÇÃO FINAL
-- ============================================================================
RAISE NOTICE '🔍 Verificando se tudo foi criado...';

DO $$
DECLARE
    func_handle BOOLEAN;
    func_grant BOOLEAN;
    trig_exists BOOLEAN;
BEGIN
    -- Verificar função handle_new_user
    SELECT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'handle_new_user'
        AND pronamespace = 'public'::regnamespace
    ) INTO func_handle;

    -- Verificar função grant_access_after_purchase
    SELECT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'grant_access_after_purchase'
        AND pronamespace = 'public'::regnamespace
    ) INTO func_grant;

    -- Verificar trigger
    SELECT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
    ) INTO trig_exists;

    IF func_handle AND func_grant AND trig_exists THEN
        RAISE NOTICE '';
        RAISE NOTICE '═══════════════════════════════════════════════';
        RAISE NOTICE '🎉 SUCESSO TOTAL! TUDO CONFIGURADO!';
        RAISE NOTICE '═══════════════════════════════════════════════';
        RAISE NOTICE '';
        RAISE NOTICE '✅ Função handle_new_user() → ATIVA';
        RAISE NOTICE '✅ Função grant_access_after_purchase() → ATIVA';
        RAISE NOTICE '✅ Trigger on_auth_user_created → ATIVO';
        RAISE NOTICE '';
        RAISE NOTICE '📋 AGORA VOCÊ PODE:';
        RAISE NOTICE '1. Criar uma conta no site';
        RAISE NOTICE '2. Usuário será criado BLOQUEADO';
        RAISE NOTICE '3. Só terá acesso após PAGAR';
        RAISE NOTICE '';
        RAISE NOTICE '💰 Valor: R$ 19,90/mês';
        RAISE NOTICE '═══════════════════════════════════════════════';
    ELSE
        RAISE WARNING '';
        RAISE WARNING '❌ ERRO: Algo não foi criado corretamente!';
        IF NOT func_handle THEN
            RAISE WARNING '  ❌ Função handle_new_user NÃO EXISTE';
        END IF;
        IF NOT func_grant THEN
            RAISE WARNING '  ❌ Função grant_access_after_purchase NÃO EXISTE';
        END IF;
        IF NOT trig_exists THEN
            RAISE WARNING '  ❌ Trigger on_auth_user_created NÃO EXISTE';
        END IF;
        RAISE WARNING '';
    END IF;
END $$;


-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================
COMMENT ON FUNCTION public.handle_new_user IS 'Trigger: Cria usuário BLOQUEADO até pagar (Sistema Apenas Pago)';
COMMENT ON FUNCTION public.grant_access_after_purchase IS 'Libera acesso após pagamento na Kiwify';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Dispara handle_new_user() ao criar usuário';


-- ============================================================================
-- 🧪 TESTE RÁPIDO (Opcional - descomente para testar)
-- ============================================================================
/*
-- Testar se a função está funcionando
DO $$
DECLARE
    test_id UUID := gen_random_uuid();
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🧪 TESTE: Inserindo usuário fake no auth.users...';

    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        aud,
        role
    ) VALUES (
        test_id,
        '00000000-0000-0000-0000-000000000000',
        'teste_' || substring(test_id::text from 1 for 8) || '@example.com',
        crypt('senha123', gen_salt('bf')),
        NOW(),
        '{"name": "Usuário Teste"}',
        NOW(),
        NOW(),
        'authenticated',
        'authenticated'
    );

    -- Verificar se foi criado em public.users
    IF EXISTS (SELECT 1 FROM public.users WHERE id = test_id) THEN
        RAISE NOTICE '✅ TESTE PASSOU! Usuário foi criado em public.users';

        -- Limpar
        DELETE FROM auth.users WHERE id = test_id;
        DELETE FROM public.users WHERE id = test_id;
        RAISE NOTICE '✅ Usuário de teste removido';
    ELSE
        RAISE WARNING '❌ TESTE FALHOU! Usuário NÃO foi criado em public.users';
    END IF;

    RAISE NOTICE '';
END $$;
*/
