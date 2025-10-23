import CategoriaExplorar from "./CategoriaExplorar";
import meditationProgram from "/assets/meditation-program.jpg";

const TrabalhoCategoria = () => {
  const conteudos = [
    {
      image: meditationProgram,
      type: "PROGRAMA",
      title: "Produtividade consciente",
      duration: "14 dias",
      route: "/explorar/trabalho/produtividade"
    },
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Foco e concentração",
      duration: "12 min",
      route: "/explorar/trabalho/foco"
    },
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Criatividade no trabalho",
      duration: "10 min",
      route: "/explorar/trabalho/criatividade"
    }
  ];

  return (
    <CategoriaExplorar
      title="Para o trabalho"
      description="Práticas de mindfulness para melhorar foco, produtividade e criatividade no trabalho."
      emoji="💼"
      conteudos={conteudos}
    />
  );
};

export default TrabalhoCategoria;
