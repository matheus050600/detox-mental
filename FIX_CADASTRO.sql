-- ============================================================================
-- =' CORREÇÃO RÁPIDA: Erro no Cadastro "Database error saving new user"
-- ============================================================================
-- COMO USAR:
-- 1. Acesse: https://app.supabase.com/
-- 2. Selecione seu projeto
-- 3. Vá em SQL Editor ’ New Query
-- 4. Cole TODO este arquivo
-- 5. Clique em RUN (ou Ctrl+Enter)
-- ============================================================================

-- >ù PASSO 1: Limpar funções e triggers antigos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_created_link_token ON public.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.link_pending_token_to_user() CASCADE;

RAISE NOTICE ' Triggers e funções antigas removidas';


-- =' PASSO 2: Criar função CORRIGIDA para criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir ou atualizar usuário
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
        COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
        NOW(),
        NOW(),
        'free',
        FALSE
    )
    ON CONFLICT (id) DO UPDATE
    SET
        last_login = NOW(),
        email = EXCLUDED.email,
        updated_at = NOW();

    -- Criar streak inicial
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    -- Criar assinatura inicial free
    INSERT INTO public.subscriptions (user_id, plan, price, status, start_date)
    VALUES (NEW.id, 'free', 0.00, 'active', NOW())
    ON CONFLICT (user_id) DO NOTHING;

    -- Verificar se existe token pendente
    UPDATE public.access_tokens
    SET user_id = NEW.id, updated_at = NOW()
    WHERE email = NEW.email AND user_id IS NULL AND is_active = TRUE;

    -- Se encontrou token, atualizar para premium
    IF FOUND THEN
        UPDATE public.users
        SET has_active_token = TRUE, token_granted_at = NOW(), plan_type = 'premium'
        WHERE id = NEW.id;

        UPDATE public.subscriptions
        SET plan = 'premium', status = 'active', price = 19.90, expiration_date = NOW() + INTERVAL '1 month'
        WHERE user_id = NEW.id;
    END IF;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erro ao criar usuário %: %', NEW.email, SQLERRM;
        RETURN NEW; -- Não bloquear o signup
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

RAISE NOTICE ' Função handle_new_user() recriada';


-- =' PASSO 3: Recriar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE ' Trigger on_auth_user_created recriado';


-- =' PASSO 4: Garantir constraints UNIQUE
ALTER TABLE public.user_streaks DROP CONSTRAINT IF EXISTS user_streaks_user_id_key;
ALTER TABLE public.user_streaks ADD CONSTRAINT user_streaks_user_id_key UNIQUE (user_id);

ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

RAISE NOTICE ' Constraints UNIQUE adicionadas';


-- >ê PASSO 5: Verificar se funcionou
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
        RAISE NOTICE '<‰ SUCESSO! Função e trigger estão ativos!';
    ELSE
        RAISE WARNING 'L ERRO: Função ou trigger não foram criados corretamente';
    END IF;
END $$;


-- ============================================================================
-- =Ê VERIFICAÇÃO FINAL (Execute para ver detalhes)
-- ============================================================================

-- Ver função criada
SELECT
    'Função' as tipo,
    proname as nome,
    prosrc as codigo
FROM pg_proc
WHERE proname = 'handle_new_user'
AND pronamespace = 'public'::regnamespace;

-- Ver trigger criado
SELECT
    'Trigger' as tipo,
    tgname as nome,
    tgenabled as ativo,
    CASE tgenabled
        WHEN 'O' THEN ' Ativo'
        WHEN 'D' THEN 'L Desativado'
        ELSE '  Desconhecido'
    END as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';


-- ============================================================================
-- >ê TESTE OPCIONAL: Simular cadastro (descomente para testar)
-- ============================================================================

/*
-- ATENÇÃO: Isso vai criar um usuário fake no auth.users
-- Use apenas para teste!

DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
BEGIN
    -- Inserir usuário de teste
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        test_user_id,
        'teste_cadastro_' || substring(test_user_id::text from 1 for 8) || '@example.com',
        crypt('senha123', gen_salt('bf')),
        NOW(),
        '{"name": "Usuário Teste"}'::jsonb,
        NOW(),
        NOW()
    );

    RAISE NOTICE ' Usuário de teste criado: %', test_user_id;

    -- Verificar se foi criado em public.users
    IF EXISTS (SELECT 1 FROM public.users WHERE id = test_user_id) THEN
        RAISE NOTICE ' Trigger funcionou! Usuário inserido em public.users';
    ELSE
        RAISE WARNING 'L Trigger NÃO funcionou! Usuário não foi inserido em public.users';
    END IF;
END $$;
*/


-- ============================================================================
--  CONCLUÍDO!
-- ============================================================================
-- Agora você pode testar o cadastro normalmente.
-- Se ainda der erro, verifique os logs do Supabase em:
-- Dashboard ’ Logs ’ Postgres Logs
-- ============================================================================
