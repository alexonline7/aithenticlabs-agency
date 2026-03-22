import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sparkles, Zap, FileText, Download, Clock, CheckCircle, ArrowRight,
  Rocket, Brain, Star, Shield, Layers, Globe, Smartphone, Monitor,
  Database, Cloud, Lock, Users, CreditCard, BarChart3, Palette,
  Code, Settings, Package, MessageSquare, ShoppingCart, BookOpen,
  Briefcase, Heart, Gamepad2, GraduationCap, Camera, Music,
  ChevronRight, Plus, Eye, RefreshCw, Wand2, Layout, Server,
} from "lucide-react";

/* ── App Categories ─────────────────────────────────────────── */
const appCategories = [
  { id: "ecommerce",  icon: ShoppingCart, label: "E-Commerce",      desc: "Online stores, marketplaces, product catalogs" },
  { id: "saas",       icon: Cloud,        label: "SaaS Platform",   desc: "Subscription services, dashboards, admin panels" },
  { id: "social",     icon: Users,        label: "Social Network",  desc: "Community platforms, forums, messaging apps" },
  { id: "education",  icon: GraduationCap,label: "Education",       desc: "LMS, course platforms, e-learning portals" },
  { id: "health",     icon: Heart,        label: "Health & Fitness",desc: "Wellness apps, telehealth, fitness tracking" },
  { id: "finance",    icon: CreditCard,   label: "Finance",         desc: "Fintech, banking, payment & invoicing tools" },
  { id: "creative",   icon: Palette,      label: "Creative & Media",desc: "Portfolio, galleries, content creation tools" },
  { id: "gaming",     icon: Gamepad2,     label: "Gaming",          desc: "Browser games, leaderboards, tournament apps" },
  { id: "productivity",icon: Briefcase,   label: "Productivity",    desc: "Project management, CRM, task automation" },
  { id: "booking",    icon: BookOpen,     label: "Booking & Events",desc: "Reservations, scheduling, event management" },
  { id: "ai",         icon: Brain,        label: "AI-Powered",      desc: "Chatbots, recommendation engines, AI tools" },
  { id: "custom",     icon: Code,         label: "Custom Build",    desc: "Fully custom spec — describe anything" },
];

/* ── Pricing Tiers ──────────────────────────────────────────── */
const pricingTiers = [
  {
    id: "starter", name: "Starter", price: 149, color: "text-secondary",
    badge: "Quick Launch", features: [
      "Up to 5 pages", "Responsive design", "Basic SEO", "Contact form",
      "1 revision round", "3-day delivery brief",
    ],
  },
  {
    id: "professional", name: "Professional", price: 299, color: "text-primary",
    badge: "Most Popular", popular: true, features: [
      "Up to 15 pages", "Advanced UI/UX", "Full SEO suite", "User authentication",
      "Database integration", "API integrations", "3 revision rounds", "Analytics dashboard",
      "5-day delivery brief",
    ],
  },
  {
    id: "enterprise", name: "Enterprise", price: 499, color: "text-deep-purple-500",
    badge: "Full Power", features: [
      "Unlimited pages", "Custom design system", "AI features built-in",
      "Multi-role auth & RBAC", "Real-time features", "Payment processing",
      "CI/CD pipeline spec", "Performance optimization", "Unlimited revisions",
      "Priority support", "7-day delivery brief",
    ],
  },
];

/* ── Tech Stack Options ─────────────────────────────────────── */
const techOptions = {
  frontend: [
    { id: "react",   label: "React + Vite" },
    { id: "next",    label: "Next.js" },
    { id: "vue",     label: "Vue 3" },
    { id: "svelte",  label: "SvelteKit" },
  ],
  styling: [
    { id: "tailwind", label: "Tailwind CSS" },
    { id: "css-modules", label: "CSS Modules" },
    { id: "styled",  label: "Styled Components" },
    { id: "chakra",  label: "Chakra UI" },
  ],
  backend: [
    { id: "supabase", label: "Supabase" },
    { id: "firebase", label: "Firebase" },
    { id: "node",    label: "Node.js + Express" },
    { id: "python",  label: "Python + FastAPI" },
  ],
  database: [
    { id: "postgres", label: "PostgreSQL" },
    { id: "mongo",   label: "MongoDB" },
    { id: "mysql",   label: "MySQL" },
    { id: "redis",   label: "Redis" },
  ],
};

/* ── Feature Modules ────────────────────────────────────────── */
const featureModules = [
  { id: "auth",       icon: Lock,          label: "Authentication",       desc: "Login, signup, OAuth, password reset" },
  { id: "payments",   icon: CreditCard,    label: "Payment Processing",   desc: "Stripe, PayPal, subscription billing" },
  { id: "analytics",  icon: BarChart3,     label: "Analytics Dashboard",  desc: "Charts, KPIs, user tracking" },
  { id: "chat",       icon: MessageSquare, label: "Real-time Chat",       desc: "WebSocket messaging, notifications" },
  { id: "ai-features",icon: Brain,         label: "AI Integration",       desc: "Chatbot, recommendations, content gen" },
  { id: "file-upload",icon: Cloud,         label: "File Storage",         desc: "Upload, CDN, media management" },
  { id: "admin",      icon: Shield,        label: "Admin Panel",          desc: "User management, content moderation" },
  { id: "api",        icon: Server,        label: "REST / GraphQL API",   desc: "Documented API endpoints" },
  { id: "i18n",       icon: Globe,         label: "Internationalization", desc: "Multi-language support" },
  { id: "seo",        icon: Eye,           label: "Advanced SEO",         desc: "Meta tags, sitemap, schema markup" },
  { id: "responsive", icon: Smartphone,    label: "Mobile-First Design",  desc: "PWA, responsive layouts" },
  { id: "testing",    icon: CheckCircle,   label: "Testing Suite",        desc: "Unit, integration, E2E test specs" },
];

/* ── Platform Targets ───────────────────────────────────────── */
const platforms = [
  { id: "web",     icon: Monitor,    label: "Web App" },
  { id: "mobile",  icon: Smartphone, label: "Mobile (PWA)" },
  { id: "desktop", icon: Monitor,    label: "Desktop (Electron)" },
  { id: "api",     icon: Server,     label: "API Only" },
];

/* ── Previous Generations ───────────────────────────────────── */
const previousGenerations = [
  { id: 1, title: "AI Fitness Coach Pro", niche: "Health & Fitness", tier: "Enterprise", pages: 42, time: "14s", date: "Mar 20, 2026", status: "complete" },
  { id: 2, title: "Smart Recipe Marketplace", niche: "Food & Cooking", tier: "Professional", pages: 28, time: "11s", date: "Mar 19, 2026", status: "complete" },
  { id: 3, title: "Pet Care SaaS Platform", niche: "Animals & Pets", tier: "Enterprise", pages: 56, time: "15s", date: "Mar 18, 2026", status: "complete" },
  { id: 4, title: "EdTech Learning Hub", niche: "Education", tier: "Professional", pages: 34, time: "12s", date: "Mar 17, 2026", status: "complete" },
  { id: 5, title: "FinTrack Portfolio Manager", niche: "Finance", tier: "Starter", pages: 18, time: "8s", date: "Mar 16, 2026", status: "complete" },
];

/* ═══════════════════════════════════════════════════════════ */

export default function FlashAppsGenerator() {
  const { user } = useAuth();
  // ── wizard state
  const [activeTab, setActiveTab] = useState("configure");
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>("professional");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["web"]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["auth", "responsive", "seo"]);
  const [selectedTech, setSelectedTech] = useState({
    frontend: "react", styling: "tailwind", backend: "supabase", database: "postgres",
  });
  const [targetAudience, setTargetAudience] = useState("");
  const [monetization, setMonetization] = useState("");
  const [includeDesignSystem, setIncludeDesignSystem] = useState(true);
  const [includeDeployGuide, setIncludeDeployGuide] = useState(true);
  const [includeApiDocs, setIncludeApiDocs] = useState(false);
  const [includeTestSpecs, setIncludeTestSpecs] = useState(false);

  // ── generation state
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationPhase, setGenerationPhase] = useState("");
  const [generatedBrief, setGeneratedBrief] = useState("");
  const [generationError, setGenerationError] = useState("");
  const briefRef = useRef("");

  const phases = [
    "Analyzing niche requirements...",
    "Mapping feature dependencies...",
    "Architecting database schema...",
    "Generating UI/UX wireframe spec...",
    "Building API specification...",
    "Compiling deployment strategy...",
    "Optimizing performance targets...",
    "Assembling final brief...",
  ];

  const togglePlatform = (id: string) =>
    setSelectedPlatforms((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleFeature = (id: string) =>
    setSelectedFeatures((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);

  const handleGenerate = async () => {
    if (!appName.trim() || !selectedCategory) return;
    setGenerating(true);
    setProgress(0);
    setActiveTab("generate");
    setGeneratedBrief("");
    setGenerationError("");
    briefRef.current = "";
    let phaseIndex = 0;
    setGenerationPhase(phases[0]);

    // Progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 3 + 1;
        const pi = Math.min(Math.floor((next / 90) * phases.length), phases.length - 1);
        if (pi !== phaseIndex) {
          phaseIndex = pi;
          setGenerationPhase(phases[pi]);
        }
        if (next >= 90) {
          clearInterval(interval);
          return 90;
        }
        return next;
      });
    }, 600);

    const BRIEF_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-brief`;

    try {
      const resp = await fetch(BRIEF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          appName,
          appDescription,
          category: appCategories.find((c) => c.id === selectedCategory)?.label || selectedCategory,
          tier: selectedTier,
          platforms: selectedPlatforms,
          features: selectedFeatures.map((fId) => featureModules.find((f) => f.id === fId)?.label || fId),
          tech: selectedTech,
          targetAudience,
          monetization,
          includeDesignSystem,
          includeDeployGuide,
          includeApiDocs,
          includeTestSpecs,
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
              briefRef.current += content;
              setGeneratedBrief(briefRef.current);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      clearInterval(interval);
      setProgress(100);
      setGenerationPhase("Brief generated successfully!");

      // Save to database
      if (briefRef.current) {
        if (!user) {
          throw new Error("Your session expired before saving. Please sign in again and retry.");
        }

        const { error: insertError } = await supabase.from("generated_reports").insert({
          user_id: user.id,
          user_email: user.email,
          project_name: appName,
          report_type: "ai-brief",
          content: briefRef.current,
          metadata: {
            category: appCategories.find((c) => c.id === selectedCategory)?.label || selectedCategory,
            tier: selectedTier,
            platforms: selectedPlatforms,
            features: selectedFeatures.map((fId) => featureModules.find((f) => f.id === fId)?.label || fId),
            tech: selectedTech,
            targetAudience,
            monetization,
            includeDesignSystem,
            includeDeployGuide,
            includeApiDocs,
            includeTestSpecs,
          },
        });

        if (insertError) {
          throw new Error(`Failed to save brief: ${insertError.message}`);
        }
      }
    } catch (err) {
      console.error("Brief generation error:", err);
      clearInterval(interval);
      setGenerationError(err instanceof Error ? err.message : "Failed to generate brief");
    } finally {
      setGenerating(false);
    }
  };

  const tierData = pricingTiers.find((t) => t.id === selectedTier)!;
  const specCount = selectedFeatures.length + selectedPlatforms.length + Object.keys(selectedTech).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-bricolage flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            FlashApps Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered project brief generator — complete specs in 8-15 seconds
          </p>
        </div>
        <Badge variant="outline" className="border-primary/40 text-primary self-start sm:self-auto gap-1">
          <Zap className="h-3 w-3" /> Quantum AI Engine v3.0
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Avg Generation", value: "12s", icon: Clock, accent: "text-secondary" },
          { label: "Briefs Created", value: "128", icon: FileText, accent: "text-primary" },
          { label: "Success Rate", value: "100%", icon: CheckCircle, accent: "text-green-400" },
          { label: "Specifications", value: `${specCount}`, icon: Layers, accent: "text-deep-purple-500" },
        ].map((s) => (
          <Card key={s.label} className="dark-slate-purple-card">
            <CardContent className="pt-5 pb-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.accent} shrink-0`} />
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 w-full justify-start flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="configure" className="gap-1.5 data-[state=active]:bg-background">
            <Settings className="h-3.5 w-3.5" /> Configure
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-1.5 data-[state=active]:bg-background">
            <Package className="h-3.5 w-3.5" /> Features
          </TabsTrigger>
          <TabsTrigger value="tech" className="gap-1.5 data-[state=active]:bg-background">
            <Code className="h-3.5 w-3.5" /> Tech Stack
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-1.5 data-[state=active]:bg-background">
            <CreditCard className="h-3.5 w-3.5" /> Pricing
          </TabsTrigger>
          <TabsTrigger value="generate" className="gap-1.5 data-[state=active]:bg-background">
            <Rocket className="h-3.5 w-3.5" /> Generate
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 data-[state=active]:bg-background">
            <Clock className="h-3.5 w-3.5" /> History
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Configure ─────────────────────────────── */}
        <TabsContent value="configure" className="space-y-6 mt-4">
          {/* Basic Info */}
          <Card className="dark-slate-purple-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-5 w-5 text-primary" /> Project Details
              </CardTitle>
              <CardDescription>Define the core identity of your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>App Name *</Label>
                  <Input value={appName} onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., SmartFit Pro" className="bg-background border-input" />
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Fitness enthusiasts aged 25-45" className="bg-background border-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>App Description</Label>
                <Textarea value={appDescription} onChange={(e) => setAppDescription(e.target.value)}
                  placeholder="Describe your app idea, core value proposition, and key user flows..."
                  className="bg-background border-input" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Monetization Strategy</Label>
                <Input value={monetization} onChange={(e) => setMonetization(e.target.value)}
                  placeholder="e.g., Freemium with $9.99/mo Pro tier" className="bg-background border-input" />
              </div>
              <Separator className="bg-border/50" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label htmlFor="design-system" className="text-sm cursor-pointer">Include Design System</Label>
                  <Switch id="design-system" checked={includeDesignSystem} onCheckedChange={setIncludeDesignSystem} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label htmlFor="deploy-guide" className="text-sm cursor-pointer">Include Deploy Guide</Label>
                  <Switch id="deploy-guide" checked={includeDeployGuide} onCheckedChange={setIncludeDeployGuide} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label htmlFor="api-docs" className="text-sm cursor-pointer">Include API Documentation</Label>
                  <Switch id="api-docs" checked={includeApiDocs} onCheckedChange={setIncludeApiDocs} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label htmlFor="test-specs" className="text-sm cursor-pointer">Include Test Specifications</Label>
                  <Switch id="test-specs" checked={includeTestSpecs} onCheckedChange={setIncludeTestSpecs} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Category */}
          <Card className="dark-slate-purple-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layout className="h-5 w-5 text-secondary" /> App Category *
              </CardTitle>
              <CardDescription>Select the type of application you want to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {appCategories.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:border-primary/50 ${
                      selectedCategory === cat.id
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/5"
                        : "border-border bg-background/50"
                    }`}>
                    <cat.icon className={`h-6 w-6 ${selectedCategory === cat.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium text-foreground">{cat.label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight">{cat.desc}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Targets */}
          <Card className="dark-slate-purple-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" /> Platform Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {platforms.map((p) => (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                      selectedPlatforms.includes(p.id)
                        ? "border-secondary bg-secondary/10"
                        : "border-border bg-background/50"
                    }`}>
                    <p.icon className={`h-5 w-5 ${selectedPlatforms.includes(p.id) ? "text-secondary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium text-foreground">{p.label}</span>
                    {selectedPlatforms.includes(p.id) && <CheckCircle className="h-4 w-4 text-secondary ml-auto" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab("features")} className="accent-gradient text-primary-foreground gap-2">
              Next: Features <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ── Tab: Features ──────────────────────────────── */}
        <TabsContent value="features" className="space-y-6 mt-4">
          <Card className="dark-slate-purple-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" /> Feature Modules
              </CardTitle>
              <CardDescription>
                Select the features to include — {selectedFeatures.length} of {featureModules.length} selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {featureModules.map((feat) => (
                  <button key={feat.id} onClick={() => toggleFeature(feat.id)}
                    className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all hover:border-primary/40 ${
                      selectedFeatures.includes(feat.id)
                        ? "border-primary/60 bg-primary/5"
                        : "border-border bg-background/50"
                    }`}>
                    <feat.icon className={`h-5 w-5 mt-0.5 shrink-0 ${
                      selectedFeatures.includes(feat.id) ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{feat.label}</span>
                        {selectedFeatures.includes(feat.id) && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{feat.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("configure")} className="gap-2">
              Back
            </Button>
            <Button onClick={() => setActiveTab("tech")} className="accent-gradient text-primary-foreground gap-2">
              Next: Tech Stack <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ── Tab: Tech Stack ────────────────────────────── */}
        <TabsContent value="tech" className="space-y-6 mt-4">
          {(Object.entries(techOptions) as [keyof typeof techOptions, typeof techOptions[keyof typeof techOptions]][]).map(
            ([group, options]) => (
              <Card key={group} className="dark-slate-purple-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base capitalize">{group}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {options.map((opt) => (
                      <button key={opt.id}
                        onClick={() => setSelectedTech((prev) => ({ ...prev, [group]: opt.id }))}
                        className={`rounded-lg border p-3 text-sm font-medium text-center transition-all ${
                          selectedTech[group] === opt.id
                            ? "border-secondary bg-secondary/10 text-secondary"
                            : "border-border bg-background/50 text-muted-foreground hover:text-foreground"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("features")} className="gap-2">
              Back
            </Button>
            <Button onClick={() => setActiveTab("pricing")} className="accent-gradient text-primary-foreground gap-2">
              Next: Pricing <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ── Tab: Pricing ───────────────────────────────── */}
        <TabsContent value="pricing" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingTiers.map((tier) => (
              <Card key={tier.id}
                className={`relative cursor-pointer transition-all ${
                  selectedTier === tier.id
                    ? "dark-slate-purple-card border-primary/50 shadow-lg shadow-primary/10 scale-[1.02]"
                    : "dark-slate-purple-card hover:border-primary/20"
                }`}
                onClick={() => setSelectedTier(tier.id)}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="accent-gradient text-primary-foreground gap-1">
                      <Star className="h-3 w-3" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-6">
                  <CardTitle className={`text-lg ${tier.color}`}>{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                    <span className="text-muted-foreground text-sm"> / brief</span>
                  </div>
                  <Badge variant="outline" className="mt-2 mx-auto">{tier.badge}</Badge>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4 bg-border/50" />
                  <ul className="space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${tier.color}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {selectedTier === tier.id && (
                    <div className="mt-4 text-center">
                      <Badge className="accent-gradient text-primary-foreground">Selected</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("tech")} className="gap-2">
              Back
            </Button>
            <Button onClick={handleGenerate}
              disabled={generating || !appName.trim() || !selectedCategory}
              className="accent-gradient text-primary-foreground gap-2 px-8">
              Generate Brief <Rocket className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* ── Tab: Generate ──────────────────────────────── */}
        <TabsContent value="generate" className="space-y-6 mt-4">
          {generating ? (
            <Card className="dark-slate-purple-card border-primary/30">
              <CardContent className="py-12 space-y-6">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-primary mx-auto animate-pulse" />
                  <h3 className="text-xl font-bold text-foreground mb-1 mt-4">Gemini AI Generating Brief</h3>
                  <p className="text-muted-foreground">{generationPhase}</p>
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                </div>
                {generatedBrief && (
                  <div className="glass-effect rounded-lg p-6 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{generatedBrief}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : generationError ? (
            <Card className="dark-slate-purple-card border-destructive/30">
              <CardContent className="py-10 text-center space-y-4">
                <h3 className="text-xl font-bold text-foreground">Generation Failed</h3>
                <p className="text-destructive">{generationError}</p>
                <Button onClick={() => { setGenerationError(""); setActiveTab("configure"); }} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : progress >= 100 ? (
            <Card className="dark-slate-purple-card border-primary/30">
              <CardContent className="py-10 space-y-6">
                <div className="text-center">
                  <CheckCircle className="h-14 w-14 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-1">Brief Generated Successfully!</h3>
                  <p className="text-muted-foreground">Your comprehensive project brief is ready</p>
                </div>

                {/* Generated Brief Content */}
                {generatedBrief && (
                  <div className="glass-effect rounded-lg p-6 max-h-[60vh] overflow-y-auto">
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{generatedBrief}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Brief Summary */}
                <div className="glass-effect rounded-lg p-6 space-y-4 max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Project:</span> <span className="font-medium text-foreground ml-1">{appName}</span></div>
                    <div><span className="text-muted-foreground">Category:</span> <span className="font-medium text-foreground ml-1">{appCategories.find((c) => c.id === selectedCategory)?.label}</span></div>
                    <div><span className="text-muted-foreground">Tier:</span> <span className={`font-medium ml-1 ${tierData.color}`}>{tierData.name} (${tierData.price})</span></div>
                    <div><span className="text-muted-foreground">Features:</span> <span className="font-medium text-foreground ml-1">{selectedFeatures.length} modules</span></div>
                    <div><span className="text-muted-foreground">Platforms:</span> <span className="font-medium text-foreground ml-1">{selectedPlatforms.length} targets</span></div>
                    <div><span className="text-muted-foreground">Pages Est.:</span> <span className="font-medium text-foreground ml-1">{selectedFeatures.length * 4 + 8} pages</span></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" className="gap-2" onClick={() => {
                    setProgress(0);
                    setGeneratedBrief("");
                    setActiveTab("configure");
                  }}>
                    <RefreshCw className="h-4 w-4" /> New Generation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="dark-slate-purple-card">
              <CardContent className="py-16 text-center space-y-4">
                <Rocket className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium text-foreground">Ready to Generate</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Configure your project settings, select features, choose your tech stack & pricing tier, then hit Generate.
                </p>
                <Button onClick={() => setActiveTab("configure")} variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" /> Start Configuring
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Tab: History ────────────────────────────────── */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card className="dark-slate-purple-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Generation History</CardTitle>
                <Badge variant="outline">{previousGenerations.length} briefs</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {previousGenerations.map((gen) => (
                <div key={gen.id} className="glass-effect rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{gen.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span>{gen.niche}</span>
                        <Badge variant="outline" className="text-[10px] h-5">{gen.tier}</Badge>
                        <span>{gen.pages} pages</span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-primary" /> {gen.time}
                        </span>
                        <span>{gen.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" /> PDF
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
