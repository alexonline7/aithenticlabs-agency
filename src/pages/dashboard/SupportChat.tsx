import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const SYSTEM_PROMPT = `You are the AI support assistant for AIThenticLabs — a premier web development agency that builds world-class websites, web apps, mobile apps, and advanced AI-powered applications.

You help prospective clients understand our services, pricing, process, and capabilities. Be professional, knowledgeable, and enthusiastic. Key facts:
- We build custom web apps, e-commerce platforms, SaaS products, mobile PWAs, AI-integrated tools
- Tech stack: React, Next.js, Supabase, Tailwind CSS, TypeScript, Python, Node.js
- Pricing tiers: Starter ($149), Professional ($299), Enterprise ($499) for project briefs
- Full custom builds range from $2,000 to $50,000+ depending on scope
- We use AI (GPT-4, Gemini) in our workflow for faster delivery
- Typical delivery: 2-8 weeks depending on complexity
- We offer ongoing maintenance and support packages

Answer questions helpfully. If asked something outside your knowledge, suggest they use the contact form or schedule a consultation.`;

const WELCOME_MSG: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Welcome to AIThenticLabs Support! I'm your AI assistant. How can I help you today? Feel free to ask about our services, pricing, process, or anything else.",
  timestamp: new Date(),
};

export default function SupportChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from database
  useEffect(() => {
    const loadHistory = async () => {
      if (!user) { setLoadingHistory(false); return; }
      const { data } = await supabase
        .from("chat_messages")
        .select("id, role, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        const history: ChatMessage[] = data.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          timestamp: new Date(m.created_at),
        }));
        setMessages([WELCOME_MSG, ...history]);
      }
      setLoadingHistory(false);
    };
    loadHistory();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const persistMessage = async (role: "user" | "assistant", content: string) => {
    if (!user) return;
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role,
      content,
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Persist user message
    persistMessage("user", userMsg.content);

    const apiMessages = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));
    apiMessages.push({ role: "user", content: userMsg.content });

    let assistantContent = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          provider: "gemini",
          systemPrompt: SYSTEM_PROMPT,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";
      const assistantId = (Date.now() + 1).toString();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantId) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [
                  ...prev,
                  { id: assistantId, role: "assistant", content: assistantContent, timestamp: new Date() },
                ];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Persist assistant response
      if (assistantContent) {
        persistMessage("assistant", assistantContent);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errContent = `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`;
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), role: "assistant", content: errContent, timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Support Chat
        </h1>
        <p className="text-muted-foreground mt-1">AI-powered support — ask anything about our services</p>
      </div>

      <Card className="dark-slate-purple-card h-[calc(100vh-16rem)]">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Chat</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" /> Gemini Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-5rem)] p-0">
          {loadingHistory ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
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
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
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
          )}
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
            <Button onClick={handleSend} disabled={isTyping} className="accent-gradient text-primary-foreground shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
