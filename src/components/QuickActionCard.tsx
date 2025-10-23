import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  duration: string;
  image: string;
}

const QuickActionCard = ({ title, duration, image }: QuickActionCardProps) => {
  return (
    <div className="gradient-card rounded-2xl p-6 shadow-soft flex items-center gap-4 hover:shadow-medium transition-smooth cursor-pointer group">
      <img 
        src={image} 
        alt={title}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{duration}</p>
      </div>
      <Button 
        size="icon" 
        className="rounded-full group-hover:scale-110 transition-smooth"
      >
        <Play className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default QuickActionCard;
