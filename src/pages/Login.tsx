import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase";
import logoImage from "/assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate("/hoje");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      // O redirecionamento é automático após autenticação
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google.");
      console.error("Erro no login com Google:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-blue-200 to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-all">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30 dark:border-gray-700/50 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logoImage}
            alt="Detox Mental"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
          Bem-vindo ao Detox Mental
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Entre para continuar sua jornada de bem-estar
        </p>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Campo de Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-indigo-400 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400">
              Ou continue com
            </span>
          </div>
        </div>

        {/* Botão Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Conectando..." : "Entrar com Google"}
        </button>

        {/* Links adicionais */}
        <div className="mt-6 flex flex-col gap-3 text-center text-sm">
          <Link
            to="/esqueci-senha"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Esqueci minha senha
          </Link>
          <div className="text-gray-600 dark:text-gray-400">
            Não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
