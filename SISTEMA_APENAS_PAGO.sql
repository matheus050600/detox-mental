-- ============================================================================
-- ✅ SISTEMA APENAS PAGO - SEM ASSINATURA FREE
-- ============================================================================
-- REGRA: Só quem PAGAR tem acesso ao dashboard
-- - Cadastro cria usuário mas NÃO libera acesso
-- - Pessoa vê página "Acesso Negado"
-- - Só após PAGAR na Kiwify que libera acesso
-- ============================================================================

-- ============================================================================
-- PASSO 1: Limpar triggers e funções antigas
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_link_token ON public.users;
DROP TRIGGER IF EXISTS on_user_created_auto_grant_access ON public.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user_on_signup(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.auto_grant_access_on_signup() CASCADE;

RAISE NOTICE '✅ Funções e triggers antigos removidos';


-- ============================================================================
-- PASSO 2: Criar FUNÇÃO - Cadastro SEM liberar acesso
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_has_pending_token BOOLEAN;
    v_user_name TEXT;
BEGIN
    -- Extrair nome do metadata ou usar padrão
    v_user_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        'Usuário'
    );

    RAISE NOTICE '🔔 Novo usuário detectado: % (ID: %)', NEW.email, NEW.id;

    -- 1️⃣ INSERIR USUÁRIO NA TABELA public.users (SEM ACESSO)
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
        'blocked', -- ⚠️ BLOQUEADO até pagar
        FALSE
    )
    ON CONFLICT (id) DO UPDATE
    SET
        last_login = NOW(),
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW();

    RAISE NOTICE '✅ Usuário criado em public.users (BLOQUEADO até pagar)';

    -- 2️⃣ CRIAR STREAK INICIAL (mas desabilitado)
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

    RAISE NOTICE '✅ Streak inicial criada';

    -- 3️⃣ NÃO CRIAR ASSINATURA FREE - Apenas se pagar
    -- Assinatura será criada apenas quando webhook da Kiwify chegar

    -- 4️⃣ VERIFICAR SE EXISTE TOKEN PENDENTE (Pessoa que JÁ PAGOU antes de cadastrar)
    SELECT EXISTS (
        SELECT 1 FROM public.access_tokens
        WHERE email = NEW.email
        AND token = 'rsmplzhq7p9'
        AND is_active = TRUE
        AND (user_id IS NULL OR user_id = NEW.id)
    ) INTO v_has_pending_token;

    -- 5️⃣ SE EXISTE TOKEN PENDENTE, LIBERAR ACESSO PREMIUM
    IF v_has_pending_token THEN
        RAISE NOTICE '🎉 Token pendente encontrado! Cliente JÁ PAGOU. Liberando acesso premium para %', NEW.email;

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

        -- CRIAR assinatura premium (só agora)
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

        RAISE NOTICE '✅ Usuário % atualizado para PREMIUM! Pode acessar dashboard.', NEW.email;
    ELSE
        RAISE NOTICE '⚠️ Nenhum token pendente. Usuário % ficou BLOQUEADO (sem acesso até pagar).', NEW.email;
    END IF;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        -- Em caso de erro, logar mas não bloquear o cadastro
        RAISE WARNING '❌ Erro ao processar novo usuário %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE '✅ Função handle_new_user() criada (APENAS PAGO)';


-- ============================================================================
-- PASSO 3: Criar TRIGGER
-- ============================================================================
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE '✅ Trigger on_auth_user_created criado';


-- ============================================================================
-- PASSO 4: Atualizar função de webhook para criar assinatura apenas ao pagar
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
    v_token TEXT := 'rsmplzhq7p9';
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

        -- Criar/atualizar assinatura premium
        INSERT INTO public.subscriptions (
            user_id,
            plan,
            price,
            status,
            start_date,
            expiration_date,
            created_at
        ) VALUES (
            v_user_id,
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
            start_date = NOW(),
            expiration_date = NOW() + INTERVAL '1 month',
            updated_at = NOW();

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

RAISE NOTICE '✅ Função grant_access_after_purchase() atualizada (APENAS PAGO)';


-- ============================================================================
-- PASSO 5: Garantir constraints
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_streaks_user_id_key'
    ) THEN
        ALTER TABLE public.user_streaks
        ADD CONSTRAINT user_streaks_user_id_key UNIQUE (user_id);
        RAISE NOTICE '✅ Constraint UNIQUE adicionada em user_streaks';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'subscriptions_user_id_key'
    ) THEN
        ALTER TABLE public.subscriptions
        ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
        RAISE NOTICE '✅ Constraint UNIQUE adicionada em subscriptions';
    END IF;
END $$;


-- ============================================================================
-- PASSO 6: Verificação Final
-- ============================================================================
DO $$
DECLARE
    func_exists BOOLEAN;
    trig_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'handle_new_user'
        AND pronamespace = 'public'::regnamespace
    ) INTO func_exists;

    SELECT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
    ) INTO trig_exists;

    IF func_exists AND trig_exists THEN
        RAISE NOTICE '🎉 SUCESSO! Sistema APENAS PAGO configurado!';
        RAISE NOTICE '✅ Usuários só terão acesso após PAGAR na Kiwify';
        RAISE NOTICE '✅ Cadastro livre mas sem acesso ao dashboard';
    ELSE
        RAISE WARNING '❌ ERRO: Função ou trigger não foram criados';
    END IF;
END $$;


-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================
COMMENT ON FUNCTION public.handle_new_user IS 'Trigger: Cria usuário BLOQUEADO até pagar (sem free)';
COMMENT ON FUNCTION public.grant_access_after_purchase IS 'Libera acesso APENAS após pagamento confirmado na Kiwify';


-- ============================================================================
-- ✅ SISTEMA APENAS PAGO ATIVADO!
-- ============================================================================
-- FLUXO:
--
-- 1. Pessoa se cadastra no site
--    ↓
-- 2. Usuário criado em public.users com plan_type = 'blocked'
--    ↓
-- 3. Pessoa tenta entrar → vê página "Acesso Negado"
--    ↓
-- 4. Pessoa clica em "Assinar Agora" → vai pra Kiwify
--    ↓
-- 5. Pessoa paga → Kiwify envia webhook
--    ↓
-- 6. Sistema libera acesso e cria assinatura premium
--    ↓
-- 7. Pessoa faz login → ENTRA NO DASHBOARD! 🎉
--
-- ============================================================================
