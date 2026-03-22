import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { projectName, projectType, platforms, selectedFeatures, additionalNotes } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Quantum, an elite technical architect at AIThenticLabs specializing in cutting-edge application specifications. You generate comprehensive, production-ready technical blueprints for advanced projects.

Given the client's selected advanced features and project details, produce a detailed specification blueprint that includes:

1. **Executive Summary** — Project overview, target audience, and unique value proposition
2. **Selected Advanced Capabilities** — Detailed breakdown of each selected feature, how it integrates, and implementation approach
3. **System Architecture** — High-level architecture diagram (described), microservices/monolith decision, communication patterns
4. **Technology Stack Recommendation** — Specific frameworks, libraries, and services for each capability
5. **Data Architecture** — Database design, data flow, caching strategies, real-time data pipelines
6. **API Design** — Key endpoints, GraphQL/REST decisions, WebSocket channels
7. **Security & Compliance Framework** — Authentication, authorization, encryption, compliance requirements
8. **Infrastructure & DevOps** — Cloud architecture, CI/CD, monitoring, scaling strategy
9. **AI/ML Pipeline** (if applicable) — Model selection, training pipeline, inference optimization, MLOps
10. **Performance Targets** — Latency goals, throughput benchmarks, availability SLAs
11. **Implementation Roadmap** — Phased delivery with milestones and estimated timelines
12. **Cost Estimation** — Infrastructure costs, development effort, and pricing tier recommendation

Format with clear markdown headings, bullet points, and code snippets where relevant. Be specific and opinionated about technology choices.`;

    const featuresFormatted = Object.entries(selectedFeatures as Record<string, string[]>)
      .map(([category, features]) => `**${category}:** ${features.join(", ")}`)
      .join("\n");

    const userPrompt = `Generate a Quantum Specification Blueprint for:

**Project Name:** ${projectName || "Untitled Project"}
**Project Type:** ${projectType}
**Target Platforms:** ${(platforms as string[]).join(", ")}

**Selected Advanced Features:**
${featuresFormatted}

${additionalNotes ? `**Additional Requirements:** ${additionalNotes}` : ""}

Produce the most comprehensive, cutting-edge specification possible. Be bold with technology recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
