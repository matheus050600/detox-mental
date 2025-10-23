import AudioPageLayout from "@/components/AudioPageLayout";
import { palestras } from "@/data/explorarData";

const CienciaMeditacao = () => {
  const conteudo = palestras["ciencia-meditacao"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Explore as descobertas científicas sobre meditação."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/palestras"
    />
  );
};

export default CienciaMeditacao;
