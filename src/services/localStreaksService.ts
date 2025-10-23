/**
 * Serviço de Streaks com localStorage
 * Sistema offline para testar funcionalidade de dias consecutivos
 */

export interface LocalStreakData {
  currentStreak: number;
  longestStreak: number;
  lastMeditationDate: string | null; // formato: YYYY-MM-DD
  totalSessions: number;
}

const STORAGE_KEY = "detox_mental_streak_data";

/**
 * Obtém os dados do streak do localStorage
 */
export function getLocalStreak(): LocalStreakData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      // Inicializar com valores padrão
      const defaultData: LocalStreakData = {
        currentStreak: 0,
        longestStreak: 0,
        lastMeditationDate: null,
        totalSessions: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }

    return JSON.parse(data) as LocalStreakData;
  } catch (error) {
    console.error("Erro ao ler streak do localStorage:", error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastMeditationDate: null,
      totalSessions: 0,
    };
  }
}

/**
 * Salva os dados do streak no localStorage
 */
function saveLocalStreak(data: LocalStreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar streak no localStorage:", error);
  }
}

/**
 * Obtém a data de hoje no formato YYYY-MM-DD
 */
function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Obtém a data de ontem no formato YYYY-MM-DD
 */
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

/**
 * Atualiza o streak após completar uma meditação
 * Retorna os dados atualizados e se é um novo recorde
 */
export function updateStreak(): {
  success: boolean;
  newStreak: number;
  isNewRecord: boolean;
  message: string;
} {
  try {
    const streakData = getLocalStreak();
    const today = getTodayString();
    const yesterday = getYesterdayString();

    // Se já meditou hoje, não atualiza
    if (streakData.lastMeditationDate === today) {
      return {
        success: true,
        newStreak: streakData.currentStreak,
        isNewRecord: false,
        message: "Você já meditou hoje! Continue assim amanhã.",
      };
    }

    let newCurrentStreak = streakData.currentStreak;

    // Se meditou ontem, incrementa o streak
    if (streakData.lastMeditationDate === yesterday) {
      newCurrentStreak += 1;
    } else {
      // Se passou mais de um dia ou é a primeira vez, reseta para 1
      newCurrentStreak = 1;
    }

    // Verifica se é um novo recorde
    const isNewRecord = newCurrentStreak > streakData.longestStreak;
    const newLongestStreak = isNewRecord ? newCurrentStreak : streakData.longestStreak;

    // Atualiza os dados
    const updatedData: LocalStreakData = {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastMeditationDate: today,
      totalSessions: streakData.totalSessions + 1,
    };

    saveLocalStreak(updatedData);

    return {
      success: true,
      newStreak: newCurrentStreak,
      isNewRecord,
      message: isNewRecord
        ? "🎉 Novo recorde pessoal!"
        : "Parabéns por manter o hábito!",
    };
  } catch (error) {
    console.error("Erro ao atualizar streak:", error);
    return {
      success: false,
      newStreak: 0,
      isNewRecord: false,
      message: "Erro ao atualizar streak",
    };
  }
}

/**
 * Formata a última data de meditação para exibição
 */
export function formatLastMeditationDate(dateStr: string | null): string {
  if (!dateStr) return "Ainda não meditou";

  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (dateStr === today) return "Hoje";
  if (dateStr === yesterday) return "Ontem";

  try {
    const date = new Date(dateStr + "T00:00:00");
    const diffTime = new Date(today + "T00:00:00").getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays} dias atrás`;

    return date.toLocaleDateString("pt-BR");
  } catch (error) {
    return dateStr;
  }
}

/**
 * Reseta o streak (útil para testes)
 */
export function resetStreak(): void {
  const defaultData: LocalStreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastMeditationDate: null,
    totalSessions: 0,
  };
  saveLocalStreak(defaultData);
  console.log("✅ Streak resetado!");
}
