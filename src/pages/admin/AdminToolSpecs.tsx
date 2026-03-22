import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  FileText,
  Zap,
  Lightbulb,
  Cpu,
  Database,
  Globe,
  Shield,
  Code,
  Layers,
  Brain,
  Rocket,
  MessageSquare,
  Image,
  Upload,
  CheckCircle,
  Clock,
  DollarSign,
  Settings,
} from "lucide-react";

const toolSpecs = [
  {
    id: "flash-apps",
    title: "FlashApps Generator",
    icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10",
    version: "2.0",
    status: "Production",
    description:
      "Multi-step wizard that guides clients through app configuration and generates comprehensive AI project briefs.",
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
      ai: ["Gemini 2.5 Flash (Brief Generation)"],
      backend: ["Lovable Cloud Edge Functions", "SSE Streaming"],
    },
    features: [
      "12 app categories (SaaS, E-Commerce, FinTech, HealthTech, etc.)",
      "12 selectable feature modules (Auth, Payments, Analytics, etc.)",
      "Multi-platform targeting (iOS, Android, Web, Desktop, PWA)",
      "3 pricing tiers: Starter ($149), Professional ($299), Enterprise ($499)",
      "Frontend/Backend/Database tech stack selection",
      "Optional design system, deployment guide, API docs, test specs",
      "Real-time SSE streaming with animated progress simulation",
      "Markdown-rendered output with section navigation",
    ],
    dataFlow: [
      "User completes multi-tab wizard (Configure → Features → Tech → Pricing → Generate)",
      "Configuration payload sent to `ai-brief` edge function",
      "Gemini 2.5 Flash generates comprehensive project brief",
      "Response streamed via SSE to frontend",
      "Brief rendered in Markdown with copy/export options",
    ],
    endpoints: [
      {
        name: "ai-brief",
        method: "POST",
        model: "Gemini 2.5 Flash",
        input: "appName, appDescription, category, tier, platforms, features, tech, targetAudience, monetization, includeDesignSystem, includeDeployGuide, includeApiDocs, includeTestSpecs",
        output: "SSE stream → Markdown brief",
      },
    ],
    database: ["No direct database writes (briefs displayed in-session)"],
    security: ["Authenticated users only (ProtectedRoute)", "Bearer token auth on edge function"],
  },
  {
    id: "generated-briefs",
    title: "Generated Summaries & Reports",
    icon: FileText,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    version: "1.0",
    status: "Production",
    description:
      "Central repository of all AI-generated reports from the Idea → Blueprint pipeline, including discovery interviews, architecture specs, UX blueprints, and consensus reports.",
    techStack: {
      frontend: ["React", "TypeScript", "ReactMarkdown"],
      ai: ["Claude Sonnet 4 (Interviews)", "GPT-4o (Architecture)", "Gemini 2.5 Flash (UX/Consensus)"],
      backend: ["Lovable Cloud (PostgreSQL)", "RLS Policies"],
    },
    features: [
      "4 report types: Discovery Interview, Architecture Spec, UX Blueprint, Consensus Report",
      "Full Markdown rendering with prose styling",
      "Search by project name or user email",
      "Filter by report type",
      "Per-report metadata and character count stats",
      "User-scoped access (own reports) + Admin full access",
    ],
    dataFlow: [
      "Reports generated during Idea → Blueprint pipeline execution",
      "Each step saves to `generated_reports` table with type, content, metadata",
      "Dashboard page queries user's own reports",
      "Admin panel queries all reports across users",
    ],
    endpoints: [],
    database: [
      "Table: `generated_reports` — id, user_id, user_email, project_name, report_type, content (text), metadata (jsonb), created_at",
      "RLS: Users read own reports; Admins read all; Users insert own",
    ],
    security: [
      "Row-Level Security enforced",
      "user_id = auth.uid() for user access",
      "has_role(admin) for admin access",
    ],
  },
  {
    id: "quantum-optimization",
    title: "Quantum Optimization",
    icon: Zap,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    version: "1.0",
    status: "Production",
    description:
      "AI-powered performance analysis dashboard showing KPI metrics, optimization recommendations, and implementation timelines for client projects.",
    techStack: {
      frontend: ["React", "TypeScript", "Progress components", "Badge system"],
      ai: ["Presentational (metrics-driven UI)"],
      backend: ["Client-side rendering"],
    },
    features: [
      "4 KPI metric cards: Performance, Security, SEO, Accessibility",
      "Color-coded scoring system (green/yellow/red thresholds)",
      "Active optimization task tracker with severity levels",
      "Multi-phase implementation timeline with progress bars",
      "Run Full Scan action trigger",
    ],
    dataFlow: [
      "Metrics displayed from structured data objects",
      "Optimization tasks shown with status/improvement percentages",
      "Timeline phases rendered with completion progress",
    ],
    endpoints: [],
    database: ["No direct database integration (dashboard-local data)"],
    security: ["Authenticated users only (ProtectedRoute)"],
  },
  {
    id: "idea-to-blueprint",
    title: "Idea → Action Plan (Blueprint Pipeline)",
    icon: Lightbulb,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    version: "2.0",
    status: "Production",
    description:
      "Multi-step AI pipeline transforming project visions into technical specifications through conversational discovery, architecture mapping, UX blueprinting, and consensus synthesis.",
    techStack: {
      frontend: ["React", "TypeScript", "ReactMarkdown", "File Upload/Preview"],
      ai: [
        "Claude Sonnet 4 (Discovery Interview — Multimodal)",
        "GPT-4o (Architecture Specification)",
        "Gemini 2.5 Flash (UX Blueprint + Consensus Report)",
      ],
      backend: ["4 Edge Functions", "SSE Streaming", "Lovable Cloud (PostgreSQL)"],
    },
    features: [
      "3 scope presets: Interview Only, Interview + Report, Full Pipeline",
      "Multimodal discovery interview (text + images + documents)",
      "Real-time chat interface with streaming AI responses",
      "Automatic interview completion detection via [INTERVIEW_COMPLETE] marker",
      "Architecture spec generation from interview transcript",
      "UX Blueprint generation from interview + architecture",
      "Consensus report synthesizing all 3 AI perspectives",
      "Step-by-step progress tracking with visual indicators",
      "All reports saved to database for future reference",
      "Pipeline reset and re-run capability",
    ],
    dataFlow: [
      "1. User selects scope (interview-only / interview-report / full-pipeline)",
      "2. Conversational interview via `idea-interview` (Claude) — supports image/doc uploads",
      "3. On [INTERVIEW_COMPLETE], transcript sent to `idea-architecture` (GPT-4o)",
      "4. Architecture spec + transcript sent to `idea-ux-blueprint` (Gemini)",
      "5. All outputs sent to `idea-consensus` (Gemini) for synthesis",
      "6. Each step's output saved to `generated_reports` table",
    ],
    endpoints: [
      {
        name: "idea-interview",
        method: "POST",
        model: "Claude Sonnet 4",
        input: "messages[] (text + multimodal content)",
        output: "SSE stream → interview responses",
      },
      {
        name: "idea-architecture",
        method: "POST",
        model: "GPT-4o",
        input: "interviewSummary (full transcript)",
        output: "SSE stream → architecture markdown",
      },
      {
        name: "idea-ux-blueprint",
        method: "POST",
        model: "Gemini 2.5 Flash",
        input: "interviewSummary, architectureSpec",
        output: "SSE stream → UX blueprint markdown",
      },
      {
        name: "idea-consensus",
        method: "POST",
        model: "Gemini 2.5 Flash",
        input: "interviewSummary, architectureSpec, uxBlueprint",
        output: "SSE stream → consensus report markdown",
      },
    ],
    consensusReportStructure: [
      "Executive Summary — What we're building, for whom, key differentiators, expected impact (3-4 paragraphs)",
      "Project Scope & Deliverables — Numbered MVP scope, Phase 1 vs Future Enhancements separation",
      "Cost Estimate — Table: Phase | Description | Estimated Cost | Timeline (calibrated: $500–$15k, days not months)",
      "Risk Assessment — Top 5-8 risks table: Risk | Probability | Impact | Mitigation",
      "Recommended Team Composition — Lean roles for AI-assisted dev (1-2 devs with AI tools vs traditional teams)",
      "Technology Decisions (Final) — Consolidated tech stack with justifications (React/Next.js, Supabase, Vercel, etc.)",
      "Implementation Roadmap — Day-by-day or sprint-by-sprint plan, MVP targeting days not months",
      "Key Metrics & Success Criteria — Measurable KPIs to determine project success",
      "Client Action Items — What the client must provide/decide before development begins",
      "Next Steps — Immediate actions to kick off the project, emphasizing speed",
    ],
    database: [
      "Table: `generated_reports` — stores each step's output",
      "report_type values: interview, architecture, ux_blueprint, consensus",
      "Metadata includes step info and generation timestamps",
    ],
    security: [
      "Authenticated users only",
      "Bearer token on all edge function calls",
      "RLS on generated_reports table",
      "Multimodal content processed server-side (no client storage)",
    ],
    pricing: {
      calibration: "AI-assisted development cycles",
      turnaround: "24 hours to 3 weeks",
      range: "$500 – $15,000",
    },
  },
];

export default function AdminToolSpecs() {
  const [activeTab, setActiveTab] = useState("flash-apps");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          Tool Specifications
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete technical reference for all platform tools — for the development team.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {toolSpecs.map((tool) => (
          <Card
            key={tool.id}
            className={`cursor-pointer transition-all hover:border-primary/40 ${
              activeTab === tool.id ? "border-primary/60 ring-1 ring-primary/20" : ""
            }`}
            onClick={() => setActiveTab(tool.id)}
          >
            <CardContent className="p-4 text-center">
              <tool.icon className={`h-8 w-8 mx-auto mb-2 ${tool.color}`} />
              <p className="text-sm font-semibold text-foreground">{tool.title}</p>
              <Badge variant="outline" className="mt-2 text-xs">
                v{tool.version} · {tool.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {toolSpecs.map((tool) => (
            <TabsTrigger key={tool.id} value={tool.id} className="gap-1.5">
              <tool.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tool.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {toolSpecs.map((tool) => (
          <TabsContent key={tool.id} value={tool.id} className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Overview */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                      <tool.icon className={`h-6 w-6 ${tool.color}`} />
                    </div>
                    <div>
                      <CardTitle>{tool.title}</CardTitle>
                      <CardDescription className="mt-1">{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Tech Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(tool.techStack).map(([layer, techs]) => (
                    <div key={layer}>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-1.5">
                        {layer}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {techs.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    Features & Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-64">
                    <ul className="space-y-2">
                      {tool.features.map((f, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Data Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-muted-foreground" />
                    Data Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {tool.dataFlow.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="bg-primary/20 text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Security & Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.security.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Shield className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              {tool.endpoints.length > 0 && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      API Endpoints (Edge Functions)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tool.endpoints.map((ep, i) => (
                        <div key={i} className="bg-muted/30 rounded-lg p-3 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                              {ep.method}
                            </Badge>
                            <code className="text-sm font-mono text-foreground">/functions/v1/{ep.name}</code>
                            <Badge variant="outline" className="text-xs ml-auto">
                              {ep.model}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Input:</span> {ep.input}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Output:</span> {ep.output}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Database */}
              <Card className={tool.endpoints.length > 0 ? "" : "md:col-span-2"}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.database.map((d, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">{d}</code>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pricing (if available) */}
              {"pricing" in tool && tool.pricing && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Pricing Calibration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Turnaround</span>
                      <span className="text-foreground font-medium">{tool.pricing.turnaround}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price Range</span>
                      <span className="text-foreground font-medium">{tool.pricing.range}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Calibrated For</span>
                      <span className="text-foreground font-medium">{tool.pricing.calibration}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
