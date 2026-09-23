import { CheckCircle2, Lightbulb, MessageSquareQuote } from "lucide-react";
import type { Lesson, LessonBlock } from "@/types";

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-[17px] leading-relaxed text-ink">{block.text}</p>;
    case "heading":
      return <h2 className="pt-2 text-xl font-bold text-ink">{block.text}</h2>;
    case "bullets":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[17px] leading-relaxed text-ink">
              <span className="mt-2.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-[17px] leading-relaxed text-ink">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-dark"
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <aside className="flex gap-3 rounded-2xl border border-achievement/60 bg-achievement-soft p-4">
          <Lightbulb aria-hidden className="mt-0.5 size-6 shrink-0 text-achievement-dark" />
          <div>
            <p className="font-bold text-ink">{block.title}</p>
            <p className="mt-1 text-ink">{block.text}</p>
          </div>
        </aside>
      );
    case "example":
      return (
        <aside className="flex gap-3 rounded-2xl border border-primary/40 bg-primary-soft p-4">
          <MessageSquareQuote aria-hidden className="mt-0.5 size-6 shrink-0 text-primary-dark" />
          <div>
            <p className="font-bold text-ink">{block.title}</p>
            <p className="mt-1 text-ink">{block.text}</p>
          </div>
        </aside>
      );
  }
}

export function LessonContent({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-5">
      {lesson.blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
      <section aria-labelledby="takeaways" className="rounded-3xl bg-card p-5 shadow-soft">
        <h2 id="takeaways" className="text-lg font-bold text-ink">
          Key takeaways
        </h2>
        <ul className="mt-3 space-y-2">
          {lesson.keyTakeaways.map((t) => (
            <li key={t} className="flex gap-2 text-ink">
              <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-dark" />
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
