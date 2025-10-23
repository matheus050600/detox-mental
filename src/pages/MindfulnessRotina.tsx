import MeditacaoAudio from "./MeditacaoAudio";

const MindfulnessRotina = () => {
  return (
    <MeditacaoAudio
      title="Mindfulness na rotina diária"
      duration="6 min"
      type="BLOG"
      description="Aprenda a integrar a prática de mindfulness em suas atividades cotidianas. Descubra como transformar momentos comuns em oportunidades de presença e consciência plena."
      benefits={[
        "Integre mindfulness no dia a dia",
        "Aumente sua presença em atividades cotidianas",
        "Reduza o piloto automático",
        "Aprecie mais os momentos simples"
      ]}
    />
  );
};

export default MindfulnessRotina;
