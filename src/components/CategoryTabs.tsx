import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContentCard from "./ContentCard";
import meditationProgram from "/assets/meditation-program.jpg";
import sleepJourney from "/assets/sleep-journey.jpg";
import stressRelief from "/assets/stress-relief.jpg";

const CategoryTabs = () => {
  const categories = [
    { value: "all", label: "Todos" },
    { value: "beginners", label: "Iniciantes" },
    { value: "sleep", label: "Sono" },
    { value: "stress", label: "Estresse e Ansiedade" },
    { value: "popular", label: "Popular" },
  ];

  const content = [
    {
      image: meditationProgram,
      type: "PROGRAMA",
      title: "Comece a meditar em 21 dias",
      progress: 0,
    },
    {
      image: sleepJourney,
      type: "JORNADA",
      title: "Sono profundo e restaurador",
      progress: 15,
    },
    {
      image: stressRelief,
      type: "MEDITAÇÃO",
      title: "Liberação de estresse e ansiedade",
      duration: "15 min",
    },
  ];

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1 mb-8">
        {categories.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="data-[state=active]:bg-background data-[state=active]:shadow-soft whitespace-nowrap"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.value} value={category.value} className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {content.map((item, index) => (
              <ContentCard key={index} {...item} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoryTabs;
