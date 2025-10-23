import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const SoulAICard = () => {
  return (
    <div className="gradient-card rounded-2xl p-8 shadow-soft border border-primary/10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">Receber orientação individual</h3>
          <p className="text-muted-foreground mb-4">
            Converse com o Soul AI e descubra meditações personalizadas para o seu momento atual
          </p>
          <Button className="gap-2">
            Começar conversa
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SoulAICard;
