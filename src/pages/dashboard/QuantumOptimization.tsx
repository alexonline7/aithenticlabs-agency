import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from "react-markdown";
import {
  Zap, Brain, Shield, Globe, Cpu, Wifi, Eye, BarChart3, Lock, Cloud,
  Smartphone, Monitor, Loader2, CheckCircle, ChevronRight, ChevronLeft,
  Sparkles, FileText, Server, Database, Bot, Gauge, Layers, Rocket,
  Target, TrendingUp, Users, Lightbulb, Timer, Atom, Crown, Flame,
  ArrowRight, CircuitBoard, MessageSquare, Play, Briefcase, Search,
  Wrench, DollarSign, Star, Trophy, Settings, Blocks, PenTool,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   CONSTANTS & TYPES
   ══════════════════════════════════════════════════════════ */

const NICHE_CATEGORIES = [
  { id: "healthcare", label: "Healthcare Pro", icon: Shield, description: "HIPAA-ready patient & clinic tools" },
  { id: "legal", label: "Legal Tech", icon: FileText, description: "Case management & contract AI" },
  { id: "realestate", label: "Real Estate", icon: Globe, description: "Property listings & agent platforms" },
  { id: "fitness", label: "Fitness & Wellness", icon: Gauge, description: "Training apps & health trackers" },
  { id: "education", label: "Education", icon: Lightbulb, description: "E-learning & tutoring platforms" },
  { id: "finance", label: "Finance", icon: BarChart3, description: "Fintech dashboards & analytics" },
  { id: "restaurant", label: "Restaurant & Food", icon: Flame, description: "Ordering, menus & reservations" },
  { id: "ecommerce", label: "E-Commerce", icon: TrendingUp, description: "Storefronts & marketplaces" },
  { id: "saas", label: "SaaS Platform", icon: Cloud, description: "Multi-tenant software products" },
  { id: "creative", label: "Creative Agency", icon: Sparkles, description: "Portfolio & project management" },
  { id: "consulting", label: "Consulting", icon: Users, description: "CRM & client portals" },
  { id: "custom", label: "Custom Niche", icon: Atom, description: "Describe your own niche" },
];

interface FeatureItem { id: string; label: string; description: string; icon: React.ElementType; }
interface FeatureCategory { id: string; title: string; icon: React.ElementType; color: string; features: FeatureItem[]; }

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: "ai-ml", title: "AI & Machine Learning", icon: Brain, color: "text-[hsl(var(--deep-purple-500))]",
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
    id: "realtime-infra", title: "Real-Time & Infrastructure", icon: Wifi, color: "text-[hsl(var(--electric-blue-400))]",
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
    id: "security-compliance", title: "Security & Compliance", icon: Shield, color: "text-green-400",
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
    id: "performance-scale", title: "Performance & Scale", icon: Gauge, color: "text-[hsl(var(--deep-gold-400))]",
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

/* ── Generation Modes ──────────────────────────────────── */
interface GenerationMode {
  id: string;
  label: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  color: string;
  speed: string;
  depth: string;
}

const GENERATION_MODES: GenerationMode[] = [
  {
    id: "instant-concept",
    label: "Instant Concept",
    tagline: "Lightning-fast strategic clarity",
    description: "Concise app concept with core features, value prop, and tech snapshot. Sharp and actionable.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    speed: "~8s",
    depth: "Core",
  },
  {
    id: "premium-blueprint",
    label: "Premium Blueprint",
    tagline: "Full product architecture",
    description: "Comprehensive blueprint with modules, UX strategy, monetization, and go-to-market plan.",
    icon: Blocks,
    color: "from-blue-500 to-cyan-500",
    speed: "~12s",
    depth: "Full",
  },
  {
    id: "build-ready",
    label: "Build-Ready Scope",
    tagline: "Developer-ready specification",
    description: "Technical architecture, database schemas, API specs, implementation phases, and DevOps strategy.",
    icon: Wrench,
    color: "from-green-500 to-emerald-500",
    speed: "~14s",
    depth: "Technical",
  },
  {
    id: "market-domination",
    label: "Market Domination",
    tagline: "Total competitive blueprint",
    description: "Everything above plus competitive strategy, scale systems, viral mechanics, and investor metrics.",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    speed: "~15s",
    depth: "Maximum",
  },
];

/* ── Steps ─────────────────────────────────────────────── */
const STEPS = [
  { key: "input", label: "Describe App" },
  { key: "mode", label: "Choose Mode" },
  { key: "features", label: "Add Features" },
  { key: "generate", label: "Generate" },
] as const;
type StepKey = typeof STEPS[number]["key"];

/* ── Quantum Phases for countdown ──────────────────────── */
const QUANTUM_PHASES = [
  { at: 100, text: "Initializing Quantum Engine…", icon: CircuitBoard },
  { at: 85, text: "Niche Recognition & Analysis…", icon: Search },
  { at: 70, text: "App Opportunity Detection…", icon: Target },
  { at: 55, text: "Feature Architecture Creation…", icon: Blocks },
  { at: 40, text: "Monetization Logic Generation…", icon: DollarSign },
  { at: 25, text: "Tech Stack Mapping…", icon: Settings },
  { at: 12, text: "Expansion Logic Synthesis…", icon: TrendingUp },
  { at: 5, text: "Final Blueprint Assembly…", icon: Rocket },
];

/* ══════════════════════════════════════════════════════════
   QUANTUM COUNTDOWN
   ══════════════════════════════════════════════════════════ */
function QuantumCountdown({ onComplete, mode }: { onComplete: () => void; mode: string }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(QUANTUM_PHASES[0]);
  const modeConfig = GENERATION_MODES.find((m) => m.id === mode);
  const duration = mode === "instant-concept" ? 8 : mode === "premium-blueprint" ? 12 : mode === "build-ready" ? 14 : 15;

  useEffect(() => {
    const totalTicks = duration * 10;
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      const pct = Math.min((tick / totalTicks) * 100, 100);
      setProgress(pct);
      const currentPhase = [...QUANTUM_PHASES].reverse().find((p) => pct >= 100 - p.at);
      if (currentPhase) setPhase(currentPhase);
      if (tick >= totalTicks) {
        clearInterval(interval);
        onComplete();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete, duration]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" />
        <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/40 flex items-center justify-center">
          <Atom className="h-14 w-14 text-primary animate-spin" style={{ animationDuration: "2s" }} />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-4xl font-bold font-bricolage gradient-text tabular-nums">
          {Math.max(0, Math.ceil(duration - (progress / 100) * duration))}s
        </p>
        <div className="flex items-center gap-2 justify-center text-muted-foreground text-sm animate-pulse">
          <phase.icon className="h-4 w-4 text-primary" />
          <span>{phase.text}</span>
        </div>
        {modeConfig && (
          <Badge variant="outline" className="border-primary/40 text-primary text-xs mt-1">
            {modeConfig.label} Mode
          </Badge>
        )}
      </div>

      <div className="w-80 space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Quantum Processing</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {["GPT-5", "Claude", "Gemini"].map((model) => (
          <Badge key={model} variant="secondary" className="text-xs animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            {model}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AI NOTE SUGGESTIONS
   ══════════════════════════════════════════════════════════ */
const NICHE_SUGGESTIONS: Record<string, string[]> = {
  healthcare: [
    "Must be HIPAA-compliant with encrypted patient records",
    "Include telehealth video consultation module",
    "Add appointment scheduling with SMS reminders",
    "Integrate with EHR/EMR systems via HL7 FHIR",
  ],
  legal: [
    "Include e-signature and document versioning",
    "Add billable hours tracking with invoice generation",
    "Case timeline visualization with deadline alerts",
    "Client portal with secure document sharing",
  ],
  realestate: [
    "Interactive map-based property search with filters",
    "Virtual tour integration (Matterport/360°)",
    "Mortgage calculator and pre-qualification tool",
    "Automated listing syndication to MLS",
  ],
  fitness: [
    "Wearable device sync (Apple Watch, Fitbit)",
    "AI-powered workout plan generator",
    "Nutrition tracking with meal plan suggestions",
    "Progress photo comparison with body metrics",
  ],
  education: [
    "Gamified learning with badges and leaderboards",
    "Live classroom with whiteboard and screen sharing",
    "AI-powered quiz generator from uploaded content",
    "Student progress analytics for instructors",
  ],
  finance: [
    "Real-time market data feeds and charting",
    "Multi-currency support with exchange rates",
    "Automated tax reporting and compliance",
    "Risk assessment scoring with ML models",
  ],
  restaurant: [
    "QR code menu with real-time availability",
    "Kitchen display system with order prioritization",
    "Loyalty program with points and rewards",
    "Multi-location inventory management",
  ],
  ecommerce: [
    "AI-powered product recommendations",
    "Abandoned cart recovery with email automation",
    "Multi-vendor marketplace with split payments",
    "AR product preview (try before you buy)",
  ],
  saas: [
    "Multi-tenant architecture with data isolation",
    "Usage-based billing with Stripe integration",
    "White-label/custom branding per tenant",
    "API rate limiting and usage analytics",
  ],
  creative: [
    "Drag-and-drop portfolio builder",
    "Client feedback and approval workflow",
    "Asset library with version control",
    "Time tracking with project profitability reports",
  ],
  consulting: [
    "Client onboarding automation with intake forms",
    "Proposal generator with e-signature",
    "Meeting scheduler with calendar sync",
    "ROI tracking dashboard for client engagements",
  ],
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function QuantumOptimization() {
  const { user } = useAuth();
  const [step, setStep] = useState<StepKey>("input");

  // Input model
  const [selectedNiche, setSelectedNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [projectName, setProjectName] = useState("");
  const [appIdea, setAppIdea] = useState("");
  const [professionalType, setProfessionalType] = useState("");
  const [workflowProblem, setWorkflowProblem] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [inputMode, setInputMode] = useState<"quick" | "describe">("quick");

  // Mode
  const [generationMode, setGenerationMode] = useState("premium-blueprint");

  // Configure
  const [projectType, setProjectType] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["web"]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Features
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({});

  // Generation
  const [generating, setGenerating] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [blueprint, setBlueprint] = useState("");
  const [error, setError] = useState("");
  const blueprintRef = useRef<HTMLDivElement>(null);

  // AI recommendations
  const [recommending, setRecommending] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ featureId: string; label: string; category: string; reason: string }[]>([]);

  const totalSelected = Object.values(selectedFeatures).reduce((sum, arr) => sum + arr.length, 0);
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const nicheLabel = selectedNiche === "custom" ? customNiche : NICHE_CATEGORIES.find((n) => n.id === selectedNiche)?.label || "";

  const togglePlatform = (id: string) =>
    setSelectedPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const toggleFeature = (categoryId: string, featureId: string) => {
    setSelectedFeatures((prev) => {
      const current = prev[categoryId] || [];
      const updated = current.includes(featureId) ? current.filter((f) => f !== featureId) : [...current, featureId];
      return { ...prev, [categoryId]: updated };
    });
  };

  const isFeatureSelected = (categoryId: string, featureId: string) =>
    (selectedFeatures[categoryId] || []).includes(featureId);

  const canProceedFromInput = inputMode === "quick"
    ? (selectedNiche && projectName.trim() && (selectedNiche !== "custom" || customNiche.trim()))
    : (appIdea.trim() && projectName.trim());

  const canGenerate = projectName.trim() && (selectedNiche || appIdea.trim()) && generationMode;

  /* ── Generate Blueprint ─────────────────────────────── */
  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    setBlueprint("");
    setError("");
    setShowCountdown(true);
    setStep("generate");

    try {
      const featureMap: Record<string, string[]> = {};
      for (const [catId, featureIds] of Object.entries(selectedFeatures)) {
        const cat = FEATURE_CATEGORIES.find((c) => c.id === catId);
        if (!cat || featureIds.length === 0) continue;
        featureMap[cat.title] = featureIds.map((fId) => cat.features.find((f) => f.id === fId)?.label || fId);
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
          niche: nicheLabel,
          professionalType,
          businessCategory: selectedNiche,
          appIdea,
          workflowProblem,
          targetCustomer,
          desiredOutcome,
          projectType: PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType || "Web Application",
          platforms: selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p),
          selectedFeatures: featureMap,
          additionalNotes,
          mode: generationMode,
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
            if (content) { accumulated += content; setBlueprint(accumulated); }
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
            if (content) { accumulated += content; setBlueprint(accumulated); }
          } catch {}
        }
      }

      // Save report
      if (accumulated) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        const currentUser = userData.user ?? user;
        if (userError || !currentUser) throw new Error("Session expired. Please sign in again.");

        const { error: insertError } = await supabase.from("generated_reports").insert({
          user_id: currentUser.id,
          user_email: currentUser.email ?? null,
          project_name: projectName,
          report_type: "quantum-blueprint",
          content: accumulated,
          metadata: {
            niche: nicheLabel,
            mode: generationMode,
            modeLabel: GENERATION_MODES.find((m) => m.id === generationMode)?.label,
            appIdea,
            professionalType,
            workflowProblem,
            targetCustomer,
            desiredOutcome,
            projectType: PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType,
            platforms: selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p),
            selectedFeatures: featureMap,
            additionalNotes,
            generatedByTool: "quantum-optimization",
          },
        });
        if (insertError) throw new Error(`Failed to save: ${insertError.message}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  /* ── AI Feature Recommend ───────────────────────────── */
  const handleAiRecommend = async () => {
    setRecommending(true);
    setAiSuggestions([]);
    try {
      const currentSelections: Record<string, string[]> = {};
      for (const [catId, featureIds] of Object.entries(selectedFeatures)) {
        const cat = FEATURE_CATEGORIES.find((c) => c.id === catId);
        if (!cat || featureIds.length === 0) continue;
        currentSelections[cat.title] = featureIds.map((fId) => cat.features.find((f) => f.id === fId)?.label || fId);
      }
      const allAvailable = FEATURE_CATEGORIES.flatMap((cat) =>
        cat.features.filter((f) => !isFeatureSelected(cat.id, f.id)).map((f) => ({ id: f.id, label: f.label, category: cat.title, categoryId: cat.id }))
      );
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quantum-recommend`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          projectName, niche: nicheLabel,
          projectType: PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType,
          platforms: selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p),
          currentSelections,
          availableFeatures: allAvailable.map((a) => `${a.label} (${a.category})`),
          additionalNotes,
        }),
      });
      if (!resp.ok) throw new Error((await resp.json().catch(() => ({}))).error || `Error ${resp.status}`);
      const data = await resp.json();
      const suggestions = (data.recommendations || []).map((r: any) => {
        const match = allAvailable.find((a) => a.label.toLowerCase() === r.label?.toLowerCase() || a.id === r.featureId);
        return { featureId: match?.id || r.featureId || "", label: match?.label || r.label || "", category: match?.categoryId || r.category || "", reason: r.reason || "" };
      });
      setAiSuggestions(suggestions.filter((s: any) => s.featureId && s.label));
    } catch (e) {
      console.error("AI recommend error:", e);
      setError(e instanceof Error ? e.message : "Failed to get recommendations");
    } finally {
      setRecommending(false);
    }
  };

  const applySuggestion = (suggestion: typeof aiSuggestions[0]) => {
    const cat = FEATURE_CATEGORIES.find((c) => c.id === suggestion.category) ||
      FEATURE_CATEGORIES.find((c) => c.features.some((f) => f.id === suggestion.featureId));
    if (cat && !isFeatureSelected(cat.id, suggestion.featureId)) toggleFeature(cat.id, suggestion.featureId);
    setAiSuggestions((prev) => prev.filter((s) => s.featureId !== suggestion.featureId));
  };

  const handleReset = () => {
    setBlueprint(""); setError(""); setAiSuggestions([]); setShowCountdown(false);
    setStep("input"); setSelectedNiche(""); setCustomNiche(""); setProjectName("");
    setProjectType(""); setSelectedPlatforms(["web"]); setSelectedFeatures({});
    setAdditionalNotes(""); setAppIdea(""); setProfessionalType("");
    setWorkflowProblem(""); setTargetCustomer(""); setDesiredOutcome("");
    setGenerationMode("premium-blueprint"); setInputMode("quick");
  };

  const handleRegenerate = () => {
    setBlueprint(""); setError(""); setShowCountdown(false); setStep("mode");
  };

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl dark-slate-purple-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }} />
        </div>
        <div className="relative z-10 p-8 sm:p-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="accent-gradient text-primary-foreground border-0 text-xs font-bold tracking-wider uppercase px-3 py-1.5">
                  <Timer className="h-3 w-3 mr-1.5" />8–15s Generation
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  <Crown className="h-3 w-3 mr-1" />Generation Engine
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-bricolage leading-tight">
                <span className="gradient-text">Quantum</span>{" "}
                <span className="text-foreground">App Generator</span>
              </h1>
              <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-xl leading-relaxed">
                Describe your app idea. Choose a generation mode. Get a complete blueprint in 8–15 seconds.
                From intent to software concept — instantly.
              </p>
            </div>
            <div className="flex gap-3">
              {[
                { label: "Speed", value: "8–15s", icon: Zap },
                { label: "Modes", value: "4", icon: Blocks },
                { label: "Niches", value: "12+", icon: Target },
              ].map((stat) => (
                <div key={stat.label} className="text-center glass-effect rounded-lg p-3 min-w-[72px]">
                  <stat.icon className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Step Progress ──────────────────────────────── */}
      <div className="flex items-center gap-2 px-1">
        {STEPS.map((s, i) => {
          const isActive = s.key === step;
          const isPast = i < stepIndex;
          return (
            <div key={s.key} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => { if (isPast) setStep(s.key); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full ${
                  isActive ? "bg-primary/15 text-primary border border-primary/30"
                    : isPast ? "bg-muted/30 text-foreground cursor-pointer hover:bg-muted/50"
                    : "bg-muted/10 text-muted-foreground cursor-default"
                }`}
              >
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isPast ? "bg-primary text-primary-foreground" : isActive ? "bg-primary/20 text-primary border border-primary/40" : "bg-muted/20 text-muted-foreground"
                }`}>
                  {isPast ? <CheckCircle className="h-3 w-3" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════
         STEP 1: INPUT — Describe your app
         ══════════════════════════════════════════════════ */}
      {step === "input" && (
        <div className="space-y-6">
          {/* Input mode toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setInputMode("quick")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                inputMode === "quick"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card/50 text-muted-foreground border border-border/50 hover:border-primary/40"
              }`}
            >
              <Zap className="h-4 w-4" /> Quick Select
            </button>
            <button
              onClick={() => setInputMode("describe")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                inputMode === "describe"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card/50 text-muted-foreground border border-border/50 hover:border-primary/40"
              }`}
            >
              <PenTool className="h-4 w-4" /> Describe Idea
            </button>
          </div>

          {inputMode === "quick" ? (
            <>
              {/* Niche grid */}
              <div className="text-center">
                <h2 className="text-2xl font-bold font-bricolage">
                  What kind of <span className="gradient-text">app</span> do you want to build?
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Select a niche to get intelligent, tailored generation.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {NICHE_CATEGORIES.map((niche) => {
                  const isSelected = selectedNiche === niche.id;
                  return (
                    <button
                      key={niche.id}
                      onClick={() => setSelectedNiche(niche.id)}
                      className={`group relative flex flex-col items-center gap-3 p-5 rounded-xl border text-center transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                          : "border-border/30 bg-card/50 hover:border-primary/40 hover:bg-card/80"
                      }`}
                    >
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                        isSelected ? "bg-primary/20" : "bg-muted/20 group-hover:bg-primary/10"
                      }`}>
                        <niche.icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>{niche.label}</p>
                        <p className="text-[11px] text-muted-foreground/70 mt-0.5">{niche.description}</p>
                      </div>
                      {isSelected && <div className="absolute top-2 right-2"><CheckCircle className="h-4 w-4 text-primary" /></div>}
                    </button>
                  );
                })}
              </div>

              {selectedNiche === "custom" && (
                <Input
                  placeholder="Describe your niche (e.g. Veterinary Clinic Management)"
                  value={customNiche} onChange={(e) => setCustomNiche(e.target.value)}
                  className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground max-w-lg mx-auto"
                />
              )}

              {selectedNiche && (
                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name your app</label>
                    <Input placeholder="e.g. NeuroHealth Pro" value={projectName} onChange={(e) => setProjectName(e.target.value)}
                      className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Who is this for? <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <Input placeholder="e.g. Solo practitioners, small clinics" value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)}
                      className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">What problem does it solve? <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <Input placeholder="e.g. Manual patient record management is slow and error-prone" value={workflowProblem} onChange={(e) => setWorkflowProblem(e.target.value)}
                      className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ── Describe mode ─────────────────────────── */
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-bold font-bricolage">
                  Describe your <span className="gradient-text">app idea</span>
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Tell us what you want to build. The more detail, the better the output.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">App Name</label>
                <Input placeholder="e.g. LegalFlow AI" value={projectName} onChange={(e) => setProjectName(e.target.value)}
                  className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  <Lightbulb className="h-4 w-4 inline mr-1.5 text-primary" />
                  Your App Idea
                </label>
                <Textarea
                  placeholder="Describe the app you want to build. What does it do? Who is it for? What makes it valuable?&#10;&#10;e.g. An AI-powered legal document analyzer that reads contracts, flags risky clauses, and suggests improvements for solo attorneys..."
                  value={appIdea} onChange={(e) => setAppIdea(e.target.value)} rows={5}
                  className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Professional Type <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <Input placeholder="e.g. Attorney, Dentist, Trainer" value={professionalType} onChange={(e) => setProfessionalType(e.target.value)}
                    className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Target Customer <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <Input placeholder="e.g. Small law firms, solo practitioners" value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)}
                    className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Workflow Problem <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <Input placeholder="e.g. Contract review takes hours manually" value={workflowProblem} onChange={(e) => setWorkflowProblem(e.target.value)}
                    className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Desired Outcome <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <Input placeholder="e.g. 10x faster contract review with AI" value={desiredOutcome} onChange={(e) => setDesiredOutcome(e.target.value)}
                    className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              className="accent-gradient text-primary-foreground gap-2 font-semibold"
              disabled={!canProceedFromInput}
              onClick={() => setStep("mode")}
            >
              Next: Choose Mode <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
         STEP 2: MODE — Choose generation mode
         ══════════════════════════════════════════════════ */}
      {step === "mode" && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-bricolage">
              Choose <span className="gradient-text">Generation Mode</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Each mode changes the depth, detail, and strategic value of your output.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GENERATION_MODES.map((mode) => {
              const isSelected = generationMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setGenerationMode(mode.id)}
                  className={`group relative flex flex-col p-6 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-border/30 bg-card/50 hover:border-primary/40 hover:bg-card/80"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                      <mode.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px] border-border/50">{mode.speed}</Badge>
                      <Badge variant="outline" className="text-[10px] border-border/50">{mode.depth}</Badge>
                    </div>
                  </div>
                  <p className={`text-base font-bold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>{mode.label}</p>
                  <p className="text-xs text-primary/80 font-medium mt-0.5">{mode.tagline}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">{mode.description}</p>
                  {isSelected && <div className="absolute top-3 right-3"><CheckCircle className="h-5 w-5 text-primary" /></div>}
                </button>
              );
            })}
          </div>

          {/* Quick config: project type + platforms */}
          <Card className="dark-slate-purple-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Quick Config <span className="text-xs text-muted-foreground font-normal ml-2">(optional — improves output)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Project Type</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {PROJECT_TYPES.map((type) => (
                    <button key={type.id} onClick={() => setProjectType(type.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        projectType === type.id ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-card/30 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <type.icon className="h-5 w-5" />
                      <span className="text-xs font-medium text-center">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Target Platforms</p>
                <div className="flex flex-wrap gap-3">
                  {PLATFORMS.map((p) => (
                    <button key={p.id} onClick={() => togglePlatform(p.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedPlatforms.includes(p.id) ? "bg-primary text-primary-foreground" : "bg-card/30 text-muted-foreground border border-border/50 hover:border-primary/50"
                      }`}
                    >{p.label}</button>
                  ))}
                </div>
              </div>

              {/* AI note suggestions */}
              {(() => {
                const suggestions = NICHE_SUGGESTIONS[selectedNiche] || [];
                if (suggestions.length === 0 && inputMode === "quick") return null;
                if (suggestions.length === 0) return null;
                return (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" /> AI-suggested notes — click to add
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button key={s} type="button"
                          onClick={() => setAdditionalNotes((prev) => prev.includes(s) ? prev : prev ? `${prev}\n${s}` : s)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            additionalNotes.includes(s)
                              ? "bg-primary/20 border-primary/50 text-primary"
                              : "bg-card/30 border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <Textarea placeholder="Any specific requirements, constraints, or preferences..." value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows={3}
                className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("input")} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("features")} className="gap-2 border-primary/30 hover:bg-primary/10">
                <Blocks className="h-4 w-4" /> Add Features
              </Button>
              <Button
                className="accent-gradient text-primary-foreground gap-2 font-bold text-base px-6"
                disabled={!canGenerate || generating}
                onClick={handleGenerate}
              >
                <Zap className="h-5 w-5" />
                Generate {GENERATION_MODES.find((m) => m.id === generationMode)?.label}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
         STEP 3: FEATURES (Optional — power users)
         ══════════════════════════════════════════════════ */}
      {step === "features" && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-bricolage">
              Add <span className="gradient-text">Advanced Features</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Optional — select specific capabilities to include in your blueprint.</p>
          </div>

          {/* AI Recommendation bar */}
          <Card className="dark-slate-purple-card border-primary/20">
            <CardContent className="pt-5 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Feature Recommendations</p>
                  <p className="text-xs text-muted-foreground">Let AI suggest the best features for your {nicheLabel || "app"}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:bg-primary/10 shrink-0"
                disabled={recommending} onClick={handleAiRecommend}>
                {recommending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
                {recommending ? "Analyzing…" : "Get AI Suggestions"}
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiSuggestions.map((suggestion) => (
                <button key={suggestion.featureId} onClick={() => applySuggestion(suggestion)}
                  className="flex items-start gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-left transition-all">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{suggestion.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{suggestion.reason}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">+ Add</Badge>
                </button>
              ))}
            </div>
          )}

          {/* Feature categories */}
          {FEATURE_CATEGORIES.map((cat) => {
            const selectedCount = (selectedFeatures[cat.id] || []).length;
            return (
              <Card key={cat.id} className="dark-slate-purple-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <cat.icon className={`h-5 w-5 ${cat.color}`} />
                    {cat.title}
                    {selectedCount > 0 && <Badge variant="default" className="ml-2 text-xs">{selectedCount}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cat.features.map((feat) => {
                      const selected = isFeatureSelected(cat.id, feat.id);
                      return (
                        <button key={feat.id} onClick={() => toggleFeature(cat.id, feat.id)}
                          className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                            selected ? "border-primary bg-primary/10" : "border-border/30 bg-card/20 hover:border-primary/40 hover:bg-card/40"
                          }`}>
                          <div className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-all ${
                            selected ? "bg-primary border-primary" : "border-muted-foreground/40"
                          }`}>
                            {selected && <CheckCircle className="h-3.5 w-3.5 text-primary-foreground" />}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-medium ${selected ? "text-foreground" : "text-muted-foreground"}`}>{feat.label}</p>
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

          {/* Summary + Generate */}
          <Card className="dark-slate-purple-card border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{projectName}</p>
                  <p className="text-xs text-muted-foreground">
                    {GENERATION_MODES.find((m) => m.id === generationMode)?.label} Mode · {totalSelected} feature{totalSelected !== 1 ? "s" : ""} selected
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("mode")} className="gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button className="accent-gradient text-primary-foreground gap-2 font-bold text-base px-6"
                    disabled={!canGenerate || generating} onClick={handleGenerate}>
                    <Zap className="h-5 w-5" />
                    Generate {GENERATION_MODES.find((m) => m.id === generationMode)?.label}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
         STEP 4: GENERATE + BLUEPRINT OUTPUT
         ══════════════════════════════════════════════════ */}
      {step === "generate" && (
        <div className="space-y-6">
          {error && (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={handleReset}>Try Again</Button>
              </CardContent>
            </Card>
          )}

          {showCountdown && generating && !blueprint && (
            <QuantumCountdown onComplete={() => setShowCountdown(false)} mode={generationMode} />
          )}

          {generating && !blueprint && !showCountdown && (
            <Card className="dark-slate-purple-card">
              <CardContent className="pt-6 flex flex-col items-center justify-center gap-4 py-16">
                <div className="relative">
                  <Zap className="h-12 w-12 text-primary animate-pulse" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-semibold text-lg">Quantum Engine Processing…</p>
                  <p className="text-muted-foreground text-sm mt-1">Streaming your {GENERATION_MODES.find((m) => m.id === generationMode)?.label}</p>
                </div>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </CardContent>
            </Card>
          )}

          {blueprint && (
            <Card className="dark-slate-purple-card">
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="gradient-text">{projectName}</span>
                  <Badge variant="secondary" className="text-xs ml-2">
                    {GENERATION_MODES.find((m) => m.id === generationMode)?.label}
                  </Badge>
                </CardTitle>
                {!generating && (
                  <div className="flex gap-2">
                    <Button onClick={handleRegenerate} variant="outline" size="sm" className="gap-2 border-primary/30">
                      <ArrowRight className="h-4 w-4" /> Change Mode & Regenerate
                    </Button>
                    <Button onClick={handleReset} className="accent-gradient text-primary-foreground gap-2 font-semibold" size="sm">
                      <Rocket className="h-4 w-4" /> New Generation
                    </Button>
                  </div>
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
                <Atom className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Configure your project to generate a blueprint.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setStep("input")}>Get Started</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
