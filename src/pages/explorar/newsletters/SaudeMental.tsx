import BlogPageLayout from "@/components/BlogPageLayout";

const SaudeMental = () => {
  return (
    <BlogPageLayout
      title="Como vai a sua saúde mental?"
      subtitle="Reflexões sobre seu bem-estar emocional."
      duration="5 min"
      textFile="saude-mental.txt"
      backPath="/explorar/newsletters"
    />
  );
};

export default SaudeMental;
