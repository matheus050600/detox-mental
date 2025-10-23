import AudioPageLayout from "@/components/AudioPageLayout";
import { comecarMeditar } from "@/data/explorarData";

const PrimeirosPassosMeditacao = () => {
  const conteudo = comecarMeditar["primeiros-passos"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Pressione play e aproveite seu momento de calma."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/comecar-meditar"
    />
  );
};

export default PrimeirosPassosMeditacao;
