import CategoriaExplorar from "./CategoriaExplorar";
import meditationProgram from "/assets/meditation-program.jpg";

const PalestrasCategoria = () => {
  const conteudos = [
    {
      image: meditationProgram,
      type: "PALESTRA",
      title: "A ciência da meditação",
      duration: "45 min",
      route: "/explorar/palestras/ciencia-meditacao"
    },
    {
      image: meditationProgram,
      type: "PALESTRA",
      title: "Neuroplasticidade e mindfulness",
      duration: "38 min",
      route: "/explorar/palestras/neuroplasticidade"
    },
    {
      image: meditationProgram,
      type: "PALESTRA",
      title: "Budismo e meditação moderna",
      duration: "52 min",
      route: "/explorar/palestras/budismo"
    },
    {
      image: meditationProgram,
      type: "PALESTRA",
      title: "Seus limites e seu espaço de aceitação",
      duration: "40 min",
      route: "/explorar/palestras/limites"
    }
  ];

  return (
    <CategoriaExplorar
      title="Palestras"
      description="Aprofunde seu conhecimento sobre meditação, mindfulness e bem-estar com especialistas."
      emoji="🎙️"
      conteudos={conteudos}
    />
  );
};

export default PalestrasCategoria;
