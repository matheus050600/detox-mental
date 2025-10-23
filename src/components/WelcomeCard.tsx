import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const WelcomeCard = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="gradient-card rounded-2xl p-8 shadow-soft animate-fade-in">
      <h2 className="text-3xl font-semibold mb-3">
        {getGreeting()}, <span className="text-primary">você</span>
      </h2>
      <p className="text-muted-foreground mb-6">Como você está se sentindo hoje?</p>
      <Button variant="outline" className="gap-2">
        <Heart className="h-4 w-4" />
        Registrar humor
      </Button>
    </div>
  );
};

export default WelcomeCard;
