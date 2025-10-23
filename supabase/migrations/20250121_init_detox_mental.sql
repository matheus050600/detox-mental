-- ============================================================================
-- DETOX MENTAL - SCHEMA COMPLETO
-- Criado em: 2025-01-21
-- Descrição: Schema completo para o app Detox Mental com autenticação,
--            meditações, progresso, streaks e assinaturas
-- ============================================================================

-- ============================================================================
-- 1. TABELA: users (Informações do usuário)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    plan_type TEXT DEFAULT 'premium' CHECK (plan_type IN ('free', 'premium', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);


-- ============================================================================
-- 2. TABELA: meditations (Áudios de meditação)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.meditations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- duração em segundos
    audio_url TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL DEFAULT 'geral',
    difficulty TEXT DEFAULT 'iniciante' CHECK (difficulty IN ('iniciante', 'intermediario', 'avancado')),
    is_premium BOOLEAN DEFAULT FALSE,
    play_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para meditações (todos podem ver, apenas admins podem editar)
ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver meditações"
    ON public.meditations FOR SELECT
    USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_meditations_category ON public.meditations(category);
CREATE INDEX IF NOT EXISTS idx_meditations_difficulty ON public.meditations(difficulty);
CREATE INDEX IF NOT EXISTS idx_meditations_play_count ON public.meditations(play_count DESC);


-- ============================================================================
-- 3. TABELA: user_progress (Progresso do usuário nas meditações)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    meditation_id UUID NOT NULL REFERENCES public.meditations(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    completed BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, meditation_id)
);

-- RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio progresso"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio progresso"
    ON public.user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso"
    ON public.user_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_meditation_id ON public.user_progress(meditation_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON public.user_progress(completed);


-- ============================================================================
-- 4. TABELA: user_streaks (Sequências/Streaks do usuário)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_meditation_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias streaks"
    ON public.user_streaks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias streaks"
    ON public.user_streaks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias streaks"
    ON public.user_streaks FOR UPDATE
    USING (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);


-- ============================================================================
-- 5. TABELA: subscriptions (Assinaturas/Planos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'premium' CHECK (plan IN ('free', 'premium', 'enterprise')),
    price DECIMAL(10, 2) DEFAULT 19.90,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'expired')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiration_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias assinaturas"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias assinaturas"
    ON public.subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias assinaturas"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);


-- ============================================================================
-- 6. TABELA: user_sessions (Histórico de sessões de meditação)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    meditation_id UUID NOT NULL REFERENCES public.meditations(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL, -- duração em segundos
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT
);

-- RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias sessões"
    ON public.user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias sessões"
    ON public.user_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_completed_at ON public.user_sessions(completed_at DESC);


-- ============================================================================
-- 7. VIEW: user_stats (Estatísticas agregadas do usuário)
-- ============================================================================
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
    u.id,
    COALESCE(COUNT(DISTINCT us.id), 0)::INTEGER AS sessions_completed,
    COALESCE(SUM(us.duration) / 60, 0)::INTEGER AS total_minutes,
    COALESCE(s.current_streak, 0)::INTEGER AS streak_days,
    COALESCE(s.longest_streak, 0)::INTEGER AS longest_streak,
    s.last_meditation_date::TEXT AS last_session_date,
    u.created_at::TEXT,
    NOW()::TEXT AS updated_at
FROM
    public.users u
LEFT JOIN
    public.user_sessions us ON u.id = us.user_id
LEFT JOIN
    public.user_streaks s ON u.id = s.user_id
GROUP BY
    u.id, s.current_streak, s.longest_streak, s.last_meditation_date, u.created_at;


-- ============================================================================
-- 8. VIEW: user_complete_profile (Perfil completo do usuário)
-- ============================================================================
CREATE OR REPLACE VIEW public.user_complete_profile AS
SELECT
    u.id,
    u.name,
    u.email,
    u.avatar_url,
    u.plan_type,
    u.created_at::TEXT,
    u.last_login::TEXT,
    stats.sessions_completed,
    stats.total_minutes,
    stats.streak_days,
    stats.longest_streak,
    stats.last_session_date
FROM
    public.users u
LEFT JOIN
    public.user_stats stats ON u.id = stats.id;


-- ============================================================================
-- 9. VIEW: popular_meditations (Meditações mais populares)
-- ============================================================================
CREATE OR REPLACE VIEW public.popular_meditations AS
SELECT
    m.*
FROM
    public.meditations m
ORDER BY
    m.play_count DESC
LIMIT 20;


-- ============================================================================
-- 10. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Função para criar registro inicial do usuário após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir na tabela users
    INSERT INTO public.users (id, email, name, created_at, last_login)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'), NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Criar streak inicial
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    -- Criar assinatura premium padrão
    INSERT INTO public.subscriptions (user_id, plan, price, status, start_date, expiration_date)
    VALUES (NEW.id, 'premium', 19.90, 'active', NOW(), NOW() + INTERVAL '1 month')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- Função para atualizar streak quando uma sessão é completada
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_date DATE;
    current_streak_val INTEGER;
    longest_streak_val INTEGER;
BEGIN
    -- Buscar dados atuais do streak
    SELECT last_meditation_date, current_streak, longest_streak
    INTO last_date, current_streak_val, longest_streak_val
    FROM public.user_streaks
    WHERE user_id = NEW.user_id;

    -- Se não existe registro, criar
    IF NOT FOUND THEN
        INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_meditation_date)
        VALUES (NEW.user_id, 1, 1, CURRENT_DATE);
        RETURN NEW;
    END IF;

    -- Verificar se meditou hoje
    IF last_date = CURRENT_DATE THEN
        -- Já meditou hoje, não fazer nada
        RETURN NEW;
    ELSIF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Meditou ontem, incrementar streak
        current_streak_val := current_streak_val + 1;

        -- Atualizar longest_streak se necessário
        IF current_streak_val > longest_streak_val THEN
            longest_streak_val := current_streak_val;
        END IF;
    ELSE
        -- Quebrou a sequência, reiniciar
        current_streak_val := 1;
    END IF;

    -- Atualizar registro
    UPDATE public.user_streaks
    SET
        current_streak = current_streak_val,
        longest_streak = longest_streak_val,
        last_meditation_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar streak
DROP TRIGGER IF EXISTS on_session_completed ON public.user_sessions;
CREATE TRIGGER on_session_completed
    AFTER INSERT ON public.user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_streak();


-- Função para incrementar play_count ao completar uma meditação
CREATE OR REPLACE FUNCTION public.increment_meditation_play_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.meditations
    SET play_count = play_count + 1
    WHERE id = NEW.meditation_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para incrementar play_count
DROP TRIGGER IF EXISTS on_meditation_played ON public.user_sessions;
CREATE TRIGGER on_meditation_played
    AFTER INSERT ON public.user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_meditation_play_count();


-- ============================================================================
-- 11. FUNÇÃO RPC: Buscar sessões por período
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_user_sessions_by_period(period_days INTEGER DEFAULT 30)
RETURNS TABLE (
    id UUID,
    meditation_id UUID,
    duration INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    rating INTEGER,
    notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        us.id,
        us.meditation_id,
        us.duration,
        us.completed_at,
        us.rating,
        us.notes
    FROM
        public.user_sessions us
    WHERE
        us.user_id = auth.uid()
        AND us.completed_at >= NOW() - (period_days || ' days')::INTERVAL
    ORDER BY
        us.completed_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 12. FUNÇÃO RPC: Buscar meditações favoritas do usuário
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_user_favorite_meditations(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    meditation_id UUID,
    title TEXT,
    times_played BIGINT,
    last_played TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        us.meditation_id,
        m.title,
        COUNT(us.id) AS times_played,
        MAX(us.completed_at) AS last_played
    FROM
        public.user_sessions us
    JOIN
        public.meditations m ON us.meditation_id = m.id
    WHERE
        us.user_id = auth.uid()
    GROUP BY
        us.meditation_id, m.title
    ORDER BY
        times_played DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- Comentários finais
COMMENT ON TABLE public.users IS 'Tabela de usuários do Detox Mental';
COMMENT ON TABLE public.meditations IS 'Catálogo de meditações e áudios disponíveis';
COMMENT ON TABLE public.user_progress IS 'Progresso individual em cada meditação';
COMMENT ON TABLE public.user_streaks IS 'Controle de sequências diárias de meditação';
COMMENT ON TABLE public.subscriptions IS 'Planos e assinaturas dos usuários';
COMMENT ON TABLE public.user_sessions IS 'Histórico completo de sessões de meditação';
