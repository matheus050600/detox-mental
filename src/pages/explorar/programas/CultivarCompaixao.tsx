import AudioPageLayout from "@/components/AudioPageLayout";
import { programasMeditacao } from "@/data/explorarData";

const CultivarCompaixao = () => {
  const conteudo = programasMeditacao["compaixao"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Inicie sua jornada de transformação."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/programas"
    />
  );
};

export default CultivarCompaixao;
