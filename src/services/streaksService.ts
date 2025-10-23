import { supabase } from "@/lib/supabase";

export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_meditation_date: string | null;
  updated_at: string;
}

/**
 * Obtém os streaks do usuário atual
 */
export async function getUserStreaks(userId: string): Promise<UserStreak | null> {
  try {
    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Erro ao buscar streaks:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar streaks:", error);
    return null;
  }
}

/**
 * Inicializa os streaks para um novo usuário
 */
export async function initializeUserStreaks(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("user_streaks").insert({
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      last_meditation_date: null,
    });

    if (error) {
      console.error("Erro ao inicializar streaks:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao inicializar streaks:", error);
    return false;
  }
}

/**
 * Atualiza o streak do usuário após completar uma meditação
 */
export async function updateStreak(userId: string): Promise<{
  success: boolean;
  newStreak?: number;
  isNewRecord?: boolean;
  message?: string;
}> {
  try {
    // Buscar streak atual
    let streakData = await getUserStreaks(userId);

    // Se não existir, criar
    if (!streakData) {
      await initializeUserStreaks(userId);
      streakData = await getUserStreaks(userId);
      if (!streakData) {
        return { success: false, message: "Erro ao inicializar streaks" };
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    const lastMeditationDate = streakData.last_meditation_date
      ? new Date(streakData.last_meditation_date)
      : null;

    if (lastMeditationDate) {
      lastMeditationDate.setHours(0, 0, 0, 0);
    }

    let newCurrentStreak = streakData.current_streak;
    let newLongestStreak = streakData.longest_streak;

    // Se já meditou hoje, não atualiza
    if (lastMeditationDate && lastMeditationDate.getTime() === today.getTime()) {
      return {
        success: true,
        newStreak: newCurrentStreak,
        isNewRecord: false,
        message: "Streak já atualizado hoje",
      };
    }

    // Se meditou ontem, incrementa streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastMeditationDate && lastMeditationDate.getTime() === yesterday.getTime()) {
      newCurrentStreak += 1;
    } else {
      // Se passou mais de um dia, reseta streak
      newCurrentStreak = 1;
    }

    // Atualiza longest streak se necessário
    const isNewRecord = newCurrentStreak > newLongestStreak;
    if (isNewRecord) {
      newLongestStreak = newCurrentStreak;
    }

    // Atualizar no banco de dados
    const { error } = await supabase
      .from("user_streaks")
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_meditation_date: todayStr,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao atualizar streak:", error);
      return { success: false, message: "Erro ao atualizar streak" };
    }

    return {
      success: true,
      newStreak: newCurrentStreak,
      isNewRecord,
      message: "Streak atualizado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar streak:", error);
    return { success: false, message: "Erro inesperado" };
  }
}

/**
 * Registra uma meditação completada
 */
export async function recordMeditationCompleted(
  userId: string,
  sessionName: string
): Promise<boolean> {
  try {
    // Registrar progresso
    const { error: progressError } = await supabase.from("user_progress").insert({
      user_id: userId,
      session_name: sessionName,
      completed_at: new Date().toISOString(),
    });

    if (progressError) {
      console.error("Erro ao registrar progresso:", progressError);
      return false;
    }

    // Atualizar streak
    const streakResult = await updateStreak(userId);

    return streakResult.success;
  } catch (error) {
    console.error("Erro ao registrar meditação:", error);
    return false;
  }
}

/**
 * Formata a data da última meditação
 */
export function formatLastMeditationDate(dateStr: string | null): string {
  if (!dateStr) return "Ainda não meditou";

  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;

  return date.toLocaleDateString("pt-BR");
}
