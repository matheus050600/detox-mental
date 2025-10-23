import AudioPageLayout from "@/components/AudioPageLayout";
import { populares } from "@/data/explorarData";

const PazInteriorPopular = () => {
  const conteudo = populares["paz-interior"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Pressione play e aproveite seu momento de calma."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/populares"
    />
  );
};

export default PazInteriorPopular;
