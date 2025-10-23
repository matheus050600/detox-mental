-- Criar tabela user_streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_meditation_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver apenas seus próprios streaks
CREATE POLICY "Users can view their own streaks"
    ON public.user_streaks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política: usuários podem inserir seus próprios streaks
CREATE POLICY "Users can insert their own streaks"
    ON public.user_streaks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política: usuários podem atualizar seus próprios streaks
CREATE POLICY "Users can update their own streaks"
    ON public.user_streaks
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);

-- Função para criar streak automaticamente quando um novo usuário se registra
CREATE OR REPLACE FUNCTION public.create_user_streak()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_meditation_date)
    VALUES (NEW.id, 0, 0, NULL);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar streak automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_user_streak();

-- Garantir que a tabela user_progress existe
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_name TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para user_progress
CREATE POLICY "Users can view their own progress"
    ON public.user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON public.user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Criar índice para user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at ON public.user_progress(completed_at);
