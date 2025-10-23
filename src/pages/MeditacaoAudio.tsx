import AudioPageLayout from "@/components/AudioPageLayout";

interface MeditacaoAudioProps {
  title: string;
  subtitle?: string;
  duration?: string;
  type?: string;
  description?: string;
  benefits?: string[];
  backPath?: string;
}

const MeditacaoAudio = ({
  title,
  subtitle = "Pressione play e aproveite seu momento de calma.",
  duration = "10 min",
  type = "MEDITAÇÃO",
  description,
  benefits = [],
  backPath = "/hoje"
}: MeditacaoAudioProps) => {
  return (
    <AudioPageLayout
      title={title}
      subtitle={subtitle}
      duration={duration}
      type={type}
      description={description}
      benefits={benefits}
      backPath={backPath}
    />
  );
};

export default MeditacaoAudio;
