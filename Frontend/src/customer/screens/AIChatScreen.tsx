import { Send, Bot, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

// 💡 Mẹo: Nên dùng biến môi trường thay vì hardcode IP
// Tạo file .env.local và thêm: NEXT_PUBLIC_API_URL=http://localhost:5000/api/ai/chat
const API_URL = "http://127.0.0.1:5000/api/ai/chat";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatScreenProps {
  onBack?: () => void;
  userId?: number;
}

export function AIChatScreen({ onBack, userId = 1 }: AIChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý ảo AI. Bạn đang đói bụng à? Hãy chọn một câu hỏi bên dưới hoặc nhập món bạn thích nhé! 🍜", 
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref để tự động cuộn xuống cuối
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Món nào phù hợp cho bữa trưa?",
    "Tôi muốn ăn Phở.",
    "Cho tôi xem quán ăn được đánh giá cao nhất!",
    "Quán nào gần tôi nhất?",
  ];

  // Effect: Mỗi khi có tin nhắn mới -> Cuộn xuống dưới cùng
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Hiển thị tin nhắn User
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // 2. Gọi API Backend
      const response = await axios.post(API_URL, {
        message: text,
        userId: userId,
        restaurantId: 1 
      });

      // 3. Hiển thị phản hồi từ AI
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Lỗi Chat AI:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I lost connection to the server. Please check your backend.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-background border rounded-xl shadow-2xl overflow-hidden font-sans">
      
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center gap-3 shadow-md z-10">
        {onBack && (
          <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Smart Food AI</h2>
          <div className="text-xs text-white/90 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></span>
            Online • Realtime DB
          </div>
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
        
        {/* Gợi ý câu hỏi (Chỉ hiện khi ít tin nhắn) */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1 mb-1">Suggestions:</p>
            {suggestedQuestions.map((q, idx) => (
              <Card 
                key={idx} 
                className="p-3 text-sm cursor-pointer hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all border-dashed active:scale-95"
                onClick={() => handleSendMessage(q)}
              >
                ✨ {q}
              </Card>
            ))}
          </div>
        )}

        {/* Danh sách tin nhắn */}
        {messages.map((message) => {
           const isUser = message.sender === "user";
           return (
            <div
              key={message.id}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in zoom-in-95 duration-200`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm relative group ${
                  isUser
                    ? "bg-orange-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {!isUser && <p className="text-[10px] font-bold text-orange-500 mb-1">AI Assistant</p>}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                <div
                  className={`text-[10px] mt-1 text-right opacity-70 ${
                    isUser ? "text-orange-100" : "text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 rounded-bl-sm flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              <span className="text-xs text-gray-500">AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Thẻ div rỗng để scroll xuống */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
            placeholder="Ask about restaurants, menus..."
            className="rounded-full pr-12 border-gray-200 focus-visible:ring-orange-500 bg-gray-50"
            disabled={isTyping}
          />
          <Button 
            onClick={() => handleSendMessage(inputValue)}
            className="absolute right-1 top-1 h-8 w-8 rounded-full bg-orange-600 hover:bg-orange-700 p-0 shadow-sm transition-transform active:scale-95"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}