import { Link } from "react-router-dom";

export function HomeFooter() {
  return (
    <footer className="space-y-2 px-6 pt-7 text-sm leading-normal text-ink-3 web:px-0">
      <p className="font-semibold text-ink-2">Not just information. A personalized path forward.</p>
      <p>Second Take is free and private. It’s a coach, not a lawyer or counselor.</p>
      <p className="flex flex-wrap gap-x-4 gap-y-1">
        <Link to="/about" className="inline-flex min-h-11 items-center font-bold text-ink-2 underline underline-offset-4">
          How we built it
        </Link>
        <Link to="/demo" className="inline-flex min-h-11 items-center font-bold text-ink-2 underline underline-offset-4">
          Demo mode
        </Link>
      </p>
    </footer>
  );
}
