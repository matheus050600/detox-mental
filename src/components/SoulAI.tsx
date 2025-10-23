import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle } from "lucide-react";

interface SoulAIProps {
  userName: string;
  timeOfDay: "manhã" | "tarde" | "noite";
}

const SoulAI = ({ userName, timeOfDay }: SoulAIProps) => {
  const greeting = {
    manhã: "Bom dia",
    tarde: "Boa tarde",
    noite: "Boa noite"
  }[timeOfDay];

  return (
    <Card className="gradient-soul-ai border-0 p-8 md:p-10 shadow-medium relative overflow-hidden animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Mental IA</h3>
            <p className="text-white/80 text-sm">Sua orientação individual</p>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <p className="text-white text-lg font-medium mb-4">
            {greeting}, {userName}! Como foi o seu dia?
          </p>
          <p className="text-white/90 text-sm leading-relaxed">
            Compartilhe seus pensamentos e sentimentos. Estou aqui para ajudar
            você a refletir e encontrar clareza.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => alert("A função Mental IA ainda está em desenvolvimento. Em breve você poderá conversar com sua inteligência emocional personalizada.")}
          className="w-full sm:w-auto bg-white hover:bg-white/90 text-primary gap-2 shadow-soft"
        >
          <MessageCircle className="w-5 h-5" />
          Conversar com Mental IA
        </Button>
      </div>
    </Card>
  );
};

export default SoulAI;
