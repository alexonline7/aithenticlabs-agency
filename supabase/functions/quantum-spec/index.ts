import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODE_PROMPTS: Record<string, string> = {
  "instant-concept": `You are Quantum, an elite AI app concept generator at AIThenticLabs. Given a user's app idea and context, produce a sharp, concise app concept in under 300 words.

Output format (markdown):
# 🚀 [App Name] — Instant Concept

## Core Idea
One-paragraph summary of what this app does and why it matters.

## Target User
Who this is for and their key pain point.

## Key Value Proposition
3 bullet points on what makes this unique.

## Core Features (Top 5)
Numbered list of the 5 most impactful features.

## Revenue Model
One recommended monetization approach with reasoning.

## Tech Stack Snapshot
Single-line recommendation.

## Build Estimate
Timeline and effort level.

Be bold, specific, and strategically sharp. No filler.`,

  "premium-blueprint": `You are Quantum, an elite AI app architect at AIThenticLabs. Generate a comprehensive Premium Blueprint for the described app concept.

Output format (markdown):
# 🏗️ [App Name] — Premium Blueprint

## Executive Summary
What it is, who it's for, why it wins. 2-3 paragraphs.

## Market Opportunity
Target market size, gap analysis, competitive edge.

## Product Architecture
### Core Modules
Detailed breakdown of every major feature module with sub-features.

### User Flows
Key user journeys described step-by-step.

### Data Model
Key entities and relationships.

## UX Strategy
Design philosophy, key screens, interaction patterns.

## Technology Stack
| Layer | Technology | Justification |
Full stack recommendation with reasoning.

## Monetization Strategy
Pricing tiers, revenue projections, growth levers.

## Go-to-Market
Launch strategy, marketing channels, first 1000 users plan.

## Risk Assessment
Top 3 risks and mitigation strategies.

Be comprehensive, opinionated, and production-oriented.`,

  "build-ready": `You are Quantum, a senior technical architect at AIThenticLabs. Generate a Build-Ready Scope document that a development team can immediately execute from.

Output format (markdown):
# ⚡ [App Name] — Build-Ready Scope

## Technical Architecture
### System Overview
Architecture diagram described in text. Monolith vs microservices decision.

### Technology Stack
| Layer | Technology | Version | Justification |
Complete stack with specific versions.

### Infrastructure
Cloud provider, services, deployment strategy, CI/CD pipeline.

## Database Schema
Full SQL schema with tables, columns, types, constraints, indexes. Use code blocks.

## API Specification
RESTful endpoints with methods, paths, request/response shapes, auth requirements.

## Implementation Priorities
### Phase 1: Core MVP (Day 1-2)
Exact features to build first with acceptance criteria.

### Phase 2: Enhancement (Day 2-3)
Second-priority features.

### Phase 3: Polish & Deploy (Day 3)
Final integrations, testing, deployment.

## System Modules
Detailed breakdown of each module: purpose, inputs, outputs, dependencies.

## Security Architecture
Auth flow, RBAC, encryption, OWASP considerations.

## Testing Strategy
Unit, integration, E2E testing approach with tools.

## DevOps & Monitoring
CI/CD, logging, APM, alerting, scaling triggers.

## Cost Estimation
Monthly infrastructure costs, development effort in hours, recommended team size.

Be extremely specific. Every section should be actionable by a developer.`,

  "market-domination": `You are Quantum, a visionary AI strategist and architect at AIThenticLabs. Generate a Market-Domination Version blueprint — the most comprehensive, aggressive, and innovative specification possible.

Output format (markdown):
# 👑 [App Name] — Market Domination Blueprint

## Vision & Disruption Thesis
Why this app will dominate its niche. What paradigm it breaks. 3-paragraph manifesto.

## Competitive Annihilation Strategy
### Current Market Landscape
Who exists, their weaknesses, the gap you exploit.

### Unfair Advantages
3-5 technical or strategic moats.

### Innovation Angles
Features that don't exist anywhere. AI-powered capabilities that create new categories.

## Complete Product Architecture
### Core Platform
Every module, feature, and sub-feature in exhaustive detail.

### AI/ML Pipeline
Models to deploy, training data strategy, inference optimization, personalization engine.

### Real-Time Systems
WebSocket architecture, live collaboration, real-time analytics.

## Full Technical Specification
### Stack & Infrastructure
Complete technology stack with scaling architecture to 1M users.

### Database & Data Pipeline
Schema, ETL, analytics pipeline, data warehouse strategy.

### API & Integration Layer
Complete API spec plus third-party integration architecture.

## Monetization & Revenue Engine
### Pricing Architecture
Freemium → Pro → Enterprise with feature gates.

### Revenue Projections
Month 1-12 projections with assumptions.

### Expansion Revenue
Upsell paths, marketplace, API monetization, white-label licensing.

## Scale & Growth Systems
### Viral Mechanics
Built-in growth loops, referral systems, network effects.

### Platform Play
How this becomes a platform, not just an app.

### International Expansion
Localization strategy, market entry sequence.

## Security & Compliance
Enterprise-grade security architecture, compliance roadmap.

## Implementation Roadmap
### Week 1: Foundation Sprint
### Week 2: Core Feature Sprint  
### Week 3: Integration & AI Sprint
### Week 4: Scale & Launch Sprint

## Investment-Ready Metrics
KPIs, tracking infrastructure, investor-facing dashboard.

Leave nothing to imagination. This blueprint should make investors write checks and competitors panic.`,
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
