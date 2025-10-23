import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeditationCard from "@/components/MeditationCard";
import SectionTitle from "@/components/SectionTitle";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CategoriaProps {
  title: string;
  description: string;
  emoji: string;
}

const Categoria = ({ title, description, emoji }: CategoriaProps) => {
  const navigate = useNavigate();

  // Animação fade-in suave (mesma da landing page)
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  // Mock data - na aplicação real, viria de uma API
  const conteudos = [
    {
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
      type: "MEDITAÇÃO",
      title: `${title} - Sessão 1`,
      duration: "10 min"
    },
    {
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop",
      type: "PROGRAMA",
      title: `${title} - Programa completo`,
      duration: "21 dias"
    },
    {
      image: "https://images.unsplash.com/photo-1447875569765-2b3db822bec9?w=800&h=600&fit=crop",
      type: "ÁUDIO",
      title: `Sons para ${title.toLowerCase()}`,
      duration: "15 min"
    },
    {
      image: "https://images.unsplash.com/photo-1506126279646-a697353d3166?w=800&h=600&fit=crop",
      type: "JORNADA",
      title: `Jornada de ${title}`,
      duration: "14 dias"
    },
  ];

  const programasDestaque = [
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      type: "PROGRAMA",
      title: `Programa avançado de ${title}`,
      duration: "30 dias"
    },
    {
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop",
      type: "MEDITAÇÃO",
      title: `Meditação guiada - ${title}`,
      duration: "20 min"
    },
    {
      image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=600&fit=crop",
      type: "LISTA DE REPRODUÇÃO",
      title: `Playlist ${title}`,
      duration: "45 min"
    },
  ];

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/hoje")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          {/* Page Header */}
          <motion.div {...fadeInUp} className="text-center md:text-left">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {description}
            </p>
          </motion.div>

          {/* Conteúdos Principais */}
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

          {/* Programas em Destaque */}
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

          {/* Meditações Rápidas */}
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

export default Categoria;
