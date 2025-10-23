import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || (path === "/hoje" && location.pathname === "/");
  };

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/hoje">
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Serenity
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/hoje"
              className={`text-sm font-medium transition-smooth ${
                isActive("/hoje") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Hoje
            </Link>
            <Link
              to="/explorar"
              className={`text-sm font-medium transition-smooth ${
                isActive("/explorar") ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              Explorar
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
