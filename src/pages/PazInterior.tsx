import MeditacaoAudio from "./MeditacaoAudio";

const PazInterior = () => {
  return (
    <MeditacaoAudio
      title="Encontrando paz interior"
      duration="4 min"
      type="ÁUDIO"
      description="Uma breve jornada guiada para encontrar paz e tranquilidade interior, mesmo em meio ao caos do dia a dia. Descubra como acessar seu refúgio interno de calma e serenidade."
      benefits={[
        "Acesse estados de paz profunda",
        "Reduza a agitação mental",
        "Cultive equilíbrio emocional",
        "Desenvolva resiliência interior"
      ]}
    />
  );
};

export default PazInterior;
