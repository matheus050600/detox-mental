-- ============================================================================
-- DETOX MENTAL - DATABASE SCHEMA
-- Sistema de meditação e desenvolvimento mental com gestão de usuários
-- Compatible com Supabase PostgreSQL
-- ============================================================================

-- ============================================================================
-- SECTION 1: EXTENSÕES
-- ============================================================================

-- Habilita geração de UUIDs
create extension if not exists "uuid-ossp";

-- ============================================================================
-- SECTION 2: TABELA DE PERFIS DE USUÁRIO
-- ============================================================================

-- Tabela principal de perfis de usuários
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text not null,
  avatar_url text,
  plan_type text not null default 'free' check (plan_type in ('free', 'premium', 'enterprise')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Índices para melhor performance
create index if not exists user_profiles_email_idx on public.user_profiles(email);
create index if not exists user_profiles_plan_type_idx on public.user_profiles(plan_type);

-- Comentários para documentação
comment on table public.user_profiles is 'Perfis de usuários com informações básicas e tipo de plano';
comment on column public.user_profiles.plan_type is 'Tipo de plano: free, premium ou enterprise';

-- ============================================================================
-- SECTION 3: ESTATÍSTICAS DE USUÁRIO
-- ============================================================================

-- Tabela de estatísticas e progresso do usuário
create table if not exists public.user_stats (
  id uuid primary key references auth.users(id) on delete cascade,
  sessions_completed integer not null default 0 check (sessions_completed >= 0),
  total_minutes integer not null default 0 check (total_minutes >= 0),
  streak_days integer not null default 0 check (streak_days >= 0),
  last_session_date date,
  longest_streak integer not null default 0 check (longest_streak >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Índices
create index if not exists user_stats_last_session_date_idx on public.user_stats(last_session_date);
create index if not exists user_stats_streak_days_idx on public.user_stats(streak_days);

-- Comentários
comment on table public.user_stats is 'Estatísticas de progresso e meditação de cada usuário';
comment on column public.user_stats.longest_streak is 'Maior sequência de dias consecutivos de meditação';

-- ============================================================================
-- SECTION 4: MEDITAÇÕES DISPONÍVEIS
-- ============================================================================

-- Tabela de meditações disponíveis no app
create table if not exists public.meditations (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  duration integer not null check (duration > 0),
  audio_url text not null,
  image_url text,
  category text default 'geral',
  difficulty text default 'iniciante' check (difficulty in ('iniciante', 'intermediario', 'avancado')),
  is_premium boolean not null default false,
  play_count integer not null default 0 check (play_count >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Índices
create index if not exists meditations_category_idx on public.meditations(category);
create index if not exists meditations_difficulty_idx on public.meditations(difficulty);
create index if not exists meditations_is_premium_idx on public.meditations(is_premium);
create index if not exists meditations_play_count_idx on public.meditations(play_count desc);

-- Comentários
comment on table public.meditations is 'Catálogo de meditações disponíveis no aplicativo';
comment on column public.meditations.play_count is 'Número total de vezes que a meditação foi reproduzida';

-- ============================================================================
-- SECTION 5: HISTÓRICO DE SESSÕES
-- ============================================================================

-- Tabela de sessões de meditação concluídas
create table if not exists public.user_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meditation_id uuid not null references public.meditations(id) on delete cascade,
  duration integer not null check (duration > 0),
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  rating integer check (rating >= 1 and rating <= 5),
  notes text
);

-- Índices
create index if not exists user_sessions_user_id_idx on public.user_sessions(user_id);
create index if not exists user_sessions_meditation_id_idx on public.user_sessions(meditation_id);
create index if not exists user_sessions_completed_at_idx on public.user_sessions(completed_at desc);
create index if not exists user_sessions_user_date_idx on public.user_sessions(user_id, completed_at);

-- Comentários
comment on table public.user_sessions is 'Histórico de sessões de meditação concluídas por usuário';
comment on column public.user_sessions.rating is 'Avaliação da sessão de 1 a 5 estrelas';

-- ============================================================================
-- SECTION 6: RESULTADOS DE QUIZ
-- ============================================================================

-- Tabela de resultados de quiz de autoconhecimento
create table if not exists public.quiz_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  result_type text not null,
  score integer check (score >= 0 and score <= 100),
  insights text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index if not exists quiz_results_user_id_idx on public.quiz_results(user_id);
create index if not exists quiz_results_result_type_idx on public.quiz_results(result_type);
create index if not exists quiz_results_created_at_idx on public.quiz_results(created_at desc);

-- Comentários
comment on table public.quiz_results is 'Resultados de quiz de autoconhecimento realizados pelos usuários';
comment on column public.quiz_results.answers is 'Respostas do quiz em formato JSON';

-- ============================================================================
-- SECTION 7: LOGS DE ACESSO
-- ============================================================================

-- Tabela de logs de login/logout
create table if not exists public.user_access_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null check (action in ('login', 'logout', 'signup')),
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index if not exists user_access_logs_user_id_idx on public.user_access_logs(user_id);
create index if not exists user_access_logs_action_idx on public.user_access_logs(action);
create index if not exists user_access_logs_created_at_idx on public.user_access_logs(created_at desc);

-- Comentários
comment on table public.user_access_logs is 'Registro de acessos (login/logout) dos usuários';

-- ============================================================================
-- SECTION 8: HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilita RLS em todas as tabelas
alter table public.user_profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.meditations enable row level security;
alter table public.user_sessions enable row level security;
alter table public.quiz_results enable row level security;
alter table public.user_access_logs enable row level security;

-- ============================================================================
-- SECTION 9: POLÍTICAS DE SEGURANÇA - USER_PROFILES
-- ============================================================================

-- Usuários podem ver apenas seu próprio perfil
create policy "Users can view own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
create policy "Users can update own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Permitir inserção durante criação de conta (via trigger)
create policy "Enable insert for authenticated users during signup"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

-- ============================================================================
-- SECTION 10: POLÍTICAS DE SEGURANÇA - USER_STATS
-- ============================================================================

-- Usuários podem ver apenas suas próprias estatísticas
create policy "Users can view own stats"
  on public.user_stats
  for select
  using (auth.uid() = id);

-- Usuários podem atualizar apenas suas próprias estatísticas
create policy "Users can update own stats"
  on public.user_stats
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Permitir inserção durante criação de conta (via trigger)
create policy "Enable insert for authenticated users during signup"
  on public.user_stats
  for insert
  with check (auth.uid() = id);

-- ============================================================================
-- SECTION 11: POLÍTICAS DE SEGURANÇA - MEDITATIONS
-- ============================================================================

-- Qualquer usuário autenticado pode ver meditações
create policy "Authenticated users can view all meditations"
  on public.meditations
  for select
  using (auth.role() = 'authenticated');

-- Apenas admins podem inserir, atualizar ou deletar meditações
-- (Para isso, você precisará criar uma coluna is_admin na tabela user_profiles
-- ou usar uma função customizada. Por enquanto, vamos bloquear para usuários normais)
create policy "Only service role can modify meditations"
  on public.meditations
  for all
  using (auth.role() = 'service_role');

-- ============================================================================
-- SECTION 12: POLÍTICAS DE SEGURANÇA - USER_SESSIONS
-- ============================================================================

-- Usuários podem ver apenas suas próprias sessões
create policy "Users can view own sessions"
  on public.user_sessions
  for select
  using (auth.uid() = user_id);

-- Usuários podem inserir apenas suas próprias sessões
create policy "Users can insert own sessions"
  on public.user_sessions
  for insert
  with check (auth.uid() = user_id);

-- Usuários podem atualizar apenas suas próprias sessões
create policy "Users can update own sessions"
  on public.user_sessions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Usuários podem deletar apenas suas próprias sessões
create policy "Users can delete own sessions"
  on public.user_sessions
  for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- SECTION 13: POLÍTICAS DE SEGURANÇA - QUIZ_RESULTS
-- ============================================================================

-- Usuários podem ver apenas seus próprios resultados
create policy "Users can view own quiz results"
  on public.quiz_results
  for select
  using (auth.uid() = user_id);

-- Usuários podem inserir apenas seus próprios resultados
create policy "Users can insert own quiz results"
  on public.quiz_results
  for insert
  with check (auth.uid() = user_id);

-- ============================================================================
-- SECTION 14: POLÍTICAS DE SEGURANÇA - USER_ACCESS_LOGS
-- ============================================================================

-- Usuários podem ver apenas seus próprios logs
create policy "Users can view own access logs"
  on public.user_access_logs
  for select
  using (auth.uid() = user_id);

-- Usuários podem inserir apenas seus próprios logs
create policy "Users can insert own access logs"
  on public.user_access_logs
  for insert
  with check (auth.uid() = user_id);

-- ============================================================================
-- SECTION 15: FUNÇÃO PARA CRIAR PERFIL AUTOMÁTICO
-- ============================================================================

-- Função que cria automaticamente perfil e stats quando novo usuário é criado
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insere novo perfil
  insert into public.user_profiles (id, email, name, last_login)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    now()
  );

  -- Insere estatísticas zeradas
  insert into public.user_stats (id)
  values (new.id);

  -- Registra log de signup
  insert into public.user_access_logs (user_id, action)
  values (new.id, 'signup');

  return new;
end;
$$;

-- Trigger que executa a função quando usuário é criado
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- SECTION 16: FUNÇÃO PARA ATUALIZAR STATS APÓS SESSÃO
-- ============================================================================

-- Função que atualiza automaticamente as estatísticas quando sessão é concluída
create or replace function public.update_user_stats_on_session()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  current_date_utc date;
  last_session date;
  current_streak integer;
begin
  current_date_utc := date(timezone('utc'::text, now()));

  -- Busca última sessão do usuário
  select last_session_date, streak_days
  into last_session, current_streak
  from public.user_stats
  where id = new.user_id;

  -- Atualiza contador de sessões e minutos
  update public.user_stats
  set
    sessions_completed = sessions_completed + 1,
    total_minutes = total_minutes + (new.duration / 60),
    last_session_date = current_date_utc,

    -- Lógica de streak
    streak_days = case
      -- Se primeira sessão
      when last_session is null then 1
      -- Se sessão no mesmo dia, mantém streak
      when last_session = current_date_utc then streak_days
      -- Se sessão no dia seguinte, incrementa
      when last_session = current_date_utc - interval '1 day' then streak_days + 1
      -- Se pulou dias, reinicia
      else 1
    end,

    -- Atualiza longest_streak se necessário
    longest_streak = greatest(
      longest_streak,
      case
        when last_session is null then 1
        when last_session = current_date_utc then streak_days
        when last_session = current_date_utc - interval '1 day' then streak_days + 1
        else 1
      end
    ),

    updated_at = now()
  where id = new.user_id;

  -- Incrementa play_count da meditação
  update public.meditations
  set
    play_count = play_count + 1,
    updated_at = now()
  where id = new.meditation_id;

  return new;
end;
$$;

-- Trigger que atualiza stats quando nova sessão é inserida
drop trigger if exists on_session_completed on public.user_sessions;
create trigger on_session_completed
  after insert on public.user_sessions
  for each row execute function public.update_user_stats_on_session();

-- ============================================================================
-- SECTION 17: FUNÇÃO PARA ATUALIZAR UPDATED_AT
-- ============================================================================

-- Função genérica para atualizar timestamp de updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Triggers para atualizar updated_at automaticamente
create trigger update_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.update_updated_at_column();

create trigger update_user_stats_updated_at
  before update on public.user_stats
  for each row execute function public.update_updated_at_column();

create trigger update_meditations_updated_at
  before update on public.meditations
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- SECTION 18: VIEWS ÚTEIS
-- ============================================================================

-- View com perfil completo do usuário (perfil + stats)
create or replace view public.user_complete_profile as
select
  p.id,
  p.name,
  p.email,
  p.avatar_url,
  p.plan_type,
  p.created_at,
  p.last_login,
  s.sessions_completed,
  s.total_minutes,
  s.streak_days,
  s.longest_streak,
  s.last_session_date
from public.user_profiles p
left join public.user_stats s on p.id = s.id;

-- View com meditações mais populares
create or replace view public.popular_meditations as
select
  id,
  title,
  description,
  duration,
  audio_url,
  image_url,
  category,
  difficulty,
  is_premium,
  play_count
from public.meditations
order by play_count desc
limit 20;

-- ============================================================================
-- SECTION 19: FUNÇÕES HELPER PARA ESTATÍSTICAS
-- ============================================================================

-- Função para buscar histórico de sessões por período
create or replace function public.get_user_sessions_by_period(
  period_days integer default 30
)
returns table (
  session_date date,
  sessions_count bigint,
  total_minutes integer
)
language plpgsql
security definer set search_path = public
as $$
begin
  return query
  select
    date(completed_at) as session_date,
    count(*)::bigint as sessions_count,
    sum(duration / 60)::integer as total_minutes
  from public.user_sessions
  where
    user_id = auth.uid()
    and completed_at >= (current_date - interval '1 day' * period_days)
  group by date(completed_at)
  order by session_date desc;
end;
$$;

-- Função para buscar meditações favoritas do usuário
create or replace function public.get_user_favorite_meditations(
  limit_count integer default 5
)
returns table (
  meditation_id uuid,
  title text,
  times_completed bigint,
  total_minutes integer
)
language plpgsql
security definer set search_path = public
as $$
begin
  return query
  select
    s.meditation_id,
    m.title,
    count(*)::bigint as times_completed,
    sum(s.duration / 60)::integer as total_minutes
  from public.user_sessions s
  join public.meditations m on s.meditation_id = m.id
  where s.user_id = auth.uid()
  group by s.meditation_id, m.title
  order by times_completed desc, total_minutes desc
  limit limit_count;
end;
$$;

-- ============================================================================
-- SECTION 20: DADOS INICIAIS (OPCIONAL)
-- ============================================================================

-- Inserir algumas meditações de exemplo
-- Descomente e ajuste conforme necessário

/*
insert into public.meditations (title, description, duration, audio_url, image_url, category, difficulty) values
('Respiração Consciente', 'Pratique técnicas de respiração para acalmar a mente', 300, 'https://example.com/audio/respiracao.mp3', 'https://example.com/img/respiracao.jpg', 'iniciantes', 'iniciante'),
('Meditação Guiada', 'Meditação completa guiada para iniciantes', 600, 'https://example.com/audio/guiada.mp3', 'https://example.com/img/guiada.jpg', 'iniciantes', 'iniciante'),
('Sono Profundo', 'Meditação para facilitar o sono', 1200, 'https://example.com/audio/sono.mp3', 'https://example.com/img/sono.jpg', 'sono', 'intermediario'),
('Foco e Concentração', 'Melhore seu foco e produtividade', 900, 'https://example.com/audio/foco.mp3', 'https://example.com/img/foco.jpg', 'trabalho', 'intermediario'),
('Gratidão Diária', 'Cultive sentimento de gratidão', 450, 'https://example.com/audio/gratidao.mp3', 'https://example.com/img/gratidao.jpg', 'mindfulness', 'iniciante');
*/

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================

-- Para verificar se tudo foi criado corretamente:
-- select tablename from pg_tables where schemaname = 'public' order by tablename;
