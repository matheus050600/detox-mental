import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratação do SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full transition-smooth hover:bg-accent/10"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 transition-smooth" />
      ) : (
        <Moon className="h-5 w-5 text-primary transition-smooth" />
      )}
    </Button>
  );
}
