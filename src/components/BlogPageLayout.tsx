import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

interface BlogPageLayoutProps {
  title: string;
  subtitle?: string;
  duration?: string;
  textFile: string;
  backPath?: string;
}

const BlogPageLayout = ({
  title,
  subtitle = "Uma jornada de leitura reflexiva.",
  duration = "5 min",
  textFile,
  backPath = "/explorar/newsletters"
}: BlogPageLayoutProps) => {
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/texts/blogs/${textFile}`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Erro ao carregar o conteúdo:", error);
        setContent("Não foi possível carregar o conteúdo. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [textFile]);

  const formatContent = (text: string) => {
    // Remove o título do início se existir (já mostramos no header)
    const lines = text.split('\n');
    const contentWithoutTitle = lines.slice(1).join('\n');

    // Divide em parágrafos
    const paragraphs = contentWithoutTitle.split('\n\n').filter(p => p.trim());

    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();

      // Se for uma citação (começa com >)
      if (trimmedParagraph.startsWith('>')) {
        return (
          <blockquote
            key={index}
            className="border-l-4 border-primary pl-6 py-4 my-8 italic text-lg text-muted-foreground bg-primary/5 rounded-r-lg"
          >
            {trimmedParagraph.replace(/^>\s*/, '')}
          </blockquote>
        );
      }

      // Parágrafo normal
      return (
        <p
          key={index}
          className="text-lg leading-relaxed text-foreground/90 mb-6"
        >
          {trimmedParagraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(backPath)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          {/* Main Content Card */}
          <Card className="gradient-card border-0 p-8 md:p-12 shadow-medium">
            {/* Header */}
            <div className="text-center mb-12 pb-8 border-b border-border/50">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">BLOG</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {title}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
              {duration && (
                <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{duration} de leitura</span>
                </div>
              )}
            </div>

            {/* Blog Content */}
            <article className="prose prose-lg max-w-none">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-pulse space-y-4 w-full">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {formatContent(content)}
                </div>
              )}
            </article>

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-border/50 text-center">
              <p className="text-muted-foreground mb-4">
                Gostou deste conteúdo? Explore mais reflexões
              </p>
              <Button
                onClick={() => navigate("/explorar/newsletters")}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Ver mais artigos
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPageLayout;
