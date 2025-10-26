-- ============================================================================
-- FIX: Verificar e adicionar coluna avatar_url na tabela users
-- ============================================================================

-- Verificar se a coluna avatar_url existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'avatar_url'
    ) THEN
        -- Se não existe, criar a coluna
        ALTER TABLE public.users
        ADD COLUMN avatar_url TEXT;

        RAISE NOTICE '✅ Coluna avatar_url adicionada na tabela users';
    ELSE
        RAISE NOTICE 'ℹ️ Coluna avatar_url já existe na tabela users';
    END IF;
END $$;

-- Forçar refresh do schema cache
NOTIFY pgrst, 'reload schema';

RAISE NOTICE '✅ Schema cache atualizado!';
