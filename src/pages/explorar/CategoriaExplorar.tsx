import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeditationCard from "@/components/MeditationCard";
import SectionTitle from "@/components/SectionTitle";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CategoriaExplorarProps {
  title: string;
  description: string;
  emoji: string;
  conteudos: Array<{
    image: string;
    type: string;
    title: string;
    duration: string;
    route: string;
  }>;
}

const CategoriaExplorar = ({ title, description, emoji, conteudos }: CategoriaExplorarProps) => {
  const navigate = useNavigate();

  // Animação fade-in suave (mesma da landing page)
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/explorar")}
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

          {/* Conteúdos */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Conteúdos disponíveis" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {conteudos.map((item, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => navigate(item.route)}
                >
                  <MeditationCard {...item} />
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoriaExplorar;
