import MeditacaoAudio from "./MeditacaoAudio";

const MeditacaoIniciantes = () => {
  return (
    <MeditacaoAudio
      title="Meditação guiada para iniciantes"
      duration="14 dias"
      type="PROGRAMA"
      description="Programa de 14 dias com meditações guiadas especialmente desenvolvidas para iniciantes. Aprenda de forma progressiva e estruturada, com sessões que aumentam gradualmente em complexidade e duração."
      benefits={[
        "Guias passo a passo para cada sessão",
        "Técnicas de relaxamento profundo",
        "Desenvolvimento de consciência corporal",
        "Base sólida para prática contínua"
      ]}
    />
  );
};

export default MeditacaoIniciantes;
