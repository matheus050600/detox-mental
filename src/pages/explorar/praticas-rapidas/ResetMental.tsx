import AudioPageLayout from "@/components/AudioPageLayout";
import { praticasRapidas } from "@/data/explorarData";

const ResetMental = () => {
  const conteudo = praticasRapidas["reset-mental"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Renove sua energia mental."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/praticas-rapidas"
    />
  );
};

export default ResetMental;
