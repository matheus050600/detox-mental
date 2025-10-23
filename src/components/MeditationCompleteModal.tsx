import { useState } from "react";
import { X, Star } from "lucide-react";

interface MeditationCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (rating?: number, notes?: string) => Promise<void>;
  meditationTitle: string;
  duration: number;
}

const MeditationCompleteModal = ({
  isOpen,
  onClose,
  onComplete,
  meditationTitle,
  duration,
}: MeditationCompleteModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete(rating || undefined, notes || undefined);
      onClose();
      // Reset form
      setRating(0);
      setNotes("");
    } catch (error) {
      console.error("Erro ao completar meditação:", error);
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(duration / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-scale-in border border-white/30 dark:border-gray-700/50">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Ícone de Sucesso */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
          Parabéns!
        </h2>

        {/* Mensagem */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Você concluiu a meditação <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{meditationTitle}"</span>
        </p>

        {/* Informações */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">{minutes} minutos de prática</span>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
            Seu progresso foi atualizado automaticamente!
          </p>
        </div>

        {/* Avaliação */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
            Como foi sua experiência?
          </label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Notas (opcional) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notas pessoais (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Como você se sentiu durante a prática?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all resize-none"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            Fechar
          </button>
          <button
            onClick={handleComplete}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeditationCompleteModal;
