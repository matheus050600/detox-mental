import MeditacaoAudio from "./MeditacaoAudio";

const PoderRespiracao = () => {
  return (
    <MeditacaoAudio
      title="O poder da respiração consciente"
      duration="7 min"
      type="ÁUDIO"
      description="Explore o incrível poder da respiração consciente e como ela pode transformar seu estado mental e emocional instantaneamente. Aprenda técnicas práticas de respiração que você pode usar em qualquer momento do dia."
      benefits={[
        "Reduza o estresse rapidamente",
        "Melhore sua oxigenação celular",
        "Acalme a mente agitada",
        "Regule suas emoções naturalmente"
      ]}
    />
  );
};

export default PoderRespiracao;
