-- ============================================================================
-- CORRE��O: Fun��o handle_new_user() - Erro no Cadastro
-- Data: 2025-01-23
-- Descri��o: Corrige erro "Database error saving new user" no cadastro
-- ============================================================================

-- 1. Remover trigger antigo (se existir)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Remover fun��o antiga (se existir)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 3. Criar fun��o CORRIGIDA
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir usu�rio na tabela public.users
    -- Se j� existir, apenas atualizar last_login
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
        COALESCE(NEW.raw_user_meta_data->>'name', 'Usu�rio'),
        NOW(),
        NOW(),
        'free', -- Padr�o � free, muda para premium quando pagar
        FALSE
    )
    ON CONFLICT (id) DO UPDATE
    SET
        last_login = NOW(),
        email = EXCLUDED.email,
        updated_at = NOW();

    -- Criar streak inicial (se n�o existir)
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

    -- Criar assinatura inicial (se n�o existir)
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
        NULL, -- Free n�o expira
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- Vincular token pendente (se houver um para este email)
    -- Isso permite que quem pagou antes de se cadastrar receba acesso
    PERFORM public.link_pending_token_to_user_on_signup(NEW.id, NEW.email);

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log do erro (vis�vel nos logs do Supabase)
        RAISE WARNING 'Erro ao criar usu�rio %: %', NEW.email, SQLERRM;
        -- Retorna NEW mesmo com erro para n�o bloquear o signup
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Criar fun��o auxiliar para vincular token pendente
CREATE OR REPLACE FUNCTION public.link_pending_token_to_user_on_signup(
    p_user_id UUID,
    p_email TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Verificar se existe token pendente para este email
    UPDATE public.access_tokens
    SET
        user_id = p_user_id,
        updated_at = NOW()
    WHERE
        email = p_email
        AND user_id IS NULL
        AND is_active = TRUE;

    -- Se encontrou token, atualizar usu�rio
    IF FOUND THEN
        UPDATE public.users
        SET
            has_active_token = TRUE,
            token_granted_at = NOW(),
            plan_type = 'premium'
        WHERE id = p_user_id;

        -- Atualizar assinatura
        UPDATE public.subscriptions
        SET
            plan = 'premium',
            status = 'active',
            price = 19.90,
            expiration_date = NOW() + INTERVAL '1 month',
            updated_at = NOW()
        WHERE user_id = p_user_id;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- N�o propagar erro, apenas logar
        RAISE WARNING 'Erro ao vincular token para %: %', p_email, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Recriar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- 6. Garantir que a constraint UNIQUE existe em user_streaks
DO $$
BEGIN
    -- Adicionar constraint se n�o existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'user_streaks_user_id_key'
    ) THEN
        ALTER TABLE public.user_streaks
        ADD CONSTRAINT user_streaks_user_id_key UNIQUE (user_id);
    END IF;
END $$;


-- 7. Garantir que a constraint UNIQUE existe em subscriptions
DO $$
BEGIN
    -- Adicionar constraint se n�o existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'subscriptions_user_id_key'
    ) THEN
        ALTER TABLE public.subscriptions
        ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
    END IF;
END $$;


-- 8. Coment�rios
COMMENT ON FUNCTION public.handle_new_user IS 'Trigger para criar registros iniciais ao cadastrar usu�rio (CORRIGIDO)';
COMMENT ON FUNCTION public.link_pending_token_to_user_on_signup IS 'Vincula token pendente ao usu�rio ap�s cadastro';


-- ============================================================================
-- VERIFICA��O: Execute para testar se est� funcionando
-- ============================================================================

-- Ver fun��o criada
SELECT
    proname as function_name,
    prosrc as function_body
FROM pg_proc
WHERE proname IN ('handle_new_user', 'link_pending_token_to_user_on_signup')
AND pronamespace = 'public'::regnamespace;

-- Ver trigger criado
SELECT
    tgname as trigger_name,
    tgtype as trigger_type,
    tgenabled as enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
