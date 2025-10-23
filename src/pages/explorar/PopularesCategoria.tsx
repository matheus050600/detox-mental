import CategoriaExplorar from "./CategoriaExplorar";
import meditationProgram from "/assets/meditation-program.jpg";

const PopularesCategoria = () => {
  const conteudos = [
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Paz interior",
      duration: "15 min",
      route: "/explorar/populares/paz-interior"
    },
    {
      image: meditationProgram,
      type: "LISTA DE REPRODUÇÃO",
      title: "Sons da natureza",
      duration: "60 min",
      route: "/explorar/populares/sons-natureza"
    },
    {
      image: meditationProgram,
      type: "JORNADA",
      title: "Sono profundo",
      duration: "21 dias",
      route: "/explorar/populares/sono-profundo"
    },
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Gratidão diária",
      duration: "8 min",
      route: "/explorar/populares/gratidao-diaria"
    }
  ];

  return (
    <CategoriaExplorar
      title="Populares"
      description="As meditações e práticas mais amadas pela nossa comunidade."
      emoji="⭐"
      conteudos={conteudos}
    />
  );
};

export default PopularesCategoria;
