import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";
import {
  Zap,
  Brain,
  Shield,
  Globe,
  Cpu,
  Wifi,
  Eye,
  BarChart3,
  Lock,
  Cloud,
  Smartphone,
  Monitor,
  Loader2,
  CheckCircle,
  ChevronRight,
  Sparkles,
  FileText,
  Server,
  Database,
  Bot,
  Gauge,
  Layers,
  Rocket,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  Timer,
  ArrowRight,
  CircuitBoard,
  MessageSquare,
} from "lucide-react";

/* ── Strategy Phases ────────────────────────────────────── */
const STRATEGY_PHASES = [
  {
    phase: 1,
    title: "Foundation",
    subtitle: "Build the infrastructure, flow, and business model",
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
    icon: Layers,
    items: [
      "Minimalist AI-focused design",
      "AI Chat Assistant decision layer",
      "Payment & hosting flow",
      "Pricing: $149–$399",
    ],
  },
  {
    phase: 2,
    title: "Launch Platform & Flow",
    subtitle: "Quantum AI Engine — Sub-15 Second Generation",
    color: "from-secondary/20 to-secondary/5",
    borderColor: "border-secondary/30",
    icon: Rocket,
    items: [
      "Revolutionary quantum-speed app generation in 8–15 seconds",
      "Quantum AI orchestration",
      "Multi-model ensemble (GPT-5, Claude, Gemini)",
      "Instant deployment pipeline",
      "Real-time quality assurance",
    ],
  },
  {
    phase: 3,
    title: "Trend Creation & Market Innovation",
    subtitle: "Be the originator, not follower",
    color: "from-[hsl(271,81%,56%)]/20 to-[hsl(271,81%,56%)]/5",
    borderColor: "border-[hsl(271,81%,56%)]/30",
    icon: TrendingUp,
    items: [
      "Trend prediction agents",
      "Original app concepts monthly",
      "Market research automation",
      "Innovation showcase",
    ],
  },
  {
    phase: 4,
    title: "Automation & Scale",
    subtitle: "Full automation and client management",
    color: "from-green-500/20 to-green-500/5",
    borderColor: "border-green-500/30",
    icon: Cpu,
    items: [
      "Admin dashboard",
      "Client management",
      "AI help desk",
      "Update automation",
    ],
  },
];

const TECH_STACK = [
  {
    title: "Chat Assistant",
    subtitle: "OpenAI + Gemini + Mistral",
    description: "Dynamic conversation, niche recognition, project scoping",
    icon: MessageSquare,
    color: "text-primary",
  },
  {
    title: "Agent Coordination",
    subtitle: "LangSmith + LangGraph",
    description: "Turns user input into apps, runs QA and deployment",
    icon: CircuitBoard,
    color: "text-secondary",
  },
  {
    title: "Frontend / UI",
    subtitle: "Next.js + Tailwind",
    description: "Fast, clean, responsive design",
    icon: Monitor,
    color: "text-[hsl(271,81%,56%)]",
  },
  {
    title: "Backend / Storage",
    subtitle: "Supabase / Firebase",
    description: "Lightweight database with auth",
    icon: Database,
    color: "text-green-400",
  },
  {
    title: "AI Templates",
    subtitle: "You + OpenAI",
    description: "Custom pre-built frameworks",
    icon: Bot,
    color: "text-amber-400",
  },
  {
    title: "Hosting & Deployment",
    subtitle: "Cloud Platforms + GitHub",
    description: "Easy client or agency hosting",
    icon: Cloud,
    color: "text-blue-400",
  },
];

const EXPECTED_OUTCOMES = [
  "Launch the world's first quantum AI web app agency",
  "Deliver full web apps in 8–15 seconds with quantum generation",
  "Serve niche pros with ultra-original apps at light speed",
  "Lead the quantum revolution, don't follow outdated methods",
  "Monetize with quantum speed: instant delivery, immediate value",
  "Harness quantum AI ensemble: GPT-5 + Claude + Gemini simultaneously",
];

/* ── Feature categories (for generator) ─────────────────── */
interface FeatureItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface FeatureCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  features: FeatureItem[];
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    icon: Brain,
    color: "text-purple-400",
    features: [
      { id: "computer-vision", label: "Computer Vision", description: "Image recognition, object detection, OCR", icon: Eye },
      { id: "nlp", label: "Natural Language Processing", description: "Text analysis, sentiment, entity extraction", icon: FileText },
      { id: "recommendation-engine", label: "Recommendation Engine", description: "Personalized content & product suggestions", icon: Sparkles },
      { id: "predictive-analytics", label: "Predictive Analytics", description: "Forecasting, anomaly detection, trend analysis", icon: BarChart3 },
      { id: "generative-ai", label: "Generative AI", description: "Content generation, chatbots, code assistants", icon: Bot },
      { id: "ml-ops", label: "MLOps Pipeline", description: "Model training, versioning, A/B testing", icon: Layers },
    ],
  },
  {
    id: "realtime-infra",
    title: "Real-Time & Infrastructure",
    icon: Wifi,
    color: "text-blue-400",
    features: [
      { id: "websockets", label: "WebSocket Architecture", description: "Bi-directional real-time communication", icon: Wifi },
      { id: "edge-computing", label: "Edge Computing", description: "Distributed processing at network edge", icon: Globe },
      { id: "cdn-optimization", label: "CDN & Asset Optimization", description: "Global content delivery, lazy loading", icon: Cloud },
      { id: "microservices", label: "Microservices Architecture", description: "Decoupled services, event-driven design", icon: Server },
      { id: "serverless", label: "Serverless Functions", description: "Auto-scaling compute, pay-per-execution", icon: Cpu },
      { id: "message-queues", label: "Message Queues & Streaming", description: "Kafka, RabbitMQ, event streaming", icon: Database },
    ],
  },
  {
    id: "security-compliance",
    title: "Security & Compliance",
    icon: Shield,
    color: "text-green-400",
    features: [
      { id: "zero-trust", label: "Zero-Trust Architecture", description: "Never trust, always verify access model", icon: Lock },
      { id: "e2e-encryption", label: "End-to-End Encryption", description: "Data encrypted in transit and at rest", icon: Shield },
      { id: "gdpr", label: "GDPR Compliance", description: "Data privacy, consent management, right to delete", icon: FileText },
      { id: "hipaa", label: "HIPAA Compliance", description: "Healthcare data protection standards", icon: Shield },
      { id: "soc2", label: "SOC 2 Compliance", description: "Security, availability, processing integrity", icon: CheckCircle },
      { id: "rbac", label: "Advanced RBAC", description: "Role-based access with granular permissions", icon: Lock },
    ],
  },
  {
    id: "performance-scale",
    title: "Performance & Scale",
    icon: Gauge,
    color: "text-amber-400",
    features: [
      { id: "auto-scaling", label: "Auto-Scaling Infrastructure", description: "Dynamic resource allocation based on demand", icon: Gauge },
      { id: "load-balancing", label: "Intelligent Load Balancing", description: "Traffic distribution with health checks", icon: Server },
      { id: "caching-strategy", label: "Multi-Layer Caching", description: "Redis, CDN, browser, and application cache", icon: Layers },
      { id: "db-optimization", label: "Database Optimization", description: "Query optimization, sharding, read replicas", icon: Database },
      { id: "performance-monitoring", label: "APM & Observability", description: "Distributed tracing, metrics, alerting", icon: BarChart3 },
      { id: "progressive-web", label: "Progressive Web App", description: "Offline support, push notifications, installable", icon: Globe },
    ],
  },
];

const PROJECT_TYPES = [
  { id: "web-app", label: "Web Application", icon: Monitor },
  { id: "mobile-app", label: "Mobile Application", icon: Smartphone },
  { id: "full-stack", label: "Full-Stack Platform", icon: Layers },
  { id: "saas", label: "SaaS Product", icon: Cloud },
  { id: "api-service", label: "API Service", icon: Server },
];

const PLATFORMS = [
  { id: "web", label: "Web" },
  { id: "ios", label: "iOS" },
  { id: "android", label: "Android" },
  { id: "desktop", label: "Desktop" },
  { id: "api", label: "API Only" },
];

/* ── Component ──────────────────────────────────────────── */
interface AiSuggestion {
  featureId: string;
  label: string;
  category: string;
  reason: string;
}

export default function QuantumOptimization() {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({});
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState("");
  const [error, setError] = useState("");
  const blueprintRef = useRef<HTMLDivElement>(null);

  // AI recommendation state
  const [recommending, setRecommending] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);

  const totalSelected = Object.values(selectedFeatures).reduce((sum, arr) => sum + arr.length, 0);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleFeature = (categoryId: string, featureId: string) => {
    setSelectedFeatures((prev) => {
      const current = prev[categoryId] || [];
      const updated = current.includes(featureId)
        ? current.filter((f) => f !== featureId)
        : [...current, featureId];
      return { ...prev, [categoryId]: updated };
    });
  };

  const isFeatureSelected = (categoryId: string, featureId: string) =>
    (selectedFeatures[categoryId] || []).includes(featureId);

  const canGenerate = projectName.trim() && projectType && selectedPlatforms.length > 0 && totalSelected > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    setBlueprint("");
    setError("");
    setActiveTab("blueprint");

    try {
      const featureMap: Record<string, string[]> = {};
      for (const [catId, featureIds] of Object.entries(selectedFeatures)) {
        const cat = FEATURE_CATEGORIES.find((c) => c.id === catId);
        if (!cat || featureIds.length === 0) continue;
        featureMap[cat.title] = featureIds.map((fId) => {
          const f = cat.features.find((feat) => feat.id === fId);
          return f ? f.label : fId;
        });
      }

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quantum-spec`;
      const { data: sessionData } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      };

      if (sessionData.session?.access_token) {
        headers.Authorization = `Bearer ${sessionData.session.access_token}`;
      }

      const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectName,
          projectType: PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType,
          platforms: selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p),
          selectedFeatures: featureMap,
          additionalNotes,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setBlueprint(accumulated);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setBlueprint(accumulated);
            }
          } catch {}
        }
      }

      if (accumulated) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        const currentUser = userData.user ?? user;

        if (userError || !currentUser) {
          throw new Error("Your session expired before saving. Please sign in again and retry.");
        }

        const saveFeatureMap: Record<string, string[]> = {};
        for (const [catId, featureIds] of Object.entries(selectedFeatures)) {
          const cat = FEATURE_CATEGORIES.find((c) => c.id === catId);
          if (!cat || featureIds.length === 0) continue;
          saveFeatureMap[cat.title] = featureIds.map((fId) => {
            const f = cat.features.find((feat) => feat.id === fId);
            return f ? f.label : fId;
          });
        }

        const { error: insertError } = await supabase.from("generated_reports").insert({
          user_id: currentUser.id,
          user_email: currentUser.email ?? null,
          project_name: projectName,
          report_type: "quantum-blueprint",
          content: accumulated,
          metadata: {
            projectType: PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType,
            platforms: selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p),
            selectedFeatures: saveFeatureMap,
            additionalNotes,
            userVersion: accumulated,
            professionalVersion: accumulated,
            generatedByTool: "quantum-optimization",
          },
        });

        if (insertError) {
          throw new Error(`Failed to save blueprint: ${insertError.message}`);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate blueprint");
    } finally {
      setGenerating(false);
    }
  };

  const handleAiRecommend = async () => {
    setRecommending(true);
    setAiSuggestions([]);
    try {
      const currentSelections: Record<string, string[]> = {};
      for (const [catId, featureIds] of Object.entries(selectedFeatures)) {
        const cat = FEATURE_CATEGORIES.find((c) => c.id === catId);
        if (!cat || featureIds.length === 0) continue;
        currentSelections[cat.title] = featureIds.map((fId) => {
          const f = cat.features.find((feat) => feat.id === fId);
          return f ? f.label : fId;
        });
      }

      const allAvailable = FEATURE_CATEGORIES.flatMap((cat) =>
        cat.features
          .filter((f) => !isFeatureSelected(cat.id, f.id))
          .map((f) => ({ id: f.id, label: f.label, category: cat.title, categoryId: cat.id }))
      );

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quantum-recommend`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          projectName,
          projectType: PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType,
          platforms: selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p),
          currentSelections,
          availableFeatures: allAvailable.map((a) => `${a.label} (${a.category})`),
          additionalNotes,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const data = await resp.json();
      const suggestions: AiSuggestion[] = (data.recommendations || []).map((r: any) => {
        const match = allAvailable.find(
          (a) => a.label.toLowerCase() === r.label?.toLowerCase() || a.id === r.featureId
        );
        return {
          featureId: match?.id || r.featureId || "",
          label: match?.label || r.label || "",
          category: match?.categoryId || r.category || "",
          reason: r.reason || "",
        };
      });
      setAiSuggestions(suggestions.filter((s) => s.featureId && s.label));
    } catch (e) {
      console.error("AI recommend error:", e);
      setError(e instanceof Error ? e.message : "Failed to get recommendations");
    } finally {
      setRecommending(false);
    }
  };

  const applySuggestion = (suggestion: AiSuggestion) => {
    const cat = FEATURE_CATEGORIES.find((c) => c.id === suggestion.category) ||
      FEATURE_CATEGORIES.find((c) => c.features.some((f) => f.id === suggestion.featureId));
    if (cat && !isFeatureSelected(cat.id, suggestion.featureId)) {
      toggleFeature(cat.id, suggestion.featureId);
    }
    setAiSuggestions((prev) => prev.filter((s) => s.featureId !== suggestion.featureId));
  };

  const handleReset = () => {
    setBlueprint("");
    setError("");
    setAiSuggestions([]);
    setActiveTab("overview");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Hero Section ──────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl dark-slate-purple-card p-8 sm:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        <div className="absolute top-4 right-4">
          <Badge className="accent-gradient text-primary-foreground border-0 text-xs font-bold tracking-wider uppercase px-3 py-1">
            <Timer className="h-3 w-3 mr-1" />
            8–15 Seconds
          </Badge>
        </div>
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3">
            8–15 Second Quantum Generation
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-bricolage leading-tight">
            <span className="text-foreground">The World's First</span>{" "}
            <span className="gradient-text">Quantum AI</span>{" "}
            <span className="text-foreground">Web App Agency</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg max-w-2xl leading-relaxed">
            Revolutionary breakthrough! Get AI web apps for niche professionals generated in just 8–15 seconds.
            We don't build — we've just shattered the barrier.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              size="lg"
              className="accent-gradient text-primary-foreground gap-2 font-semibold"
              onClick={() => setActiveTab("project")}
            >
              <Rocket className="h-5 w-5" />
              Start Building Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary/30 hover:bg-primary/10"
              onClick={() => setActiveTab("overview")}
            >
              <Eye className="h-5 w-5" />
              View Strategy
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>

        {/* ── Tab: Overview (Vision + Strategy + Tech) ───── */}
        <TabsContent value="overview" className="space-y-8 mt-6">
          {/* Vision */}
          <Card className="dark-slate-purple-card border-primary/20">
            <CardContent className="pt-8 pb-8 text-center max-w-3xl mx-auto">
              <Lightbulb className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-bricolage mb-4">Our Vision</h2>
              <p className="text-muted-foreground text-base leading-relaxed italic">
                "Revolutionary quantum leap: Deliver trend-inspired AI web apps for niche professionals in just 8–15 seconds.
                We've shattered the time barrier with quantum AI technology. Users choose, quantum AI generates instantly,
                and the future is now."
              </p>
            </CardContent>
          </Card>

          {/* Strategy Phases */}
          <div>
            <h2 className="text-2xl font-bold font-bricolage mb-2 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Strategy in Logical Sequence
            </h2>
            <p className="text-muted-foreground mb-6">
              Our systematic approach to building the world's fastest AI web app agency
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {STRATEGY_PHASES.map((phase) => (
                <Card key={phase.phase} className={`dark-slate-purple-card ${phase.borderColor} overflow-hidden`}>
                  <div className={`h-1.5 w-full bg-gradient-to-r ${phase.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <phase.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-primary">Phase {phase.phase}</p>
                        <CardTitle className="text-lg">{phase.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{phase.subtitle}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h2 className="text-2xl font-bold font-bricolage mb-2 flex items-center gap-2">
              <CircuitBoard className="h-6 w-6 text-secondary" />
              Tech Stack & Collaboration
            </h2>
            <p className="text-muted-foreground mb-6">
              Powered by the world's best AI platforms working in perfect harmony
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TECH_STACK.map((tech) => (
                <Card key={tech.title} className="dark-slate-purple-card hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6">
                    <tech.icon className={`h-8 w-8 ${tech.color} mb-3`} />
                    <h3 className="font-semibold text-foreground">{tech.title}</h3>
                    <p className="text-sm font-medium text-primary mt-1">{tech.subtitle}</p>
                    <p className="text-xs text-muted-foreground mt-2">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab("project")} className="accent-gradient text-primary-foreground gap-2">
              Start Building <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ── Tab: Project Setup ────────────────────────── */}
        <TabsContent value="project" className="space-y-6 mt-6">
          <Card className="dark-slate-purple-card">
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Project Name</label>
                <Input
                  placeholder="e.g. NeuroCommerce Platform"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="dark-slate-purple-card">
            <CardHeader>
              <CardTitle className="text-lg">Project Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProjectType(type.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                      projectType === type.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-background/30 text-muted-foreground hover:border-primary/50 hover:bg-background/50"
                    }`}
                  >
                    <type.icon className="h-6 w-6" />
                    <span className="text-xs font-medium text-center">{type.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="dark-slate-purple-card">
            <CardHeader>
              <CardTitle className="text-lg">Target Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedPlatforms.includes(p.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/30 text-muted-foreground border border-border/50 hover:border-primary/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab("features")} className="gap-2">
              Next: Select Features <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ── Tab: Features Checklist ───────────────────── */}
        <TabsContent value="features" className="space-y-6 mt-6">
          {FEATURE_CATEGORIES.map((cat) => {
            const selectedCount = (selectedFeatures[cat.id] || []).length;
            return (
              <Card key={cat.id} className="dark-slate-purple-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <cat.icon className={`h-5 w-5 ${cat.color}`} />
                    {cat.title}
                    {selectedCount > 0 && (
                      <Badge variant="default" className="ml-2 text-xs">
                        {selectedCount} selected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cat.features.map((feat) => {
                      const selected = isFeatureSelected(cat.id, feat.id);
                      return (
                        <button
                          key={feat.id}
                          onClick={() => toggleFeature(cat.id, feat.id)}
                          className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                            selected
                              ? "border-primary bg-primary/10"
                              : "border-border/30 bg-background/20 hover:border-primary/40 hover:bg-background/40"
                          }`}
                        >
                          <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-all ${
                            selected ? "bg-primary border-primary" : "border-muted-foreground/40"
                          }`}>
                            {selected && <CheckCircle className="h-3.5 w-3.5 text-primary-foreground" />}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-medium ${selected ? "text-foreground" : "text-muted-foreground"}`}>
                              {feat.label}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">{feat.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("project")}>
              Back
            </Button>
            <Button onClick={() => setActiveTab("notes")} className="gap-2">
              Next: Additional Notes <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ── Tab: Notes ────────────────────────────────── */}
        <TabsContent value="notes" className="space-y-6 mt-6">
          <Card className="dark-slate-purple-card">
            <CardHeader>
              <CardTitle className="text-lg">Additional Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe any specific requirements, constraints, or preferences for your project..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={6}
                className="bg-background/50"
              />
            </CardContent>
          </Card>

          <Card className="dark-slate-purple-card border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI-Powered Recommendations
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={recommending || totalSelected === 0}
                onClick={handleAiRecommend}
              >
                {recommending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {recommending ? "Analyzing…" : "Get AI Suggestions"}
              </Button>
            </CardHeader>
            <CardContent>
              {aiSuggestions.length === 0 && !recommending && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click "Get AI Suggestions" to receive personalized feature recommendations based on your current selections.
                </p>
              )}
              {recommending && (
                <div className="flex items-center justify-center gap-3 py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Analyzing your selections…</span>
                </div>
              )}
              {aiSuggestions.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Click a suggestion to add it:</p>
                  {aiSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.featureId}
                      onClick={() => applySuggestion(suggestion)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-left transition-all"
                    >
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{suggestion.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{suggestion.reason}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0 mt-0.5">+ Add</Badge>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="dark-slate-purple-card">
            <CardHeader>
              <CardTitle className="text-lg">Selection Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Project</span>
                <span className="text-foreground font-medium">{projectName || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground font-medium">
                  {PROJECT_TYPES.find((t) => t.id === projectType)?.label || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platforms</span>
                <span className="text-foreground font-medium">
                  {selectedPlatforms.length > 0
                    ? selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label).join(", ")
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Features</span>
                <span className="text-foreground font-medium">{totalSelected} selected</span>
              </div>
              {FEATURE_CATEGORIES.map((cat) => {
                const selected = selectedFeatures[cat.id] || [];
                if (selected.length === 0) return null;
                return (
                  <div key={cat.id} className="pl-4 text-xs text-muted-foreground">
                    <span className={cat.color}>{cat.title}:</span>{" "}
                    {selected.map((fId) => cat.features.find((f) => f.id === fId)?.label).join(", ")}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("features")}>
              Back
            </Button>
            <Button
              className="accent-gradient text-primary-foreground gap-2"
              disabled={!canGenerate || generating}
              onClick={handleGenerate}
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {generating ? "Generating…" : "Generate Quantum Blueprint"}
            </Button>
          </div>
        </TabsContent>

        {/* ── Tab: Blueprint Output ─────────────────────── */}
        <TabsContent value="blueprint" className="space-y-6 mt-6">
          {error && (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={handleReset}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {generating && !blueprint && (
            <Card className="dark-slate-purple-card">
              <CardContent className="pt-6 flex flex-col items-center justify-center gap-4 py-16">
                <div className="relative">
                  <Zap className="h-12 w-12 text-primary animate-pulse" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-semibold text-lg">Quantum Engine Processing…</p>
                  <p className="text-muted-foreground text-sm mt-1">Generating your complete project blueprint</p>
                </div>
                <Progress value={33} className="w-64 h-2" />
              </CardContent>
            </Card>
          )}

          {blueprint && (
            <Card className="dark-slate-purple-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  Quantum Blueprint: {projectName}
                </CardTitle>
                {!generating && (
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    New Specification
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div ref={blueprintRef} className="prose prose-invert max-w-none text-sm">
                    <ReactMarkdown>{blueprint}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {!generating && !blueprint && !error && (
            <Card className="dark-slate-purple-card">
              <CardContent className="pt-6 text-center py-12">
                <Zap className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Configure your project and select features to generate an AI-powered specification blueprint.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveTab("project")}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Tab: Expected Outcomes ─────────────────────── */}
        <TabsContent value="outcomes" className="space-y-6 mt-6">
          <Card className="dark-slate-purple-card">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <Rocket className="h-10 w-10 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-bricolage">What You Will Achieve</h2>
                <p className="text-muted-foreground mt-2">Expected Outcomes</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {EXPECTED_OUTCOMES.map((outcome, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{outcome}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button
                  size="lg"
                  className="accent-gradient text-primary-foreground gap-2 font-semibold"
                  onClick={() => setActiveTab("project")}
                >
                  <Zap className="h-5 w-5" />
                  Start Your Quantum Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
