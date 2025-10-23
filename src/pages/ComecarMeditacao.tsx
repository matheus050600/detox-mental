import MeditacaoAudio from "./MeditacaoAudio";

const ComecarMeditacao = () => {
  return (
    <MeditacaoAudio
      title="Começar a meditar"
      duration="7 dias"
      type="PROGRAMA"
      description="Um programa completo de 7 dias para você desenvolver o hábito da meditação. Cada sessão foi cuidadosamente elaborada para introduzir os conceitos fundamentais da prática meditativa de forma gradual e acessível."
      benefits={[
        "Aprenda técnicas básicas de respiração",
        "Desenvolva o hábito diário de meditação",
        "Reduza o estresse e ansiedade",
        "Melhore sua concentração e foco"
      ]}
    />
  );
};

export default ComecarMeditacao;
