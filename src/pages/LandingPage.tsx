import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Heart,
  Brain,
  TrendingUp,
  CheckCircle2,
  Star,
  Shield,
  Lock,
  Award,
  Sparkles,
  Clock,
  Users,
  Play,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  // Animações reutilizáveis
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true },
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ========================================
          BARRA DE NAVEGAÇÃO SUPERIOR - GLASSMORPHISM
      ======================================== */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/assets/logo.png"
                alt="Detox Mental"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
              <span className="text-white font-bold text-lg md:text-xl">
                Detox Mental
              </span>
            </div>

            {/* Links de navegação - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#inicio"
                className="text-white/90 hover:text-white transition-colors duration-300 font-medium"
              >
                Início
              </a>
              <a
                href="#como-funciona"
                className="text-white/90 hover:text-white transition-colors duration-300 font-medium"
              >
                Como Funciona
              </a>
              <a
                href="#depoimentos"
                className="text-white/90 hover:text-white transition-colors duration-300 font-medium"
              >
                Depoimentos
              </a>
              <a
                href="#assinar"
                className="text-white/90 hover:text-white transition-colors duration-300 font-medium"
              >
                Assinar
              </a>
            </div>

            {/* Botão Entrar */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300"
              >
                Entrar
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ========================================
          1️⃣ HERO SECTION - ATENÇÃO
      ======================================== */}
      <section id="inicio" className="relative min-h-screen flex items-start md:items-center justify-center overflow-hidden pt-24 md:pt-20">
        {/* Fundo gradiente animado com melhor contraste */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #6B21A8, #7C3AED, #8B5CF6)",
            backgroundSize: "200% 200%",
          }}
        />

        {/* Animação de Respiração Visual - Círculo Pulsante */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-white/10 backdrop-blur-sm" />
        </motion.div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">

            {/* Frase de Impacto */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-white text-xl md:text-3xl lg:text-4xl font-semibold max-w-3xl md:max-w-4xl leading-tight px-2"
            >
              Você não precisa viver cansado. Descubra o método simples que devolve sua paz interior.
            </motion.h1>

            {/* Vídeo com Play Customizado */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="w-full max-w-3xl"
            >
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group">
                <video
                  id="hero-video"
                  className="w-full h-full object-cover"
                  preload="auto"
                  onClick={(e) => {
                    const video = e.currentTarget;
                    if (video.paused) {
                      video.play();
                      setIsPlaying(true);
                    } else {
                      video.pause();
                      setIsPlaying(false);
                    }
                  }}
                >
                  <source src="/landing page.mp4" type="video/mp4" />
                  Seu navegador não suporta reprodução de vídeo.
                </video>

                {/* Botão Play Customizado */}
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                    onClick={() => {
                      const video = document.getElementById('hero-video') as HTMLVideoElement;
                      if (video) {
                        video.play();
                        setIsPlaying(true);
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/80 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 shadow-2xl"
                    >
                      <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-white ml-1" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Botão Shimmer "Quero me sentir leve hoje!" - Mesma largura do vídeo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="w-full max-w-3xl"
            >
              <ShimmerButton
                onClick={() => {
                  const element = document.getElementById('assinar');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                shimmerColor="#ffffff"
                background="linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)"
                className="text-xl font-bold w-full py-6 shadow-2xl"
              >
                Quero me sentir leve hoje!
              </ShimmerButton>
            </motion.div>

            {/* Selos de Confiança */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm pt-2"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Pagamento 100% seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>7 dias de garantia</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>+10.000 usuários</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Indicador de scroll */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-white/70 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ========================================
          2️⃣ SEÇÃO INTERESSE - Como Funciona
      ======================================== */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da Seção */}
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Como o Detox Mental funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Três pilares fundamentais para transformar sua rotina em momentos
              de paz e clareza mental.
            </p>
          </motion.div>

          {/* Cards de Funcionalidades */}
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div {...fadeInUp}>
              <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-purple-50 to-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Respire e se reconecte
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sessões guiadas de meditação com trilhas sonoras imersivas que
                  te ajudam a encontrar paz interior em qualquer momento do dia.
                </p>
              </Card>
            </motion.div>

            {/* Card 2 */}
            <motion.div {...fadeInUp}>
              <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300"
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Monitore seu progresso
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Estatísticas detalhadas e conquistas pessoais que mostram sua
                  evolução e te mantêm motivado na jornada do bem-estar.
                </p>
              </Card>
            </motion.div>

            {/* Card 3 */}
            <motion.div {...fadeInUp}>
              <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-indigo-50 to-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-xl group-hover:shadow-indigo-500/50 transition-all duration-300"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Libere o estresse
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Práticas rápidas e eficazes que trazem foco, clareza mental e
                  alívio imediato do estresse acumulado no dia a dia.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          3️⃣ SEÇÃO DESEJO - Depoimentos
      ======================================== */}
      <section id="depoimentos" className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Título da Seção */}
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Milhares de pessoas já transformaram suas vidas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja o que nossos usuários estão dizendo sobre o Detox Mental
            </p>
          </motion.div>

          {/* Grid de Depoimentos */}
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Depoimento 1 */}
            <motion.div {...fadeInUp}>
              <Card className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    C
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Carolina M.</h4>
                    <p className="text-sm text-gray-500">28 anos</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "Em 10 minutos por dia, minha ansiedade diminuiu absurdamente.
                  Não imaginava que meditar pudesse ser tão transformador!"
                </p>
              </Card>
            </motion.div>

            {/* Depoimento 2 */}
            <motion.div {...fadeInUp}>
              <Card className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    R
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Ricardo L.</h4>
                    <p className="text-sm text-gray-500">33 anos</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "Achei que meditar era difícil, até conhecer o Detox Mental.
                  As sessões guiadas são perfeitas para quem está começando!"
                </p>
              </Card>
            </motion.div>

            {/* Depoimento 3 */}
            <motion.div {...fadeInUp}>
              <Card className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-indigo-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mr-4">
                    F
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Fernanda A.</h4>
                    <p className="text-sm text-gray-500">25 anos</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">
                  "A sensação de paz depois das sessões é surreal. Virei
                  assinante e não me arrependo nem um pouco!"
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          SEÇÃO BENEFÍCIOS / COMPARATIVO
      ======================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pequenos momentos, grandes resultados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Invista apenas 10 minutos por dia e colha benefícios para a vida
              toda
            </p>
          </motion.div>

          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl p-12 text-white text-center shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <p className="text-5xl font-bold mb-2">10 min</p>
                <p className="text-purple-100">por dia</p>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-6xl font-light">=</span>
              </div>
              <div>
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <p className="text-5xl font-bold mb-2">8h+</p>
                <p className="text-purple-100">de clareza mental por semana</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          4️⃣ SEÇÃO AÇÃO - CTA Final
      ======================================== */}
      <section id="assinar" className="py-24 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 relative overflow-hidden">
        {/* Efeitos de fundo */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeInUp} className="text-center">
            {/* Badge especial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold mb-8"
            >
              <Sparkles className="w-5 h-5" />
              <span>Oferta especial de lançamento</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Por apenas R$19,90/mês
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              Você tem acesso completo ao Detox Mental: meditações, sons,
              trilhas e estatísticas exclusivas para acompanhar sua evolução.
            </p>

            {/* Lista de benefícios */}
            <motion.div
              {...staggerContainer}
              className="max-w-2xl mx-auto mb-12 text-left"
            >
              {[
                "Acesso ilimitado a todas as meditações guiadas",
                "Trilhas sonoras imersivas e exclusivas",
                "Acompanhamento de progresso e estatísticas",
                "Práticas rápidas para momentos de estresse",
                "Novo conteúdo adicionado semanalmente",
                "Suporte prioritário da nossa equipe",
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  className="flex items-start gap-3 text-white mb-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Principal */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-12 w-full max-w-md mx-auto px-4"
            >
              <ShimmerButton
                onClick={() => window.open("https://pay.kiwify.com.br/aj7NocQ", "_blank")}
                shimmerColor="#ffffff"
                background="linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)"
                className="text-lg md:text-xl lg:text-2xl font-bold px-8 md:px-12 lg:px-16 py-4 md:py-6 lg:py-8 shadow-2xl w-full"
              >
                Quero começar agora
              </ShimmerButton>
            </motion.div>

            {/* Selos de confiança */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-8"
            >
              <div className="flex items-center gap-2 text-white/90">
                <Lock className="w-5 h-5" />
                <span>SSL - Pagamento 100% seguro</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5" />
                <span>7 dias de garantia</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Award className="w-5 h-5" />
                <span>Cancele quando quiser</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          SOBRE O DETOX MENTAL
      ======================================== */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Por que criamos o Detox Mental?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Criamos o Detox Mental para quem vive no automático e precisa de
              um respiro mental. Acreditamos que alguns minutos de meditação por
              dia podem transformar completamente a forma como você experimenta
              o mundo — trazendo mais paz, clareza e conexão consigo mesmo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          RODAPÉ
      ======================================== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img
                  src="/assets/logo.png"
                  alt="Detox Mental Logo"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-3xl font-bold">Detox Mental</h3>
              </div>
              <p className="text-gray-400 italic text-lg">
                Respire fundo, sua mente agradece
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm mb-8">
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Termos de Uso
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Política de Privacidade
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Contato
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © 2025 Detox Mental. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
