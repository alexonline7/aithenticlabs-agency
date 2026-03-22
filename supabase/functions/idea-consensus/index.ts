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

    const consensusPrompt = `You are the Lead Project Director at AIThenticLabs — a modern AI-powered development studio. You have received three documents for a client project:
1. A Discovery Interview transcript
2. A Technical Architecture specification
3. A UI/UX Blueprint

CRITICAL CONTEXT: We operate in the era of AI-assisted development (2025+). With tools like Lovable, Cursor, v0, Bolt, and similar AI coding platforms, a fully functional web application can be built and deployed in under 24 hours. Our timelines and pricing MUST reflect this modern reality — NOT legacy software development cycles.

Your job is to synthesize these into a FINAL Consensus Report — the definitive document our development team will use to build the project.

OUTPUT FORMAT (use markdown):
# 🏗️ Project Consensus Report

## Executive Summary
3-4 paragraph overview: what we're building, for whom, key differentiators, and expected impact.

## Project Scope & Deliverables
Clear MVP scope with numbered deliverables. Separate "Phase 1 (MVP)" from "Future Enhancements."

## Cost Estimate
| Phase | Description | Estimated Cost | Timeline |
Provide realistic estimates based on AI-assisted development speeds:
- Simple MVP: $500–$2,000 | 1–3 days
- Medium complexity: $2,000–$5,000 | 3–7 days
- Complex with integrations: $5,000–$15,000 | 1–3 weeks
Never quote months-long timelines for standard web apps. Be honest about how fast modern tools enable delivery.

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
Top 5-8 risks with mitigation strategies.

## Recommended Team Composition
In the AI-assisted era, lean teams are the norm. Specify roles, but note that 1-2 skilled developers with AI tools can accomplish what previously required 5-10 people.

## Technology Decisions (Final)
Consolidated tech stack with brief justification. Favor modern, rapid-deployment stacks (React/Next.js, Supabase, Vercel, etc.).

## Implementation Roadmap
Day-by-day or sprint-by-sprint plan. MVP should target days, not months. Use aggressive but realistic timelines.

## Key Metrics & Success Criteria
How we'll measure if the project is successful.

## Client Action Items
What the client needs to provide/decide before development begins.

## Next Steps
Immediate next steps to kick off the project. Emphasize speed — we can start building today.

Be authoritative, modern, and specific. Reflect the speed and cost-efficiency of AI-assisted development. This is the document that closes the deal and starts the project.`;

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
