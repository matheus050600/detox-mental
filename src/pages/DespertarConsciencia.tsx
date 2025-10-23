import MeditacaoAudio from "./MeditacaoAudio";

const DespertarConsciencia = () => {
  return (
    <MeditacaoAudio
      title="Despertar da consciência"
      duration="21 dias"
      type="JORNADA"
      description="Uma jornada transformadora de 21 dias para expandir sua consciência e desenvolver uma conexão mais profunda consigo mesmo. Explore diferentes técnicas de meditação e mindfulness que irão despertar sua percepção interior."
      benefits={[
        "Expansão da consciência e autoconhecimento",
        "Maior clareza mental e emocional",
        "Desenvolvimento de intuição",
        "Transformação de padrões mentais limitantes"
      ]}
    />
  );
};

export default DespertarConsciencia;
