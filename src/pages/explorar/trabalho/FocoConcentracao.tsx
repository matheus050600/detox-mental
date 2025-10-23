import AudioPageLayout from "@/components/AudioPageLayout";
import { trabalho } from "@/data/explorarData";

const FocoConcentracao = () => {
  const conteudo = trabalho["foco"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Desenvolva foco profundo e concentração sustentada."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/trabalho"
    />
  );
};

export default FocoConcentracao;
