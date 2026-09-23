import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="container-app max-w-xl pt-16 text-center">
      <Compass aria-hidden className="mx-auto size-16 text-primary-dark" />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">This page took a detour</h1>
      <p className="mt-2 text-ink-soft">That's okay — detours happen. Let's get you back on your path.</p>
      <Button asChild size="lg" className="mt-6">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
