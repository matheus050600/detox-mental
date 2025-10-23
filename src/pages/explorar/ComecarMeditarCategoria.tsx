import CategoriaExplorar from "./CategoriaExplorar";
import meditationProgram from "/assets/meditation-program.jpg";

const ComecarMeditarCategoria = () => {
  const conteudos = [
    {
      image: meditationProgram,
      type: "PROGRAMA",
      title: "Primeiros passos na meditação",
      duration: "7 min",
      route: "/explorar/comecar-meditar/primeiros-passos"
    },
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Respiração consciente",
      duration: "5 min",
      route: "/explorar/comecar-meditar/respiracao-consciente"
    },
    {
      image: meditationProgram,
      type: "JORNADA",
      title: "Iniciação ao mindfulness",
      duration: "14 dias",
      route: "/explorar/comecar-meditar/mindfulness"
    },
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Atenção plena para iniciantes",
      duration: "10 min",
      route: "/explorar/comecar-meditar/atencao-plena"
    }
  ];

  return (
    <CategoriaExplorar
      title="Começar a meditar"
      description="Dê seus primeiros passos no mundo da meditação com práticas guiadas especialmente desenvolvidas para iniciantes."
      emoji="🌱"
      conteudos={conteudos}
    />
  );
};

export default ComecarMeditarCategoria;
