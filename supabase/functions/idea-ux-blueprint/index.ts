import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { interviewSummary, architectureSpec } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const systemPrompt = `You are a world-class UX/UI Architect at AIThenticLabs — the world's leading AI-powered development studio, staffed by world-renowned experts in AI development. Given a discovery interview and a technical architecture spec, produce a comprehensive UI/UX Blueprint.

CRITICAL CONTEXT: Our elite team delivers complete, production-ready UIs in hours — full projects ship in 24 hours to 3 days maximum. Your blueprint must be optimized for immediate AI-assisted implementation — clear, structured, and actionable in a single session.

OUTPUT FORMAT (use markdown):
# UI/UX Blueprint

## 1. Design Philosophy
Overall design direction, tone, visual identity approach based on client preferences. Optimized for same-day AI-assisted implementation.

## 2. Page Map & Navigation
Complete list of pages/screens with hierarchy and navigation flow.

## 3. Page-by-Page Specifications
For EACH page, provide:
- **Purpose**: What this page does
- **Layout**: Header, body sections, sidebar, footer arrangement
- **Components**: List every UI component (buttons, forms, cards, modals, etc.)
- **Content**: What content appears and where
- **Interactions**: User actions and what happens (clicks, hovers, animations)
- **Responsive Notes**: How it adapts to mobile/tablet

## 4. Component Library
Reusable components needed: buttons, cards, forms, modals, navigation, etc. with variants. Use modern component libraries (shadcn/ui, Radix, Tailwind) for rapid implementation.

## 5. Design Tokens
- Color palette (primary, secondary, accent, semantic colors)
- Typography scale (headings, body, captions)
- Spacing system
- Border radius, shadows, transitions

## 6. User Flows
Step-by-step flows for key user journeys (signup, core action, checkout, etc.).

## 7. Accessibility Requirements
WCAG compliance notes, keyboard navigation, screen reader considerations.

## 8. Animation & Micro-interactions
Page transitions, loading states, hover effects, success/error feedback. Use Framer Motion for React implementations.

Be extremely detailed and specific. This document should let our AI experts build pixel-perfect pages within hours.`;

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
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `## Discovery Interview Transcript\n\n${interviewSummary}\n\n## Technical Architecture\n\n${architectureSpec}`,
            },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI provider error" }), {
        status: response.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("idea-ux-blueprint error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
