import CategoriaExplorar from "./CategoriaExplorar";
import meditationProgram from "/assets/meditation-program.jpg";

const NewslettersCategoria = () => {
  const conteudos = [
    {
      image: meditationProgram,
      type: "BLOG",
      title: "Como vai a sua saúde mental?",
      duration: "5 min",
      route: "/explorar/newsletters/saude-mental"
    },
    {
      image: meditationProgram,
      type: "BLOG",
      title: "Sua vida, sua cena",
      duration: "6 min",
      route: "/explorar/newsletters/sua-vida"
    },
    {
      image: meditationProgram,
      type: "BLOG",
      title: "Duvidar faz parte do processo",
      duration: "5 min",
      route: "/explorar/newsletters/duvidar"
    }
  ];

  return (
    <CategoriaExplorar
      title="Newsletters"
      description="Reflexões, insights e inspirações sobre meditação, mindfulness e bem-estar."
      emoji="📧"
      conteudos={conteudos}
    />
  );
};

export default NewslettersCategoria;
