-- ============================================================================
-- FIX: Adicionar coluna updated_at na tabela subscriptions
-- ============================================================================

-- Adicionar coluna updated_at se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'subscriptions'
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.subscriptions
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

        RAISE NOTICE '✅ Coluna updated_at adicionada em subscriptions';
    ELSE
        RAISE NOTICE 'ℹ️ Coluna updated_at já existe';
    END IF;
END $$;

-- Atualizar registros existentes
UPDATE public.subscriptions
SET updated_at = NOW()
WHERE updated_at IS NULL;

RAISE NOTICE '✅ Tabela subscriptions corrigida!';
