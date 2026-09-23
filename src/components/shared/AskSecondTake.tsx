import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SecondTakeAvatar } from "@/components/shared/SecondTake";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "How do I explain a gap in my work history?",
  "What should I do my first week home?",
  "How do I make an email account?",
];

/**
 * "Ask Second Take" chat, powered by Claude through the second-take Edge Function.
 * The conversation lives only in this component; nothing is stored.
 */
export function AskSecondTake({ context }: { context: { topOpportunity?: string; currentLesson?: string } }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading || !supabase) return;
    const next: Turn[] = [...turns, { role: "user", content }];
    setTurns(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke<{ reply?: string; error?: string }>(
        "second-take",
        { body: { messages: next, context } },
      );
      if (fnError || !data?.reply) throw new Error(data?.error ?? "No reply");
      setTurns([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Second Take couldn't answer right now. Please try again in a moment.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <SecondTakeAvatar className="size-10" />
          <div>
            <h2 className="font-bold text-ink">Ask Second Take</h2>
            <p className="text-xs text-ink-soft">AI coach · Don't share personal details like case info or your birthday.</p>
          </div>
        </div>

        <div ref={listRef} className="mt-4 max-h-80 space-y-3 overflow-y-auto" aria-live="polite" aria-label="Conversation">
          {turns.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="min-h-11 rounded-full border-2 border-line bg-white px-4 text-left text-sm font-medium text-ink hover:border-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {turns.map((t, i) => (
            <p
              key={i}
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px]",
                t.role === "user" ? "ml-auto bg-primary-dark text-white" : "bg-primary-soft text-ink",
              )}
            >
              <span className="sr-only">{t.role === "user" ? "You said: " : "Second Take said: "}</span>
              {t.content}
            </p>
          ))}
          {loading && (
            <p className="flex items-center gap-2 text-sm text-ink-soft">
              <Loader2 aria-hidden className="size-4 animate-spin" /> Second Take is thinking…
            </p>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm font-semibold text-crisis-dark">
            {error}
          </p>
        )}

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <label htmlFor="ask-input" className="sr-only">
            Ask Second Take a question
          </label>
          <Input
            id="ask-input"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1000))}
            placeholder="Ask a question…"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
            <Send aria-hidden />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
