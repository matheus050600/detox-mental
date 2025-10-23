import AudioPageLayout from "@/components/AudioPageLayout";
import { palestras } from "@/data/explorarData";

const LimitesAceitacao = () => {
  const conteudo = palestras["limites"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Reconheça seus limites e cultive autoaceitação."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/palestras"
    />
  );
};

export default LimitesAceitacao;
