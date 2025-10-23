import { motion } from "framer-motion";
import { Lock, ShoppingCart, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logoImage from "/assets/logo.png";

const AcessoNegado = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          {/* Header com Logo */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-4"
            >
              <Lock className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Acesso Restrito
            </h1>
            <p className="text-white/90 text-lg">
              Você precisa de uma assinatura ativa para acessar esta área
            </p>
          </div>

          {/* Conteúdo */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <img
                src={logoImage}
                alt="Detox Mental"
                className="h-16 w-auto object-contain mx-auto mb-6"
              />
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Para ter acesso completo ao <span className="font-bold text-purple-600 dark:text-purple-400">Detox Mental</span>,
                você precisa de uma assinatura ativa via Kiwify.
              </p>
            </div>

            {/* Benefícios */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-0 p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                ✨ O que você terá acesso:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Acesso ilimitado a todas as meditações guiadas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Acompanhamento de progresso e estatísticas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Sistema de sequências (streaks) e conquistas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Novos conteúdos exclusivos toda semana
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Suporte prioritário
                  </span>
                </li>
              </ul>
            </Card>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={() => window.open("https://pay.kiwify.com.br/aj7NocQ", "_blank")}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Assinar Agora - R$ 19,90/mês
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full py-6 rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar à Página Inicial
                </Button>
              </motion.div>
            </div>

            {/* Informação adicional */}
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Já é assinante?
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Se você já realizou o pagamento via Kiwify, aguarde alguns minutos
                    para a liberação automática do acesso. Em caso de dúvidas, entre em
                    contato com nosso suporte.
                  </p>
                </div>
              </div>
            </div>

            {/* Token de acesso (info técnica) */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Token de acesso: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">rsmplzhq7p9</code>
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dúvidas? Entre em contato: <a href="mailto:suporte@detoxmental.com" className="text-purple-600 dark:text-purple-400 hover:underline">suporte@detoxmental.com</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AcessoNegado;
