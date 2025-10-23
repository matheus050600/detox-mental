import AudioPageLayout from "@/components/AudioPageLayout";
import { palestras } from "@/data/explorarData";

const Neuroplasticidade = () => {
  const conteudo = palestras["neuroplasticidade"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Descubra como a meditação muda seu cérebro."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/palestras"
    />
  );
};

export default Neuroplasticidade;
