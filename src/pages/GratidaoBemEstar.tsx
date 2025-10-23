import MeditacaoAudio from "./MeditacaoAudio";

const GratidaoBemEstar = () => {
  return (
    <MeditacaoAudio
      title="Gratidão e bem-estar"
      duration="5 min"
      type="ÁUDIO"
      description="Uma prática guiada de gratidão que irá elevar seu estado emocional e conectá-lo com as bênçãos presentes em sua vida. A gratidão é uma das práticas mais poderosas para o bem-estar mental e emocional."
      benefits={[
        "Cultive uma mentalidade positiva",
        "Melhore sua saúde emocional",
        "Aumente sua satisfação com a vida",
        "Desenvolva resiliência e otimismo"
      ]}
    />
  );
};

export default GratidaoBemEstar;
