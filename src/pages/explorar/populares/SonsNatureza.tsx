import AudioPageLayout from "@/components/AudioPageLayout";
import { populares } from "@/data/explorarData";

const SonsNatureza = () => {
  const conteudo = populares["sons-natureza"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Pressione play e deixe-se envolver pela serenidade natural."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/populares"
    />
  );
};

export default SonsNatureza;
