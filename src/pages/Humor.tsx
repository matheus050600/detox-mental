import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Sparkles } from "lucide-react";

type Mood = {
  emoji: string;
  label: string;
  value: string;
};

const moods: Mood[] = [
  { emoji: "😀", label: "Feliz", value: "feliz" },
  { emoji: "😡", label: "Raiva", value: "raiva" },
  { emoji: "😢", label: "Tristeza", value: "tristeza" },
  { emoji: "😰", label: "Ansiedade", value: "ansiedade" },
  { emoji: "😴", label: "Cansado", value: "cansado" },
  { emoji: "😎", label: "Calmo", value: "calmo" },
];

const Humor = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // Aqui você pode salvar no localStorage ou enviar para uma API
    console.log("Humor salvo:", { mood: selectedMood, note });
    setShowSuccess(true);

    // Após 2 segundos, redireciona para a página Hoje
    setTimeout(() => {
      navigate("/hoje");
    }, 2000);
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/hoje")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          {/* Main Card */}
          <Card className="gradient-card border-0 p-8 md:p-12 shadow-medium animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Como você está se sentindo hoje?
              </h1>
              <p className="text-muted-foreground text-lg">
                Selecione o emoji que melhor representa seu humor
              </p>
            </div>

            {/* Mood Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-6 rounded-2xl border-2 transition-smooth hover:scale-105 ${
                    selectedMood === mood.value
                      ? "border-primary bg-primary/10 shadow-medium"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="text-6xl mb-3">{mood.emoji}</div>
                  <div className="text-lg font-medium">{mood.label}</div>
                </button>
              ))}
            </div>

            {/* Note Section - Shows when mood is selected */}
            {selectedMood && (
              <div className="space-y-4 animate-fade-in">
                <Textarea
                  placeholder="Quer contar o motivo? (opcional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[120px] resize-none"
                />

                <Button
                  onClick={handleSave}
                  className="w-full gap-2 text-lg py-6"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Salvar registro
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-primary" />
              Registro salvo com sucesso!
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Seu humor foi registrado. Continue cuidando do seu bem-estar!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Humor;
