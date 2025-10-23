import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import Hoje from "./pages/Hoje";
import Explorar from "./pages/Explorar";
import Humor from "./pages/Humor";
import Perfil from "./pages/Perfil";
import PrimeirosPassos from "./pages/PrimeirosPassos";
import Iniciantes from "./pages/Iniciantes";
import Sono from "./pages/Sono";
import Ansiedade from "./pages/Ansiedade";
import Foco from "./pages/Foco";
import ComecarMeditacao from "./pages/ComecarMeditacao";
import MeditacaoIniciantes from "./pages/MeditacaoIniciantes";
import DespertarConsciencia from "./pages/DespertarConsciencia";
import MeditacaoTransformaVida from "./pages/MeditacaoTransformaVida";
import PoderRespiracao from "./pages/PoderRespiracao";
import PazInterior from "./pages/PazInterior";
import MindfulnessRotina from "./pages/MindfulnessRotina";
import GratidaoBemEstar from "./pages/GratidaoBemEstar";
import NotFound from "./pages/NotFound";
import AcessoNegado from "./pages/AcessoNegado";
import ProtectedRoute from "./components/ProtectedRoute";

// Category pages
import ComecarMeditarCategoria from "./pages/explorar/ComecarMeditarCategoria";
import ProgramasMeditacaoCategoria from "./pages/explorar/ProgramasMeditacaoCategoria";
import PopularesCategoria from "./pages/explorar/PopularesCategoria";
import PraticasRapidasCategoria from "./pages/explorar/PraticasRapidasCategoria";
import PalestrasCategoria from "./pages/explorar/PalestrasCategoria";
import TrabalhoCategoria from "./pages/explorar/TrabalhoCategoria";
import NewslettersCategoria from "./pages/explorar/NewslettersCategoria";
import JornadasCategoria from "./pages/explorar/JornadasCategoria";

// Começar a meditar content pages
import PrimeirosPassosMeditacao from "./pages/explorar/comecar-meditar/PrimeirosPassosMeditacao";
import RespiracaoConsciente from "./pages/explorar/comecar-meditar/RespiracaoConsciente";
import IniciacaoMindfulness from "./pages/explorar/comecar-meditar/IniciacaoMindfulness";
import AtencaoPlenaIniciantes from "./pages/explorar/comecar-meditar/AtencaoPlenaIniciantes";

// Programas content pages
import AnsiedadeEstresse from "./pages/explorar/programas/AnsiedadeEstresse";
import AutoconhecimentoProfundo from "./pages/explorar/programas/AutoconhecimentoProfundo";
import CultivarCompaixao from "./pages/explorar/programas/CultivarCompaixao";
import EquilibrioEmocional from "./pages/explorar/programas/EquilibrioEmocional";

// Populares content pages
import PazInteriorPopular from "./pages/explorar/populares/PazInteriorPopular";
import SonsNatureza from "./pages/explorar/populares/SonsNatureza";
import SonoProfundo from "./pages/explorar/populares/SonoProfundo";
import GratidaoDiaria from "./pages/explorar/populares/GratidaoDiaria";

// Práticas rápidas content pages
import PausaMindful from "./pages/explorar/praticas-rapidas/PausaMindful";
import Respiracao478 from "./pages/explorar/praticas-rapidas/Respiracao478";
import ResetMental from "./pages/explorar/praticas-rapidas/ResetMental";

// Palestras content pages
import CienciaMeditacao from "./pages/explorar/palestras/CienciaMeditacao";
import Neuroplasticidade from "./pages/explorar/palestras/Neuroplasticidade";
import BudismoModerno from "./pages/explorar/palestras/BudismoModerno";
import LimitesAceitacao from "./pages/explorar/palestras/LimitesAceitacao";

// Trabalho content pages
import ProdutividadeConsciente from "./pages/explorar/trabalho/ProdutividadeConsciente";
import FocoConcentracao from "./pages/explorar/trabalho/FocoConcentracao";
import CriatividadeTrabalho from "./pages/explorar/trabalho/CriatividadeTrabalho";

// Newsletters content pages
import SaudeMental from "./pages/explorar/newsletters/SaudeMental";
import SuaVidaSuaCena from "./pages/explorar/newsletters/SuaVidaSuaCena";
import DuvidarFazParte from "./pages/explorar/newsletters/DuvidarFazParte";

// Jornadas content pages
import JornadaGratidao from "./pages/explorar/jornadas/JornadaGratidao";
import JornadaConsciencia from "./pages/explorar/jornadas/JornadaConsciencia";
import JornadaTransformacao from "./pages/explorar/jornadas/JornadaTransformacao";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="serenity-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication routes (públicas) */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/acesso-negado" element={<AcessoNegado />} />

            {/* Protected routes - requerem autenticação E token ativo */}
            <Route path="/hoje" element={<ProtectedRoute><Hoje /></ProtectedRoute>} />
            <Route path="/explorar" element={<ProtectedRoute><Explorar /></ProtectedRoute>} />
            <Route path="/humor" element={<ProtectedRoute><Humor /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/primeiros-passos" element={<PrimeirosPassos />} />
            <Route path="/iniciantes" element={<Iniciantes />} />
            <Route path="/sono" element={<Sono />} />
            <Route path="/ansiedade" element={<Ansiedade />} />
            <Route path="/foco" element={<Foco />} />
            <Route path="/comecar-meditacao" element={<ComecarMeditacao />} />
            <Route path="/meditacao-iniciantes" element={<MeditacaoIniciantes />} />
            <Route path="/despertar-consciencia" element={<DespertarConsciencia />} />
            <Route path="/meditacao-transforma-vida" element={<MeditacaoTransformaVida />} />
            <Route path="/poder-respiracao" element={<PoderRespiracao />} />
            <Route path="/paz-interior" element={<PazInterior />} />
            <Route path="/mindfulness-rotina" element={<MindfulnessRotina />} />
            <Route path="/gratidao-bemestar" element={<GratidaoBemEstar />} />

            {/* Explorar category pages */}
            <Route path="/explorar/comecar-meditar" element={<ComecarMeditarCategoria />} />
            <Route path="/explorar/programas" element={<ProgramasMeditacaoCategoria />} />
            <Route path="/explorar/populares" element={<PopularesCategoria />} />
            <Route path="/explorar/praticas-rapidas" element={<PraticasRapidasCategoria />} />
            <Route path="/explorar/palestras" element={<PalestrasCategoria />} />
            <Route path="/explorar/trabalho" element={<TrabalhoCategoria />} />
            <Route path="/explorar/newsletters" element={<NewslettersCategoria />} />
            <Route path="/explorar/jornadas" element={<JornadasCategoria />} />

            {/* Começar a meditar content pages */}
            <Route path="/explorar/comecar-meditar/primeiros-passos" element={<PrimeirosPassosMeditacao />} />
            <Route path="/explorar/comecar-meditar/respiracao-consciente" element={<RespiracaoConsciente />} />
            <Route path="/explorar/comecar-meditar/mindfulness" element={<IniciacaoMindfulness />} />
            <Route path="/explorar/comecar-meditar/atencao-plena" element={<AtencaoPlenaIniciantes />} />

            {/* Programas content pages */}
            <Route path="/explorar/programas/ansiedade" element={<AnsiedadeEstresse />} />
            <Route path="/explorar/programas/autoconhecimento" element={<AutoconhecimentoProfundo />} />
            <Route path="/explorar/programas/compaixao" element={<CultivarCompaixao />} />
            <Route path="/explorar/programas/equilibrio" element={<EquilibrioEmocional />} />

            {/* Populares content pages */}
            <Route path="/explorar/populares/paz-interior" element={<PazInteriorPopular />} />
            <Route path="/explorar/populares/sons-natureza" element={<SonsNatureza />} />
            <Route path="/explorar/populares/sono-profundo" element={<SonoProfundo />} />
            <Route path="/explorar/populares/gratidao-diaria" element={<GratidaoDiaria />} />

            {/* Práticas rápidas content pages */}
            <Route path="/explorar/praticas-rapidas/pausa-mindful" element={<PausaMindful />} />
            <Route path="/explorar/praticas-rapidas/respiracao-478" element={<Respiracao478 />} />
            <Route path="/explorar/praticas-rapidas/reset-mental" element={<ResetMental />} />

            {/* Palestras content pages */}
            <Route path="/explorar/palestras/ciencia-meditacao" element={<CienciaMeditacao />} />
            <Route path="/explorar/palestras/neuroplasticidade" element={<Neuroplasticidade />} />
            <Route path="/explorar/palestras/budismo" element={<BudismoModerno />} />
            <Route path="/explorar/palestras/limites" element={<LimitesAceitacao />} />

            {/* Trabalho content pages */}
            <Route path="/explorar/trabalho/produtividade" element={<ProdutividadeConsciente />} />
            <Route path="/explorar/trabalho/foco" element={<FocoConcentracao />} />
            <Route path="/explorar/trabalho/criatividade" element={<CriatividadeTrabalho />} />

            {/* Newsletters content pages */}
            <Route path="/explorar/newsletters/saude-mental" element={<SaudeMental />} />
            <Route path="/explorar/newsletters/sua-vida" element={<SuaVidaSuaCena />} />
            <Route path="/explorar/newsletters/duvidar" element={<DuvidarFazParte />} />

            {/* Jornadas content pages */}
            <Route path="/explorar/jornadas/gratidao" element={<JornadaGratidao />} />
            <Route path="/explorar/jornadas/consciencia" element={<JornadaConsciencia />} />
            <Route path="/explorar/jornadas/transformacao" element={<JornadaTransformacao />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
