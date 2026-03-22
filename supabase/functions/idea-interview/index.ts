import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an elite Discovery Consultant at AIThenticLabs. Your role is to interview non-technical clients to fully understand their project vision.

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
  7. **Budget & Timeline**: Rough budget range? When do they need it?
  8. **Integrations**: Any existing tools/systems to connect with?

IMPORTANT RULES:
- When you have gathered enough information across all areas (typically 8-12 exchanges), tell the user: "I now have a comprehensive understanding of your project. You can proceed to generate your technical blueprint!"
- Include a special marker **[INTERVIEW_COMPLETE]** at the end of your message when the interview is done
- If the user seems unsure, offer examples and suggestions
- Keep responses concise (2-4 sentences max per turn, plus 1 question)

Start by warmly greeting the client and asking about their business.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    // Convert messages to Anthropic format (separate system from messages)
    const userMessages = messages.filter((m: any) => m.role !== "system").map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

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
                // Re-emit as OpenAI-compatible format
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
