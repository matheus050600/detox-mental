import CategoriaExplorar from "./CategoriaExplorar";
import meditationProgram from "/assets/meditation-program.jpg";

const ProgramasMeditacaoCategoria = () => {
  const conteudos = [
    {
      image: meditationProgram,
      type: "PROGRAMA",
      title: "Ansiedade e estresse",
      duration: "21 dias",
      route: "/explorar/programas/ansiedade"
    },
    {
      image: meditationProgram,
      type: "PROGRAMA",
      title: "Autoconhecimento profundo",
      duration: "30 dias",
      route: "/explorar/programas/autoconhecimento"
    },
    {
      image: meditationProgram,
      type: "PROGRAMA",
      title: "Cultivando a compaixão",
      duration: "14 dias",
      route: "/explorar/programas/compaixao"
    },
    {
      image: meditationProgram,
      type: "PROGRAMA",
      title: "Equilíbrio emocional",
      duration: "21 dias",
      route: "/explorar/programas/equilibrio"
    }
  ];

  return (
    <CategoriaExplorar
      title="Programas de meditação"
      description="Programas estruturados para desenvolver habilidades específicas e alcançar objetivos de bem-estar."
      emoji="📚"
      conteudos={conteudos}
    />
  );
};

export default ProgramasMeditacaoCategoria;
