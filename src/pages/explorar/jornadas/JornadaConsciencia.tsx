import AudioPageLayout from "@/components/AudioPageLayout";
import { jornadas } from "@/data/explorarData";

const JornadaConsciencia = () => {
  const conteudo = jornadas["jornada-consciencia"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Inicie sua jornada transformadora."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/jornadas"
    />
  );
};

export default JornadaConsciencia;
