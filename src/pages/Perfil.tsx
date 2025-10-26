import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import StreakCard from "@/components/StreakCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Calendar,
  Trophy,
  Clock,
  Flame,
  Sparkles,
  Moon,
  Sun,
  Sunrise,
  Crown,
  Heart,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import {
  signOut,
  updateUserProfile,
  getUserSessions,
  getUserSubscription,
  type UserSession,
} from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Perfil = () => {
  const { profile, loading, refreshProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("stats");
  const [recentSessions, setRecentSessions] = useState<UserSession[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        avatar_url: profile.avatar_url || "",
      });
      loadRecentSessions();
      loadSubscription();
    }
  }, [profile]);

  const loadSubscription = async () => {
    try {
      const sub = await getUserSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Erro ao carregar assinatura:", error);
    }
  };

  const loadRecentSessions = async () => {
    try {
      const sessions = await getUserSessions(10);
      setRecentSessions(sessions);
    } catch (error) {
      console.error("Erro ao carregar sessões:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(formData);
      await refreshProfile();
      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Saudação dinâmica baseada na hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { text: "Boa madrugada", icon: Moon, emoji: "🌙" };
    if (hour < 12) return { text: "Bom dia", icon: Sunrise, emoji: "🌅" };
    if (hour < 18) return { text: "Boa tarde", icon: Sun, emoji: "☀️" };
    return { text: "Boa noite", icon: Moon, emoji: "🌙" };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

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
            Carregando seu perfil...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const displayProfile = profile || {
    id: "",
    name: "Usuário",
    email: "usuario@example.com",
    avatar_url: null,
    plan_type: "premium" as const,
    created_at: new Date().toISOString(),
    last_login: null,
    sessions_completed: 0,
    total_minutes: 0,
    streak_days: 0,
    longest_streak: 0,
    last_session_date: null,
  };

  const menuItems = [
    { id: "stats", label: "Estatísticas", icon: BarChart3 },
    { id: "history", label: "Histórico", icon: Calendar },
    { id: "subscription", label: "Assinatura", icon: CreditCard },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "stats":
        return (
          <div className="space-y-8">
            {/* Cards de Estatísticas com Animação Staggered */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sessões Concluídas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:scale-105 rounded-3xl cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/20"
                  />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/40"
                      >
                        <Trophy className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </motion.div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Sessões
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                      {displayProfile.sessions_completed}
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Minutos Meditados */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:scale-105 rounded-3xl cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20"
                  />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/40"
                      >
                        <Clock className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sparkles className="w-5 h-5 text-blue-400" />
                      </motion.div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Minutos
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                      {displayProfile.total_minutes}
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Sequência Atual */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:scale-105 rounded-3xl cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-600/20"
                  />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/40"
                      >
                        <Flame className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sparkles className="w-5 h-5 text-orange-400" />
                      </motion.div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Sequência
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                      {displayProfile.streak_days}
                      <span className="text-lg ml-1">dias</span>
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Recorde */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="group relative overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:scale-105 rounded-3xl cursor-pointer">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20"
                  />
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-3 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/40"
                      >
                        <Trophy className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Sparkles className="w-5 h-5 text-green-400" />
                      </motion.div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Recorde
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                      {displayProfile.longest_streak}
                      <span className="text-lg ml-1">dias</span>
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Streak Card - Sistema de Sequências */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <StreakCard />
            </motion.div>

            {/* Progresso Mensal com Animação */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500 shadow-lg"
                    >
                      <BarChart3 className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Progresso Mensal
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Continue meditando para alcançar sua meta
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Meta: 30 sessões
                      </span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                        className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                      >
                        {Math.min(Math.round((displayProfile.sessions_completed / 30) * 100), 100)}%
                      </motion.span>
                    </div>

                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((displayProfile.sessions_completed / 30) * 100, 100)}%`,
                        }}
                        transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 rounded-full shadow-lg shadow-purple-500/50"
                      >
                        <motion.div
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 bg-white/20"
                        />
                      </motion.div>
                    </div>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {displayProfile.sessions_completed}
                      </span>{" "}
                      de 30 sessões concluídas
                    </p>
                  </div>

                  {displayProfile.last_session_date && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-6 pt-6 border-t dark:border-gray-700"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Última meditação: <span className="font-semibold">{formatDate(displayProfile.last_session_date)}</span>
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>

          </div>
        );

      case "history":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Histórico de Sessões
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Acompanhe sua jornada de meditação
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {recentSessions.length === 0 ? (
                <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Nenhuma sessão ainda
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Comece sua jornada de bem-estar agora mesmo
                  </p>
                  <Button
                    onClick={() => navigate("/explorar")}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Começar agora
                  </Button>
                </Card>
              ) : (
                recentSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                            Meditação Concluída
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{Math.floor(session.duration / 60)} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(session.completed_at).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                          {session.notes && (
                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                              "{session.notes}"
                            </p>
                          )}
                        </div>
                        {session.rating && (
                          <div className="flex gap-1">
                            {[...Array(session.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">⭐</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );

      case "subscription":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Assinatura
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie seu plano e pagamentos
                </p>
              </div>
            </div>

            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {subscription?.plan === 'premium' ? 'Plano Premium' : subscription?.plan === 'free' ? 'Plano Gratuito' : 'Plano Enterprise'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {subscription?.plan === 'premium' ? 'Acesso ilimitado a todo conteúdo' : 'Acesso básico'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      R$ {subscription?.price?.toFixed(2) || '19,90'}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">por mês</p>
                  </div>
                </div>

                <div className="pt-6 border-t dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${subscription?.status === 'active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                        <span className={`text-sm ${subscription?.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium`}>
                          {subscription?.status === 'active' ? 'Plano ativo' : subscription?.status === 'expired' ? 'Expirado' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {subscription?.status === 'active' ? 'Próxima renovação' : 'Data de expiração'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subscription?.expiration_date
                          ? new Date(subscription.expiration_date).toLocaleDateString("pt-BR")
                          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full py-6 rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Gerenciar assinatura
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        );

      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-500">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Configurações
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personalize seu perfil
                </p>
              </div>
            </div>

            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={displayProfile.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    O email não pode ser alterado
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Foto de Perfil
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => isEditing && setFormData({ ...formData, avatar_url: 'male' })}
                      disabled={!isEditing}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.avatar_url === 'male'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-4xl">👨</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Homem
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => isEditing && setFormData({ ...formData, avatar_url: 'female' })}
                      disabled={!isEditing}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.avatar_url === 'female'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                          <span className="text-4xl">👩</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Mulher
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleUpdateProfile}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Salvar alterações
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: displayProfile.name || "",
                            avatar_url: displayProfile.avatar_url || "",
                          });
                        }}
                        className="flex-1 py-6 rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Editar perfil
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Emocional com Gradiente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8 overflow-hidden border-0 shadow-2xl rounded-3xl">
              {/* Gradiente Emocional Premium (lilac → blue) */}
              <div className="relative h-48 bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 overflow-hidden">
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                    backgroundSize: "200% 200%",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Texto do Header Emocional */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center gap-2 mb-2"
                  >
                    <GreetingIcon className="w-6 h-6" />
                    <span className="text-xl font-semibold">
                      {greeting.text}, {displayProfile.name || "Visitante"} {greeting.emoji}
                    </span>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-white/90 text-center italic text-lg"
                  >
                    Cada respiração é um novo começo
                  </motion.p>
                </div>
              </div>

              {/* Card do Usuário */}
              <div className="px-8 pb-8">
                <div className="flex flex-col items-center -mt-16">
                  {/* Avatar com Hover Effect */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-2xl ring-4 ring-purple-400/50 hover:ring-purple-500/70 transition-all duration-300">
                      {displayProfile.avatar_url === 'male' ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-7xl">
                          👨
                        </div>
                      ) : displayProfile.avatar_url === 'female' ? (
                        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-7xl">
                          👩
                        </div>
                      ) : displayProfile.avatar_url && !['male', 'female'].includes(displayProfile.avatar_url) ? (
                        <AvatarImage src={displayProfile.avatar_url} />
                      ) : (
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayProfile.email}`}
                        />
                      )}
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-4xl font-bold">
                        {getInitials(displayProfile.name)}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  {/* Info do Usuário Centralizada */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center mt-4"
                  >
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                      {displayProfile.name || "Usuário"}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {displayProfile.email}
                    </p>
                    {displayProfile.created_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Membro desde {formatDate(displayProfile.created_at)}
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Menu */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-4 lg:sticky lg:top-24">
                <nav className="flex flex-col gap-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => setActiveSection(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold text-sm">{item.label}</span>
                      </motion.button>
                    );
                  })}

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold text-sm">Sair</span>
                  </motion.button>
                </nav>
              </Card>
            </motion.div>

            {/* Content Area */}
            <div className="lg:col-span-3">{renderContent()}</div>
          </div>

          {/* Footer Inspirador */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Card className="border-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl shadow-lg p-8 relative overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"
              />
              <div className="relative flex items-center justify-center gap-3 mb-3">
                <Heart className="w-6 h-6 text-purple-500" />
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 italic">
                  "A calma é a força dos sábios."
                </p>
                <Heart className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 relative">— Provérbio Oriental</p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
