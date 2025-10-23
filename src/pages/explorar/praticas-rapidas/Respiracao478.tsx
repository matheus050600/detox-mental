import AudioPageLayout from "@/components/AudioPageLayout";
import { praticasRapidas } from "@/data/explorarData";

const Respiracao478 = () => {
  const conteudo = praticasRapidas["respiracao-478"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Técnica poderosa de respiração."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/praticas-rapidas"
    />
  );
};

export default Respiracao478;
