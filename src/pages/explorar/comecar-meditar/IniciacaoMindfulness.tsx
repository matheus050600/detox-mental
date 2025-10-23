import AudioPageLayout from "@/components/AudioPageLayout";
import { comecarMeditar } from "@/data/explorarData";

const IniciacaoMindfulness = () => {
  const conteudo = comecarMeditar["mindfulness"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Pressione play e aproveite sua jornada."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/comecar-meditar"
    />
  );
};

export default IniciacaoMindfulness;
