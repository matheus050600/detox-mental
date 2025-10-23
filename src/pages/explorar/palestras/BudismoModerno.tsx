import AudioPageLayout from "@/components/AudioPageLayout";
import { palestras } from "@/data/explorarData";

const BudismoModerno = () => {
  const conteudo = palestras["budismo"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Uma ponte entre sabedoria antiga e ciência contemporânea."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/palestras"
    />
  );
};

export default BudismoModerno;
