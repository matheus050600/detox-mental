import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AudioPlayer from "@/components/AudioPlayer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowLeft, Clock, Headphones, Music, Flame, Trophy, Sparkles } from "lucide-react";
import { getContentByTitle } from "@/data/contentMap";
import { getFixedContent } from "@/data/fixedContentMap";
import { updateStreak } from "@/services/localStreaksService";
import { motion } from "framer-motion";

interface AudioPageLayoutProps {
  title: string;
  subtitle?: string;
  duration?: string;
  type?: string;
  description?: string;
  benefits?: string[];
  backPath?: string;
}

const AudioPageLayout = ({
  title,
  subtitle = "Pressione play e aproveite seu momento de calma.",
  duration = "10 min",
  type = "MEDITAÇÃO",
  description,
  benefits = [],
  backPath = "/explorar"
}: AudioPageLayoutProps) => {
  const navigate = useNavigate();
  const [content, setContent] = useState<{ image: string | null; audio: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [streakData, setStreakData] = useState<{ newStreak: number; isNewRecord: boolean; message: string } | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    // 1. PRIORIDADE: Tenta buscar no mapa fixo primeiro
    const fixedContent = getFixedContent(title);

    if (fixedContent) {
      setContent(fixedContent);
      setLoading(false);
      return;
    }

    // 2. FALLBACK: Busca no contentMap automático se não encontrou no fixo
    let foundContent = getContentByTitle(title);

    // Se não encontrou conteúdo completo, tenta buscar variações do título
    if (!foundContent || (!foundContent.image || !foundContent.audio)) {
      const normalizedTitle = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/õ/g, 'o')
        .replace(/ã/g, 'a')
        .replace(/ç/g, 'c')
        .trim();

      // Tenta buscar variações comuns
      const variations = [
        normalizedTitle,
        `${normalizedTitle} meditacao`,
        `${normalizedTitle} na meditacao`,
        normalizedTitle.replace('meditacao', '').trim()
      ];

      // Busca imagem e áudio separadamente
      let image = foundContent?.image || null;
      let audio = foundContent?.audio || null;

      for (const variation of variations) {
        const varContent = getContentByTitle(variation);
        if (varContent) {
          if (!image && varContent.image) image = varContent.image;
          if (!audio && varContent.audio) audio = varContent.audio;
        }
      }

      foundContent = { image, audio, title, normalizedName: normalizedTitle };
    }

    setContent(foundContent);
    setLoading(false);
  }, [title]);

  const handleMeditationComplete = () => {
    console.log("🎵 Áudio concluído! Atualizando streak...");

    try {
      // Atualiza o streak usando localStorage
      const result = updateStreak();

      console.log("📊 Resultado do streak:", result);

      if (result.success) {
        setStreakData({
          newStreak: result.newStreak,
          isNewRecord: result.isNewRecord,
          message: result.message,
        });
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error("❌ Erro ao registrar conclusão da meditação:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/90 to-gray-100/70 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen px-8 py-24">
        {/* Back Button */}
        <div className="absolute top-20 left-4 md:left-8">
          <Button
            variant="ghost"
            onClick={() => navigate(backPath)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-2xl animate-fade-in">
          {/* Cover Image */}
          {loading ? (
            <div className="w-[80vw] max-w-[220px] h-[80vw] max-h-[220px] md:w-64 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-lg mb-6 animate-pulse" />
          ) : content?.image ? (
            <img
              src={content.image}
              alt={title}
              className="w-[80vw] max-w-[220px] h-[80vw] max-h-[220px] md:w-64 md:h-64 object-cover rounded-2xl shadow-lg mb-6"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/meditation-program.jpg";
              }}
            />
          ) : (
            <div className="w-[80vw] max-w-[220px] h-[80vw] max-h-[220px] md:w-64 md:h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl shadow-lg mb-6 flex items-center justify-center">
              <Headphones className="w-20 h-20 md:w-24 md:h-24 text-primary/40" />
            </div>
          )}

          {/* Audio Player */}
          {loading ? (
            <div className="w-[90vw] max-w-xl h-14 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-md mb-6 animate-pulse" />
          ) : content?.audio ? (
            <div className="w-[90vw] max-w-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-md mb-6 p-6">
              <AudioPlayer
                audioSrc={content.audio}
                title={title}
                onComplete={handleMeditationComplete}
                onProgressChange={setAudioProgress}
              />
              {/* Progress Bar with Percentage */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Progresso</span>
                  <span className="text-sm font-semibold text-primary">{audioProgress}%</span>
                </div>
                <Progress value={audioProgress} className="h-2" />
              </div>
            </div>
          ) : (
            <div className="w-[90vw] max-w-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-md mb-6 p-6 md:p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <Music className="w-10 h-10 md:w-12 md:h-12 text-primary/50" />
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  Áudio disponível em breve
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
            {title}
          </h2>

          {/* Type and Duration */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
            {type && (
              <div className="inline-flex items-center gap-1.5">
                <Headphones className="w-4 h-4" />
                <span>{type}</span>
              </div>
            )}
            {duration && (
              <div className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-center text-gray-600 dark:text-gray-300 text-base max-w-md mb-8">
              {subtitle}
            </p>
          )}

          {/* Description */}
          {description && (
            <div className="w-full max-w-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Sobre esta prática
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <div className="w-full max-w-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Benefícios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              🎉 Parabéns! Você concluiu sua meditação!
            </DialogTitle>
          </DialogHeader>

          {streakData && (
            <div className="space-y-4 py-4">
              {/* Streak Atual */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl"
              >
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
                  <Flame className="w-8 h-8 text-orange-500" />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Sequência atual
                  </p>
                  <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    {streakData.newStreak}
                    <span className="text-lg ml-1">dias</span>
                  </p>
                </div>
              </motion.div>

              {/* Novo Recorde */}
              {streakData.isNewRecord && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl"
                >
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    🎉 Novo recorde pessoal!
                  </p>
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </motion.div>
              )}

              {/* Mensagem Motivacional */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  {streakData.newStreak >= 7
                    ? "🎉 Incrível! Você está construindo um hábito forte!"
                    : streakData.newStreak >= 3
                    ? "💪 Continue assim! Você está no caminho certo!"
                    : "🌱 Ótimo começo! Continue praticando!"}
                </p>
              </motion.div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCompletionModal(false)}
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              onClick={() => navigate("/perfil")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              Ver Perfil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AudioPageLayout;
