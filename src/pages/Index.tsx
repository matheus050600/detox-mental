import Header from "@/components/Header";
import WelcomeCard from "@/components/WelcomeCard";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import QuickActionCard from "@/components/QuickActionCard";
import Section from "@/components/Section";
import SoulAICard from "@/components/SoulAICard";
import CategoryTabs from "@/components/CategoryTabs";
import LiveCounter from "@/components/LiveCounter";
import meditationProgram from "/assets/meditation-program.jpg";

const Index = () => {
  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <WelcomeCard />
          
          <FeaturedCarousel />
          
          <Section title="Recomendações diárias">
            <QuickActionCard 
              title="Primeiros passos"
              duration="7 min"
              image={meditationProgram}
            />
          </Section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-6">Recomendações para você</h2>
            <CategoryTabs />
          </section>

          <SoulAICard />

          <Section title="Aprenda e explore" showViewAll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <QuickActionCard 
                title="O poder da respiração consciente"
                duration="12 min"
                image={meditationProgram}
              />
              <QuickActionCard 
                title="Meditação para iniciantes"
                duration="8 min"
                image={meditationProgram}
              />
              <QuickActionCard 
                title="Sons da natureza para relaxar"
                duration="20 min"
                image={meditationProgram}
              />
            </div>
          </Section>

          <LiveCounter />
        </div>
      </main>
    </div>
  );
};

export default Index;
