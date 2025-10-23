import CategoriaExplorar from "./CategoriaExplorar";
import meditationProgram from "/assets/meditation-program.jpg";

const PraticasRapidasCategoria = () => {
  const conteudos = [
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Pausa mindful",
      duration: "1 min",
      route: "/explorar/praticas-rapidas/pausa-mindful"
    },
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Respiração 4-7-8",
      duration: "3 min",
      route: "/explorar/praticas-rapidas/respiracao-478"
    },
    {
      image: meditationProgram,
      type: "MEDITAÇÃO",
      title: "Reset mental",
      duration: "5 min",
      route: "/explorar/praticas-rapidas/reset-mental"
    }
  ];

  return (
    <CategoriaExplorar
      title="Práticas rápidas"
      description="Meditações curtas e eficazes para momentos em que você precisa de uma pausa rápida."
      emoji="⚡"
      conteudos={conteudos}
    />
  );
};

export default PraticasRapidasCategoria;
