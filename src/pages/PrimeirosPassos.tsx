import AudioPageLayout from "@/components/AudioPageLayout";

const PrimeirosPassos = () => {
  return (
    <AudioPageLayout
      title="Primeiros Passos"
      subtitle="Um momento para respirar e relaxar"
      duration="7 min"
      type="PROGRAMA"
      description="Nesta sessão guiada, você aprenderá as técnicas fundamentais da meditação. Encontre um lugar confortável, ajuste sua postura e prepare-se para uma jornada de autodescoberta e relaxamento profundo. Perfeito para iniciantes que desejam desenvolver o hábito da meditação diária."
      benefits={[
        "Redução do estresse e ansiedade",
        "Maior clareza mental",
        "Melhora na qualidade do sono",
        "Desenvolvimento de consciência plena"
      ]}
      backPath="/hoje"
    />
  );
};

export default PrimeirosPassos;
