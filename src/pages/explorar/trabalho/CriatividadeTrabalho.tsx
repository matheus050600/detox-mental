import AudioPageLayout from "@/components/AudioPageLayout";
import { trabalho } from "@/data/explorarData";

const CriatividadeTrabalho = () => {
  const conteudo = trabalho["criatividade"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Desbloqueie sua criatividade e inovação."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/trabalho"
    />
  );
};

export default CriatividadeTrabalho;
