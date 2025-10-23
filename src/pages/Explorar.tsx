import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeditationCard from "@/components/MeditationCard";
import SectionTitle from "@/components/SectionTitle";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Explorar = () => {
  const navigate = useNavigate();

  // Animação fade-in suave (mesma da landing page)
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const categories = [
    { name: "Começar a meditar", route: "/explorar/comecar-meditar" },
    { name: "Programas de meditação", route: "/explorar/programas" },
    { name: "Populares", route: "/explorar/populares" },
    { name: "Práticas rápidas", route: "/explorar/praticas-rapidas" },
    { name: "Palestras", route: "/explorar/palestras" },
    { name: "Para o trabalho", route: "/explorar/trabalho" },
    { name: "Newsletters", route: "/explorar/newsletters" },
    { name: "Jornadas", route: "/explorar/jornadas" }
  ];

  // Mock data - na aplicação real, viria de uma API
  const meditationData = {
    comecar: [
      {
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop",
        type: "PROGRAMA",
        title: "Primeiros passos na meditação",
        route: "/explorar/comecar-meditar/primeiros-passos"
      },
      {
        image: "https://images.unsplash.com/photo-1447875569765-2b3db822bec9?w=800&h=600&fit=crop",
        type: "PROGRAMA",
        title: "Respiração consciente",
        route: "/explorar/comecar-meditar/respiracao-consciente"
      },
      {
        image: "https://images.unsplash.com/photo-1506126279646-a697353d3166?w=800&h=600&fit=crop",
        type: "JORNADA",
        title: "Iniciação ao mindfulness",
        route: "/explorar/comecar-meditar/mindfulness"
      },
      {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        type: "MEDITAÇÃO",
        title: "Atenção plena para iniciantes",
        route: "/explorar/comecar-meditar/atencao-plena"
      }
    ],
    programas: [
      {
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop",
        type: "PROGRAMA",
        title: "Ansiedade e estresse",
        route: "/explorar/programas/ansiedade"
      },
      {
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=600&fit=crop",
        type: "PROGRAMA",
        title: "Autoconhecimento profundo",
        route: "/explorar/programas/autoconhecimento"
      },
      {
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        type: "PROGRAMA",
        title: "Cultivando a compaixão",
        route: "/explorar/programas/compaixao"
      },
      {
        image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=600&fit=crop",
        type: "PROGRAMA",
        title: "Equilíbrio emocional",
        route: "/explorar/programas/equilibrio"
      }
    ],
    populares: [
      {
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        type: "MEDITAÇÃO",
        title: "Paz interior",
        route: "/explorar/populares/paz-interior"
      },
      {
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop",
        type: "LISTA DE REPRODUÇÃO",
        title: "Sons da natureza",
        route: "/explorar/populares/sons-natureza"
      },
      {
        image: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=800&h=600&fit=crop",
        type: "JORNADA",
        title: "Sono profundo",
        route: "/explorar/populares/sono-profundo"
      },
      {
        image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=800&h=600&fit=crop",
        type: "MEDITAÇÃO",
        title: "Gratidão diária",
        route: "/explorar/populares/gratidao-diaria"
      }
    ],
    praticasRapidas: [
      {
        image: "https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=800&h=600&fit=crop",
        type: "MEDITAÇÃO",
        title: "Pausa mindful",
        route: "/explorar/praticas-rapidas/pausa-mindful"
      },
      {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        type: "MEDITAÇÃO",
        title: "Respiração 4-7-8",
        route: "/explorar/praticas-rapidas/respiracao-478"
      },
      {
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        type: "MEDITAÇÃO",
        title: "Reset mental",
        route: "/explorar/praticas-rapidas/reset-mental"
      }
    ],
    palestras: [
      {
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop",
        type: "PALESTRA",
        title: "A ciência da meditação",
        route: "/explorar/palestras/ciencia-meditacao"
      },
      {
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=600&fit=crop",
        type: "PALESTRA",
        title: "Neuroplasticidade e mindfulness",
        route: "/explorar/palestras/neuroplasticidade"
      },
      {
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        type: "PALESTRA",
        title: "Budismo e meditação moderna",
        route: "/explorar/palestras/budismo"
      },
      {
        image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=600&fit=crop",
        type: "PALESTRA",
        title: "Seus limites e seu espaço de aceitação",
        route: "/explorar/palestras/limites"
      }
    ],
    trabalho: [
      {
        image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=600&fit=crop",
        type: "PROGRAMA",
        title: "Produtividade consciente",
        route: "/explorar/trabalho/produtividade"
      },
      {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        type: "MEDITAÇÃO",
        title: "Foco e concentração",
        route: "/explorar/trabalho/foco"
      },
      {
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        type: "MEDITAÇÃO",
        title: "Criatividade no trabalho",
        route: "/explorar/trabalho/criatividade"
      }
    ],
    newsletters: [
      {
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop",
        type: "BLOG",
        title: "Como vai a sua saúde mental?",
        route: "/explorar/newsletters/saude-mental"
      },
      {
        image: "https://images.unsplash.com/photo-1447875569765-2b3db822bec9?w=800&h=600&fit=crop",
        type: "BLOG",
        title: "Sua vida, sua cena",
        route: "/explorar/newsletters/sua-vida"
      },
      {
        image: "https://images.unsplash.com/photo-1506126279646-a697353d3166?w=800&h=600&fit=crop",
        type: "BLOG",
        title: "Duvidar faz parte do processo",
        route: "/explorar/newsletters/duvidar"
      }
    ],
    jornadas: [
      {
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop",
        type: "JORNADA",
        title: "21 dias de gratidão",
        route: "/explorar/jornadas/gratidao"
      },
      {
        image: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?w=800&h=600&fit=crop",
        type: "JORNADA",
        title: "Despertar da consciência",
        route: "/explorar/jornadas/consciencia"
      },
      {
        image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=800&h=600&fit=crop",
        type: "JORNADA",
        title: "Transformação pessoal",
        route: "/explorar/jornadas/transformacao"
      }
    ]
  };

  return (
    <div className="min-h-screen gradient-soft mobile-page">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-4 md:pb-12">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          {/* Page Title */}
          <motion.div {...fadeInUp}>
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Explorar</h1>

            {/* Category Filters */}
            <Tabs defaultValue={categories[0].name} className="w-full">
              <div className="relative mb-12">
                <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-2 h-auto flex-nowrap custom-scrollbar">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.name}
                      value={category.name}
                      onClick={() => navigate(category.route)}
                      className="data-[state=active]:bg-purple-200 data-[state=active]:text-purple-700 data-[state=active]:shadow-soft whitespace-nowrap transition-smooth cursor-pointer dark:data-[state=active]:bg-purple-300"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </motion.div>

          {/* Começar a meditar */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Começar a meditar" showViewAll />
            <HorizontalScroll>
              {meditationData.comecar.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start cursor-pointer" onClick={() => navigate(item.route)}>
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          {/* Programas de meditação */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Programas de meditação" showViewAll />
            <HorizontalScroll>
              {meditationData.programas.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start cursor-pointer" onClick={() => navigate(item.route)}>
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          {/* Populares */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Populares" showViewAll />
            <HorizontalScroll>
              {meditationData.populares.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start cursor-pointer" onClick={() => navigate(item.route)}>
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          {/* Práticas rápidas */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Práticas rápidas" showViewAll />
            <HorizontalScroll>
              {meditationData.praticasRapidas.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start cursor-pointer" onClick={() => navigate(item.route)}>
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          {/* Palestras */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Palestras" showViewAll />
            <HorizontalScroll>
              {meditationData.palestras.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start cursor-pointer" onClick={() => navigate(item.route)}>
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          {/* Para o trabalho */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Para o trabalho" showViewAll />
            <HorizontalScroll>
              {meditationData.trabalho.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start cursor-pointer" onClick={() => navigate(item.route)}>
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          {/* Newsletters */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Newsletters" showViewAll />
            <HorizontalScroll>
              {meditationData.newsletters.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start cursor-pointer" onClick={() => navigate(item.route)}>
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          {/* Jornadas */}
          <motion.section {...fadeInUp}>
            <SectionTitle title="Jornadas" showViewAll />
            <HorizontalScroll>
              {meditationData.jornadas.map((item, index) => (
                <div key={index} className="min-w-[280px] snap-start cursor-pointer" onClick={() => navigate(item.route)}>
                  <MeditationCard {...item} />
                </div>
              ))}
            </HorizontalScroll>
          </motion.section>

          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Explorar;
