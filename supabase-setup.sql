-- =====================================================
-- DETOX MENTAL - SUPABASE DATABASE SETUP
-- Script SQL completo e essencial
-- =====================================================

-- Habilitar extensão UUID (se não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1️⃣ TABELA: users
-- Armazena os dados dos usuários
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    plan_type TEXT DEFAULT 'free',
    plan_value NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar usuários por email rapidamente
CREATE INDEX idx_users_email ON users(email);

-- =====================================================
-- 2️⃣ TABELA: meditations
-- Catálogo de meditações disponíveis
-- =====================================================
CREATE TABLE meditations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- duração em minutos
    category TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar meditações por categoria
CREATE INDEX idx_meditations_category ON meditations(category);

-- =====================================================
-- 3️⃣ TABELA: user_progress
-- Progresso do usuário em cada meditação
-- =====================================================
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meditation_id UUID NOT NULL REFERENCES meditations(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Garante que cada usuário tenha apenas um registro de progresso por meditação
    UNIQUE(user_id, meditation_id)
);

-- Índices para consultas rápidas
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_meditation ON user_progress(meditation_id);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4️⃣ TABELA: user_streaks
-- Sequência de dias de meditação do usuário
-- =====================================================
CREATE TABLE user_streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_meditation_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER update_user_streaks_updated_at
    BEFORE UPDATE ON user_streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5️⃣ TABELA: subscriptions
-- Assinaturas e planos dos usuários
-- =====================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar assinaturas por usuário
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Índice único parcial: Um usuário pode ter apenas uma assinatura ativa por vez
CREATE UNIQUE INDEX idx_subscriptions_user_active ON subscriptions(user_id) WHERE status = 'active';

-- =====================================================
-- POLICIES DE SEGURANÇA (Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- USERS: Usuários podem ler e atualizar apenas seus próprios dados
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- MEDITATIONS: Todos podem ler (catálogo público)
CREATE POLICY "Anyone can view meditations" ON meditations
    FOR SELECT USING (true);

-- USER_PROGRESS: Usuários podem gerenciar apenas seu próprio progresso
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- USER_STREAKS: Usuários podem gerenciar apenas suas próprias streaks
CREATE POLICY "Users can view own streaks" ON user_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON user_streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON user_streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- SUBSCRIPTIONS: Usuários podem ver apenas suas próprias assinaturas
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- Exemplos de meditações para popular o banco
-- =====================================================

INSERT INTO meditations (title, description, duration, category, audio_url, image_url) VALUES
('Respiração Consciente', 'Uma prática simples de respiração para acalmar a mente', 10, 'Iniciantes', '/assets/audios/respiracao-consciente.mp3', '/assets/images/respiracao.jpg'),
('Meditação Guiada para Ansiedade', 'Técnicas específicas para reduzir ansiedade e estresse', 15, 'Ansiedade', '/assets/audios/ansiedade.mp3', '/assets/images/ansiedade.jpg'),
('Sono Profundo', 'Relaxamento guiado para uma noite de sono tranquila', 20, 'Sono', '/assets/audios/sono-profundo.mp3', '/assets/images/sono.jpg'),
('Mindfulness no Trabalho', 'Práticas rápidas para aumentar foco e produtividade', 5, 'Trabalho', '/assets/audios/mindfulness-trabalho.mp3', '/assets/images/trabalho.jpg'),
('Gratidão Diária', 'Cultive gratidão e positividade no seu dia', 8, 'Bem-estar', '/assets/audios/gratidao.mp3', '/assets/images/gratidao.jpg');

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Para verificar se tudo foi criado corretamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
