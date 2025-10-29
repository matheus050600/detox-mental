import { createClient } from '@supabase/supabase-js'

// ============================================================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================================================
// As credenciais vêm do arquivo .env na raiz do projeto
// Certifique-se de criar o arquivo .env baseado no .env.example

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não configuradas!')
  console.error('Por favor, crie um arquivo .env baseado no .env.example')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// TIPOS
// ============================================================================

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  plan_type: 'free' | 'premium' | 'enterprise';
  created_at: string;
  last_login: string | null;
  updated_at: string;
}

export interface UserStats {
  id: string;
  sessions_completed: number;
  total_minutes: number;
  streak_days: number;
  last_session_date: string | null;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface Meditation {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  audio_url: string;
  image_url: string | null;
  category: string;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  is_premium: boolean;
  play_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  meditation_id: string;
  duration: number;
  completed_at: string;
  rating: number | null;
  notes: string | null;
}

export interface CompleteProfile {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  plan_type: string;
  created_at: string;
  last_login: string | null;
  sessions_completed: number;
  total_minutes: number;
  streak_days: number;
  longest_streak: number;
  last_session_date: string | null;
}

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

// Fazer login com email e senha
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Atualizar último login
  if (data.user) {
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id)
  }

  return data
}

// Fazer cadastro com email e senha
export async function signUpWithEmail(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || 'Usuário',
      },
    },
  })

  if (error) throw error

  // Chamar função para criar usuário em public.users
  if (data.user) {
    const { data: createResult, error: createError } = await supabase.rpc('create_user_on_signup', {
      p_user_id: data.user.id,
      p_email: data.user.email,
      p_name: name || 'Usuário'
    })

    if (createError) {
      console.error('Erro ao criar usuário em public.users:', createError)
      throw new Error('Database error saving new user')
    }

    console.log('✅ Usuário criado em public.users:', createResult)
  }

  return data
}

// Função para fazer logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Função para recuperar senha
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
  return data
}

// Função para obter o usuário atual
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Função para verificar se está autenticado
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Função para fazer login com Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/hoje`,
    },
  })

  if (error) throw error
  return data
}

// ============================================================================
// FUNÇÕES DE PERFIL E ESTATÍSTICAS
// ============================================================================

// Buscar perfil completo do usuário (perfil + stats)
export async function getUserCompleteProfile(): Promise<CompleteProfile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // CORREÇÃO: Buscar da VIEW user_complete_profile que contém as estatísticas
  // em vez da tabela users
  const { data, error } = await supabase
    .from('user_complete_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil completo:', error)
    return null
  }

  // Debug: log dos dados recebidos
  console.log('📊 Perfil atualizado:', {
    timestamp: new Date().toLocaleTimeString(),
    sessions: data.sessions_completed,
    minutes: data.total_minutes,
    streak: data.streak_days,
    longest_streak: data.longest_streak,
  })

  return data as CompleteProfile
}

// Buscar apenas perfil
export async function getUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }
  return data as UserProfile
}

// Atualizar perfil do usuário
export async function updateUserProfile(updates: Partial<UserProfile>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Buscar estatísticas do usuário
export async function getUserStats(): Promise<UserStats | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// FUNÇÕES DE MEDITAÇÕES
// ============================================================================

// Buscar todas as meditações
export async function getAllMeditations(): Promise<Meditation[]> {
  const { data, error } = await supabase
    .from('meditations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Buscar meditações por categoria
export async function getMeditationsByCategory(category: string): Promise<Meditation[]> {
  const { data, error } = await supabase
    .from('meditations')
    .select('*')
    .eq('category', category)
    .order('play_count', { ascending: false })

  if (error) throw error
  return data || []
}

// Buscar meditação por ID
export async function getMeditationById(id: string): Promise<Meditation | null> {
  const { data, error } = await supabase
    .from('meditations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Buscar meditações populares
export async function getPopularMeditations(): Promise<Meditation[]> {
  const { data, error } = await supabase
    .from('popular_meditations')
    .select('*')

  if (error) throw error
  return data || []
}

// ============================================================================
// FUNÇÕES DE SESSÕES
// ============================================================================

// Completar uma sessão de meditação
export async function completeMeditationSession(
  meditationId: string,
  duration: number,
  rating?: number,
  notes?: string
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('user_sessions')
    .insert({
      user_id: user.id,
      meditation_id: meditationId,
      duration,
      rating: rating || null,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Buscar histórico de sessões
export async function getUserSessions(limit: number = 10): Promise<UserSession[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Buscar sessões por período (usando RPC)
export async function getSessionsByPeriod(periodDays: number = 30) {
  const { data, error } = await supabase
    .rpc('get_user_sessions_by_period', { period_days: periodDays })

  if (error) throw error
  return data || []
}

// Buscar meditações favoritas (usando RPC)
export async function getFavoriteMeditations(limitCount: number = 5) {
  const { data, error } = await supabase
    .rpc('get_user_favorite_meditations', { limit_count: limitCount })

  if (error) throw error
  return data || []
}

// ============================================================================
// FUNÇÕES DE LOG DE ACESSO
// ============================================================================

// Registrar login
export async function logUserAccess(action: 'login' | 'logout' | 'signup') {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('user_access_logs')
    .insert({
      user_id: user.id,
      action,
    })

  if (error) console.error('Erro ao registrar log de acesso:', error)
}

// Atualizar último login
export async function updateLastLogin() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id)
}

// ============================================================================
// PROGRESSO E CONTROLE DE SESSÕES
// ============================================================================

// Atualizar progresso em uma meditação
export async function updateMeditationProgress(
  meditationId: string,
  progressPercent: number
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const completed = progressPercent >= 100

  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      meditation_id: meditationId,
      progress_percent: progressPercent,
      completed,
      last_updated: new Date().toISOString(),
    }, {
      onConflict: 'user_id,meditation_id'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Buscar progresso de uma meditação específica
export async function getMeditationProgress(meditationId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('meditation_id', meditationId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Buscar todas as meditações completadas
export async function getCompletedMeditations() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_progress')
    .select('*, meditations(*)')
    .eq('user_id', user.id)
    .eq('completed', true)

  if (error) throw error
  return data || []
}

// ============================================================================
// ASSINATURAS
// ============================================================================

// Buscar assinatura do usuário
export async function getUserSubscription() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Atualizar assinatura
export async function updateSubscription(updates: {
  plan?: string
  price?: number
  status?: string
  expiration_date?: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// STREAKS
// ============================================================================

// Buscar streak do usuário
export async function getUserStreak() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// ============================================================================
// KIWIFY WEBHOOK + CONTROLE DE ACESSO
// ============================================================================

// Verificar se usuário tem token ativo (rsmplzhq7p9)
export async function checkUserHasActiveToken() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('access_tokens')
    .select('*')
    .eq('user_id', user.id)
    .eq('token', 'rsmplzhq7p9')
    .eq('is_active', true)
    .single()

  if (error && error.code !== 'PGRST116') return false

  // Verificar se o token expirou
  if (data?.expires_at) {
    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return false
    }
  }

  return !!data
}

// Buscar status completo de acesso do usuário
export async function getUserAccessStatus() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_access_status')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Processar webhook da Kiwify (chamado via API externa ou função serverless)
export async function processKiwifyWebhook(payload: any) {
  const { data, error } = await supabase.rpc('process_kiwify_webhook', {
    payload: payload,
  })

  if (error) throw error
  return data
}

// Verificar se email tem token pendente (antes de cadastrar)
export async function checkPendingTokenByEmail(email: string) {
  const { data, error } = await supabase
    .from('access_tokens')
    .select('*')
    .eq('email', email)
    .eq('token', 'rsmplzhq7p9')
    .eq('is_active', true)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Buscar todos os webhooks (apenas para admins)
export async function getKiwifyWebhooks(limit: number = 50) {
  const { data, error } = await supabase
    .from('kiwify_webhooks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
