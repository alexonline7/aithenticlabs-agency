import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      appName, appDescription, category, tier, platforms,
      features, tech, targetAudience, monetization,
      includeDesignSystem, includeDeployGuide, includeApiDocs, includeTestSpecs,
    } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const systemPrompt = `You are an elite full-stack architect at AIThenticLabs. Generate a comprehensive project brief for the specified app. 

The brief should be detailed, professional, and ready to hand to a development team. Include:
1. Executive Summary
2. Technical Architecture
3. Database Schema Design
4. API Endpoints Specification
5. UI/UX Component Breakdown
6. User Flow Diagrams (described in text)
7. Security Considerations
8. Performance Targets
${includeDesignSystem ? "9. Design System Specification" : ""}
${includeDeployGuide ? "10. Deployment & CI/CD Guide" : ""}
${includeApiDocs ? "11. API Documentation Structure" : ""}
${includeTestSpecs ? "12. Testing Strategy & Specifications" : ""}

Format with clear markdown headings and bullet points. Be specific with technology choices, not generic.`;

    const userPrompt = `Generate a project brief for:
- App Name: ${appName}
- Description: ${appDescription || "Not provided"}
- Category: ${category}
- Pricing Tier: ${tier}
- Target Platforms: ${platforms.join(", ")}
- Features: ${features.join(", ")}
- Tech Stack: Frontend: ${tech.frontend}, Styling: ${tech.styling}, Backend: ${tech.backend}, Database: ${tech.database}
- Target Audience: ${targetAudience || "General"}
- Monetization: ${monetization || "Not specified"}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash-preview-04-17",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI provider error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-brief error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
