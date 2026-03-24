import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import {
  MessageSquare, Brain, FileCheck, Send, ArrowRight,
  CheckCircle2, Loader2, Lightbulb, Cpu, Paintbrush, ClipboardCheck,
  RotateCcw, ChevronDown, Paperclip, X, FileText,
  UserPlus, LogIn, Sparkles,
} from "lucide-react";
import { detectBrowserLang, t, type BlueprintLang } from "@/lib/blueprint-i18n";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Scope = "interview-only" | "interview-report" | "full-pipeline";
type PipelineStep = "scope" | "interview" | "architecture" | "ux-blueprint" | "consensus";

interface Attachment {
  id: string;
  file: File;
  preview?: string;
  type: "image" | "document";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: { type: "image" | "document"; name: string; preview?: string }[];
}

function getScopeOptions(lang: BlueprintLang) {
  return [
    {
      id: "interview-only" as Scope,
      icon: MessageSquare,
      title: t(lang, "interviewOnly"),
      desc: t(lang, "interviewOnlyDesc"),
      steps: [t(lang, "discoveryInterview")],
    },
    {
      id: "interview-report" as Scope,
      icon: FileCheck,
      title: t(lang, "interviewReport"),
      desc: t(lang, "interviewReportDesc"),
      steps: [t(lang, "discoveryInterview"), t(lang, "consensusReport")],
      recommended: true,
    },
    {
      id: "full-pipeline" as Scope,
      icon: Brain,
      title: t(lang, "fullPipeline"),
      desc: t(lang, "fullPipelineDesc"),
      steps: [t(lang, "discoveryInterview"), t(lang, "technicalArchitecture"), t(lang, "uiUxBlueprint"), t(lang, "consensusReport")],
    },
  ];
}

function getPipelineMeta(lang: BlueprintLang) {
  return {
    interview: { icon: Lightbulb, label: t(lang, "discoveryInterview"), ai: "Claude", color: "from-orange-500 to-amber-500" },
    architecture: { icon: Cpu, label: t(lang, "technicalArchitecture"), ai: "GPT-4o", color: "from-blue-500 to-purple-600" },
    "ux-blueprint": { icon: Paintbrush, label: t(lang, "uiUxBlueprint"), ai: "Gemini", color: "from-green-500 to-teal-500" },
    consensus: { icon: ClipboardCheck, label: t(lang, "consensusReport"), ai: "All 3 AIs", color: "from-primary to-accent" },
  } as Record<string, { icon: typeof MessageSquare; label: string; ai: string; color: string }>;
}

async function streamFromFunction(
  fnName: string,
  body: Record<string, unknown>,
  onDelta: (text: string) => void,
  onDone: () => void,
  onError: (msg: string) => void
) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
    };
    if (sessionData.session?.access_token) {
      headers.Authorization = `Bearer ${sessionData.session.access_token}`;
    }

    const resp = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Unknown error" }));
      onError(err.error || `Error ${resp.status}`);
      return;
    }

    const reader = resp.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") break;
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch { /* partial */ }
      }
    }
    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Network error");
  }
}

export default function IdeaToBlueprintPublic() {
  const { user } = useAuth();
  const [lang] = useState<BlueprintLang>(() => detectBrowserLang());
  const [scope, setScope] = useState<Scope | null>(null);
  const [currentStep, setCurrentStep] = useState<PipelineStep>("scope");
  const [pipelineFinished, setPipelineFinished] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [architectureSpec, setArchitectureSpec] = useState("");
  const [uxBlueprint, setUxBlueprint] = useState("");
  const [consensusReport, setConsensusReport] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const scopeOptions = useMemo(() => getScopeOptions(lang), [lang]);
  const pipelineMeta = useMemo(() => getPipelineMeta(lang), [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [architectureSpec, uxBlueprint, consensusReport]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newAttachments: Attachment[] = [];
    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const att: Attachment = { id: crypto.randomUUID(), file, type: isImage ? "image" : "document" };
      if (isImage) att.preview = await fileToBase64(file);
      newAttachments.push(att);
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const buildMessageContent = async (text: string, atts: Attachment[]) => {
    if (atts.length === 0) return text;
    const parts: any[] = [];
    if (text.trim()) parts.push({ type: "text", text });
    for (const att of atts) {
      if (att.type === "image") {
        const dataUrl = att.preview || (await fileToBase64(att.file));
        parts.push({ type: "image_url", image_url: { url: dataUrl } });
      } else {
        const docText = await att.file.text();
        parts.push({ type: "document_text", text: `[Uploaded document: ${att.file.name}]\n\n${docText.slice(0, 50000)}` });
      }
    }
    if (!text.trim() && atts.length > 0) {
      parts.unshift({ type: "text", text: `I'm sharing ${atts.length} file(s) for you to analyze.` });
    }
    return parts;
  };

  const getInterviewSummary = useCallback(() => {
    return messages.map((m) => `${m.role === "user" ? "Client" : "Consultant"}: ${m.content}`).join("\n\n");
  }, [messages]);

  const handleScopeSelect = (s: Scope) => {
    setScope(s);
    setCurrentStep("interview");
    setMessages([]);
    setIsTyping(true);

    let assistantContent = "";
    streamFromFunction(
      "idea-interview",
      { messages: [], lang },
      (delta) => {
        assistantContent += delta;
        const clean = assistantContent.replace("[INTERVIEW_COMPLETE]", "");
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: clean } : m));
          }
          return [{ id: crypto.randomUUID(), role: "assistant", content: clean }];
        });
      },
      () => {
        setIsTyping(false);
        if (assistantContent.includes("[INTERVIEW_COMPLETE]")) setInterviewComplete(true);
      },
      (err) => { setIsTyping(false); setGenError(err); }
    );
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isTyping) return;

    const currentAttachments = [...attachments];
    const messageContent = await buildMessageContent(input.trim(), currentAttachments);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: typeof messageContent === "string" ? messageContent : input.trim() || `Shared ${currentAttachments.length} file(s)`,
      attachments: currentAttachments.map((a) => ({ type: a.type, name: a.file.name, preview: a.type === "image" ? a.preview : undefined })),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setAttachments([]);
    setIsTyping(true);

    const apiMessages = await Promise.all(
      newMessages.map(async (m) => {
        if (m.id === userMsg.id) return { role: m.role, content: messageContent };
        return { role: m.role, content: m.content };
      })
    );

    let assistantContent = "";
    streamFromFunction(
      "idea-interview",
      { messages: apiMessages, lang },
      (delta) => {
        assistantContent += delta;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.id.startsWith("stream-")) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent.replace("[INTERVIEW_COMPLETE]", "") } : m));
          }
          return [...prev, { id: "stream-" + crypto.randomUUID(), role: "assistant", content: assistantContent.replace("[INTERVIEW_COMPLETE]", "") }];
        });
      },
      () => {
        setIsTyping(false);
        if (assistantContent.includes("[INTERVIEW_COMPLETE]")) {
          setInterviewComplete(true);
          if (user) {
            const cleanAssistant = assistantContent.replace("[INTERVIEW_COMPLETE]", "");
            const transcript = [...newMessages, { id: "assistant-final", role: "assistant", content: cleanAssistant }]
              .map((m) => `${m.role === "user" ? "Client" : "Consultant"}: ${m.content}`)
              .join("\n\n");
            const projectTitle = newMessages.find((m) => m.role === "user")?.content?.slice(0, 80) || "Idea Blueprint";
            supabase.from("generated_reports").insert({
              user_id: user.id,
              user_email: user.email ?? null,
              project_name: projectTitle,
              report_type: "interview",
              content: cleanAssistant,
              metadata: { scope, pipelineStep: "interview", interviewTranscript: transcript, generatedByTool: "idea-blueprint" },
            });
          }
        }
      },
      (err) => { setIsTyping(false); setGenError(err); }
    );
  };

  const getStepsForScope = (): PipelineStep[] => {
    if (scope === "interview-only") return ["interview"];
    if (scope === "interview-report") return ["interview", "consensus"];
    return ["interview", "architecture", "ux-blueprint", "consensus"];
  };

  const proceedToNextStep = async () => {
    const steps = getStepsForScope();
    const currentIdx = steps.indexOf(currentStep);
    if (currentIdx >= steps.length - 1) return;
    const nextStep = steps[currentIdx + 1];
    setCurrentStep(nextStep);
    setGenerating(true);
    setGenError("");

    const summary = getInterviewSummary();

    const trySaveReport = async (reportType: string, content: string) => {
      if (!content || !user) return;
      const projectTitle = messages.find((m) => m.role === "user")?.content?.slice(0, 80) || "Idea Blueprint";
      await supabase.from("generated_reports").insert({
        user_id: user.id,
        user_email: user.email ?? null,
        project_name: projectTitle,
        report_type: reportType,
        content,
        metadata: { scope, pipelineStep: reportType, generatedByTool: "idea-blueprint" },
      });
    };

    if (nextStep === "architecture") {
      let content = "";
      streamFromFunction("idea-architecture", { interviewSummary: summary },
        (d) => { content += d; setArchitectureSpec(content); },
        async () => { await trySaveReport("architecture", content); setGenerating(false); },
        (err) => { setGenerating(false); setGenError(err); }
      );
    } else if (nextStep === "ux-blueprint") {
      let content = "";
      streamFromFunction("idea-ux-blueprint", { interviewSummary: summary, architectureSpec },
        (d) => { content += d; setUxBlueprint(content); },
        async () => { await trySaveReport("ux_blueprint", content); setGenerating(false); },
        (err) => { setGenerating(false); setGenError(err); }
      );
    } else if (nextStep === "consensus") {
      let content = "";
      const body: Record<string, string> = { interviewSummary: summary };
      if (architectureSpec) body.architectureSpec = architectureSpec;
      if (uxBlueprint) body.uxBlueprint = uxBlueprint;
      if (scope === "interview-report") {
        body.architectureSpec = "(Not generated — interview-only scope)";
        body.uxBlueprint = "(Not generated — interview-only scope)";
      }
      streamFromFunction("idea-consensus", body,
        (d) => { content += d; setConsensusReport(content); },
        async () => { await trySaveReport("consensus", content); setGenerating(false); setPipelineFinished(true); },
        (err) => { setGenerating(false); setGenError(err); }
      );
    }
  };

  const resetPipeline = () => {
    setScope(null);
    setCurrentStep("scope");
    setMessages([]);
    setInput("");
    setIsTyping(false);
    setInterviewComplete(false);
    setArchitectureSpec("");
    setUxBlueprint("");
    setConsensusReport("");
    setGenerating(false);
    setGenError("");
    setPipelineFinished(false);
  };

  const isLastStep = () => {
    const steps = getStepsForScope();
    return steps.indexOf(currentStep) >= steps.length - 1;
  };

  // ─── ACCOUNT CTA ───
  const renderAccountCTA = () => {
    if (user) return null;
    return (
      <Card className="p-6 mt-6 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">{t(lang, "saveBlueprint")}</h3>
            <p className="text-muted-foreground max-w-md">{t(lang, "saveBlueprintDesc")}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold px-6">
                <UserPlus className="w-4 h-4 mr-2" /> {t(lang, "createAccount")}
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="border-primary/30">
                <LogIn className="w-4 h-4 mr-2" /> {t(lang, "signIn")}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  };

  // ─── SCOPE SELECTION ───
  if (currentStep === "scope") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16 space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t(lang, "pageTitle")}</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">{t(lang, "pageSubtitle")}</p>
            {!user && (
              <p className="text-sm text-muted-foreground">
                {t(lang, "noAccountNeeded")}{" "}
                <Link to="/auth" className="text-primary hover:underline">{t(lang, "signInToSave")}</Link>
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {scopeOptions.map((opt) => (
              <Card
                key={opt.id}
                onClick={() => handleScopeSelect(opt.id)}
                className={`relative p-6 cursor-pointer transition-all hover:scale-[1.02] hover:border-primary/50 ${
                  opt.recommended ? "ring-2 ring-primary/40" : ""
                }`}
              >
                {opt.recommended && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs">
                    {t(lang, "recommended")}
                  </Badge>
                )}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                    <opt.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{opt.title}</h3>
                  <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {opt.steps.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── PIPELINE PROGRESS BAR ───
  const steps = getStepsForScope();
  const currentIdx = steps.indexOf(currentStep);
  const progress = ((currentIdx + (generating ? 0.5 : interviewComplete || currentStep !== "interview" ? 1 : 0.3)) / steps.length) * 100;

  const renderStepIndicator = () => (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {steps.map((step, i) => {
            const meta = pipelineMeta[step];
            const isDone = i < currentIdx || (i === currentIdx && !generating && currentStep !== "interview");
            const isActive = i === currentIdx;
            return (
              <div key={step} className="flex items-center gap-1">
                {i > 0 && <ChevronDown className="w-3 h-3 text-muted-foreground rotate-[-90deg]" />}
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  isDone ? "bg-green-500/20 text-green-400" :
                  isActive ? "bg-primary/20 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {isDone ? <CheckCircle2 className="w-3 h-3" /> : isActive && generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <meta.icon className="w-3 h-3" />}
                  <span className="hidden sm:inline">{meta.label}</span>
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" onClick={resetPipeline} className="text-muted-foreground">
          <RotateCcw className="w-3 h-3 mr-1" /> {t(lang, "startOver")}
        </Button>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );

  // ─── INTERVIEW STEP ───
  if (currentStep === "interview") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16 space-y-4 animate-fade-in">
          {renderStepIndicator()}

          <Card className="flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{t(lang, "aiDiscoveryInterview")}</h2>
                <p className="text-xs text-muted-foreground">{t(lang, "poweredByClaudeDesc")}</p>
              </div>
              {interviewComplete && (
                <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">{t(lang, "interviewComplete")}</Badge>
              )}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {msg.attachments.map((att, idx) => (
                            att.type === "image" && att.preview ? (
                              <img key={idx} src={att.preview} alt={att.name} className="max-w-[200px] max-h-[150px] rounded-lg object-cover" />
                            ) : (
                              <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/20 text-xs">
                                <FileText className="w-3 h-3" />
                                <span className="truncate max-w-[120px]">{att.name}</span>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              {interviewComplete && !isLastStep() && (
                <div className="mb-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between">
                  <p className="text-sm text-green-400">{t(lang, "interviewCompleteMsg")}</p>
                  <Button onClick={proceedToNextStep} size="sm" className="bg-primary text-primary-foreground">
                    {t(lang, "continue")} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
              {interviewComplete && isLastStep() && (
                <div className="mb-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-400">{t(lang, "interviewCompleteFinalMsg")}</p>
                </div>
              )}
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((att) => (
                    <div key={att.id} className="relative group">
                      {att.type === "image" && att.preview ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                          <img src={att.preview} alt={att.file.name} className="w-full h-full object-cover" />
                          <button onClick={() => removeAttachment(att.id)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted text-xs">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[100px]">{att.file.name}</span>
                          <button onClick={() => removeAttachment(att.id)} className="ml-1 text-muted-foreground hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.txt,.doc,.docx,.md,.csv,.json" onChange={handleFileSelect} className="hidden" />
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isTyping} className="shrink-0 h-11 w-11 text-muted-foreground hover:text-foreground" title={t(lang, "attachTooltip")}>
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={t(lang, "tellAi")}
                  className="min-h-[44px] max-h-32 resize-none bg-muted border-border"
                  disabled={isTyping}
                />
                <Button onClick={handleSend} disabled={(!input.trim() && attachments.length === 0) || isTyping} size="icon" className="shrink-0 h-11 w-11">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {interviewComplete && isLastStep() && renderAccountCTA()}
        </div>
      </div>
    );
  }

  // ─── GENERATION STEPS ───
  const meta = pipelineMeta[currentStep];
  const currentContent =
    currentStep === "architecture" ? architectureSpec :
    currentStep === "ux-blueprint" ? uxBlueprint :
    consensusReport;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 space-y-4 animate-fade-in">
        {renderStepIndicator()}

        {genError && (
          <Card className="p-4 bg-destructive/10 border-destructive/30 text-destructive text-sm">
            {genError}
            <Button variant="ghost" size="sm" onClick={proceedToNextStep} className="ml-2 text-destructive">{t(lang, "retry")}</Button>
          </Card>
        )}

        <Card className="flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${meta.color}`}>
              <meta.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{meta.label}</h2>
              <p className="text-xs text-muted-foreground">{t(lang, "poweredBy")} {meta.ai}</p>
            </div>
            {generating && <Loader2 className="ml-auto w-4 h-4 animate-spin text-primary" />}
            {!generating && currentContent && (
              <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">{t(lang, "complete")}</Badge>
            )}
          </div>

          <ScrollArea className="flex-1 p-6" ref={outputRef}>
            {currentContent ? (
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{currentContent}</ReactMarkdown>
              </div>
            ) : generating ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">{t(lang, "generating")} {meta.label.toLowerCase()}...</p>
              </div>
            ) : null}
          </ScrollArea>

          {!generating && currentContent && !isLastStep() && (
            <div className="p-4 border-t border-border flex justify-end">
              <Button onClick={proceedToNextStep} className="bg-primary text-primary-foreground">
                {t(lang, "continueToNext")} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
          {!generating && currentContent && isLastStep() && (
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-green-400">{t(lang, "blueprintComplete")}</p>
              <Button variant="outline" onClick={resetPipeline}>
                <RotateCcw className="w-3 h-3 mr-1" /> {t(lang, "newProject")}
              </Button>
            </div>
          )}
        </Card>

        {!generating && currentContent && isLastStep() && renderAccountCTA()}
      </div>
    </div>
  );
}
