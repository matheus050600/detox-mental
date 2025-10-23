import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  getLocalStreak,
  formatLastMeditationDate,
  type LocalStreakData
} from "@/services/localStreaksService";

export default function StreakCard() {
  const [streakData, setStreakData] = useState<LocalStreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakData();

    // Atualizar quando houver mudanças no localStorage
    const handleStorageChange = () => {
      loadStreakData();
    };

    window.addEventListener("storage", handleStorageChange);

    // Interval para atualizar a cada 5 segundos (detecta mudanças na mesma aba)
    const interval = setInterval(loadStreakData, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadStreakData = () => {
    setLoading(true);
    const data = getLocalStreak();
    setStreakData(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 rounded-3xl border border-purple-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
          <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!streakData) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-xl p-6 rounded-3xl border border-purple-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Título */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          🌿 Seu progresso
        </h3>
      </div>

      {/* Grid de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dias consecutivos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm p-4 rounded-2xl border border-purple-100 dark:border-gray-600"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Flame className="w-6 h-6 text-purple-500" />
            </motion.div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Dias consecutivos
            </span>
          </div>
          <motion.p
            key={streakData.currentStreak}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-4xl font-bold text-purple-600 dark:text-purple-400"
          >
            {streakData.currentStreak}
          </motion.p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            dias seguidos
          </p>
        </motion.div>

        {/* Maior sequência */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm p-4 rounded-2xl border border-blue-100 dark:border-gray-600"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Maior sequência
            </span>
          </div>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {streakData.longestStreak}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            recorde pessoal
          </p>
        </motion.div>

        {/* Última meditação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm p-4 rounded-2xl border border-green-100 dark:border-gray-600"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Última meditação
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatLastMeditationDate(streakData.lastMeditationDate)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            última sessão
          </p>
        </motion.div>
      </div>

      {/* Mensagem motivacional */}
      {streakData.currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-200/50 dark:border-gray-600"
        >
          <p className="text-center text-sm text-gray-700 dark:text-gray-300 italic">
            {streakData.currentStreak >= 7
              ? "🎉 Incrível! Você está construindo um hábito forte!"
              : streakData.currentStreak >= 3
              ? "💪 Continue assim! Você está no caminho certo!"
              : "🌱 Ótimo começo! Continue praticando!"}
          </p>
        </motion.div>
      )}
    </Card>
  );
}
