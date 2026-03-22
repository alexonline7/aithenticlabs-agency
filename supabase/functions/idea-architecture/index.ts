import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { interviewSummary } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const systemPrompt = `You are a senior Solutions Architect at AIThenticLabs — a modern AI-powered development studio. Given a discovery interview transcript, produce a detailed Technical Architecture document.

CRITICAL CONTEXT: We operate in the AI-assisted development era (2025+). With tools like Lovable, Cursor, v0, and Bolt, a fully functional web application can be built and deployed in hours to days. Your architecture must reflect this reality:
- Favor rapid-deployment stacks (React/Next.js + Supabase/Firebase + Vercel/Netlify)
- Prioritize managed services over custom infrastructure
- Design for speed-to-market — MVPs in 1-3 days, full apps in 1-3 weeks
- Never suggest timelines in months for standard web applications

OUTPUT FORMAT (use markdown):
# Technical Architecture Specification

## 1. System Overview
Brief summary of what we're building and why. Include estimated delivery timeline reflecting AI-assisted development speeds.

## 2. Recommended Tech Stack
| Layer | Technology | Justification |
Table with Frontend, Backend, Database, Hosting, Auth, APIs. Favor modern rapid-deployment technologies.

## 3. Database Schema
Full schema with tables, columns, types, relationships. Use code blocks for SQL.

## 4. API Endpoints
RESTful API specification with methods, paths, request/response shapes.

## 5. System Architecture Diagram (Text)
Describe the architecture flow: client → API → services → database.

## 6. Third-Party Integrations
Any external services needed (payments, email, analytics, etc.). Prefer plug-and-play solutions.

## 7. Security Architecture
Authentication flow, authorization rules, data encryption, OWASP considerations.

## 8. Scalability Considerations
Caching strategy, CDN, load balancing, database optimization.

## 9. Development Phases
Break into MVP (1-3 days), Phase 2 (week 1-2), Phase 3 (week 2-3) with specific deliverables per phase. Timelines must reflect AI-assisted development velocity.

Be specific with technology choices. Use modern 2025-2026 rapid-deployment stacks. Tailor everything to the client's needs described in the interview.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the discovery interview transcript:\n\n${interviewSummary}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI provider error" }), {
        status: response.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("idea-architecture error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
