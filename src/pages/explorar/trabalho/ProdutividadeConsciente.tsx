import AudioPageLayout from "@/components/AudioPageLayout";
import { trabalho } from "@/data/explorarData";

const ProdutividadeConsciente = () => {
  const conteudo = trabalho["produtividade"];

  return (
    <AudioPageLayout
      title={conteudo.title}
      subtitle="Trabalhe de forma mais inteligente, não mais difícil."
      duration={conteudo.duration}
      type={conteudo.type}
      description={conteudo.description}
      benefits={conteudo.benefits}
      backPath="/explorar/trabalho"
    />
  );
};

export default ProdutividadeConsciente;
