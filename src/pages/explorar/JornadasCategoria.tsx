import CategoriaExplorar from "./CategoriaExplorar";
import meditationProgram from "/assets/meditation-program.jpg";

const JornadasCategoria = () => {
  const conteudos = [
    {
      image: meditationProgram,
      type: "JORNADA",
      title: "21 dias de gratidão",
      duration: "21 dias",
      route: "/explorar/jornadas/gratidao"
    },
    {
      image: meditationProgram,
      type: "JORNADA",
      title: "Despertar da consciência",
      duration: "30 dias",
      route: "/explorar/jornadas/consciencia"
    },
    {
      image: meditationProgram,
      type: "JORNADA",
      title: "Transformação pessoal",
      duration: "60 dias",
      route: "/explorar/jornadas/transformacao"
    }
  ];

  return (
    <CategoriaExplorar
      title="Jornadas"
      description="Jornadas transformadoras de longo prazo para desenvolvimento pessoal profundo."
      emoji="🌟"
      conteudos={conteudos}
    />
  );
};

export default JornadasCategoria;
