-- ============================================================================
-- MIGRATION: Sistema Apenas Pago (Sem Free)
-- Data: 2025-01-25
-- Descrição: Remove plano free, só libera acesso após pagamento
-- ============================================================================

-- 1. Atualizar coluna plan_type para aceitar 'blocked'
-- Se a coluna for ENUM, precisamos adicionar o valor 'blocked'
DO $$
BEGIN
    -- Verificar se plan_type é ENUM
    IF EXISTS (
        SELECT 1 FROM pg_type
        WHERE typname = 'plan_type_enum'
    ) THEN
        -- Adicionar 'blocked' ao ENUM se não existir
        ALTER TYPE plan_type_enum ADD VALUE IF NOT EXISTS 'blocked';
        RAISE NOTICE '✅ Valor "blocked" adicionado ao ENUM plan_type';
    END IF;
END $$;

-- 2. Atualizar todos os usuários 'free' para 'blocked'
UPDATE public.users
SET
    plan_type = 'blocked',
    has_active_token = FALSE,
    updated_at = NOW()
WHERE plan_type = 'free' OR plan_type IS NULL;

RAISE NOTICE '✅ Todos os usuários free foram atualizados para blocked';

-- 3. Remover todas as assinaturas free
DELETE FROM public.subscriptions
WHERE plan = 'free';

RAISE NOTICE '✅ Todas as assinaturas free foram removidas';

-- 4. Limpar triggers antigos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_link_token ON public.users;
DROP TRIGGER IF EXISTS on_user_created_auto_grant_access ON public.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user_on_signup(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.auto_grant_access_on_signup() CASCADE;

RAISE NOTICE '✅ Triggers e funções antigas removidas';

-- 5. Criar função NOVA (sem criar assinatura free)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_has_pending_token BOOLEAN;
    v_user_name TEXT;
BEGIN
    v_user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        'Usuário'
    );

    -- Inserir usuário BLOQUEADO
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

    -- Criar streak inicial
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

    -- NÃO criar assinatura free (só cria quando pagar)

    -- Verificar token pendente (pessoa pagou antes de cadastrar)
    SELECT EXISTS (
        SELECT 1 FROM public.access_tokens
        WHERE email = NEW.email
        AND token = 'rsmplzhq7p9'
        AND is_active = TRUE
        AND (user_id IS NULL OR user_id = NEW.id)
    ) INTO v_has_pending_token;

    -- Se tem token pendente, liberar acesso premium
    IF v_has_pending_token THEN
        -- Vincular token
        UPDATE public.access_tokens
        SET user_id = NEW.id, updated_at = NOW()
        WHERE email = NEW.email
        AND token = 'rsmplzhq7p9'
        AND is_active = TRUE;

        -- Atualizar para premium
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
    END IF;

    RETURN NEW;

EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Erro ao criar usuário %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE '✅ Função handle_new_user() criada (APENAS PAGO)';

-- 6. Recriar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE '✅ Trigger on_auth_user_created criado';

-- 7. Atualizar função grant_access_after_purchase
CREATE OR REPLACE FUNCTION public.grant_access_after_purchase(
    p_email TEXT,
    p_customer_name TEXT DEFAULT NULL,
    p_order_id TEXT DEFAULT NULL,
    p_subscription_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
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
        -- Criar token
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

        -- Atualizar usuário para premium
        UPDATE public.users
        SET
            has_active_token = TRUE,
            token_granted_at = NOW(),
            plan_type = 'premium',
            kiwify_subscription_id = p_subscription_id,
            kiwify_subscription_status = 'active',
            updated_at = NOW()
        WHERE id = v_user_id;

        -- Criar assinatura premium
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
            'success', TRUE, 'message', 'Acesso liberado!',
            'user_id', v_user_id, 'email', p_email,
            'has_access', TRUE, 'plan', 'premium'
        );
    ELSE
        -- Criar token pendente
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
            'email', p_email, 'has_access', FALSE, 'pending', TRUE
        );
    END IF;

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', FALSE, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE '✅ Função grant_access_after_purchase() atualizada';

-- 8. Comentários
COMMENT ON FUNCTION public.handle_new_user IS 'Cria usuário BLOQUEADO até pagar (sem free)';
COMMENT ON FUNCTION public.grant_access_after_purchase IS 'Libera acesso APENAS após pagamento Kiwify';

-- 9. Verificação final
DO $$
BEGIN
    RAISE NOTICE '🎉 SISTEMA APENAS PAGO ATIVADO!';
    RAISE NOTICE '✅ Cadastro livre mas SEM acesso gratuito';
    RAISE NOTICE '✅ Acesso liberado APENAS após pagamento na Kiwify';
    RAISE NOTICE '✅ Valor: R$ 19,90/mês';
END $$;
