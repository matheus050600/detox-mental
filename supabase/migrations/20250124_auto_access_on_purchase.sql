-- ============================================================================
-- AUTOMAÇÃO: Acesso Automático ao Dashboard após Compra
-- Data: 2025-01-24
-- Descrição: Sistema que libera acesso automaticamente quando pessoa compra
-- ============================================================================

-- ============================================================================
-- 1. FUNÇÃO: Processar compra e liberar acesso imediatamente
-- ============================================================================
CREATE OR REPLACE FUNCTION public.grant_access_after_purchase(
    p_email TEXT,
    p_customer_name TEXT DEFAULT NULL,
    p_order_id TEXT DEFAULT NULL,
    p_subscription_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_token TEXT := 'rsmplzhq7p9'; -- Token fixo para todos
    v_result JSONB;
BEGIN
    -- 1. Verificar se usuário já existe
    SELECT id INTO v_user_id
    FROM public.users
    WHERE email = p_email
    LIMIT 1;

    -- 2. Se usuário existe, liberar acesso imediatamente
    IF v_user_id IS NOT NULL THEN

        -- Criar/ativar token de acesso
        INSERT INTO public.access_tokens (
            user_id,
            email,
            token,
            is_active,
            kiwify_order_id,
            kiwify_subscription_id,
            granted_by
        ) VALUES (
            v_user_id,
            p_email,
            v_token,
            TRUE,
            p_order_id,
            p_subscription_id,
            'kiwify_purchase'
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

        -- Atualizar assinatura para premium
        UPDATE public.subscriptions
        SET
            plan = 'premium',
            status = 'active',
            price = 19.90,
            start_date = NOW(),
            expiration_date = NOW() + INTERVAL '1 month',
            updated_at = NOW()
        WHERE user_id = v_user_id;

        v_result := jsonb_build_object(
            'success', TRUE,
            'message', 'Acesso liberado! Usuário já existe.',
            'user_id', v_user_id,
            'email', p_email,
            'has_access', TRUE,
            'plan', 'premium'
        );

    ELSE
        -- 3. Se usuário NÃO existe, criar token pendente
        -- Será vinculado automaticamente quando pessoa se cadastrar

        INSERT INTO public.access_tokens (
            email,
            token,
            is_active,
            kiwify_order_id,
            kiwify_subscription_id,
            granted_by
        ) VALUES (
            p_email,
            v_token,
            TRUE,
            p_order_id,
            p_subscription_id,
            'kiwify_purchase_pending'
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
            'message', 'Token pendente criado. Será ativado quando usuário se cadastrar.',
            'email', p_email,
            'has_access', FALSE,
            'pending', TRUE
        );

    END IF;

    RETURN v_result;

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', FALSE,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 2. ATUALIZAR TRIGGER: Vincular token ao cadastrar
-- ============================================================================
-- Esta função é chamada AUTOMATICAMENTE quando alguém cria conta
CREATE OR REPLACE FUNCTION public.auto_grant_access_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    v_has_pending_token BOOLEAN;
BEGIN
    -- Verificar se existe token pendente para este email
    SELECT EXISTS (
        SELECT 1 FROM public.access_tokens
        WHERE email = NEW.email
        AND token = 'rsmplzhq7p9'
        AND is_active = TRUE
    ) INTO v_has_pending_token;

    -- Se existe token pendente, vincular ao usuário
    IF v_has_pending_token THEN

        -- Vincular token ao usuário
        UPDATE public.access_tokens
        SET
            user_id = NEW.id,
            updated_at = NOW()
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

        -- Atualizar assinatura para premium
        UPDATE public.subscriptions
        SET
            plan = 'premium',
            status = 'active',
            price = 19.90,
            expiration_date = NOW() + INTERVAL '1 month',
            updated_at = NOW()
        WHERE user_id = NEW.id;

        RAISE NOTICE '✅ Token vinculado! Usuário % agora tem acesso premium.', NEW.email;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_user_created_link_token ON public.users;

-- Criar novo trigger
CREATE TRIGGER on_user_created_auto_grant_access
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_grant_access_on_signup();


-- ============================================================================
-- 3. ATUALIZAR FUNÇÃO DE WEBHOOK KIWIFY
-- ============================================================================
-- Atualizar a função process_kiwify_webhook para usar a nova lógica
CREATE OR REPLACE FUNCTION public.process_kiwify_webhook(payload JSONB)
RETURNS JSONB AS $$
DECLARE
    webhook_id UUID;
    customer_email TEXT;
    customer_name TEXT;
    order_status TEXT;
    subscription_status TEXT;
    subscription_id TEXT;
    order_id TEXT;
    result JSONB;
BEGIN
    -- Extrair dados do payload
    customer_email := payload->'Customer'->>'email';
    customer_name := COALESCE(payload->'Customer'->>'full_name', payload->'Customer'->>'first_name');
    order_status := payload->>'order_status';
    subscription_status := payload->'Subscription'->>'status';
    subscription_id := payload->>'subscription_id';
    order_id := payload->>'order_id';

    -- 1. Inserir webhook no log
    INSERT INTO public.kiwify_webhooks (
        order_id,
        order_ref,
        order_status,
        webhook_event_type,
        customer_email,
        customer_name,
        customer_cpf,
        product_id,
        product_name,
        subscription_id,
        subscription_status,
        plan_name,
        plan_frequency,
        amount,
        payment_method,
        raw_payload,
        processed
    ) VALUES (
        order_id,
        payload->>'order_ref',
        order_status,
        payload->>'webhook_event_type',
        customer_email,
        customer_name,
        payload->'Customer'->>'CPF',
        payload->'Product'->>'product_id',
        payload->'Product'->>'product_name',
        subscription_id,
        subscription_status,
        payload->'Subscription'->'plan'->>'name',
        payload->'Subscription'->'plan'->>'frequency',
        CAST(COALESCE(payload->'Commissions'->>'my_commission', '0') AS DECIMAL),
        payload->>'payment_method',
        payload,
        FALSE
    )
    ON CONFLICT (order_id) DO UPDATE
    SET
        order_status = EXCLUDED.order_status,
        subscription_status = EXCLUDED.subscription_status,
        raw_payload = EXCLUDED.raw_payload,
        created_at = NOW()
    RETURNING id INTO webhook_id;

    -- 2. Verificar se é um pagamento aprovado
    IF order_status = 'paid' OR subscription_status = 'active' THEN

        -- Usar a nova função para liberar acesso
        result := public.grant_access_after_purchase(
            customer_email,
            customer_name,
            order_id,
            subscription_id
        );

        -- Marcar webhook como processado
        UPDATE public.kiwify_webhooks
        SET processed = TRUE, processed_at = NOW()
        WHERE id = webhook_id;

        -- Adicionar info do webhook ao resultado
        result := result || jsonb_build_object('webhook_id', webhook_id);

    ELSIF order_status = 'refunded' OR subscription_status = 'canceled' THEN
        -- Pagamento reembolsado ou assinatura cancelada

        -- Desativar token
        UPDATE public.access_tokens
        SET is_active = FALSE, updated_at = NOW()
        WHERE email = customer_email AND token = 'rsmplzhq7p9';

        -- Atualizar usuário
        UPDATE public.users
        SET
            has_active_token = FALSE,
            kiwify_subscription_status = subscription_status,
            plan_type = 'free',
            updated_at = NOW()
        WHERE email = customer_email;

        -- Atualizar assinatura
        UPDATE public.subscriptions
        SET
            plan = 'free',
            status = 'cancelled',
            price = 0.00,
            updated_at = NOW()
        WHERE user_id IN (SELECT id FROM public.users WHERE email = customer_email);

        -- Marcar webhook como processado
        UPDATE public.kiwify_webhooks
        SET processed = TRUE, processed_at = NOW()
        WHERE id = webhook_id;

        result := jsonb_build_object(
            'success', TRUE,
            'message', 'Acesso revogado',
            'webhook_id', webhook_id,
            'token_revoked', TRUE
        );

    ELSE
        result := jsonb_build_object(
            'success', TRUE,
            'message', 'Webhook recebido mas não processado (status não requer ação)',
            'webhook_id', webhook_id
        );
    END IF;

    RETURN result;

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', FALSE,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 4. FUNÇÃO AUXILIAR: Verificar status de acesso de um usuário
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_user_access(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user RECORD;
    v_token RECORD;
    v_subscription RECORD;
BEGIN
    -- Buscar usuário
    SELECT * INTO v_user
    FROM public.users
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'error', 'Usuário não encontrado'
        );
    END IF;

    -- Buscar token
    SELECT * INTO v_token
    FROM public.access_tokens
    WHERE user_id = p_user_id
    AND token = 'rsmplzhq7p9'
    AND is_active = TRUE
    LIMIT 1;

    -- Buscar assinatura
    SELECT * INTO v_subscription
    FROM public.subscriptions
    WHERE user_id = p_user_id
    LIMIT 1;

    RETURN jsonb_build_object(
        'success', TRUE,
        'user_id', v_user.id,
        'email', v_user.email,
        'name', v_user.name,
        'has_active_token', v_user.has_active_token,
        'plan_type', v_user.plan_type,
        'can_access_dashboard', (v_token.id IS NOT NULL AND v_token.is_active = TRUE),
        'subscription', jsonb_build_object(
            'plan', v_subscription.plan,
            'status', v_subscription.status,
            'price', v_subscription.price,
            'expiration_date', v_subscription.expiration_date
        ),
        'token', CASE
            WHEN v_token.id IS NOT NULL THEN jsonb_build_object(
                'is_active', v_token.is_active,
                'granted_at', v_token.granted_at,
                'expires_at', v_token.expires_at
            )
            ELSE NULL
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 5. COMENTÁRIOS
-- ============================================================================
COMMENT ON FUNCTION public.grant_access_after_purchase IS 'Libera acesso automaticamente após compra (via webhook Kiwify)';
COMMENT ON FUNCTION public.auto_grant_access_on_signup IS 'Trigger: Vincula token pendente ao usuário ao se cadastrar';
COMMENT ON FUNCTION public.check_user_access IS 'Verifica status completo de acesso do usuário';


-- ============================================================================
-- 6. TESTES (Execute para testar o sistema)
-- ============================================================================

-- TESTE 1: Simular compra de pessoa que NÃO tem cadastro ainda
-- Isso cria um token pendente
/*
SELECT public.grant_access_after_purchase(
    'teste@example.com',
    'João Teste',
    'ORDER123',
    'SUB123'
);
*/

-- TESTE 2: Simular compra de pessoa que JÁ tem cadastro
-- Isso libera acesso imediatamente
/*
SELECT public.grant_access_after_purchase(
    'usuario_existente@example.com',
    'Maria Silva',
    'ORDER456',
    'SUB456'
);
*/

-- TESTE 3: Verificar status de acesso de um usuário
/*
SELECT public.check_user_access('UUID_DO_USUARIO_AQUI');
*/

-- TESTE 4: Ver todos os tokens ativos
/*
SELECT
    at.id,
    at.email,
    at.token,
    at.is_active,
    at.granted_at,
    u.name as user_name,
    u.plan_type,
    u.has_active_token
FROM public.access_tokens at
LEFT JOIN public.users u ON at.user_id = u.id
WHERE at.token = 'rsmplzhq7p9'
ORDER BY at.created_at DESC;
*/

-- ============================================================================
-- ✅ PRONTO! SISTEMA AUTOMÁTICO CONFIGURADO
-- ============================================================================
-- FLUXO AUTOMÁTICO:
--
-- CENÁRIO 1: Pessoa compra ANTES de se cadastrar
-- 1. Kiwify envia webhook → process_kiwify_webhook()
-- 2. Sistema cria token pendente com email
-- 3. Pessoa se cadastra com mesmo email
-- 4. Trigger auto_grant_access_on_signup() detecta token pendente
-- 5. Sistema vincula token e libera acesso premium
-- 6. Pessoa vai direto pro dashboard ✅
--
-- CENÁRIO 2: Pessoa se cadastra ANTES de comprar
-- 1. Pessoa cria conta (fica como free)
-- 2. Pessoa compra na Kiwify
-- 3. Kiwify envia webhook → process_kiwify_webhook()
-- 4. Sistema encontra usuário e libera acesso imediatamente
-- 5. Pessoa já pode acessar dashboard ✅
--
-- ============================================================================
