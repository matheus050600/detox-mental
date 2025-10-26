import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeditationCard from "@/components/MeditationCard";
import SoulAI from "@/components/SoulAI";
import SectionTitle from "@/components/SectionTitle";
import HorizontalScroll from "@/components/HorizontalScroll";
import LiveCounter from "@/components/LiveCounter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import motivationalImage1 from "/assets/frase motivacional 1.jpg";
import motivationalImage2 from "/assets/frase motivacional 2.jpg";
import motivationalImage3 from "/assets/frase motivacional.jpg";
import { useUser } from "@/hooks/useUser";

const Hoje = () => {
  const navigate = useNavigate();
  const { profile } = useUser();

  // Animação fade-in suave (mesma da landing page)
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  // Seleção aleatória das imagens motivacionais
  const motivationalImages = [motivationalImage1, motivationalImage2, motivationalImage3];
  const randomInspirationImage = useMemo(() => {
    return motivationalImages[Math.floor(Math.random() * motivationalImages.length)];
  }, []);

  // Recomendações diárias com assets locais
  const dailyRecommendations = [
    {
      image: "/assets/primeiros passos.jpg",
      type: "PROGRAMA",
      title: "Primeiros passos",
      audio: "/assets/comece a meditar.m4a"
    }
  ];

  const recommendations = {
    iniciantes: [
      {
        image: "/assets/comece a meditar 1.jpg",
        type: "Programa",
        title: "Começar a meditar",
        audio: "/assets/comece a meditar.m4a"
      },
      {
        image: "/assets/meditação guiada para iniciantes 1.jpg",
        type: "Programa",
        title: "Meditação guiada para iniciantes",
        audio: "/assets/meidtação guiada para iniciantes.m4a"
      },
      {
        image: "/assets/despertar da cosciência.jpg",
        type: "Jornada",
        title: "Despertar da consciência",
        audio: "/assets/despertar da conciência.mp3"
      },
      {
        image: "/assets/meditation-program.jpg",
        type: "Blog",
        title: "Como a meditação transforma sua vida",
        audio: "/assets/como a meditação transforma a sua vida.m4a"
      }
    ],
    sono: [
      {
        image: "/assets/sono profundo.jpg",
        type: "Jornada",
        title: "Sono profundo e restaurador",
        audio: "/assets/sono profundo.mp3"
      },
      {
        image: "/assets/sleep-journey.jpg",
        type: "Meditação",
        title: "Relaxamento antes de dormir",
        audio: "/assets/soothing-dreams-165498.mp3"
      },
      {
        image: "/assets/sleep-journey.jpg",
        type: "Programa",
        title: "Técnicas para dormir melhor",
        audio: "/assets/sleep-music-vol15-195425.mp3"
      }
    ]
  };

  const learnContent = [
    {
      image: "/assets/reapiração consciente.jpg",
      type: "ÁUDIO",
      title: "O poder da respiração consciente",
      audio: "/assets/respiração consciente.mp3"
    },
    {
      image: "/assets/paz interior.jpg",
      type: "ÁUDIO",
      title: "Encontrando paz interior",
      audio: "/assets/encontrando a paz interior.mp3"
    },
    {
      image: "/assets/iniciação ao mindfulness.jpg",
      type: "BLOG",
      title: "Mindfulness na rotina diária",
      audio: "/assets/Mindfulness na rotina diária.mp3"
    },
    {
      image: "/assets/gratidão diaria.jpg",
      type: "ÁUDIO",
      title: "Gratidão e bem-estar",
      audio: "/assets/gratidão diaria.mp3"
    }
  ];

  const getTimeOfDay = (): "manhã" | "tarde" | "noite" => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "manhã";
    if (hour >= 12 && hour < 18) return "tarde";
    return "noite";
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section - Two Cards */}
          <motion.section {...fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Greeting Card - Left */}
            <Card className="relative overflow-hidden p-8 flex flex-col justify-center min-h-[280px] shadow-lg hover:shadow-xl transition-smooth">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-blue-200 to-purple-200 dark:from-purple-900/80 dark:via-blue-900/80 dark:to-purple-800/80" />
              <div className="relative z-10 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Boa {getTimeOfDay()}, {profile?.name || "visitante"}
                  </h1>
                  <p className="text-lg text-gray-700 dark:text-gray-200">
                    Faça um registro rápido do seu humor!
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/humor")}
                  className="bg-white text-primary hover:bg-white/90 shadow-md gap-2 px-6 py-6 text-base font-semibold rounded-xl"
                >
                  Registrar humor
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            {/* Inspiration Card - Right */}
            <Card className="relative overflow-hidden flex items-center justify-center min-h-[280px] shadow-lg hover:shadow-xl transition-smooth">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${randomInspirationImage})`,
                }}
              />
              {/* Overlay translúcido para melhor contraste */}
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 p-8 text-center">
                <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed animate-quote-fade-in">
                  "Para obtermos a resposta, precisamos buscar apenas dentro de nós mesmos."
                </p>
              </div>
            </Card>
          </motion.section>

          {/* Daily Recommendations */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Recomendações diárias" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyRecommendations.map((item, index) => (
                <div key={index} onClick={() => window.location.href = '/primeiros-passos'} className="cursor-pointer">
                  <MeditationCard
                    variant="horizontal"
                    {...item}
                  />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Recommendations for You */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Recomendações para você" />
            <Tabs defaultValue="iniciantes" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 mb-8 h-auto flex-wrap gap-2">
                <TabsTrigger
                  value="iniciantes"
                  onClick={() => window.location.href = '/iniciantes'}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-soft whitespace-nowrap cursor-pointer"
                >
                  Iniciantes
                </TabsTrigger>
                <TabsTrigger
                  value="sono"
                  onClick={() => window.location.href = '/sono'}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-soft whitespace-nowrap cursor-pointer"
                >
                  Sono
                </TabsTrigger>
                <TabsTrigger
                  value="estresse"
                  onClick={() => window.location.href = '/ansiedade'}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-soft whitespace-nowrap cursor-pointer"
                >
                  Estresse e Ansiedade
                </TabsTrigger>
                <TabsTrigger
                  value="foco"
                  onClick={() => window.location.href = '/foco'}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-soft whitespace-nowrap cursor-pointer"
                >
                  Foco
                </TabsTrigger>
              </TabsList>

              <HorizontalScroll>
                {recommendations.iniciantes.map((item, index) => {
                  const routes = [
                    '/comecar-meditacao',
                    '/meditacao-iniciantes',
                    '/despertar-consciencia',
                    '/meditacao-transforma-vida'
                  ];
                  return (
                    <div
                      key={index}
                      className="min-w-[280px] snap-start cursor-pointer"
                      onClick={() => window.location.href = routes[index]}
                    >
                      <MeditationCard {...item} />
                    </div>
                  );
                })}
              </HorizontalScroll>
            </Tabs>
          </motion.section>

          {/* Mental IA */}
          <motion.div {...fadeInUp}>
            <SoulAI userName="matheus" timeOfDay={getTimeOfDay()} />
          </motion.div>

          {/* Learn and Explore */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Aprenda e explore" showViewAll />
            <HorizontalScroll>
              {learnContent.map((item, index) => {
                const routes = [
                  '/poder-respiracao',
                  '/paz-interior',
                  '/mindfulness-rotina',
                  '/gratidao-bemestar'
                ];
                return (
                  <div
                    key={index}
                    className="min-w-[280px] snap-start cursor-pointer"
                    onClick={() => window.location.href = routes[index]}
                  >
                    <MeditationCard {...item} />
                  </div>
                );
              })}
            </HorizontalScroll>
          </motion.section>

          {/* Live Counter */}
          <motion.div {...fadeInUp}>
            <LiveCounter />
          </motion.div>

          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Hoje;
