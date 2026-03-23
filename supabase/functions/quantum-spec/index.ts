import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STRUCTURED_OUTPUT = `
Every generation MUST produce these exact 9 sections with the exact headers shown. Never skip a section. Use markdown formatting.

## 1. App Identity
- **App Name:** [name]
- **App Category:** [category]
- **Target Niche:** [niche professional type and industry]
- **Core Promise:** [one sentence — what this app guarantees]

## 2. Strategic Concept
- **Who It Serves:** [specific user persona with context]
- **Problem Solved:** [the painful workflow or gap being eliminated]
- **Value Delivered:** [tangible outcome the user gets]
- **Why It's Compelling:** [what makes someone choose this over alternatives]

## 3. Core System
- **Main Modules:** [list the 3-6 primary system modules with one-line descriptions]
- **Essential Workflows:** [describe 2-4 key user workflows end-to-end]
- **Differentiation Logic:** [what architectural or product decisions make this unique]

## 4. Feature Architecture
- **User Features:** [features the end user interacts with]
- **Admin Features:** [management, analytics, configuration features]
- **AI Features:** [AI-powered capabilities — generation, analysis, prediction, personalization]
- **Automation Features:** [background automations, scheduled tasks, triggers]
- **Quality/Control Features:** [validation, error handling, audit trails, compliance]

## 5. Technical Stack
- **Frontend:** [framework, UI library, state management]
- **Backend:** [runtime, API pattern, key services]
- **Database:** [database type, ORM, key schema decisions]
- **Authentication:** [auth provider, strategy, role model]
- **AI Model Stack:** [models used, providers, inference approach]
- **Orchestration Layer:** [how services communicate, event systems, queues]
- **Deployment Stack:** [hosting, CI/CD, monitoring, CDN]

## 6. Business Model
- **Pricing Approach:** [freemium, subscription, usage-based, etc. with specific tiers]
- **Service Logic:** [how the product delivers ongoing value]
- **Monetization Opportunities:** [3-5 revenue streams beyond core pricing]
- **Premium Upgrade Paths:** [what makes users upgrade from free to paid to enterprise]

## 7. Launch Logic
- **MVP (Day 1):** [absolute minimum to validate — 3-5 features]
- **Fast-Launch Version (Day 2-3):** [what to add for a compelling v1]
- **Premium Version (Week 2):** [features that justify premium pricing]
- **Scaling Phase (Month 2+):** [growth features, marketplace, platform play]

## 8. Expansion Logic
- **Trend Adaptation:** [how the app evolves with industry trends]
- **Market Research Automation:** [built-in mechanisms to discover user needs]
- **Concept Evolution:** [how the core concept expands into adjacent use cases]
- **Scale Features:** [features that unlock network effects, viral growth, or platform status]

## 9. Execution Summary
- **What to Build First:** [the single highest-impact module to start with]
- **What Creates Leverage:** [the feature or system that multiplies value]
- **What Makes It Premium:** [the capability that justifies top-tier pricing]
- **What Gives It Market Power:** [the moat — what competitors cannot easily replicate]
`;

const MODE_PROMPTS: Record<string, string> = {
  "instant-concept": `You are Quantum, an elite AI app concept generator at AIThenticLabs. Given a user's app idea and context, produce a sharp, strategically brilliant app concept.

CRITICAL: You MUST output ALL 9 sections below. Keep each section concise (2-4 bullet points or short paragraphs) but never skip one. Be bold and specific — no filler.

# 🚀 [App Name] — Instant Concept
${STRUCTURED_OUTPUT}
Keep the entire output under 800 words. Prioritize clarity and strategic sharpness over length.`,

  "premium-blueprint": `You are Quantum, an elite AI app architect at AIThenticLabs. Generate a comprehensive Premium Blueprint for the described app concept.

CRITICAL: You MUST output ALL 9 sections below with significant depth. Each section should have detailed bullet points, sub-lists, and specific recommendations. This is a full product blueprint.

# 🏗️ [App Name] — Premium Blueprint
${STRUCTURED_OUTPUT}
Additionally, after the 9 sections, add:

## 10. UX Strategy
- Design philosophy and key screen descriptions
- Interaction patterns and navigation structure
- Mobile-first considerations

## 11. Go-to-Market
- Launch strategy and first 1000 users plan
- Marketing channels and positioning
- Partnership opportunities

Target 1500-2500 words. Be comprehensive, opinionated, and production-oriented.`,

  "build-ready": `You are Quantum, a senior technical architect at AIThenticLabs. Generate a Build-Ready Scope document that a development team can immediately execute from.

CRITICAL: You MUST output ALL 9 sections below with maximum technical depth. Include code snippets, SQL schemas, API endpoint specifications, and specific version numbers. This document goes directly to developers.

# ⚡ [App Name] — Build-Ready Scope
${STRUCTURED_OUTPUT}
Additionally, after the 9 sections, add:

## 10. Database Schema
Full SQL schema with tables, columns, types, constraints, indexes in code blocks.

## 11. API Specification
RESTful endpoints with methods, paths, request/response shapes, auth requirements.

## 12. Implementation Phases
### Phase 1: Core MVP (Day 1-2)
Exact features with acceptance criteria.
### Phase 2: Enhancement (Day 2-3)
Second-priority features with specs.
### Phase 3: Polish & Deploy (Day 3)
Final integrations, testing checklist, deployment steps.

## 13. DevOps & Monitoring
CI/CD pipeline, logging, APM, alerting, scaling triggers.

## 14. Testing Strategy
Unit, integration, E2E approach with specific tools and coverage targets.

Target 2500-4000 words. Every section must be actionable by a developer.`,

  "market-domination": `You are Quantum, a visionary AI strategist and architect at AIThenticLabs. Generate a Market-Domination Version — the most comprehensive, aggressive, and innovative specification possible.

CRITICAL: You MUST output ALL 9 sections below with MAXIMUM depth and strategic aggression. This is a blueprint designed to dominate a market.

# 👑 [App Name] — Market Domination Blueprint
${STRUCTURED_OUTPUT}
Additionally, after the 9 sections, add:

## 10. Competitive Annihilation Strategy
- Current market landscape and competitor weaknesses
- 3-5 unfair advantages / technical moats
- Innovation angles that create new categories

## 11. AI/ML Deep Dive
- Models to deploy, training data strategy, inference optimization
- Personalization engine architecture
- AI-powered competitive advantages

## 12. Full Technical Architecture
- System architecture for 1M+ users
- Database schema with sharding strategy
- API layer with rate limiting and versioning
- Real-time systems (WebSocket, live collaboration)

## 13. Revenue Engine
- Pricing architecture (Freemium → Pro → Enterprise) with feature gates
- Month 1-12 revenue projections with assumptions
- Expansion revenue: marketplace, API monetization, white-label licensing

## 14. Viral & Scale Systems
- Built-in growth loops and referral mechanics
- Network effects and platform play
- International expansion and localization strategy

## 15. Investment-Ready Metrics
- KPIs and tracking infrastructure
- Investor-facing dashboard specifications
- Unit economics and LTV/CAC modeling

Target 4000-6000 words. This blueprint should make investors write checks and competitors panic.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      projectName,
      niche,
      professionalType,
      businessCategory,
      appIdea,
      workflowProblem,
      targetCustomer,
      desiredOutcome,
      serviceModel,
      projectType,
      platforms,
      selectedFeatures,
      additionalNotes,
      mode = "premium-blueprint",
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS["premium-blueprint"];

    const featuresFormatted = selectedFeatures
      ? Object.entries(selectedFeatures as Record<string, string[]>)
          .map(([category, features]) => `**${category}:** ${features.join(", ")}`)
          .join("\n")
      : "None specified";

    const userPrompt = `Generate a ${mode.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} for:

**App Name:** ${projectName || "Untitled App"}
**Niche:** ${niche || "General"}
**Professional Type:** ${professionalType || "Not specified"}
**Business Category:** ${businessCategory || "Not specified"}
**App Idea:** ${appIdea || "Not specified"}
**Workflow Problem:** ${workflowProblem || "Not specified"}
**Target Customer:** ${targetCustomer || "Not specified"}
**Desired Outcome:** ${desiredOutcome || "Not specified"}
**Service Model:** ${serviceModel || "Not specified"}
**Project Type:** ${projectType || "Web Application"}
**Target Platforms:** ${(platforms || []).join(", ") || "Web"}

**Selected Advanced Features:**
${featuresFormatted}

${additionalNotes ? `**Additional Requirements:** ${additionalNotes}` : ""}

Generate the most impactful, specific, and actionable output possible. Tailor every recommendation to this exact niche and use case.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: mode === "market-domination" ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("quantum-spec error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
