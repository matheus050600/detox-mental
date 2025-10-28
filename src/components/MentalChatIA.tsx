import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  type: "user" | "ai" | "error";
  timestamp: Date;
}

interface MentalChatIAProps {
  isOpen: boolean;
  onClose: () => void;
}

const MentalChatIA = ({ isOpen, onClose }: MentalChatIAProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Olá! Sou a Mental IA. Estou aqui para te ouvir e acolher. Como você está se sentindo hoje?",
      type: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Webhook URL do n8n
  const WEBHOOK_URL = "https://n8n.promptart.store/webhook/Mentalia";

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Ajustar altura do textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        120
      ) + "px";
    }
  };

  // Enviar mensagem para o webhook do n8n
  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      type: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Resetar altura do textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      console.log("🚀 Enviando mensagem para webhook:", WEBHOOK_URL);
      console.log("📤 Payload:", { message });

      // Fazer requisição para o webhook do n8n
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      console.log("📥 Status da resposta:", response.status);
      console.log("📥 Headers da resposta:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro HTTP:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log("📝 Resposta raw:", responseText);
      console.log("📏 Tamanho da resposta:", responseText.length);

      // Verificar se a resposta está vazia
      if (!responseText || responseText.trim() === "") {
        console.warn("⚠️ Webhook retornou resposta vazia");
        const warningMessage: Message = {
          id: Date.now().toString() + "-ai",
          text: "Recebi sua mensagem! O webhook está funcionando, mas ainda não está configurado para retornar uma resposta. Por favor, configure o workflow no n8n para retornar um JSON com o campo 'response'.",
          type: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, warningMessage]);
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("✅ Resposta JSON parseada:", data);
      } catch (parseError) {
        console.error("❌ Erro ao parsear JSON:", parseError);
        console.log("📄 Conteúdo que falhou:", responseText);
        throw new Error("Resposta inválida do servidor");
      }

      // Adicionar resposta da IA
      const aiResponse = data.response || data.message || data.reply || data.output || data.text || "Desculpe, não consegui processar sua mensagem.";
      console.log("🤖 Resposta da IA:", aiResponse);

      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        text: aiResponse,
        type: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Erro ao comunicar com Mental IA:", error);

      // Adicionar mensagem de erro
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        text: "Não consegui responder agora. Tente novamente.",
        type: "error",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter para enviar (Shift+Enter para quebra de linha)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={onClose}
      />

      {/* Chat Container */}
      <div className="fixed bottom-5 right-5 w-[380px] h-[560px] max-h-[90vh] bg-[#0B0B0F] rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden border border-purple-500/15 animate-slide-up md:bottom-5 md:right-5 max-md:w-[calc(100%-2.5rem)] max-md:h-[90vh] max-md:left-1/2 max-md:-translate-x-1/2">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-5 flex justify-between items-center border-b border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-white">Mental IA</h3>
            <p className="text-xs text-white/80 font-light">
              sua escuta acolhedora
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/15 rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex animate-message-slide ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.type === "user"
                    ? "bg-gradient-to-br from-purple-600 to-purple-400 text-white rounded-br"
                    : msg.type === "error"
                    ? "bg-red-500/10 border border-red-500/30 text-red-300 rounded-bl"
                    : "bg-[#1a1a24] border border-purple-500/10 text-white rounded-bl"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start animate-message-slide">
              <div className="bg-[#1a1a24] border border-purple-500/10 px-4 py-4 rounded-2xl rounded-bl flex gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-typing-dot" />
                <span
                  className="w-2 h-2 bg-purple-500 rounded-full animate-typing-dot"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="w-2 h-2 bg-purple-500 rounded-full animate-typing-dot"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-[#0B0B0F] border-t border-purple-500/15 flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escreva algo aqui…"
            rows={1}
            className="flex-1 bg-[#1a1a24] border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-purple-500 transition-colors max-h-[120px] overflow-y-auto"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-br from-purple-600 to-purple-400 hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all h-11 w-11 rounded-xl flex-shrink-0"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default MentalChatIA;
