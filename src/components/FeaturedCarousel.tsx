import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getFraseMotivacionalAleatoria } from "@/data/assetMapping";

const FeaturedCarousel = () => {
  const [fraseImage, setFraseImage] = useState<string>("");

  useEffect(() => {
    // Seleciona uma frase motivacional aleatória ao carregar o componente
    setFraseImage(getFraseMotivacionalAleatoria());
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-medium animate-fade-in h-[400px]">
      <img
        src={fraseImage || "/assets/frase motivacional.jpg"}
        alt="Frase motivacional do dia"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <p className="text-white/90 text-sm mb-2">Destaque do dia</p>
        <h3 className="text-white text-3xl font-semibold mb-4">
          Encontre paz interior através da respiração consciente
        </h3>
        <Button className="gap-2">
          Ver detalhes
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
