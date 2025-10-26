-- ============================================================================
-- FIX: Ajustar colunas da tabela subscriptions
-- ============================================================================

-- Ver estrutura atual
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'subscriptions'
ORDER BY ordinal_position;

-- Remover constraint NOT NULL de plan_name (se existir)
ALTER TABLE public.subscriptions
ALTER COLUMN plan_name DROP NOT NULL;

-- Ou renomear se plan_name não deveria existir
-- (A função usa "plan", não "plan_name")

-- Verificar se tem coluna "plan"
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'subscriptions'
        AND column_name = 'plan'
    ) THEN
        -- Se não tem coluna "plan", criar
        ALTER TABLE public.subscriptions
        ADD COLUMN plan TEXT DEFAULT 'free';

        RAISE NOTICE '✅ Coluna plan criada';
    END IF;
END $$;

-- Atualizar plan_name para ser nullable ou remover
ALTER TABLE public.subscriptions
ALTER COLUMN plan_name DROP NOT NULL;

RAISE NOTICE '✅ Tabela subscriptions ajustada!';
