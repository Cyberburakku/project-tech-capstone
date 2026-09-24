import { ChevronRight, Home, MessageSquare, Phone } from "lucide-react";
import { Sheet, SheetClose } from "@/components/layout/Sheet";

const LINES = [
  {
    href: "tel:988",
    title: "988 Lifeline",
    detail: "Call or text 988 · crisis or emotional distress",
    icon: Phone,
    tint: "bg-clay-soft text-clay",
  },
  {
    href: "sms:741741?&body=HOME",
    title: "Crisis Text Line",
    detail: "Text HOME to 741741",
    icon: MessageSquare,
    tint: "bg-sage-soft text-sage",
  },
  {
    href: "tel:211",
    title: "211 Maine",
    detail: "Food, housing, rides, and more",
    icon: Home,
    tint: "bg-sun-soft text-ink",
  },
];

export function HelpSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet id="sheet-help" open={open} onClose={onClose} labelledBy="help-h">
      <h2 id="help-h" className="text-[26px] leading-tight text-ink">
        Talk to someone now
      </h2>
      <p className="mt-1.5 text-base text-ink-2">Free and confidential. You don’t have to say who you are.</p>
      <ul className="mt-2">
        {LINES.map(({ href, title, detail, icon: Icon, tint }) => (
          <li key={href} className="border-b border-line last:border-b-0">
            <a href={href} className="flex min-h-[76px] items-center gap-3.5 py-4">
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tint}`} aria-hidden="true">
                <Icon className="size-[22px]" />
              </span>
              <span>
                <span className="block text-[17px] font-bold leading-tight text-ink">{title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-ink-2">{detail}</span>
              </span>
              <ChevronRight aria-hidden="true" className="ml-auto size-5 text-ink-2" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-1 text-sm text-ink-2">
        In danger right now? Call{" "}
        <a href="tel:911" className="inline-flex min-h-11 items-center font-bold text-ink underline underline-offset-4">
          911
        </a>
        .
      </p>
      <SheetClose onClose={onClose} />
    </Sheet>
  );
}
