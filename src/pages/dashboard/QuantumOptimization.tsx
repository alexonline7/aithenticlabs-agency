import { useState, useRef, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import ReactMarkdown from "react-markdown";
import {
  Zap, Brain, Shield, Globe, Cpu, Wifi, Eye, BarChart3, Lock, Cloud,
  Smartphone, Monitor, Loader2, CheckCircle, ChevronRight, ChevronLeft,
  Sparkles, FileText, Server, Database, Bot, Gauge, Layers, Rocket,
  Target, TrendingUp, Users, Lightbulb, Atom, Crown, Flame,
  ArrowRight, CircuitBoard, MessageSquare, Play, Briefcase,
  Wrench, DollarSign, Blocks, PenTool,
  ShieldCheck, Gem, Crosshair, Workflow, Scale, Fingerprint,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   NICHE DATA
   ══════════════════════════════════════════════════════════ */
const NICHES = [
  { id: "healthcare", label: "Healthcare", icon: Shield },
  { id: "legal", label: "Legal Tech", icon: FileText },
  { id: "realestate", label: "Real Estate", icon: Globe },
  { id: "fitness", label: "Fitness", icon: Gauge },
  { id: "education", label: "Education", icon: Lightbulb },
  { id: "finance", label: "Finance", icon: BarChart3 },
  { id: "restaurant", label: "Restaurant", icon: Flame },
  { id: "ecommerce", label: "E-Commerce", icon: TrendingUp },
  { id: "saas", label: "SaaS", icon: Cloud },
  { id: "creative", label: "Creative", icon: Sparkles },
  { id: "consulting", label: "Consulting", icon: Users },
  { id: "custom", label: "Custom", icon: Atom },
];

const PROJECT_TYPES = [
  { id: "web-app", label: "Web App", icon: Monitor },
  { id: "mobile-app", label: "Mobile", icon: Smartphone },
  { id: "full-stack", label: "Full-Stack", icon: Layers },
  { id: "saas", label: "SaaS", icon: Cloud },
  { id: "api-service", label: "API", icon: Server },
];

const PLATFORMS = [
  { id: "web", label: "Web" }, { id: "ios", label: "iOS" }, { id: "android", label: "Android" },
  { id: "desktop", label: "Desktop" }, { id: "api", label: "API" },
];

/* ══════════════════════════════════════════════════════════
   18 TRANSFORMATION MODULES
   ══════════════════════════════════════════════════════════ */
const MODULES = [
  { id: "tool-definition", n: 1, label: "Tool Definition", short: "Definition", icon: Workflow, desc: "Engine behavior: tool-first, not content" },
  { id: "core-user-action", n: 2, label: "Core User Action", short: "Core Action", icon: Target, desc: "Intent → blueprint in one flow" },
  { id: "input-model", n: 3, label: "Input Model", short: "Input", icon: MessageSquare, desc: "Niche, idea, workflow, customer capture" },
  { id: "generation-modes", n: 4, label: "Generation Modes", short: "Modes", icon: Play, desc: "Instant / Premium / Build-Ready / Domination" },
  { id: "quantum-behavior", n: 5, label: "Quantum Behavior", short: "Quantum", icon: Atom, desc: "Staged 8\u201315 s execution pipeline" },
  { id: "output-structure", n: 6, label: "Output Structure", short: "Structure", icon: FileText, desc: "9-section blueprint schema" },
  { id: "phase-conversion", n: 7, label: "Phase Conversion", short: "Phases", icon: Layers, desc: "4 phases \u2192 intelligence routing" },
  { id: "tech-stack", n: 8, label: "Tech Stack Logic", short: "Stack", icon: Server, desc: "Architecture mapped by niche" },
  { id: "pricing", n: 9, label: "Pricing Intelligence", short: "Pricing", icon: DollarSign, desc: "$149\u2013$399 tier logic + setup fees" },
  { id: "trend-engine", n: 10, label: "Trend Engine", short: "Trends", icon: TrendingUp, desc: "Adjacent opportunities + innovation" },
  { id: "qa", n: 11, label: "Quality Assurance", short: "QA", icon: ShieldCheck, desc: "7-criteria refinement gate" },
  { id: "niche-spec", n: 12, label: "Niche Specialization", short: "Niche", icon: Crosshair, desc: "Domain workflows + terminology" },
  { id: "originality", n: 13, label: "Originality Filter", short: "Originality", icon: Fingerprint, desc: "Anti-template differentiation" },
  { id: "admin-scale", n: 14, label: "Admin + Scale", short: "Admin", icon: Scale, desc: "Ops systems + growth controls" },
  { id: "monetization", n: 15, label: "Monetization", short: "Revenue", icon: Gem, desc: "Revenue architecture + upsell" },
  { id: "buildability", n: 16, label: "Buildability", short: "Build", icon: Wrench, desc: "MVP realism + dependency path" },
  { id: "tool-personality", n: 17, label: "Tool Personality", short: "Persona", icon: Crown, desc: "5-expert strategist mind" },
  { id: "final-synthesis", n: 18, label: "Final Synthesis", short: "Synthesis", icon: Rocket, desc: "Premium blueprint packaging" },
] as const;

/* ── Feature categories ── */
interface FeatureItem { id: string; label: string; description: string; icon: React.ElementType; }
interface FeatureCategory { id: string; title: string; icon: React.ElementType; color: string; features: FeatureItem[]; }
const FEATURE_CATEGORIES: FeatureCategory[] = [
  { id: "ai-ml", title: "AI & Machine Learning", icon: Brain, color: "text-[hsl(var(--deep-purple-500))]", features: [
    { id: "computer-vision", label: "Computer Vision", description: "Image recognition, OCR", icon: Eye },
    { id: "nlp", label: "NLP", description: "Text analysis, sentiment", icon: FileText },
    { id: "recommendation-engine", label: "Recommendations", description: "Personalized suggestions", icon: Sparkles },
    { id: "predictive-analytics", label: "Predictive Analytics", description: "Forecasting, trends", icon: BarChart3 },
    { id: "generative-ai", label: "Generative AI", description: "Content gen, chatbots", icon: Bot },
    { id: "ml-ops", label: "MLOps", description: "Model training, A/B", icon: Layers },
  ]},
  { id: "realtime-infra", title: "Real-Time & Infra", icon: Wifi, color: "text-[hsl(var(--electric-blue-400))]", features: [
    { id: "websockets", label: "WebSockets", description: "Real-time comms", icon: Wifi },
    { id: "edge-computing", label: "Edge Computing", description: "Distributed processing", icon: Globe },
    { id: "cdn-optimization", label: "CDN", description: "Global delivery", icon: Cloud },
    { id: "microservices", label: "Microservices", description: "Decoupled services", icon: Server },
    { id: "serverless", label: "Serverless", description: "Auto-scaling compute", icon: Cpu },
    { id: "message-queues", label: "Message Queues", description: "Event streaming", icon: Database },
  ]},
  { id: "security-compliance", title: "Security & Compliance", icon: Shield, color: "text-green-400", features: [
    { id: "zero-trust", label: "Zero-Trust", description: "Always verify", icon: Lock },
    { id: "e2e-encryption", label: "E2E Encryption", description: "Transit + rest", icon: Shield },
    { id: "gdpr", label: "GDPR", description: "Privacy, consent", icon: FileText },
    { id: "hipaa", label: "HIPAA", description: "Healthcare data", icon: Shield },
    { id: "soc2", label: "SOC 2", description: "Security audit", icon: CheckCircle },
    { id: "rbac", label: "RBAC", description: "Granular perms", icon: Lock },
  ]},
  { id: "performance-scale", title: "Performance & Scale", icon: Gauge, color: "text-[hsl(var(--deep-gold-400))]", features: [
    { id: "auto-scaling", label: "Auto-Scale", description: "Dynamic resources", icon: Gauge },
    { id: "load-balancing", label: "Load Balancing", description: "Traffic distribution", icon: Server },
    { id: "caching-strategy", label: "Caching", description: "Multi-layer cache", icon: Layers },
    { id: "db-optimization", label: "DB Optimization", description: "Query tuning", icon: Database },
    { id: "performance-monitoring", label: "APM", description: "Tracing, metrics", icon: BarChart3 },
    { id: "progressive-web", label: "PWA", description: "Offline, push", icon: Globe },
  ]},
];

/* ══════════════════════════════════════════════════════════
   GENERATION MODES
   ══════════════════════════════════════════════════════════ */
const MODES = [
  { id: "instant-concept", label: "Instant Concept", tag: "~8 s \u00b7 9 sections", icon: Zap, grad: "from-[hsl(var(--deep-gold-500))] to-[hsl(43,96%,70%)]", modules: 16, desc: "Sharp concept with pricing, niche specialization, and MVP." },
  { id: "premium-blueprint", label: "Premium Blueprint", tag: "~12 s \u00b7 12+ sections", icon: Blocks, grad: "from-[hsl(var(--electric-blue-500))] to-[hsl(var(--electric-blue-400))]", modules: 18, desc: "Full architecture, UX, go-to-market, revenue table, buildability." },
  { id: "build-ready", label: "Build-Ready Scope", tag: "~14 s \u00b7 16+ sections", icon: Wrench, grad: "from-emerald-500 to-green-400", modules: 18, desc: "DB schemas, API specs, phased implementation, dependency manifest." },
  { id: "market-domination", label: "Market Domination", tag: "~15 s \u00b7 17+ sections", icon: Crown, grad: "from-[hsl(var(--deep-purple-500))] to-pink-500", modules: 18, desc: "Competitive annihilation, AI deep dive, revenue projections." },
] as const;

const STRICT_APPENDIX = "Strict enforcement: Include sensible MVP (1-3 days), implementation order (Day 1/2/3/Week 2), stack + dependencies with costs, ship-now vs delay-later, highest-leverage-first, sharp premium strategist tone.";
const SECTION_LABELS = ["App Identity","Strategic Concept","Core System","Feature Architecture","Technical Architecture","Business Model","Launch Logic","Expansion Logic","Execution Summary"];

const NICHE_TIPS: Record<string, string[]> = {
  healthcare: ["HIPAA-compliant patient records","Telehealth video module","Appointment scheduling + SMS","EHR/EMR via HL7 FHIR"],
  legal: ["E-signature + doc versioning","Billable hours + invoicing","Case timeline + deadline alerts","Secure client portal"],
  realestate: ["Map-based property search","Virtual tour (Matterport)","Mortgage calculator","MLS syndication"],
  fitness: ["Wearable sync (Apple Watch)","AI workout planner","Nutrition tracker","Progress photo compare"],
  education: ["Gamified learning","Live classroom + whiteboard","AI quiz generator","Student analytics"],
  finance: ["Real-time market feeds","Multi-currency","Tax reporting","Risk scoring ML"],
  restaurant: ["QR menu + availability","Kitchen display system","Loyalty program","Multi-location inventory"],
  ecommerce: ["AI product recs","Abandoned cart recovery","Multi-vendor marketplace","AR product preview"],
  saas: ["Multi-tenant isolation","Usage-based billing + Stripe","White-label per tenant","API rate limiting"],
  creative: ["Portfolio builder","Client approval workflow","Asset library + versioning","Time tracking + profitability"],
  consulting: ["Client onboarding forms","Proposal + e-signature","Calendar sync scheduler","ROI tracking dashboard"],
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function QuantumOptimization() {
  const { user } = useAuth();
  type Phase = "intake" | "configure" | "generating" | "result";
  const [phase, setPhase] = useState<Phase>("intake");

  const [inputMode, setInputMode] = useState<"quick" | "describe">("quick");
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [projectName, setProjectName] = useState("");
  const [appIdea, setAppIdea] = useState("");
  const [professionalType, setProfessionalType] = useState("");
  const [workflowProblem, setWorkflowProblem] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");

  const [mode, setMode] = useState("premium-blueprint");
  const [projectType, setProjectType] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["web"]);
  const [notes, setNotes] = useState("");
  const [strict, setStrict] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({});
  const [showFeatures, setShowFeatures] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState("");
  const [error, setError] = useState("");
  const [genStart, setGenStart] = useState<number | null>(null);
  const [genEnd, setGenEnd] = useState<number | null>(null);
  const [pipelineStep, setPipelineStep] = useState(0);
  const blueprintRef = useRef<HTMLDivElement>(null);

  const nicheLabel = niche === "custom" ? customNiche : NICHES.find((n) => n.id === niche)?.label || "";
  const modeConfig = MODES.find((m) => m.id === mode);
  const canGenerate = projectName.trim() && (niche || appIdea.trim());
  const totalFeatures = Object.values(selectedFeatures).reduce((s, a) => s + a.length, 0);
  const genDuration = genStart && genEnd ? ((genEnd - genStart) / 1000).toFixed(1) : null;

  const togglePlatform = (id: string) => setPlatforms((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleFeature = (catId: string, fId: string) => {
    setSelectedFeatures((prev) => {
      const cur = prev[catId] || [];
      return { ...prev, [catId]: cur.includes(fId) ? cur.filter((x) => x !== fId) : [...cur, fId] };
    });
  };
  const isFeatureSelected = (catId: string, fId: string) => (selectedFeatures[catId] || []).includes(fId);

  useEffect(() => {
    if (!generating) { setPipelineStep(0); return; }
    const iv = setInterval(() => { setPipelineStep((s) => (s < MODULES.length - 1 ? s + 1 : s)); }, 700);
    return () => clearInterval(iv);
  }, [generating]);

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenStart(Date.now()); setGenEnd(null); setGenerating(true); setBlueprint(""); setError(""); setPhase("generating");
    try {
      const featureMap: Record<string, string[]> = {};
      for (const [catId, fIds] of Object.entries(selectedFeatures)) {
        const cat = FEATURE_CATEGORIES.find((c) => c.id === catId);
        if (!cat || !fIds.length) continue;
        featureMap[cat.title] = fIds.map((fId) => cat.features.find((f) => f.id === fId)?.label || fId);
      }
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quantum-spec`;
      const { data: sd } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY };
      if (sd.session?.access_token) headers.Authorization = \`Bearer \${sd.session.access_token}\`;

      const resp = await fetch(url, {
        method: "POST", headers,
        body: JSON.stringify({
          projectName, niche: nicheLabel, professionalType, businessCategory: niche, appIdea,
          workflowProblem, targetCustomer, desiredOutcome,
          projectType: PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType || "Web Application",
          platforms: platforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p),
          selectedFeatures: featureMap,
          additionalNotes: [notes, strict ? STRICT_APPENDIX : ""].filter(Boolean).join("\n\n"),
          mode,
        }),
      });
      if (!resp.ok) { const e = await resp.json().catch(() => ({ error: \`Error \${resp.status}\` })); throw new Error(e.error); }

      const reader = resp.body!.getReader();
      const dec = new TextDecoder();
      let buf = "", acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx); buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const js = line.slice(6).trim();
          if (js === "[DONE]") break;
          try { const p = JSON.parse(js); const c = p.choices?.[0]?.delta?.content; if (c) { acc += c; setBlueprint(acc); } } catch { buf = line + "\n" + buf; break; }
        }
      }
      if (buf.trim()) { for (let raw of buf.split("\n")) { if (!raw || !raw.startsWith("data: ")) continue; const js = raw.slice(6).trim(); if (js === "[DONE]") continue; try { const p = JSON.parse(js); const c = p.choices?.[0]?.delta?.content; if (c) { acc += c; setBlueprint(acc); } } catch {} } }

      if (acc) {
        const { data: ud, error: ue } = await supabase.auth.getUser();
        const cu = ud.user ?? user;
        if (ue || !cu) throw new Error("Session expired.");
        const { error: ie } = await supabase.from("generated_reports").insert({
          user_id: cu.id, user_email: cu.email ?? null, project_name: projectName,
          report_type: "quantum-blueprint", content: acc,
          metadata: { niche: nicheLabel, mode, modeLabel: modeConfig?.label, appIdea, professionalType, workflowProblem, targetCustomer, desiredOutcome, projectType: PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType, platforms: platforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p), selectedFeatures: featureMap, additionalNotes: notes, strictEnforcement: strict, generatedByTool: "quantum-optimization" },
        });
        if (ie) throw new Error(\`Save failed: \${ie.message}\`);
      }
      setPhase("result");
    } catch (e) { setError(e instanceof Error ? e.message : "Generation failed"); setPhase("result"); } finally { setGenEnd(Date.now()); setGenerating(false); }
  };

  const handleReset = () => {
    setPhase("intake"); setNiche(""); setCustomNiche(""); setProjectName(""); setAppIdea(""); setProfessionalType("");
    setWorkflowProblem(""); setTargetCustomer(""); setDesiredOutcome(""); setProjectType(""); setPlatforms(["web"]);
    setNotes(""); setSelectedFeatures({}); setBlueprint(""); setError(""); setGenStart(null); setGenEnd(null);
    setMode("premium-blueprint"); setInputMode("quick"); setShowFeatures(false);
  };

  const sectionCoverage = useMemo(() => {
    if (!blueprint.trim()) return SECTION_LABELS.map((l) => ({ label: l, found: false }));
    return SECTION_LABELS.map((label) => ({ label, found: new RegExp(\`##\\s+(?:\\d+\\.\\s*)?\${label.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\`, "im").test(blueprint) }));
  }, [blueprint]);
  const sectionsFound = sectionCoverage.filter((s) => s.found).length;

  return (
    <div className="space-y-0 animate-fade-in">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl mb-8" style={{ background: "linear-gradient(145deg, hsl(222 47% 7%) 0%, hsl(271 81% 10%) 40%, hsl(217 91% 10%) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(43 96% 56% / 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 30%, hsl(217 91% 60% / 0.06) 0%, transparent 50%)" }} />
        <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-14">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full accent-gradient px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground"><Zap className="h-3 w-3" /> 8\u201315 s</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">18 modules</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">4 modes</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold font-bricolage leading-[1.1] tracking-tight">
                <span className="gradient-text">Quantum</span>{" "}<span className="text-foreground">Generator</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
                Describe your app. 18 transformation modules fire in parallel \u2014 pricing intelligence, buildability, originality enforcement, niche specialization, and more \u2014 delivering a premium, buildable blueprint in seconds.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ v: "8\u201315s", l: "Speed" }, { v: "18", l: "Modules" }, { v: "4", l: "Modes" }, { v: "12+", l: "Niches" }].map((s) => (
                <div key={s.l} className="rounded-xl glass-effect p-4 text-center min-w-[80px]">
                  <p className="text-xl font-extrabold gradient-text">{s.v}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">Transformation Pipeline \u2014 18 modules active</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {MODULES.map((m) => (
                <div key={m.id} className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-2">
                  <m.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-foreground truncate">{m.short}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PHASE: INTAKE */}
      {phase === "intake" && (
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="flex justify-center gap-2">
            {([["quick", "Quick Select", Zap], ["describe", "Describe Idea", PenTool]] as const).map(([key, label, Icon]) => (
              <button key={key} onClick={() => setInputMode(key as "quick" | "describe")}
                className={\`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all \${inputMode === key ? "accent-gradient text-primary-foreground shadow-lg shadow-primary/20" : "glass-effect text-muted-foreground hover:text-foreground"}\`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          {inputMode === "quick" ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-bricolage text-center">What <span className="gradient-text">niche</span> are you building for?</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {NICHES.map((n) => {
                  const sel = niche === n.id;
                  return (
                    <button key={n.id} onClick={() => setNiche(n.id)}
                      className={\`group relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all \${sel ? "border-primary bg-primary/10 shadow-md shadow-primary/10" : "border-border/20 bg-card/30 hover:border-primary/30"}\`}>
                      <n.icon className={\`h-5 w-5 \${sel ? "text-primary" : "text-muted-foreground group-hover:text-primary/60"}\`} />
                      <span className={\`text-xs font-semibold \${sel ? "text-foreground" : "text-muted-foreground"}\`}>{n.label}</span>
                      {sel && <CheckCircle className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-primary" />}
                    </button>
                  );
                })}
              </div>
              {niche === "custom" && <Input placeholder="Your niche (e.g. Veterinary Clinic)" value={customNiche} onChange={(e) => setCustomNiche(e.target.value)} className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground max-w-md mx-auto" />}
              {niche && (
                <div className="space-y-3 max-w-md mx-auto">
                  <Input placeholder="App name \u2014 e.g. NeuroHealth Pro" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground h-12 text-base" />
                  <Input placeholder="Who is this for? (optional)" value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground" />
                  <Input placeholder="What problem does it solve? (optional)" value={workflowProblem} onChange={(e) => setWorkflowProblem(e.target.value)} className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold font-bricolage text-center">Describe your <span className="gradient-text">app idea</span></h2>
              <Input placeholder="App name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground h-12 text-base" />
              <Textarea placeholder="Describe the app \u2014 what it does, who it\u2019s for, what makes it valuable\u2026" value={appIdea} onChange={(e) => setAppIdea(e.target.value)} rows={4} className="bg-background border-primary/30 text-foreground placeholder:text-muted-foreground" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Professional type (optional)" value={professionalType} onChange={(e) => setProfessionalType(e.target.value)} className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground" />
                <Input placeholder="Target customer (optional)" value={targetCustomer} onChange={(e) => setTargetCustomer(e.target.value)} className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground" />
                <Input placeholder="Workflow problem (optional)" value={workflowProblem} onChange={(e) => setWorkflowProblem(e.target.value)} className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground" />
                <Input placeholder="Desired outcome (optional)" value={desiredOutcome} onChange={(e) => setDesiredOutcome(e.target.value)} className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button className="accent-gradient text-primary-foreground gap-2 font-bold px-8 h-11" disabled={!canGenerate} onClick={() => setPhase("configure")}>
              Configure Generation <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* PHASE: CONFIGURE */}
      {phase === "configure" && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-effect">
            <Atom className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{projectName}</p>
              <p className="text-xs text-muted-foreground">{nicheLabel || "Custom idea"} \u00b7 {platforms.join(", ")}</p>
            </div>
            <button onClick={() => setPhase("intake")} className="text-xs text-primary hover:underline">Edit</button>
          </div>
          <div>
            <h2 className="text-xl font-bold font-bricolage mb-4">Select <span className="gradient-text">Generation Mode</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MODES.map((m) => {
                const sel = mode === m.id;
                return (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={\`relative flex items-start gap-4 p-5 rounded-xl border text-left transition-all \${sel ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/5" : "border-border/20 bg-card/30 hover:border-primary/30"}\`}>
                    <div className={\`h-11 w-11 rounded-xl bg-gradient-to-br \${m.grad} flex items-center justify-center shrink-0\`}>
                      <m.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-foreground">{m.label}</p>
                        <span className="text-[10px] text-muted-foreground border border-border/30 rounded-full px-2 py-0.5">{m.tag}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</p>
                      <p className="text-[10px] text-primary mt-1.5 font-semibold">{m.modules} transformation modules active</p>
                    </div>
                    {sel && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/20 bg-card/20 p-4">
              <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Project Type</p>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map((t) => (
                  <button key={t.id} onClick={() => setProjectType(t.id)}
                    className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all \${projectType === t.id ? "border-primary bg-primary/10 text-primary" : "border-border/30 text-muted-foreground hover:border-primary/30"}\`}>
                    <t.icon className="h-3.5 w-3.5" /> {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/20 bg-card/20 p-4">
              <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    className={\`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all \${platforms.includes(p.id) ? "border-primary bg-primary/10 text-primary" : "border-border/30 text-muted-foreground hover:border-primary/30"}\`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/20 bg-card/20 p-4">
            <div>
              <p className="text-sm font-bold text-foreground">Strict Enforcement</p>
              <p className="text-xs text-muted-foreground mt-0.5">Force MVP realism, implementation order, dependencies, and sharp strategist tone.</p>
            </div>
            <Switch checked={strict} onCheckedChange={setStrict} />
          </div>
          {NICHE_TIPS[niche] && (
            <div className="rounded-xl border border-border/20 bg-card/20 p-4">
              <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> AI Suggestions for {nicheLabel}</p>
              <div className="flex flex-wrap gap-2">
                {NICHE_TIPS[niche]!.map((tip) => (
                  <button key={tip} onClick={() => setNotes((p) => p ? \`\${p}\n\${tip}\` : tip)}
                    className={\`text-xs px-3 py-1.5 rounded-full border transition-all \${notes.includes(tip) ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 text-muted-foreground hover:border-primary/30"}\`}>
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Textarea placeholder="Additional notes or requirements\u2026" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="bg-background border-border/30 text-foreground placeholder:text-muted-foreground" />
          <button onClick={() => setShowFeatures((p) => !p)} className="flex items-center gap-2 text-sm text-primary hover:underline font-medium">
            <Blocks className="h-4 w-4" /> {showFeatures ? "Hide" : "Show"} Advanced Features {totalFeatures > 0 && \`(\${totalFeatures} selected)\`}
          </button>
          {showFeatures && (
            <div className="space-y-4">
              {FEATURE_CATEGORIES.map((cat) => {
                const cnt = (selectedFeatures[cat.id] || []).length;
                return (
                  <div key={cat.id} className="rounded-xl border border-border/20 bg-card/20 p-4">
                    <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                      <cat.icon className={\`h-4 w-4 \${cat.color}\`} /> {cat.title}
                      {cnt > 0 && <Badge className="ml-1 text-[10px]">{cnt}</Badge>}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cat.features.map((f) => {
                        const sel = isFeatureSelected(cat.id, f.id);
                        return (
                          <button key={f.id} onClick={() => toggleFeature(cat.id, f.id)}
                            className={\`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all \${sel ? "border-primary bg-primary/10 text-foreground" : "border-border/20 text-muted-foreground hover:border-primary/30"}\`}>
                            <div className={\`h-4 w-4 rounded border flex items-center justify-center shrink-0 \${sel ? "bg-primary border-primary" : "border-muted-foreground/40"}\`}>
                              {sel && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className="font-medium">{f.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex items-center justify-between gap-4 pt-2">
            <Button variant="outline" onClick={() => setPhase("intake")} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
            <Button className="accent-gradient text-primary-foreground gap-2 font-extrabold text-base px-10 h-12 shadow-lg shadow-primary/20" disabled={!canGenerate} onClick={handleGenerate}>
              <Zap className="h-5 w-5" /> Generate {modeConfig?.label}
            </Button>
          </div>
        </div>
      )}

      {/* PHASE: GENERATING */}
      {phase === "generating" && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center gap-5 py-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full animate-pulse" />
              <div className="relative h-24 w-24 rounded-full border border-primary/40 flex items-center justify-center" style={{ background: "radial-gradient(circle, hsl(43 96% 56% / 0.15) 0%, transparent 70%)" }}>
                <Atom className="h-12 w-12 text-primary animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-extrabold font-bricolage gradient-text">{projectName}</p>
              <p className="text-sm text-muted-foreground">{modeConfig?.label} Mode \u00b7 18 modules processing</p>
            </div>
            <Progress value={blueprint ? Math.min(95, 30 + (blueprint.length / 50)) : (pipelineStep / MODULES.length) * 80} className="w-72 h-2" />
          </div>
          <div className="rounded-2xl border border-border/20 bg-card/20 p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3 font-bold">18-Module Transformation Pipeline</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {MODULES.map((m, i) => {
                const done = i < pipelineStep;
                const active = i === pipelineStep;
                return (
                  <div key={m.id} className={\`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-all duration-300 \${done ? "border-primary/30 bg-primary/10" : active ? "border-primary/40 bg-primary/5 shadow-md shadow-primary/10" : "border-border/10 bg-card/10 opacity-40"}\`}>
                    {done ? <CheckCircle className="h-4 w-4 text-primary shrink-0" /> : active ? <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" /> : <div className="h-4 w-4 rounded-full border border-border/30 shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className={\`text-[11px] font-bold truncate \${done || active ? "text-foreground" : "text-muted-foreground"}\`}>
                        <span className="text-primary mr-1">{m.n}.</span>{m.short}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {blueprint && (
            <div className="rounded-2xl border border-border/20 bg-card/20 p-5">
              <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-2"><CircuitBoard className="h-4 w-4 text-primary" /> Live Output Stream</p>
              <ScrollArea className="h-[300px]">
                <div ref={blueprintRef} className="prose prose-invert max-w-none text-sm [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_li]:text-muted-foreground [&_strong]:text-foreground [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs">
                  <ReactMarkdown>{blueprint}</ReactMarkdown>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}

      {/* PHASE: RESULT */}
      {phase === "result" && (
        <div className="max-w-5xl mx-auto space-y-6">
          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5">
              <p className="text-sm text-destructive font-medium">{error}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleReset}>Start Over</Button>
            </div>
          )}
          {blueprint && (
            <>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl font-extrabold font-bricolage"><span className="gradient-text">{projectName}</span></h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge className="accent-gradient text-primary-foreground border-0 text-xs">{modeConfig?.label}</Badge>
                    <Badge variant="outline" className="text-[10px] border-border/30">{genDuration ? \`\${genDuration}s\` : "\u2014"}</Badge>
                    <Badge variant="outline" className="text-[10px] border-border/30">{sectionsFound}/9 sections</Badge>
                    <Badge variant="outline" className="text-[10px] border-border/30">18 modules</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setBlueprint(""); setError(""); setPhase("configure"); }} className="gap-2 border-primary/30"><ArrowRight className="h-4 w-4" /> Regenerate</Button>
                  <Button size="sm" onClick={handleReset} className="accent-gradient text-primary-foreground gap-2 font-bold"><Rocket className="h-4 w-4" /> New Project</Button>
                </div>
              </div>
              <div className="rounded-xl border border-border/20 bg-card/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold mb-2">Modules Executed</p>
                <div className="flex flex-wrap gap-1.5">
                  {MODULES.map((m) => (
                    <span key={m.id} className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                      <CheckCircle className="h-2.5 w-2.5" /> {m.short}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border/20 bg-card/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold mb-2">Section Coverage</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {sectionCoverage.map((s) => (
                    <div key={s.label} className={\`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium \${s.found ? "border-primary/30 bg-primary/5 text-foreground" : "border-border/10 text-muted-foreground opacity-50"}\`}>
                      {s.found ? <CheckCircle className="h-3 w-3 text-primary shrink-0" /> : <div className="h-3 w-3 rounded-full border border-border/40 shrink-0" />}
                      <span className="truncate">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border/20 bg-card/20 overflow-hidden">
                <div className="px-5 py-3 border-b border-border/10 flex items-center gap-2">
                  <CircuitBoard className="h-4 w-4 text-primary" /><p className="text-xs font-bold text-foreground">Generated Blueprint</p>
                </div>
                <ScrollArea className="h-[600px]">
                  <div ref={blueprintRef} className="p-6 prose prose-invert max-w-none text-sm [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-foreground [&_h1]:mt-8 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_li]:text-muted-foreground [&_strong]:text-foreground [&_strong]:font-semibold [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:text-foreground [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_hr]:border-border [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border/30 [&_th]:bg-muted/20 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:text-foreground [&_td]:border [&_td]:border-border/20 [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs">
                    <ReactMarkdown>{blueprint}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
          {!blueprint && !error && (
            <div className="text-center py-16">
              <Atom className="h-12 w-12 text-primary/20 mx-auto mb-4" />
              <p className="text-muted-foreground">No blueprint generated yet.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleReset}>Start Over</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
