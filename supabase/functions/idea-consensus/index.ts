import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { interviewSummary, architectureSpec, uxBlueprint } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

    if (!OPENAI_API_KEY || !GEMINI_API_KEY || !ANTHROPIC_API_KEY) {
      throw new Error("All three AI API keys must be configured");
    }

    const consensusPrompt = `You are the Lead Project Director at AIThenticLabs — the world's leading AI-powered development studio, staffed by world-renowned experts in AI development. You have received three documents for a client project:
1. A Discovery Interview transcript
2. A Technical Architecture specification
3. A UI/UX Blueprint

CRITICAL CONTEXT: Our elite team of world-class AI development experts delivers fully functional, production-ready web applications in 24 hours to 3 days maximum. Our timelines and pricing MUST reflect this extraordinary capability — NEVER reference weeks or months.

Your job is to synthesize these into a FINAL Consensus Report — the definitive document our development team will use to build the project.

OUTPUT FORMAT (use markdown):
# 🏗️ Project Consensus Report

## Executive Summary
3-4 paragraph overview: what we're building, for whom, key differentiators, and expected impact. Emphasize our world-class team's ability to deliver in 24h–3 days.

## Project Scope & Deliverables
Clear MVP scope with numbered deliverables. Separate "Day 1 (Core MVP)" from "Day 2-3 (Enhancements)" and "Future Iterations."

## Cost Estimate
| Phase | Description | Estimated Cost | Timeline |
Provide estimates reflecting our elite AI-assisted development speed:
- Simple MVP: $500–$1,500 | 24 hours
- Medium complexity: $1,500–$3,500 | 1–2 days
- Complex with integrations: $3,500–$8,000 | 2–3 days
NEVER quote timelines beyond 3 days. Maximum delivery is 3 days for any project.

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
Top 5-8 risks with mitigation strategies.

## Recommended Team Composition
Our world-renowned AI experts work in ultra-lean teams. 1-2 expert developers with cutting-edge AI tools deliver what legacy teams of 10+ could not achieve in months.

## Technology Decisions (Final)
Consolidated tech stack with brief justification. Favor modern, rapid-deployment stacks (React/Next.js, Supabase, Vercel, etc.).

## Implementation Roadmap
Hour-by-hour or day-by-day plan across 1–3 days maximum. Day 1: Core MVP. Day 2: Integrations & refinements. Day 3: Polish, testing & deployment.

## Key Metrics & Success Criteria
How we'll measure if the project is successful.

## Client Action Items
What the client needs to provide/decide before development begins.

## Next Steps
Immediate next steps to kick off the project. Emphasize that we can start building today and deliver within 24–72 hours.

Be authoritative, confident, and specific. Reflect AIThenticLabs' position as the world's leading AI development studio. This is the document that closes the deal and starts the project.`;

    const inputContent = `## Discovery Interview\n\n${interviewSummary}\n\n## Technical Architecture\n\n${architectureSpec}\n\n## UI/UX Blueprint\n\n${uxBlueprint}`;

    // Use Gemini for the consensus (good at synthesis with large context)
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: [
            { role: "system", content: consensusPrompt },
            { role: "user", content: inputContent },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Consensus AI error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI provider error" }), {
        status: response.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("idea-consensus error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
