import { Link } from "react-router-dom";
import { Check, ShieldCheck, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";

const WE_STORE = [
  "Your first name (or a nickname)",
  "The Maine county you plan to live in",
  "Your check-in answers (multiple choice only) and scores",
  "Which lessons you finished and certificates you earned",
  "That you wrote a reflection — not what you wrote",
];

const WE_NEVER_STORE = [
  "Date of birth",
  "Social Security number",
  "Criminal history or case details",
  "Release date",
  "Medical or health information",
  "Passwords — there's no account to create",
];

export default function PrivacyPage() {
  return (
    <div className="container-app max-w-3xl">
      <PageHeader
        eyebrow="Privacy"
        title="How we protect you"
        description="Project T.E.C.H. is built to collect as little as possible. Here's exactly what that means."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-ink">What we save</h2>
            <ul className="mt-3 space-y-2">
              {WE_STORE.map((i) => (
                <li key={i} className="flex gap-2 text-ink">
                  <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-dark" /> {i}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-ink">What we never ask for</h2>
            <ul className="mt-3 space-y-2">
              {WE_NEVER_STORE.map((i) => (
                <li key={i} className="flex gap-2 text-ink">
                  <X aria-hidden className="mt-0.5 size-5 shrink-0 text-crisis-dark" /> {i}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardContent className="space-y-3 p-6 text-ink">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShieldCheck aria-hidden className="size-5 text-primary-dark" /> Where it lives
          </h2>
          <p>
            Your progress is saved on this device so you can pick up where you left off. If the program has turned
            on its secure database, the items above are also saved there so the program can see overall numbers
            (like how many people finished a module). Nobody can look up an individual learner from the app.
          </p>
          <p>
            Your reflections and practice stories stay on your device only. You can clear everything anytime from
            the Progress page.
          </p>
          <p>
            Using a shared or public computer? Clear your data when you're done, or use a private browsing window.
          </p>
        </CardContent>
      </Card>
      <Button asChild size="lg" className="mt-6">
        <Link to="/start">I'm ready — let's start</Link>
      </Button>
    </div>
  );
}
