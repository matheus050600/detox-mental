import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const GradientBanner = () => {
  return (
    <div className="gradient-primary rounded-2xl p-8 md:p-12 shadow-medium text-center text-white">
      <h3 className="text-3xl font-semibold mb-4">
        Leve a tranquilidade para qualquer lugar
      </h3>
      <p className="text-white/90 mb-8 max-w-2xl mx-auto">
        Baixe o app e tenha acesso a centenas de meditações guiadas, 
        programas de bem-estar e sons relaxantes.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button 
          variant="secondary" 
          size="lg" 
          className="gap-2 bg-white text-primary hover:bg-white/90"
        >
          <Download className="h-5 w-5" />
          App Store
        </Button>
        <Button 
          variant="secondary" 
          size="lg" 
          className="gap-2 bg-white text-primary hover:bg-white/90"
        >
          <Download className="h-5 w-5" />
          Google Play
        </Button>
      </div>
    </div>
  );
};

export default GradientBanner;
