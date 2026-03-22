import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Welcome to AIThenticLabs Support! I'm your AI assistant powered by quantum-speed intelligence. How can I help you today?",
    timestamp: new Date(),
  },
];

export default function SupportChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Thank you for reaching out! Our quantum AI engine is analyzing your request. A specialist will follow up shortly with a detailed response. In the meantime, feel free to browse our Generated Briefs or try the FlashApps Generator.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Support Chat
        </h1>
        <p className="text-muted-foreground mt-1">AI-powered support with quantum-speed responses</p>
      </div>

      <Card className="dark-slate-purple-card h-[calc(100vh-16rem)]">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Chat</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" /> AI Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-5rem)] p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "glass-effect text-foreground"
                    }`}
                  >
                    {msg.content}
                    <p className="text-xs opacity-60 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-secondary" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="glass-effect rounded-lg p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-border flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="resize-none bg-background border-input"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} className="accent-gradient text-primary-foreground shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
