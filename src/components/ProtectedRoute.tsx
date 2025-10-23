import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, checkUserHasActiveToken } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireToken?: boolean; // Se true, requer token de acesso além de autenticação
}

const ProtectedRoute = ({ children, requireToken = true }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await isAuthenticated();
      setAuthenticated(isAuth);

      if (isAuth && requireToken) {
        const hasActiveToken = await checkUserHasActiveToken();
        setHasToken(hasActiveToken);
      } else {
        setHasToken(true); // Se não requer token, considera como true
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setAuthenticated(false);
      setHasToken(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-400 font-medium"
          >
            Verificando acesso...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Não autenticado - redireciona para login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado mas sem token de acesso - redireciona para página de acesso negado
  if (requireToken && !hasToken) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
