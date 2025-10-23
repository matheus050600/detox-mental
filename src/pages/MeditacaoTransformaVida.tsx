import MeditacaoAudio from "./MeditacaoAudio";

const MeditacaoTransformaVida = () => {
  return (
    <MeditacaoAudio
      title="Como a meditação transforma sua vida"
      duration="5 min"
      type="BLOG"
      description="Descubra como a prática regular da meditação pode transformar profundamente sua vida. Neste áudio, exploramos os benefícios científicos da meditação e como ela pode melhorar sua saúde física, mental e emocional."
      benefits={[
        "Compreenda os benefícios da meditação",
        "Inspire-se com histórias de transformação",
        "Aprenda sobre a ciência por trás da prática",
        "Motive-se a iniciar sua jornada meditativa"
      ]}
    />
  );
};

export default MeditacaoTransformaVida;
