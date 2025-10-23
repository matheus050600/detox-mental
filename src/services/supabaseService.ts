import { supabase } from '@/lib/supabase'

// ============================================================================
// TIPOS PARA AS TABELAS DO DETOX MENTAL
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  plan_type: string
  plan_value: number
  created_at: string
}

export interface Meditation {
  id: string
  title: string
  description: string | null
  duration: number
  category: string
  audio_url: string
  image_url: string | null
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  meditation_id: string
  progress_percent: number
  completed: boolean
  updated_at: string
}

export interface UserStreak {
  user_id: string
  current_streak: number
  longest_streak: number
  last_meditation_date: string | null
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_name: string
  price: number
  start_date: string
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  created_at: string
}

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

/**
 * Faz login com email e senha
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Faz cadastro com email, senha e nome
 * Cria automaticamente o plano mensal padrão
 */
export async function signUpWithEmail(name: string, email: string, password: string) {
  // 1. Cria o usuário no Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('Erro ao criar usuário')

  // 2. Insere dados na tabela users
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      name: name,
      email: email,
      plan_type: 'mensal',
      plan_value: 19.90,
    })

  if (userError) throw userError

  // 3. Cria assinatura inicial
  const { error: subError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: authData.user.id,
      plan_name: 'Plano Mensal',
      price: 19.90,
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
    })

  if (subError) throw subError

  // 4. Inicializa streak do usuário
  const { error: streakError } = await supabase
    .from('user_streaks')
    .insert({
      user_id: authData.user.id,
      current_streak: 0,
      longest_streak: 0,
      last_meditation_date: null,
    })

  if (streakError) throw streakError

  return authData
}

/**
 * Faz logout
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Obtém o usuário autenticado atual
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

/**
 * Busca os dados completos do usuário da tabela users
 */
export async function getUserData(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// MEDITAÇÕES
// ============================================================================

/**
 * Busca todas as meditações
 */
export async function getAllMeditations(): Promise<Meditation[]> {
  const { data, error } = await supabase
    .from('meditations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Busca meditações por categoria
 */
export async function getMeditationsByCategory(category: string): Promise<Meditation[]> {
  const { data, error } = await supabase
    .from('meditations')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Busca uma meditação específica por ID
 */
export async function getMeditationById(id: string): Promise<Meditation | null> {
  const { data, error } = await supabase
    .from('meditations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// PROGRESSO DO USUÁRIO
// ============================================================================

/**
 * Busca o progresso do usuário em uma meditação específica
 */
export async function getUserProgress(meditationId: string): Promise<UserProgress | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('meditation_id', meditationId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data
}

/**
 * Atualiza o progresso do usuário em uma meditação
 */
export async function updateUserProgress(
  meditationId: string,
  progressPercent: number,
  completed: boolean = false
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  // Verifica se já existe um registro de progresso
  const existing = await getUserProgress(meditationId)

  if (existing) {
    // Atualiza o registro existente
    const { data, error } = await supabase
      .from('user_progress')
      .update({
        progress_percent: progressPercent,
        completed: completed,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('meditation_id', meditationId)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Cria um novo registro
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        meditation_id: meditationId,
        progress_percent: progressPercent,
        completed: completed,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

/**
 * Busca todas as meditações concluídas pelo usuário
 */
export async function getCompletedMeditations(): Promise<UserProgress[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Conta quantas meditações o usuário completou
 */
export async function getCompletedMeditationsCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count, error } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true)

  if (error) throw error
  return count || 0
}

// ============================================================================
// STREAKS
// ============================================================================

/**
 * Busca a streak atual do usuário
 */
export async function getUserStreak(): Promise<UserStreak | null> {
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

/**
 * Atualiza a streak do usuário quando completa uma meditação
 */
export async function updateUserStreak() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const today = new Date().toISOString().split('T')[0]
  const streak = await getUserStreak()

  if (!streak) {
    // Cria a primeira streak
    const { data, error } = await supabase
      .from('user_streaks')
      .insert({
        user_id: user.id,
        current_streak: 1,
        longest_streak: 1,
        last_meditation_date: today,
      })
      .select()
      .single()

    if (error) throw error
    return { newStreak: 1, isNewRecord: true, message: 'Primeira meditação concluída!' }
  }

  // Verifica se já meditou hoje
  if (streak.last_meditation_date === today) {
    return {
      newStreak: streak.current_streak,
      isNewRecord: false,
      message: 'Você já meditou hoje!',
    }
  }

  // Verifica se é consecutivo (ontem)
  const lastDate = new Date(streak.last_meditation_date || '')
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak: number
  let isNewRecord = false

  if (streak.last_meditation_date === yesterdayStr) {
    // Consecutivo! Incrementa a streak
    newStreak = streak.current_streak + 1
  } else {
    // Quebrou a sequência, reinicia
    newStreak = 1
  }

  // Atualiza o recorde se necessário
  const newLongest = Math.max(newStreak, streak.longest_streak)
  isNewRecord = newLongest > streak.longest_streak

  const { data, error } = await supabase
    .from('user_streaks')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_meditation_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error

  return {
    newStreak,
    isNewRecord,
    message: isNewRecord ? 'Novo recorde pessoal!' : 'Continue assim!',
  }
}

// ============================================================================
// ASSINATURAS
// ============================================================================

/**
 * Busca a assinatura ativa do usuário
 */
export async function getActiveSubscription(): Promise<Subscription | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

/**
 * Busca todas as assinaturas do usuário (histórico)
 */
export async function getUserSubscriptions(): Promise<Subscription[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Verifica se o usuário tem uma assinatura ativa
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const subscription = await getActiveSubscription()
  return subscription !== null && subscription.status === 'active'
}

/**
 * Cancela a assinatura ativa do usuário
 */
export async function cancelSubscription() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('user_id', user.id)
    .eq('status', 'active')
    .select()
    .single()

  if (error) throw error
  return data
}
