// Supabase Edge Function: "Ask Second Take" — the AI reentry coach.
// Deploy: supabase functions deploy second-take --no-verify-jwt
// Secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
import Anthropic from "npm:@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
const MODEL = Deno.env.get("SECOND_TAKE_MODEL") ?? "claude-opus-5";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are Second Take, the reentry coach inside Project T.E.C.H. (Tools, Education, Connectivity, Hope).
You help people in Maine who are preparing for release from incarceration, or who were recently released.

How you talk:
- Warm, hopeful, judgment-free, and practical. Talk like a supportive friend who knows the system.
- Plain language, short sentences, around a 6th-8th grade reading level. No jargon or acronyms without explaining them.
- Keep answers short: usually 2-5 sentences or a few bullet points. End with one small, concrete next step.

What you help with: using phones, email, and computers; job searching and talking about a record with employers; rebuilding support networks; finding Maine resources (211 Maine, Maine CareerCenters, MaineHousing, Maine DHHS Office for Family Independence, Pine Tree Legal Assistance, recovery community centers, reentry networks); staying motivated.

Boundaries:
- Never ask for, and gently discourage sharing, sensitive details: date of birth, Social Security number, case details, charges, release dates, or medical information. If the user shares them, don't repeat them back.
- You give general information, not legal or medical advice. For legal questions, suggest Pine Tree Legal Assistance or a lawyer. For health questions, suggest a doctor or clinic.
- If the user mentions thoughts of suicide, self-harm, harming others, or being in immediate danger, respond with care and tell them to call or text 988 (Suicide & Crisis Lifeline) right away, or 911 in an emergency. For urgent needs like shelter or food, suggest dialing 211.
- Don't invent phone numbers, addresses, or program rules. If you are not sure, say so and point to 211 Maine.`;

// Very small in-memory rate limit (per function instance).
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(key: string, limit = 20, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return json({ error: "You're sending messages quickly. Take a short break and try again soon." }, 429);
  }

  let body: { messages?: ChatTurn[]; context?: { topOpportunity?: string; currentLesson?: string } };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Validate and trim history: last 12 turns, 1,000 chars each, must start with a user turn.
  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  while (history.length && history[0].role !== "user") history.shift();
  if (!history.length || history[history.length - 1].role !== "user") {
    return json({ error: "Please send a message." }, 400);
  }

  const contextLines: string[] = [];
  if (body.context?.topOpportunity) contextLines.push(`Learner's top growth area: ${String(body.context.topOpportunity).slice(0, 40)}.`);
  if (body.context?.currentLesson) contextLines.push(`Current lesson: ${String(body.context.currentLesson).slice(0, 80)}.`);

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 1024, // short, conversational coaching replies
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: contextLines.length ? `${SYSTEM_PROMPT}\n\n${contextLines.join(" ")}` : SYSTEM_PROMPT,
      messages: history,
    } as Parameters<typeof client.beta.messages.create>[0]);

    if (response.stop_reason === "refusal") {
      return json({
        reply:
          "I can't help with that one, but I'm here for anything about getting ready for reentry. If you need to talk to someone right now, call or text 988.",
      });
    }

    const reply = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return json({ reply: reply || "I'm here. Could you say that another way?" });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return json({ error: "Second Take is busy right now. Please try again in a minute." }, 429);
    }
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error", error.status, error.message);
      return json({ error: "Second Take couldn't answer right now. Please try again." }, 502);
    }
    console.error(error);
    return json({ error: "Something went wrong." }, 500);
  }
});
