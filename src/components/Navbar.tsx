import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoImage from "/assets/logo.png";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ||
           (path === "/hoje" && location.pathname === "/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-[10px] border-b border-white/20 dark:border-gray-700/20">
      <div className="w-full px-4 md:px-6">
        {/* Mobile Layout (< 768px) */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2 h-16 py-3 overflow-x-auto">
          {/* 1. Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img
              src={logoImage}
              alt="Detox Mental"
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* 2. Nome - Cor violeta/roxo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <span className="text-xs sm:text-sm font-semibold text-purple-400 dark:text-purple-300 whitespace-nowrap">
              Detox Mental
            </span>
          </Link>

          {/* 3. Hoje - Cor violeta/roxo */}
          <Link
            to="/hoje"
            className={`flex items-center justify-center flex-shrink-0 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth whitespace-nowrap ${
              isActive("/hoje")
                ? "bg-purple-500/20 text-purple-400 dark:text-purple-300"
                : "text-purple-400 dark:text-purple-300 hover:text-purple-300 hover:bg-purple-500/10"
            }`}
          >
            Hoje
          </Link>

          {/* 4. Explorar - Cor violeta/roxo */}
          <Link
            to="/explorar"
            className={`flex items-center justify-center flex-shrink-0 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth whitespace-nowrap ${
              isActive("/explorar")
                ? "bg-purple-500/20 text-purple-400 dark:text-purple-300"
                : "text-purple-400 dark:text-purple-300 hover:text-purple-300 hover:bg-purple-500/10"
            }`}
          >
            Explorar
          </Link>

          {/* 5. Theme Toggle */}
          <div className="flex items-center flex-shrink-0 ml-auto">
            <ThemeToggle />
          </div>

          {/* 6. Avatar de Perfil */}
          <Link to="/perfil" className="flex items-center flex-shrink-0">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=matheus" />
              <AvatarFallback className="bg-gradient-primary text-white font-semibold text-xs">
                M
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* Desktop Layout (>= 768px) - Mantido igual */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo e Nome */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoImage}
              alt="Detox Mental"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Detox Mental
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/hoje"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                isActive("/hoje")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Hoje
            </Link>
            <Link
              to="/explorar"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                isActive("/explorar")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Explorar
            </Link>
          </div>

          {/* Theme Toggle & User Avatar */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/perfil">
              <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-smooth">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=matheus" />
                <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                  M
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
