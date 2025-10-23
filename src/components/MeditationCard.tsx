import { Badge } from "@/components/ui/badge";
import { Clock, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fixAssetPath } from "@/utils/assetPath";

interface MeditationCardProps {
  image: string;
  type: string;
  title: string;
  duration?: string;
  progress?: number;
  variant?: "default" | "horizontal";
  audio?: string;
}

const MeditationCard = ({
  image,
  type,
  title,
  duration,
  progress,
  variant = "default",
  audio
}: MeditationCardProps) => {
  const fixedImage = fixAssetPath(image);
  const fixedAudio = fixAssetPath(audio || '');
  if (variant === "horizontal") {
    return (
      <Card className="group flex gap-4 p-4 hover:shadow-medium transition-smooth cursor-pointer border-border/50">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={fixedImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <Badge
            variant="secondary"
            className="w-fit mb-2 text-xs font-semibold bg-primary/10 text-primary border-0"
          >
            {type}
          </Badge>
          <h3 className="font-semibold text-base mb-1 truncate">{title}</h3>
          {duration && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden border-border/50 hover:shadow-hover transition-smooth cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={fixedImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="text-xs font-semibold bg-white/95 text-primary shadow-soft border-0"
          >
            {type}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center transition-smooth">
          <div className="w-14 h-14 rounded-full bg-purple-200 flex items-center justify-center shadow-2xl transition-smooth transform group-hover:scale-110">
            <Play className="w-6 h-6 text-purple-700 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base mb-2 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>
        {(duration || progress !== undefined) && (
          <div className="flex items-center justify-between">
            {duration && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
            {progress !== undefined && (
              <span className="text-sm font-semibold text-primary">{progress}%</span>
            )}
          </div>
        )}
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-1" />
        )}
      </div>
    </Card>
  );
};

export default MeditationCard;
