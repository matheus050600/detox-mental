import { useNavigate } from "react-router-dom";
import { Smile, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GreetingCardProps {
  userName: string;
  timeOfDay: "manhã" | "tarde" | "noite";
}

const GreetingCard = ({ userName, timeOfDay }: GreetingCardProps) => {
  const navigate = useNavigate();

  const greeting = {
    manhã: "Bom dia",
    tarde: "Boa tarde",
    noite: "Boa noite"
  }[timeOfDay];

  return (
    <Card className="gradient-header border-0 p-8 md:p-10 shadow-medium animate-fade-in">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {greeting}, {userName}
        </h1>
        <p className="text-white/90 text-base md:text-lg flex items-center gap-2 mb-4">
          <Smile className="w-5 h-5" />
          Como você está se sentindo hoje?
        </p>
        <Button
          onClick={() => navigate("/humor")}
          variant="secondary"
          className="bg-white hover:bg-white/90 text-foreground gap-2"
        >
          Registrar humor
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default GreetingCard;
