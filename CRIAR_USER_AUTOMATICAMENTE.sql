-- ============================================================================
-- ✅ CRIAR USUÁRIO AUTOMATICAMENTE EM public.users QUANDO CADASTRAR
-- ============================================================================
-- ESTE SCRIPT GARANTE QUE:
-- 1. Quando alguém se cadastra via Authentication
-- 2. O usuário é criado automaticamente na tabela public.users
-- 3. Com streak inicial, assinatura free e tudo configurado
-- 4. Se tiver token de compra pendente, já libera como premium
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
-- PASSO 2: Criar FUNÇÃO que será executada quando alguém se cadastrar
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

    -- 1️⃣ INSERIR USUÁRIO NA TABELA public.users
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
        'free', -- Padrão é free, muda para premium se tiver token
        FALSE
    )
    ON CONFLICT (id) DO UPDATE
    SET
        last_login = NOW(),
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW();

    RAISE NOTICE '✅ Usuário criado em public.users';

    -- 2️⃣ CRIAR STREAK INICIAL
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

    -- 3️⃣ CRIAR ASSINATURA INICIAL (FREE)
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
        'free',
        0.00,
        'active',
        NOW(),
        NULL, -- Free não expira
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE '✅ Assinatura free criada';

    -- 4️⃣ VERIFICAR SE EXISTE TOKEN PENDENTE (Pessoa que comprou antes de cadastrar)
    SELECT EXISTS (
        SELECT 1 FROM public.access_tokens
        WHERE email = NEW.email
        AND token = 'rsmplzhq7p9'
        AND is_active = TRUE
        AND (user_id IS NULL OR user_id = NEW.id)
    ) INTO v_has_pending_token;

    -- 5️⃣ SE EXISTE TOKEN PENDENTE, LIBERAR COMO PREMIUM
    IF v_has_pending_token THEN
        RAISE NOTICE '🎉 Token pendente encontrado! Liberando acesso premium para %', NEW.email;

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

        RAISE NOTICE '✅ Usuário % atualizado para PREMIUM!', NEW.email;
    ELSE
        RAISE NOTICE 'ℹ️ Nenhum token pendente. Usuário % ficou como FREE.', NEW.email;
    END IF;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        -- Em caso de erro, logar mas não bloquear o cadastro
        RAISE WARNING '❌ Erro ao processar novo usuário %: %', NEW.email, SQLERRM;
        RETURN NEW; -- Não bloquear o signup
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE '✅ Função handle_new_user() criada com sucesso';


-- ============================================================================
-- PASSO 3: Criar TRIGGER que chama a função automaticamente
-- ============================================================================
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE '✅ Trigger on_auth_user_created criado com sucesso';


-- ============================================================================
-- PASSO 4: Garantir constraints UNIQUE (evitar duplicatas)
-- ============================================================================
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
        RAISE NOTICE 'ℹ️ Constraint user_streaks_user_id_key já existe';
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
        RAISE NOTICE 'ℹ️ Constraint subscriptions_user_id_key já existe';
    END IF;
END $$;


-- ============================================================================
-- PASSO 5: Verificar se tudo foi criado corretamente
-- ============================================================================
DO $$
DECLARE
    func_exists BOOLEAN;
    trig_exists BOOLEAN;
BEGIN
    -- Verificar função
    SELECT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'handle_new_user'
        AND pronamespace = 'public'::regnamespace
    ) INTO func_exists;

    -- Verificar trigger
    SELECT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
    ) INTO trig_exists;

    IF func_exists AND trig_exists THEN
        RAISE NOTICE '🎉 SUCESSO TOTAL! Função e trigger estão ativos!';
        RAISE NOTICE '✅ Agora quando alguém se cadastrar via Authentication, será criado automaticamente em public.users';
    ELSE
        RAISE WARNING '❌ ERRO: Função ou trigger não foram criados corretamente';
        IF NOT func_exists THEN
            RAISE WARNING '  - Função handle_new_user NÃO EXISTE';
        END IF;
        IF NOT trig_exists THEN
            RAISE WARNING '  - Trigger on_auth_user_created NÃO EXISTE';
        END IF;
    END IF;
END $$;


-- ============================================================================
-- 📊 CONSULTAS DE VERIFICAÇÃO (Execute depois para testar)
-- ============================================================================

-- Ver função criada
SELECT
    'Função' as tipo,
    proname as nome,
    'Ativa' as status
FROM pg_proc
WHERE proname = 'handle_new_user'
AND pronamespace = 'public'::regnamespace;

-- Ver trigger criado
SELECT
    'Trigger' as tipo,
    tgname as nome,
    CASE tgenabled
        WHEN 'O' THEN '✅ Ativo'
        WHEN 'D' THEN '❌ Desativado'
        ELSE '⚠️ Desconhecido'
    END as status,
    'auth.users' as tabela_monitorada
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';


-- ============================================================================
-- 🧪 TESTE OPCIONAL: Simular cadastro (CUIDADO!)
-- ============================================================================
/*
⚠️ ATENÇÃO: Este teste cria um usuário REAL no auth.users!
Descomente apenas se quiser testar:

-- Criar usuário de teste
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    instance_id,
    aud,
    role
) VALUES (
    gen_random_uuid(),
    'teste_trigger_' || substring(gen_random_uuid()::text from 1 for 8) || '@example.com',
    crypt('senha123', gen_salt('bf')),
    NOW(),
    '{"name": "Teste Trigger"}',
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated'
);

-- Verificar se foi criado em public.users
SELECT
    u.id,
    u.email,
    u.name,
    u.plan_type,
    u.has_active_token,
    s.plan as subscription_plan,
    s.status as subscription_status
FROM public.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
ORDER BY u.created_at DESC
LIMIT 5;
*/


-- ============================================================================
-- ✅ CONCLUÍDO!
-- ============================================================================
-- PRÓXIMOS PASSOS:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Vá no site e crie uma conta nova
-- 3. Verifique em Table Editor → users se o usuário apareceu
-- 4. Verifique também em user_streaks e subscriptions
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger automático: Cria usuário em public.users quando cadastra via Authentication';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Trigger que chama handle_new_user() ao inserir em auth.users';
