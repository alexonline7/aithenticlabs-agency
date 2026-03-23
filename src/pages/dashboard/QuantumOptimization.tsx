import { useState, useRef, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import {
  Zap, Brain, Shield, Globe, Cpu, Wifi, Eye, BarChart3, Lock, Cloud,
  Smartphone, Monitor, Loader2, CheckCircle, ChevronRight, ChevronLeft,
  Sparkles, FileText, Server, Database, Bot, Gauge, Layers, Rocket,
  Target, TrendingUp, Users, Lightbulb, Timer, Atom, Crown, Flame,
  ArrowRight, CircuitBoard, MessageSquare, Play, Briefcase, Search,
  Wrench, DollarSign, Star, Trophy, Settings, Blocks, PenTool,
  ShieldCheck, Gem, Crosshair, Workflow, Scale, Fingerprint,
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

/* ── Quantum Optimization Transformation Modules ──────── */
interface IntelligenceLayer {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const INTELLIGENCE_LAYERS: IntelligenceLayer[] = [
  { id: "tool-definition", label: "Tool Definition", shortLabel: "Definition", icon: Workflow, color: "text-primary", description: "Engine behavior: tool-first, not marketing content" },
  { id: "core-user-action", label: "Core User Action", shortLabel: "Core Action", icon: Target, color: "text-primary", description: "Intent → structured app blueprint in one flow" },
  { id: "input-model", label: "Input Model", shortLabel: "Input", icon: MessageSquare, color: "text-primary", description: "Niche, app idea, workflow, customer, and outcome capture" },
  { id: "generation-modes", label: "Generation Modes", shortLabel: "Modes", icon: Play, color: "text-primary", description: "Instant, Premium, Build-Ready, Market-Domination" },
  { id: "quantum-behavior", label: "Quantum Behavior", shortLabel: "Quantum", icon: Atom, color: "text-primary", description: "Rapid staged generation for 8-15 second execution" },
  { id: "output-structure", label: "Output Structure", shortLabel: "Structure", icon: FileText, color: "text-primary", description: "Enforces the 9-section blueprint framework" },
  { id: "phase-conversion", label: "Phase Conversion", shortLabel: "Phase Logic", icon: Layers, color: "text-primary", description: "Converts 4 phases into internal intelligence routing" },
  { id: "tech-stack", label: "Tech Stack Logic", shortLabel: "Tech Stack", icon: Server, color: "text-primary", description: "Maps architecture recommendations by concept and niche" },
  { id: "pricing", label: "Pricing Intelligence", shortLabel: "Pricing", icon: DollarSign, color: "text-primary", description: "Tier logic, setup fees, and commercial positioning" },
  { id: "trend-engine", label: "Trend Engine", shortLabel: "Trend", icon: TrendingUp, color: "text-primary", description: "Generates adjacent opportunities and innovation angles" },
  { id: "qa", label: "Quality Assurance", shortLabel: "QA", icon: ShieldCheck, color: "text-primary", description: "7-criteria refinement before final output" },
  { id: "niche", label: "Niche Specialization", shortLabel: "Niche", icon: Crosshair, color: "text-primary", description: "Domain-specific workflows, language, and integrations" },
  { id: "originality", label: "Originality Enforcement", shortLabel: "Originality", icon: Fingerprint, color: "text-primary", description: "Anti-template filtering and differentiation checks" },
  { id: "admin-scale", label: "Admin + Scale Logic", shortLabel: "Admin+Scale", icon: Scale, color: "text-primary", description: "Operational systems, support flows, and scaling controls" },
  { id: "monetization", label: "Monetization Leverage", shortLabel: "Monetization", icon: Gem, color: "text-primary", description: "Revenue architecture, retention mechanics, and upsell paths" },
  { id: "buildability", label: "Buildability Layer", shortLabel: "Buildability", icon: Wrench, color: "text-primary", description: "MVP realism, dependency path, and implementation order" },
  { id: "tool-personality", label: "Tool Personality", shortLabel: "Personality", icon: Crown, color: "text-primary", description: "Strategist + architect + founder + operator + analyst tone" },
  { id: "final-synthesis", label: "Final Synthesis", shortLabel: "Synthesis", icon: Rocket, color: "text-primary", description: "Combines all modules into a premium buildable blueprint" },
];

const FULL_TRANSFORMATION_STACK = INTELLIGENCE_LAYERS.map((layer) => layer.id);

const MODE_LAYERS: Record<string, string[]> = {
  "instant-concept": [
    "tool-definition",
    "core-user-action",
    "input-model",
    "generation-modes",
    "quantum-behavior",
    "output-structure",
    "phase-conversion",
    "tech-stack",
    "pricing",
    "qa",
    "niche",
    "originality",
    "monetization",
    "buildability",
    "tool-personality",
    "final-synthesis",
  ],
  "premium-blueprint": FULL_TRANSFORMATION_STACK,
  "build-ready": FULL_TRANSFORMATION_STACK,
  "market-domination": FULL_TRANSFORMATION_STACK,
};

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
  sections: string;
  personality: string;
}

const GENERATION_MODES: GenerationMode[] = [
  {
    id: "instant-concept",
    label: "Instant Concept",
    tagline: "Lightning-fast strategic clarity",
    description: "Sharp app concept with pricing intelligence, niche specialization, MVP definition, and monetization logic. Built to validate fast.",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    speed: "~8s",
    depth: "16 modules",
    sections: "9 sections",
    personality: "Fast-launch founder mode",
  },
  {
    id: "premium-blueprint",
    label: "Premium Blueprint",
    tagline: "Full product architecture",
    description: "Comprehensive blueprint with UX strategy, go-to-market plan, revenue architecture table, buildability roadmap, and adjacent opportunities.",
    icon: Blocks,
    color: "from-blue-500 to-cyan-500",
    speed: "~12s",
    depth: "18 modules",
    sections: "12+ sections",
    personality: "Product strategist + architect",
  },
  {
    id: "build-ready",
    label: "Build-Ready Scope",
    tagline: "Developer-ready specification",
    description: "Database schemas, API specs, phased implementation with acceptance criteria, dependency manifest with costs, and admin architecture.",
    icon: Wrench,
    color: "from-green-500 to-emerald-500",
    speed: "~14s",
    depth: "18 modules",
    sections: "16+ sections",
    personality: "Senior technical architect",
  },
  {
    id: "market-domination",
    label: "Market Domination",
    tagline: "Total competitive blueprint",
    description: "Competitive annihilation strategy, AI/ML deep dive, revenue engine with projections, viral systems, and investment-ready metrics. Maximum depth.",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    speed: "~15s",
    depth: "18 modules MAX",
    sections: "17+ sections",
    personality: "Visionary strategist — $500/hr output",
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

interface QuantumPhase {
  id: string;
  text: string;
  icon: React.ElementType;
  layerId?: string;
}

const TRANSFORMATION_PHASES: QuantumPhase[] = [
  { id: "tool-definition", layerId: "tool-definition", text: "1/18 Tool Definition — configuring generator behavior as an execution engine…", icon: Workflow },
  { id: "core-user-action", layerId: "core-user-action", text: "2/18 Core User Action — locking the intent → blueprint workflow…", icon: Target },
  { id: "input-model", layerId: "input-model", text: "3/18 Input Model — parsing niche, user type, value opportunity, and constraints…", icon: MessageSquare },
  { id: "generation-modes", layerId: "generation-modes", text: "4/18 Mode Orchestration — selecting depth profile for this run…", icon: Play },
  { id: "quantum-behavior", layerId: "quantum-behavior", text: "5/18 Quantum Behavior — executing staged 8-15 second synthesis…", icon: Atom },
  { id: "output-structure", layerId: "output-structure", text: "6/18 Output Structure — enforcing the 9-section blueprint schema…", icon: FileText },
  { id: "phase-conversion", layerId: "phase-conversion", text: "7/18 Phase Conversion — routing through internal intelligence layers…", icon: Layers },
  { id: "tech-stack", layerId: "tech-stack", text: "8/18 Tech Stack Logic — mapping implementation-ready architecture…", icon: Server },
  { id: "pricing", layerId: "pricing", text: "9/18 Pricing Intelligence — generating tier, setup, and upgrade logic…", icon: DollarSign },
  { id: "trend-engine", layerId: "trend-engine", text: "10/18 Trend Engine — injecting adjacent opportunities and innovation paths…", icon: TrendingUp },
  { id: "qa", layerId: "qa", text: "11/18 QA Gate — refining clarity, originality, feasibility, and scale…", icon: ShieldCheck },
  { id: "niche", layerId: "niche", text: "12/18 Niche Specialization — applying domain workflows and terminology…", icon: Crosshair },
  { id: "originality", layerId: "originality", text: "13/18 Originality Filter — rejecting boilerplate and enforcing differentiation…", icon: Fingerprint },
  { id: "admin-scale", layerId: "admin-scale", text: "14/18 Admin + Scale — adding operational systems and growth controls…", icon: Scale },
  { id: "monetization", layerId: "monetization", text: "15/18 Monetization Leverage — defining revenue architecture and retention mechanics…", icon: Gem },
  { id: "buildability", layerId: "buildability", text: "16/18 Buildability — sequencing MVP, dependencies, and ship-now scope…", icon: Wrench },
  { id: "tool-personality", layerId: "tool-personality", text: "17/18 Tool Personality — applying strategist + architect + founder mindset…", icon: Crown },
  { id: "final-synthesis", layerId: "final-synthesis", text: "18/18 Final Synthesis — packaging a premium, actionable blueprint…", icon: Rocket },
];

const getModePhases = (mode: string) => {
  const activeLayerIds = new Set(MODE_LAYERS[mode] || MODE_LAYERS["premium-blueprint"]);
  return TRANSFORMATION_PHASES.filter((phase) => phase.layerId && activeLayerIds.has(phase.layerId));
};

type ValidationResult = { id: string; label: string; passed: boolean; evidence: string[]; critical: boolean };
type ValidationGroupResult = { id: string; title: string; description: string; passed: number; total: number; checks: ValidationResult[] };
type ValidationSummary = { groups: ValidationGroupResult[]; totalPassed: number; totalChecks: number; criticalFailures: ValidationResult[] };
type SectionCoverageItem = { label: string; found: boolean };
type BlueprintEvidenceMap = { buildability: string[]; personality: string[]; synthesis: string[] };
type WorkflowProofItem = { id: string; label: string; passed: boolean; evidence: string };

type RegexEvidence = { pattern: RegExp; hint: string };

const STRICT_ENFORCEMENT_APPENDIX = [
  "Strict enforcement requirements:",
  "- Include a sensible MVP with exactly what ships in 1-3 days.",
  "- Provide a clear implementation order (Day 1, Day 2, Day 3, Week 2).",
  "- Include stack recommendations and dependency manifest with costs.",
  "- Explicitly split ship-now vs delay-later scope.",
  "- Identify the single highest-leverage feature to build first.",
  "- Keep the tone sharp, premium, visionary, commercially intelligent, and technically grounded.",
].join("\n");

const ENFORCEMENT_RULES = [
  "Sensible MVP (1–3 day scope)",
  "Implementation order (Day 1 / Day 2 / Day 3 / Week 2)",
  "Stack recommendations and dependency manifest",
  "Ship-now vs delay-later decisions",
  "Highest-leverage-first execution logic",
  "Sharp premium strategist/founder/architect tone",
];

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSectionCoverage = (blueprintContent: string): SectionCoverageItem[] => {
  const normalized = blueprintContent.trim();
  if (!normalized) {
    return SECTION_LABELS.map((label) => ({ label, found: false }));
  }

  return SECTION_LABELS.map((label) => {
    const pattern = new RegExp(`^##\\s+(?:\\d+\\.\\s*)?${escapeRegex(label)}`, "im");
    return { label, found: pattern.test(normalized) };
  });
};

const extractEvidenceLines = (blueprintContent: string, patterns: RegExp[], limit = 4) => {
  const lines = blueprintContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const matches: string[] = [];
  for (const line of lines) {
    if (patterns.some((pattern) => pattern.test(line))) {
      matches.push(line.replace(/^[-*]\s*/, ""));
    }
    if (matches.length >= limit) break;
  }
  return matches;
};

const extractBlueprintEvidence = (blueprintContent: string): BlueprintEvidenceMap => {
  if (!blueprintContent.trim()) {
    return { buildability: [], personality: [], synthesis: [] };
  }

  return {
    buildability: extractEvidenceLines(blueprintContent, [/\bmvp\b/i, /day\s*1|phase\s*1|implementation/i, /dependenc|third-party|integrations/i, /ship\s*now|delay|can wait/i]),
    personality: extractEvidenceLines(blueprintContent, [/pricing|revenue|retention|upsell|margin/i, /architecture|api|schema|database/i, /category|moat|market|trend/i]),
    synthesis: extractEvidenceLines(blueprintContent, [/execution summary/i, /launch logic/i, /expansion logic/i, /quality|qa|criteria/i]),
  };
};

const buildWorkflowProof = (params: {
  projectName: string;
  appIdea: string;
  nicheLabel: string;
  sectionCoverage: SectionCoverageItem[];
  validationSummary: ValidationSummary;
}) => {
  const { projectName, appIdea, nicheLabel, sectionCoverage, validationSummary } = params;
  const sectionCount = sectionCoverage.filter((section) => section.found).length;
  const criticalFailures = validationSummary.criticalFailures.length;

  const steps: WorkflowProofItem[] = [
    {
      id: "step-1",
      label: "1) App concept captured",
      passed: Boolean(projectName.trim() && (appIdea.trim() || nicheLabel.trim())),
      evidence: projectName ? `Project: ${projectName}` : "Project name missing",
    },
    {
      id: "step-2",
      label: "2) Niche/value analysis executed",
      passed: sectionCoverage.some((section) => section.label === "Strategic Concept" && section.found),
      evidence: sectionCoverage.some((section) => section.label === "Strategic Concept" && section.found)
        ? "Strategic Concept section present"
        : "Strategic Concept section missing",
    },
    {
      id: "step-3",
      label: "3) Structured blueprint assembled",
      passed: sectionCount >= 7,
      evidence: `${sectionCount}/9 required core sections found`,
    },
    {
      id: "step-4",
      label: "4) Strategic + technical + monetization outputs present",
      passed: validationSummary.groups.length > 0 && validationSummary.groups.every((group) => group.passed >= Math.ceil(group.total * 0.5)),
      evidence: `${validationSummary.totalPassed}/${validationSummary.totalChecks} validation checks passed`,
    },
    {
      id: "step-5",
      label: "5) Refinement/regeneration path available",
      passed: true,
      evidence: criticalFailures > 0 ? "Strict regeneration available for missing critical checks" : "Regeneration controls available",
    },
  ];

  return steps;
};

const runRegexValidation = (checks: { id: string; label: string; critical?: boolean; evidence: RegexEvidence[] }[], text: string): ValidationResult[] =>
  checks.map((check) => {
    const evidence = check.evidence.filter((item) => item.pattern.test(text)).map((item) => item.hint);
    return {
      id: check.id,
      label: check.label,
      passed: evidence.length > 0,
      evidence,
      critical: check.critical !== false,
    };
  });

const SECTION_LABELS = [
  "App Identity",
  "Strategic Concept",
  "Core System",
  "Feature Architecture",
  "Technical Architecture",
  "Business Model",
  "Launch Logic",
  "Expansion Logic",
  "Execution Summary",
];

const buildValidationSummary = (blueprintContent: string): ValidationSummary => {
  const normalized = blueprintContent.trim();

  if (!normalized) {
    return { groups: [], totalPassed: 0, totalChecks: 0, criticalFailures: [] };
  }

  const buildabilityChecks = runRegexValidation([
    { id: "mvp", label: "Sensible MVP defined", evidence: [{ pattern: /\bmvp\b|minimum viable/i, hint: "MVP" }] },
    { id: "order", label: "Implementation order included", evidence: [{ pattern: /implementation order|day\s*1|phase\s*1|roadmap|timeline/i, hint: "Implementation order" }] },
    { id: "stack", label: "Stack recommendations included", evidence: [{ pattern: /tech stack|stack recommendation|frontend|backend|database|api/i, hint: "Tech stack" }] },
    { id: "dependencies", label: "Dependencies and services listed", evidence: [{ pattern: /dependencies|third-party|integrations|services|api key/i, hint: "Dependencies" }] },
    { id: "ship-now-vs-later", label: "Ship now vs delay split included", evidence: [{ pattern: /ship[-\s]?fast|ship now|can wait|delay|later phase|week\s*2/i, hint: "Ship now vs delay" }] },
    { id: "leverage", label: "Highest leverage first identified", evidence: [{ pattern: /highest leverage|what to build first|build first|keystone/i, hint: "Highest leverage" }] },
  ], normalized);

  const personalityChecks = runRegexValidation([
    { id: "commercial", label: "Commercial intelligence language present", evidence: [{ pattern: /pricing|revenue|upsell|retention|ltv|cac|margin/i, hint: "Commercial terms" }] },
    { id: "technical", label: "Technically grounded decisions present", evidence: [{ pattern: /architecture|schema|api|database|auth|infrastructure/i, hint: "Technical grounding" }] },
    { id: "visionary", label: "Visionary market language present", evidence: [{ pattern: /category|moat|trend|first[-\s]?mover|expansion|market shift/i, hint: "Visionary framing" }] },
    { id: "decisive", label: "Sharp and decisive tone present", evidence: [{ pattern: /must|prioritize|launch|execute|deploy|non-negotiable/i, hint: "Decisive phrasing" }] },
  ], normalized);

  const structureEvidence = SECTION_LABELS.filter((label) => new RegExp(label, "i").test(normalized));
  const synthesisChecks: ValidationResult[] = [
    {
      id: "structure",
      label: "Structured blueprint sections coverage (>= 7/9)",
      passed: structureEvidence.length >= 7,
      evidence: structureEvidence,
      critical: true,
    },
    ...runRegexValidation([
      { id: "trend-originality", label: "Trend + originality logic included", evidence: [{ pattern: /trend|originality|anti-template|innovation/i, hint: "Trend/originality" }] },
      { id: "qa", label: "QA gate/evaluation logic included", evidence: [{ pattern: /quality assurance|qa|criteria|evaluation/i, hint: "QA logic" }] },
      { id: "scale", label: "Scale and automation logic included", evidence: [{ pattern: /scale|automation|admin|operations|growth systems/i, hint: "Scale logic" }] },
      { id: "niche", label: "Niche specialization logic included", evidence: [{ pattern: /niche|industry|domain workflow|specialization/i, hint: "Niche logic" }] },
    ], normalized),
  ];

  const groups: ValidationGroupResult[] = [
    {
      id: "buildability",
      title: "Buildability Proof",
      description: "Validates MVP realism, implementation order, and shipping leverage.",
      checks: buildabilityChecks,
      passed: buildabilityChecks.filter((check) => check.passed).length,
      total: buildabilityChecks.length,
    },
    {
      id: "personality",
      title: "Personality Proof",
      description: "Verifies strategist + architect + founder tone signals in output.",
      checks: personalityChecks,
      passed: personalityChecks.filter((check) => check.passed).length,
      total: personalityChecks.length,
    },
    {
      id: "synthesis",
      title: "Final Synthesis Proof",
      description: "Checks if output is coherent, layered, and structurally complete.",
      checks: synthesisChecks,
      passed: synthesisChecks.filter((check) => check.passed).length,
      total: synthesisChecks.length,
    },
  ];

  const allChecks = groups.flatMap((group) => group.checks);
  return {
    groups,
    totalPassed: allChecks.filter((check) => check.passed).length,
    totalChecks: allChecks.length,
    criticalFailures: allChecks.filter((check) => check.critical && !check.passed),
  };
};

/* ══════════════════════════════════════════════════════════
   QUANTUM COUNTDOWN
   ══════════════════════════════════════════════════════════ */
function QuantumCountdown({ onComplete, mode }: { onComplete: () => void; mode: string }) {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const modeConfig = GENERATION_MODES.find((m) => m.id === mode);
  const duration = mode === "instant-concept" ? 8 : mode === "premium-blueprint" ? 12 : mode === "build-ready" ? 14 : 15;
  const activeLayers = Array.from(new Set(MODE_LAYERS[mode] || MODE_LAYERS["premium-blueprint"]));
  const phases = useMemo(() => getModePhases(mode), [mode]);
  const activePhase = phases[Math.min(phaseIndex, phases.length - 1)] || phases[0];

  useEffect(() => {
    const totalTicks = duration * 10;
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      const pct = Math.min((tick / totalTicks) * 100, 100);
      setProgress(pct);
      const currentPhaseIndex = Math.min(Math.floor((pct / 100) * phases.length), phases.length - 1);
      setPhaseIndex(currentPhaseIndex);
      if (tick >= totalTicks) {
        clearInterval(interval);
        onComplete();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete, duration, phases.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
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
          <activePhase.icon className="h-4 w-4 text-primary" />
          <span>{activePhase.text}</span>
        </div>
        {modeConfig && (
          <Badge variant="outline" className="border-primary/40 text-primary text-xs mt-1">
            {modeConfig.label} Mode — {activeLayers.length} Transformation Modules Active
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

      <div className="w-full max-w-3xl rounded-xl border border-border/30 bg-card/20 p-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Live Workflow Execution</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {phases.map((item, index) => {
            const isDone = index < phaseIndex;
            const isActive = index === phaseIndex;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 border transition-all ${
                  isDone
                    ? "border-primary/30 bg-primary/10"
                    : isActive
                      ? "border-primary/20 bg-primary/5"
                      : "border-border/20 bg-muted/10"
                }`}
              >
                {isDone ? (
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                ) : isActive ? (
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border border-border/50 shrink-0" />
                )}
                <span className={`text-[11px] leading-snug ${isDone || isActive ? "text-foreground" : "text-muted-foreground"}`}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active layer indicators */}
      <div className="flex gap-1.5 flex-wrap justify-center max-w-md">
        {activeLayers.map((layerId) => {
          const layer = INTELLIGENCE_LAYERS.find((l) => l.id === layerId);
          if (!layer) return null;
          const layerProgress = progress > 0;
          return (
            <Badge key={layer.id} variant="secondary" className={`text-[10px] gap-1 transition-all ${layerProgress ? 'opacity-100' : 'opacity-40'}`}>
              <layer.icon className={`h-2.5 w-2.5 ${layer.color}`} />
              {layer.shortLabel}
            </Badge>
          );
        })}
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
  const [strictModeEnabled, setStrictModeEnabled] = useState(true);
  const [generationAttempt, setGenerationAttempt] = useState(0);
  const [lastRunStrict, setLastRunStrict] = useState(false);
  const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(null);
  const [generationCompletedAt, setGenerationCompletedAt] = useState<number | null>(null);
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
  const handleGenerate = async (strictEnforcement = strictModeEnabled) => {
    if (!canGenerate) return;
    setGenerationAttempt((prev) => prev + 1);
    setLastRunStrict(strictEnforcement);
    setGenerationStartedAt(Date.now());
    setGenerationCompletedAt(null);
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
          additionalNotes: [additionalNotes, strictEnforcement ? STRICT_ENFORCEMENT_APPENDIX : ""].filter(Boolean).join("\n\n"),
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
            strictEnforcement,
            generatedByTool: "quantum-optimization",
          },
        });
        if (insertError) throw new Error(`Failed to save: ${insertError.message}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerationCompletedAt(Date.now());
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
    setGenerationAttempt(0); setLastRunStrict(false); setGenerationStartedAt(null); setGenerationCompletedAt(null);
    setGenerationMode("premium-blueprint"); setInputMode("quick");
  };

  const handleRegenerate = () => {
    setBlueprint(""); setError(""); setShowCountdown(false); setStep("mode");
  };

  const activeLayers = Array.from(new Set(MODE_LAYERS[generationMode] || MODE_LAYERS["premium-blueprint"]));
  const activeLayerSet = useMemo(() => new Set(activeLayers), [activeLayers]);
  const validationSummary = useMemo(() => buildValidationSummary(blueprint), [blueprint]);
  const sectionCoverage = useMemo(() => getSectionCoverage(blueprint), [blueprint]);
  const blueprintEvidence = useMemo(() => extractBlueprintEvidence(blueprint), [blueprint]);
  const workflowProof = useMemo(() => buildWorkflowProof({
    projectName,
    appIdea,
    nicheLabel,
    sectionCoverage,
    validationSummary,
  }), [projectName, appIdea, nicheLabel, sectionCoverage, validationSummary]);
  const readinessChecklist = useMemo(() => {
    return [
      { id: "intent", label: "App intent captured", passed: Boolean(projectName.trim() && (appIdea.trim() || selectedNiche)) },
      { id: "niche", label: "Niche/professional target defined", passed: Boolean(nicheLabel.trim() || professionalType.trim() || targetCustomer.trim()) },
      { id: "problem", label: "Problem/outcome direction present", passed: Boolean(workflowProblem.trim() || desiredOutcome.trim()) },
      { id: "mode", label: "Generation mode selected", passed: Boolean(generationMode) },
      { id: "stack", label: "Project type/platform context set", passed: Boolean(projectType || selectedPlatforms.length > 0) },
    ];
  }, [projectName, appIdea, selectedNiche, nicheLabel, professionalType, targetCustomer, workflowProblem, desiredOutcome, generationMode, projectType, selectedPlatforms.length]);
  const readinessScore = readinessChecklist.filter((item) => item.passed).length;
  const generationDurationSeconds = generationStartedAt && generationCompletedAt
    ? Math.max((generationCompletedAt - generationStartedAt) / 1000, 0).toFixed(1)
    : null;
  const hasCriticalFailures = validationSummary.criticalFailures.length > 0;

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
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge className="accent-gradient text-primary-foreground border-0 text-xs font-bold tracking-wider uppercase px-3 py-1.5">
                  <Timer className="h-3 w-3 mr-1.5" />8–15s Generation
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  <Crown className="h-3 w-3 mr-1" />{INTELLIGENCE_LAYERS.length} Transformation Modules
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />QA Enforced
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold font-bricolage leading-tight">
                <span className="gradient-text">Quantum</span>{" "}
                <span className="text-foreground">AI Product Studio</span>
              </h1>
              <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-xl leading-relaxed">
                5 expert minds. {INTELLIGENCE_LAYERS.length} transformation modules. From intent to premium, buildable, niche-specialized app blueprint — in seconds.
                Pricing intelligence, trend engine, originality enforcement, and QA built in.
              </p>
            </div>
            <div className="flex gap-3">
              {[
                { label: "Speed", value: "8–15s", icon: Zap },
                  { label: "Modules", value: String(INTELLIGENCE_LAYERS.length), icon: Brain },
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

          {/* Intelligence Layer Strip */}
          <div className="mt-6 pt-5 border-t border-border/20">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Active Intelligence Modules</p>
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                {activeLayers.length} active in {GENERATION_MODES.find((mode) => mode.id === generationMode)?.label}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {INTELLIGENCE_LAYERS.map((layer) => {
                const isActive = activeLayerSet.has(layer.id);
                return (
                  <div
                    key={layer.id}
                    className={`rounded-lg border p-2.5 transition-all ${
                      isActive
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/20 bg-card/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <layer.icon className={`h-3.5 w-3.5 ${layer.color}`} />
                        <span className={`text-[11px] font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{layer.shortLabel}</span>
                      </div>
                      <Badge variant={isActive ? "default" : "outline"} className="text-[9px] px-1.5 py-0">
                        {isActive ? "ON" : "OFF"}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{layer.description}</p>
                  </div>
                );
              })}
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
                <p className="text-muted-foreground text-sm mt-1">Select a niche to activate industry-specific intelligence.</p>
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
                <p className="text-muted-foreground text-sm mt-1">Tell us what you want to build. The AI will infer niche, market, and strategy.</p>
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
            <p className="text-muted-foreground text-sm mt-1">Each mode activates different intelligence layers at different depths.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GENERATION_MODES.map((mode) => {
              const isSelected = generationMode === mode.id;
              const layers = MODE_LAYERS[mode.id] || [];
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

                  {/* Layer indicators per mode */}
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{mode.sections}</span>
                      <span className="text-[9px] text-muted-foreground">·</span>
                      <span className="text-[9px] text-muted-foreground italic">{mode.personality}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {layers.slice(0, 8).map((layerId) => {
                        const layer = INTELLIGENCE_LAYERS.find((l) => l.id === layerId);
                        if (!layer) return null;
                        return (
                          <span key={layer.id} className={`inline-flex items-center gap-0.5 text-[9px] ${layer.color} opacity-70`}>
                            <layer.icon className="h-2.5 w-2.5" />
                            {layer.shortLabel}
                          </span>
                        );
                      })}
                      {layers.length > 8 && (
                        <span className="text-[9px] text-muted-foreground">+{layers.length - 8} more</span>
                      )}
                    </div>
                  </div>

                  {isSelected && <div className="absolute top-3 right-3"><CheckCircle className="h-5 w-5 text-primary" /></div>}
                </button>
              );
            })}
          </div>

          <Card className="dark-slate-purple-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Workflow className="h-4 w-4 text-primary" />
                Quantum Workflow Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border/30 bg-card/20 p-3">
                <div>
                  <Label className="text-sm font-semibold text-foreground">Strict buildability + personality enforcement</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    When enabled, generation enforces MVP realism, implementation order, dependencies, and highest-leverage-first strategy.
                  </p>
                </div>
                <Switch checked={strictModeEnabled} onCheckedChange={setStrictModeEnabled} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ENFORCEMENT_RULES.map((rule) => (
                  <div key={rule} className="flex items-center gap-2 rounded-md border border-border/30 bg-muted/10 px-2 py-1.5">
                    <CheckCircle className={`h-3.5 w-3.5 ${strictModeEnabled ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs text-foreground">{rule}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">Input Readiness</p>
                  <Badge variant="outline" className="text-[10px] border-border/50">
                    {readinessScore}/{readinessChecklist.length}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {readinessChecklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-[11px]">
                      {item.passed ? <CheckCircle className="h-3.5 w-3.5 text-primary" /> : <Shield className="h-3.5 w-3.5 text-muted-foreground" />}
                      <span className={item.passed ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

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
                    onClick={() => handleGenerate(strictModeEnabled)}
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
                      {GENERATION_MODES.find((m) => m.id === generationMode)?.label} Mode · {totalSelected} feature{totalSelected !== 1 ? "s" : ""} selected · {activeLayers.length} modules active
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("mode")} className="gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button className="accent-gradient text-primary-foreground gap-2 font-bold text-base px-6"
                    disabled={!canGenerate || generating} onClick={() => handleGenerate(strictModeEnabled)}>
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
                  <p className="text-muted-foreground text-sm mt-1">Streaming your {GENERATION_MODES.find((m) => m.id === generationMode)?.label} — {activeLayers.length} modules active</p>
                </div>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </CardContent>
            </Card>
          )}

          {blueprint && (
            <Card className="dark-slate-purple-card">
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    <span className="gradient-text">{projectName}</span>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {GENERATION_MODES.find((m) => m.id === generationMode)?.label}
                    </Badge>
                  </CardTitle>
                  {!generating && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activeLayers.slice(0, 6).map((layerId) => {
                        const layer = INTELLIGENCE_LAYERS.find((l) => l.id === layerId);
                        if (!layer) return null;
                        return (
                          <Badge key={layer.id} variant="outline" className="text-[9px] border-border/30 gap-0.5">
                            <layer.icon className={`h-2.5 w-2.5 ${layer.color}`} />
                            {layer.shortLabel}
                          </Badge>
                        );
                      })}
                      {activeLayers.length > 6 && (
                        <Badge variant="outline" className="text-[9px] border-border/30">
                          +{activeLayers.length - 6} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
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
                {!generating && validationSummary.groups.length > 0 && (
                  <div className="mb-4 rounded-xl border border-border/30 bg-card/30 p-4 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Workflow Proof — Runtime Validation</p>
                        <p className="text-xs text-muted-foreground">
                          Validating Buildability, Personality, and Final Synthesis on generated output.
                        </p>
                      </div>
                      <Badge variant={hasCriticalFailures ? "destructive" : "default"} className="text-xs">
                        {validationSummary.totalPassed}/{validationSummary.totalChecks} checks passed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="rounded-md border border-border/30 bg-muted/10 p-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Run</p>
                        <p className="text-sm font-semibold text-foreground">Attempt #{generationAttempt || 1}</p>
                      </div>
                      <div className="rounded-md border border-border/30 bg-muted/10 p-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Enforcement</p>
                        <p className="text-sm font-semibold text-foreground">{lastRunStrict ? "Strict" : "Standard"}</p>
                      </div>
                      <div className="rounded-md border border-border/30 bg-muted/10 p-2">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Generation Time</p>
                        <p className="text-sm font-semibold text-foreground">{generationDurationSeconds ? `${generationDurationSeconds}s` : "—"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      {validationSummary.groups.map((group) => (
                        <div key={group.id} className="rounded-lg border border-border/30 bg-muted/10 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-foreground">{group.title}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{group.description}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-border/50">
                              {group.passed}/{group.total}
                            </Badge>
                          </div>

                          <div className="mt-2.5 space-y-1.5">
                            {group.checks.map((check) => (
                              <div key={check.id} className="flex items-start gap-2">
                                {check.passed ? (
                                  <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                                ) : (
                                  <Shield className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                )}
                                <div>
                                  <p className={`text-[11px] leading-snug ${check.passed ? "text-foreground" : "text-muted-foreground"}`}>{check.label}</p>
                                  {check.evidence.length > 0 && (
                                    <p className="text-[10px] text-muted-foreground/80">{check.evidence.slice(0, 2).join(" · ")}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border/30 bg-muted/10 p-3">
                        <p className="text-xs font-semibold text-foreground mb-2">Core Blueprint Sections</p>
                        <div className="space-y-1.5">
                          {sectionCoverage.map((section) => (
                            <div key={section.label} className="flex items-center justify-between gap-2 text-[11px]">
                              <span className={section.found ? "text-foreground" : "text-muted-foreground"}>{section.label}</span>
                              {section.found ? <CheckCircle className="h-3.5 w-3.5 text-primary" /> : <Shield className="h-3.5 w-3.5 text-muted-foreground" />}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border border-border/30 bg-muted/10 p-3">
                        <p className="text-xs font-semibold text-foreground mb-2">Core User Workflow Proof</p>
                        <div className="space-y-1.5">
                          {workflowProof.map((item) => (
                            <div key={item.id} className="rounded-md border border-border/20 bg-card/30 p-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-[11px] font-medium ${item.passed ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</p>
                                {item.passed ? <CheckCircle className="h-3.5 w-3.5 text-primary" /> : <Shield className="h-3.5 w-3.5 text-muted-foreground" />}
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{item.evidence}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      {([
                        { key: "buildability", title: "Buildability Evidence", lines: blueprintEvidence.buildability },
                        { key: "personality", title: "Personality Evidence", lines: blueprintEvidence.personality },
                        { key: "synthesis", title: "Synthesis Evidence", lines: blueprintEvidence.synthesis },
                      ] as const).map((bucket) => (
                        <div key={bucket.key} className="rounded-lg border border-border/30 bg-muted/10 p-3">
                          <p className="text-xs font-semibold text-foreground mb-2">{bucket.title}</p>
                          {bucket.lines.length > 0 ? (
                            <ul className="space-y-1">
                              {bucket.lines.map((line, index) => (
                                <li key={`${bucket.key}-${index}`} className="text-[11px] text-muted-foreground leading-relaxed">• {line}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[11px] text-muted-foreground">No direct evidence detected in this run.</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {hasCriticalFailures && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-xs font-semibold text-destructive">Critical requirements missing from this blueprint.</p>
                          <p className="text-[11px] text-destructive/80 mt-0.5">
                            Missing: {validationSummary.criticalFailures.slice(0, 3).map((check) => check.label).join(" · ")}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => handleGenerate(true)}>
                          Regenerate with Strict Enforcement
                        </Button>
                      </div>
                    )}
                  </div>
                )}

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
