import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import motivationalImage1 from "/assets/frase motivacional 1.jpg";
import motivationalImage2 from "/assets/frase motivacional 2.jpg";
import motivationalImage3 from "/assets/frase motivacional.jpg";

interface InspirationCardProps {
  quote: string;
  image?: string; // Tornamos opcional pois agora escolhemos aleatoriamente
}

const InspirationCard = ({ quote, image }: InspirationCardProps) => {
  // Array com as imagens motivacionais
  const motivationalImages = [motivationalImage1, motivationalImage2, motivationalImage3];

  // Seleciona uma imagem aleatória (memoizado para não mudar a cada render)
  const randomBackground = useMemo(() => {
    if (image) return image; // Se uma imagem for passada explicitamente, usa ela
    return motivationalImages[Math.floor(Math.random() * motivationalImages.length)];
  }, [image]);

  return (
    <Card className="relative overflow-hidden border-0 shadow-medium group animate-fade-in">
      <div className="relative aspect-[21/9] md:aspect-[21/7]">
        <img
          src={randomBackground}
          alt="Inspiração"
          className="w-full h-full object-cover transition-smooth"
        />
        {/* Overlay translúcido para melhor contraste */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <blockquote className="relative z-10 text-white text-lg md:text-2xl font-semibold max-w-3xl leading-relaxed">
            "{quote}"
          </blockquote>
        </div>
      </div>
    </Card>
  );
};

export default InspirationCard;
