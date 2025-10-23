-- ============================================================================
-- DETOX MENTAL - INTEGRAÇÃO KIWIFY + CONTROLE DE ACESSO
-- Criado em: 2025-01-22
-- Descrição: Sistema de webhooks Kiwify e controle de acesso por token
-- ============================================================================

-- ============================================================================
-- 1. TABELA: kiwify_webhooks (Log de todos os webhooks recebidos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.kiwify_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL,
    order_ref TEXT,
    order_status TEXT NOT NULL,
    webhook_event_type TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_cpf TEXT,
    product_id TEXT,
    product_name TEXT,
    subscription_id TEXT,
    subscription_status TEXT,
    plan_name TEXT,
    plan_frequency TEXT,
    amount DECIMAL(10, 2),
    payment_method TEXT,
    raw_payload JSONB NOT NULL, -- payload completo do webhook
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_kiwify_webhooks_order_id ON public.kiwify_webhooks(order_id);
CREATE INDEX IF NOT EXISTS idx_kiwify_webhooks_customer_email ON public.kiwify_webhooks(customer_email);
CREATE INDEX IF NOT EXISTS idx_kiwify_webhooks_subscription_id ON public.kiwify_webhooks(subscription_id);
CREATE INDEX IF NOT EXISTS idx_kiwify_webhooks_processed ON public.kiwify_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_kiwify_webhooks_created_at ON public.kiwify_webhooks(created_at DESC);

-- RLS (apenas admins podem acessar)
ALTER TABLE public.kiwify_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas admins podem ver webhooks"
    ON public.kiwify_webhooks FOR SELECT
    USING (false); -- Apenas via Service Role Key


-- ============================================================================
-- 2. TABELA: access_tokens (Tokens de acesso dos usuários)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL, -- Token de acesso (ex: rsmplzhq7p9)
    is_active BOOLEAN DEFAULT TRUE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- null = sem expiração
    granted_by TEXT DEFAULT 'kiwify_webhook', -- origem do token
    kiwify_order_id TEXT,
    kiwify_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_access_tokens_user_id ON public.access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_access_tokens_email ON public.access_tokens(email);
CREATE INDEX IF NOT EXISTS idx_access_tokens_token ON public.access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_access_tokens_is_active ON public.access_tokens(is_active);
CREATE INDEX IF NOT EXISTS idx_access_tokens_kiwify_subscription ON public.access_tokens(kiwify_subscription_id);

-- RLS
ALTER TABLE public.access_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver apenas seus próprios tokens"
    ON public.access_tokens FOR SELECT
    USING (auth.uid() = user_id);


-- ============================================================================
-- 3. ATUALIZAR TABELA USERS - Adicionar campos de controle de acesso
-- ============================================================================
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS has_active_token BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS token_granted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS kiwify_customer_id TEXT,
ADD COLUMN IF NOT EXISTS kiwify_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS kiwify_subscription_status TEXT;

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_has_active_token ON public.users(has_active_token);
CREATE INDEX IF NOT EXISTS idx_users_kiwify_subscription ON public.users(kiwify_subscription_id);


-- ============================================================================
-- 4. FUNÇÃO: Processar webhook da Kiwify
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_kiwify_webhook(payload JSONB)
RETURNS JSONB AS $$
DECLARE
    webhook_id UUID;
    user_record RECORD;
    token_record RECORD;
    customer_email TEXT;
    customer_name TEXT;
    order_status TEXT;
    subscription_status TEXT;
    subscription_id TEXT;
    result JSONB;
BEGIN
    -- Extrair dados do payload
    customer_email := payload->'Customer'->>'email';
    customer_name := COALESCE(payload->'Customer'->>'full_name', payload->'Customer'->>'first_name');
    order_status := payload->>'order_status';
    subscription_status := payload->'Subscription'->>'status';
    subscription_id := payload->>'subscription_id';

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
        payload->>'order_id',
        payload->>'order_ref',
        payload->>'order_status',
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

        -- 3. Buscar usuário pelo email
        SELECT * INTO user_record
        FROM public.users
        WHERE email = customer_email
        LIMIT 1;

        -- 4. Criar ou atualizar token de acesso
        IF user_record.id IS NOT NULL THEN
            -- Usuário existe, criar/atualizar token
            INSERT INTO public.access_tokens (
                user_id,
                email,
                token,
                is_active,
                kiwify_order_id,
                kiwify_subscription_id
            ) VALUES (
                user_record.id,
                customer_email,
                'rsmplzhq7p9', -- TOKEN FIXO
                TRUE,
                payload->>'order_id',
                subscription_id
            )
            ON CONFLICT (token) DO UPDATE
            SET
                is_active = TRUE,
                kiwify_subscription_id = EXCLUDED.kiwify_subscription_id,
                updated_at = NOW();

            -- Atualizar usuário
            UPDATE public.users
            SET
                has_active_token = TRUE,
                token_granted_at = NOW(),
                kiwify_subscription_id = subscription_id,
                kiwify_subscription_status = subscription_status,
                plan_type = 'premium'
            WHERE id = user_record.id;

            -- Atualizar assinatura
            UPDATE public.subscriptions
            SET
                plan = 'premium',
                status = 'active',
                expiration_date = NOW() + INTERVAL '1 month',
                updated_at = NOW()
            WHERE user_id = user_record.id;

        ELSE
            -- Usuário não existe, criar token pendente (será vinculado ao se cadastrar)
            INSERT INTO public.access_tokens (
                email,
                token,
                is_active,
                kiwify_order_id,
                kiwify_subscription_id
            ) VALUES (
                customer_email,
                'rsmplzhq7p9',
                TRUE,
                payload->>'order_id',
                subscription_id
            )
            ON CONFLICT (token) DO UPDATE
            SET
                is_active = TRUE,
                kiwify_subscription_id = EXCLUDED.kiwify_subscription_id,
                updated_at = NOW();
        END IF;

        -- Marcar webhook como processado
        UPDATE public.kiwify_webhooks
        SET processed = TRUE, processed_at = NOW()
        WHERE id = webhook_id;

        result := jsonb_build_object(
            'success', TRUE,
            'message', 'Webhook processado com sucesso',
            'webhook_id', webhook_id,
            'user_found', user_record.id IS NOT NULL,
            'token_granted', TRUE
        );

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
            kiwify_subscription_status = subscription_status
        WHERE email = customer_email;

        -- Atualizar assinatura
        UPDATE public.subscriptions
        SET
            status = 'cancelled',
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
-- 5. FUNÇÃO: Verificar se usuário tem token ativo
-- ============================================================================
CREATE OR REPLACE FUNCTION public.user_has_active_token(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_token BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.access_tokens
        WHERE email = user_email
        AND token = 'rsmplzhq7p9'
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO has_token;

    RETURN has_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 6. FUNÇÃO: Vincular token pendente ao usuário após cadastro
-- ============================================================================
CREATE OR REPLACE FUNCTION public.link_pending_token_to_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se existe token pendente para este email
    UPDATE public.access_tokens
    SET user_id = NEW.id, updated_at = NOW()
    WHERE email = NEW.email
    AND user_id IS NULL
    AND is_active = TRUE;

    -- Se encontrou token, atualizar usuário
    IF FOUND THEN
        UPDATE public.users
        SET
            has_active_token = TRUE,
            token_granted_at = NOW(),
            plan_type = 'premium'
        WHERE id = NEW.id;

        -- Atualizar assinatura
        UPDATE public.subscriptions
        SET
            plan = 'premium',
            status = 'active',
            expiration_date = NOW() + INTERVAL '1 month'
        WHERE user_id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para vincular token ao criar usuário
DROP TRIGGER IF EXISTS on_user_created_link_token ON public.users;
CREATE TRIGGER on_user_created_link_token
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.link_pending_token_to_user();


-- ============================================================================
-- 7. VIEW: user_access_status (Status de acesso do usuário)
-- ============================================================================
CREATE OR REPLACE VIEW public.user_access_status AS
SELECT
    u.id AS user_id,
    u.email,
    u.name,
    u.has_active_token,
    u.token_granted_at,
    u.kiwify_subscription_id,
    u.kiwify_subscription_status,
    u.plan_type,
    at.token,
    at.is_active AS token_is_active,
    at.expires_at AS token_expires_at,
    at.granted_at AS token_granted_at_detail,
    CASE
        WHEN at.is_active = TRUE AND (at.expires_at IS NULL OR at.expires_at > NOW()) THEN TRUE
        ELSE FALSE
    END AS has_valid_access
FROM
    public.users u
LEFT JOIN
    public.access_tokens at ON u.id = at.user_id AND at.token = 'rsmplzhq7p9';


-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================
COMMENT ON TABLE public.kiwify_webhooks IS 'Log de todos os webhooks recebidos da Kiwify';
COMMENT ON TABLE public.access_tokens IS 'Tokens de acesso dos usuários (gerados via Kiwify)';
COMMENT ON FUNCTION public.process_kiwify_webhook IS 'Processa webhook da Kiwify e gerencia tokens de acesso';
COMMENT ON FUNCTION public.user_has_active_token IS 'Verifica se usuário tem token ativo';
COMMENT ON VIEW public.user_access_status IS 'Status consolidado de acesso do usuário';
