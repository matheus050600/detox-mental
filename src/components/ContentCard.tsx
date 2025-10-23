import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fixAssetPath } from "@/utils/assetPath";

interface ContentCardProps {
  image: string;
  type: string;
  title: string;
  progress?: number;
  duration?: string;
}

const ContentCard = ({ image, type, title, progress, duration }: ContentCardProps) => {
  return (
    <div className="group cursor-pointer animate-slide-in">
      <div className="relative rounded-xl overflow-hidden mb-3 shadow-soft transition-smooth hover:shadow-medium hover:scale-[1.02]">
        <img
          src={fixAssetPath(image)}
          alt={title}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 dark:bg-black/70 text-foreground">
            {type}
          </Badge>
        </div>
        {duration && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {duration}
          </div>
        )}
      </div>
      <h4 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
        {title}
      </h4>
      {progress !== undefined && (
        <div className="space-y-1">
          <Progress value={progress} className="h-1" />
          <p className="text-xs text-muted-foreground">{progress}% concluído</p>
        </div>
      )}
    </div>
  );
};

export default ContentCard;
