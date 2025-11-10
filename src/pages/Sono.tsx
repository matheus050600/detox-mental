import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeditationCard from "@/components/MeditationCard";
import SectionTitle from "@/components/SectionTitle";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Sono = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const conteudos = [
    {
      image: "/assets/sono-sessao1.jpg",
      type: "MEDITAÇÃO",
      title: "Sono - Sessão 1",
      duration: "10 min",
      audio: "/assets/sono-sessao1.mp3"
    },
    {
      image: "/assets/sono - programa completo.jpg",
      type: "PROGRAMA",
      title: "Sono - Programa completo",
      duration: "21 dias",
      audio: "/assets/Sono — Programa Completo.mp3"
    },
    {
      image: "/assets/sons para sono.jpg",
      type: "ÁUDIO",
      title: "Sons para sono",
      duration: "15 min",
      audio: "/assets/sons para sono.mp3"
    },
    {
      image: "/assets/jornada de sono.jpg",
      type: "JORNADA",
      title: "Jornada de Sono",
      duration: "14 dias",
      audio: "/assets/jornada de sono.mp3"
    },
  ];

  const programasDestaque = [
    {
      image: "/assets/sono profundo.jpg",
      type: "MEDITAÇÃO",
      title: "Sono Profundo",
      duration: "20 min",
      audio: "/assets/sono profundo.mp3"
    },
    {
      image: "/assets/sono-sessao1.jpg",
      type: "PROGRAMA",
      title: "Programa avançado de Sono",
      duration: "30 dias",
      audio: "/assets/Sono — Programa Completo.mp3"
    },
    {
      image: "/assets/sons para sono.jpg",
      type: "LISTA DE REPRODUÇÃO",
      title: "Playlist Sono",
      duration: "45 min",
      audio: "/assets/sons para sono.mp3"
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
            <div className="text-6xl mb-4">😴</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sono</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Descubra meditações e sons relaxantes que irão ajudá-lo a ter uma noite de sono profunda e restauradora.
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

export default Sono;
