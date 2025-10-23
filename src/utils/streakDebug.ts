/**
 * Funções de debug para testar o sistema de streaks
 * Disponíveis globalmente no console do navegador
 */

import {
  getLocalStreak,
  updateStreak,
  resetStreak,
  formatLastMeditationDate,
  type LocalStreakData,
} from "@/services/localStreaksService";

// Expor funções no objeto window para acesso via console
declare global {
  interface Window {
    streakDebug: {
      // Ver dados atuais
      view: () => LocalStreakData;

      // Resetar streak
      reset: () => void;

      // Simular meditação hoje
      meditateToday: () => void;

      // Simular meditação ontem (para testar incremento)
      meditateYesterday: () => void;

      // Simular meditação há X dias (para testar quebra)
      meditateDaysAgo: (days: number) => void;

      // Forçar um streak específico
      setStreak: (currentStreak: number, longestStreak?: number) => void;

      // Informações sobre o sistema
      help: () => void;
    };
  }
}

// Implementação das funções de debug
window.streakDebug = {
  view: () => {
    const data = getLocalStreak();
    console.log("📊 Dados do Streak:", data);
    console.log("📅 Última meditação:", formatLastMeditationDate(data.lastMeditationDate));
    return data;
  },

  reset: () => {
    resetStreak();
    console.log("✅ Streak resetado para 0!");
    window.location.reload();
  },

  meditateToday: () => {
    const result = updateStreak();
    console.log("🎯 Meditação registrada:", result);
    if (result.isNewRecord) {
      console.log("🎉 NOVO RECORDE PESSOAL!");
    }
    window.location.reload();
  },

  meditateYesterday: () => {
    const data = getLocalStreak();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    data.lastMeditationDate = yesterday.toISOString().split("T")[0];
    localStorage.setItem("detox_mental_streak_data", JSON.stringify(data));

    console.log("⏰ Última meditação configurada para ONTEM");
    console.log("💡 Agora complete uma meditação para ver o streak incrementar!");
  },

  meditateDaysAgo: (days: number) => {
    const data = getLocalStreak();
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    data.lastMeditationDate = daysAgo.toISOString().split("T")[0];
    localStorage.setItem("detox_mental_streak_data", JSON.stringify(data));

    console.log(`⏰ Última meditação configurada para ${days} dias atrás`);
    console.log("💡 Agora complete uma meditação para ver o streak resetar!");
  },

  setStreak: (currentStreak: number, longestStreak?: number) => {
    const data = getLocalStreak();
    data.currentStreak = currentStreak;
    data.longestStreak = longestStreak ?? Math.max(currentStreak, data.longestStreak);
    data.lastMeditationDate = new Date().toISOString().split("T")[0];

    localStorage.setItem("detox_mental_streak_data", JSON.stringify(data));

    console.log(`🔥 Streak configurado para ${currentStreak} dias`);
    console.log(`🏆 Recorde: ${data.longestStreak} dias`);
    window.location.reload();
  },

  help: () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║           🔥 SISTEMA DE STREAKS - COMANDOS DEBUG          ║
╚═══════════════════════════════════════════════════════════╝

📊 VISUALIZAR DADOS:
   streakDebug.view()
   → Mostra os dados atuais do streak

✅ RESETAR STREAK:
   streakDebug.reset()
   → Reseta o streak para 0 e recarrega a página

🎯 REGISTRAR MEDITAÇÃO HOJE:
   streakDebug.meditateToday()
   → Simula uma meditação hoje e mostra o resultado

⏰ CONFIGURAR ÚLTIMA MEDITAÇÃO:
   streakDebug.meditateYesterday()
   → Configura última meditação para ONTEM
   → Útil para testar incremento de streak

   streakDebug.meditateDaysAgo(3)
   → Configura última meditação para 3 dias atrás
   → Útil para testar quebra de streak

🔥 FORÇAR STREAK ESPECÍFICO:
   streakDebug.setStreak(7)
   → Define streak atual como 7 dias

   streakDebug.setStreak(5, 10)
   → Define streak atual como 5 e recorde como 10

❓ AJUDA:
   streakDebug.help()
   → Mostra este menu de ajuda

╔═══════════════════════════════════════════════════════════╗
║                    EXEMPLOS DE USO                        ║
╚═══════════════════════════════════════════════════════════╝

1️⃣ Testar incremento de streak:
   streakDebug.meditateYesterday()
   // Agora vá para uma meditação e complete o áudio
   // O streak deve incrementar!

2️⃣ Testar quebra de streak:
   streakDebug.meditateDaysAgo(5)
   // Agora vá para uma meditação e complete o áudio
   // O streak deve resetar para 1!

3️⃣ Testar novo recorde:
   streakDebug.setStreak(5, 5)  // streak atual = recorde
   streakDebug.meditateYesterday()
   // Complete uma meditação para ver "🎉 Novo recorde!"

4️⃣ Ver dados atuais:
   streakDebug.view()

╔═══════════════════════════════════════════════════════════╗
║                  DADOS NO LOCALSTORAGE                    ║
╚═══════════════════════════════════════════════════════════╝

Chave: detox_mental_streak_data

Estrutura:
{
  currentStreak: number,
  longestStreak: number,
  lastMeditationDate: "YYYY-MM-DD",
  totalSessions: number
}

💡 DICA: Abra a aba Application → Local Storage no DevTools
         para ver os dados em tempo real!
    `);
  },
};

// Mostrar mensagem de boas-vindas ao carregar
console.log(`
╔═══════════════════════════════════════════════════════════╗
║          🔥 SISTEMA DE STREAKS - DEBUG ATIVADO            ║
╚═══════════════════════════════════════════════════════════╝

Digite streakDebug.help() para ver todos os comandos!

Exemplo rápido:
  streakDebug.view()    → Ver dados atuais
  streakDebug.reset()   → Resetar streak
`);

export {}; // Fazer este arquivo ser um módulo
