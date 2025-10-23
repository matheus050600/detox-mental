import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SectionProps {
  title: string;
  children: ReactNode;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const Section = ({ title, children, showViewAll = false, onViewAll }: SectionProps) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {showViewAll && (
          <Button 
            variant="ghost" 
            className="gap-1 text-primary hover:text-primary/80"
            onClick={onViewAll}
          >
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;
