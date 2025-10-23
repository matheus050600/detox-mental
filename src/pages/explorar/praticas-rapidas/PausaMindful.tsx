import AudioPageLayout from "@/components/AudioPageLayout";
import { praticasRapidas } from "@/data/explorarData";

const PausaMindful = () => {
  const conteudo = praticasRapidas["pausa-mindful"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Uma pausa rápida para o presente."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/praticas-rapidas"
    />
  );
};

export default PausaMindful;
