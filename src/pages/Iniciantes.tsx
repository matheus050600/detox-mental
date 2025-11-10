import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeditationCard from "@/components/MeditationCard";
import SectionTitle from "@/components/SectionTitle";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Iniciantes = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const conteudos = [
    {
      image: "/assets/primeiros passos.jpg",
      type: "MEDITAÇÃO",
      title: "Primeiros Passos",
      duration: "7 min",
      audio: "/assets/primeiros passos.mp3"
    },
    {
      image: "/assets/primeiros passos na meditacao.jpg",
      type: "PROGRAMA",
      title: "Primeiros passos na meditação",
      duration: "10 min",
      audio: "/assets/primeiros passos na meditação.mp3"
    },
    {
      image: "/assets/meditação guiada para iniciantes 1.jpg",
      type: "MEDITAÇÃO",
      title: "Meditação guiada para iniciantes",
      duration: "15 min",
      audio: "/assets/meidtação guiada para iniciantes.m4a"
    },
    {
      image: "/assets/atenção plena para iniciantes.jpg",
      type: "PROGRAMA",
      title: "Atenção plena para iniciantes",
      duration: "12 min",
      audio: "/assets/meditation-yoga-409201.mp3"
    },
  ];

  const programasDestaque = [
    {
      image: "/assets/comece a meditar 1.jpg",
      type: "PROGRAMA",
      title: "Começar a meditar",
      duration: "21 dias",
      audio: "/assets/comece a meditar.m4a"
    },
    {
      image: "/assets/reapiração consciente.jpg",
      type: "MEDITAÇÃO",
      title: "Respiração consciente",
      duration: "10 min",
      audio: "/assets/respiração consciente.mp3"
    },
    {
      image: "/assets/iniciação ao mindfulness.jpg",
      type: "PROGRAMA",
      title: "Iniciação ao mindfulness",
      duration: "14 dias",
      audio: "/assets/meditation-yoga-409201.mp3"
    },
  ];

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/hoje")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <motion.div {...fadeInUp} className="text-center md:text-left">
            <div className="text-6xl mb-4">🌱</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Iniciantes</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Comece sua jornada de meditação com práticas guiadas especialmente desenvolvidas para quem está dando os primeiros passos.
            </p>
          </motion.div>

          <motion.section {...fadeInUp}>
            <SectionTitle title="Conteúdos recomendados" />
            <HorizontalScroll>
              {conteudos.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start">
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          <motion.section {...fadeInUp}>
            <SectionTitle title="Programas em destaque" showViewAll />
            <HorizontalScroll>
              {programasDestaque.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start">
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          <motion.section {...fadeInUp}>
            <SectionTitle title="Meditações rápidas" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conteudos.slice(0, 3).map((item, index) => (
                <MeditationCard key={index} variant="horizontal" {...item} />
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Iniciantes;
