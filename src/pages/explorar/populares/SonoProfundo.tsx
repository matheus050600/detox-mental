import AudioPageLayout from "@/components/AudioPageLayout";
import { populares } from "@/data/explorarData";

const SonoProfundo = () => {
  const conteudo = populares["sono-profundo"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Inicie sua jornada para noites melhores."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/populares"
    />
  );
};

export default SonoProfundo;
