import AudioPageLayout from "@/components/AudioPageLayout";
import { populares } from "@/data/explorarData";

const GratidaoDiaria = () => {
  const conteudo = populares["gratidao-diaria"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Pressione play e aproveite seu momento de gratidão."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/populares"
    />
  );
};

export default GratidaoDiaria;
