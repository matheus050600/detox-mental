import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "@/lib/supabase";
import logoImage from "/assets/logo.png";

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar email de recuperação. Tente novamente.");
      console.error("Erro na recuperação de senha:", err);
    } finally {
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
          Recuperar Senha
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Digite seu e-mail para receber o link de recuperação
        </p>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Mensagem de sucesso */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl text-sm">
            E-mail de recuperação enviado! Verifique sua caixa de entrada.
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
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

          {/* Botão de Enviar */}
          <button
            type="submit"
            disabled={loading || success}
            className="bg-gradient-to-r from-purple-500 to-indigo-400 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Enviando..." : "Enviar Link de Recuperação"}
          </button>
        </form>

        {/* Links adicionais */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Lembrou sua senha?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EsqueciSenha;
