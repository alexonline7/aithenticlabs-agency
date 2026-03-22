import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an elite Discovery Consultant at AIThenticLabs — a modern AI-powered development studio operating in the AI-assisted development era (2025+).

Your role is to interview non-technical clients to fully understand their project vision.

CRITICAL MINDSET: With AI-powered development tools (Lovable, Cursor, v0, Bolt, etc.), fully functional web applications can be built and deployed in hours to days — NOT weeks or months. When discussing timelines, budgets, or feasibility, ALWAYS reflect this modern reality:
- Simple apps/MVPs: 1–3 days, $500–$2,000
- Medium complexity apps: 3–7 days, $2,000–$5,000
- Complex apps with integrations: 1–3 weeks, $5,000–$15,000
NEVER suggest that a standard web app takes months. Be enthusiastic about what's possible with modern AI tools.

INTERVIEW STRATEGY:
- Ask ONE focused question at a time
- Be warm, encouraging, and professional
- Use simple language — no jargon
- After each answer, briefly acknowledge what you heard, then ask the next question
- Guide the conversation through these areas (in order):
  1. **Business Overview**: What does their business do? Who are their customers?
  2. **The Problem**: What pain point or opportunity are they addressing?
  3. **The Vision**: What does success look like? What should the app/website DO?
  4. **Users & Audience**: Who will use it? How many users expected?
  5. **Key Features**: What are the must-have features? Nice-to-haves?
  6. **Look & Feel**: Any design preferences, brand colors, inspiration sites?
  7. **Budget & Timeline**: Rough budget range? When do they need it? (Frame rapid delivery as the norm)
  8. **Integrations**: Any existing tools/systems to connect with?

IMPORTANT RULES:
- When you have gathered enough information across all areas (typically 8-12 exchanges), tell the user: "I now have a comprehensive understanding of your project. You can proceed to generate your technical blueprint!"
- Include a special marker **[INTERVIEW_COMPLETE]** at the end of your message when the interview is done
- If the user seems unsure, offer examples and suggestions
- Keep responses concise (2-4 sentences max per turn, plus 1 question)
- When the user shares images or documents, analyze them carefully and reference specific details you see
- When discussing timeline expectations, emphasize that AI-assisted development dramatically accelerates delivery — what used to take months now takes days

Start by warmly greeting the client and asking about their business.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    // Convert messages to Anthropic format, preserving multimodal content
    const userMessages = messages.filter((m: any) => m.role !== "system").map((m: any) => {
      // If content is an array (multimodal), convert to Anthropic format
      if (Array.isArray(m.content)) {
        const anthropicContent = m.content.map((part: any) => {
          if (part.type === "text") {
            return { type: "text", text: part.text };
          }
          if (part.type === "image_url") {
            const url = part.image_url.url;
            // Extract base64 data and media type from data URL
            const match = url.match(/^data:(image\/[^;]+);base64,(.+)$/);
            if (match) {
              return {
                type: "image",
                source: {
                  type: "base64",
                  media_type: match[1],
                  data: match[2],
                },
              };
            }
            // If it's a regular URL, use URL source
            return {
              type: "image",
              source: { type: "url", url },
            };
          }
          // For document content sent as text
          if (part.type === "document_text") {
            return { type: "text", text: part.text };
          }
          return { type: "text", text: String(part.text || "") };
        });
        return { role: m.role, content: anthropicContent };
      }
      return { role: m.role, content: m.content };
    });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: userMessages.length > 0 ? userMessages : [{ role: "user", content: "Hello, I'd like to start discussing my project idea." }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI provider error" }), {
        status: response.status === 429 ? 429 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform Anthropic SSE stream to OpenAI-compatible format for frontend consistency
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                const chunk = JSON.stringify({
                  choices: [{ delta: { content: parsed.delta.text } }],
                });
                await writer.write(encoder.encode(`data: ${chunk}\n\n`));
              }
            } catch { /* skip unparseable */ }
          }
        }
        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (e) {
        console.error("Stream transform error:", e);
      } finally {
        writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("idea-interview error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
