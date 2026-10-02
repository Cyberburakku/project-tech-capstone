import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { isDemo, loadDemo } from "@/lib/demo";

/**
 * Presentation mode: loads Jordan, a sample learner part-way through the journey,
 * and goes straight to Home. Asks first if real progress is saved on this device.
 */
export default function DemoPage() {
  const navigate = useNavigate();
  const hasRealData = useAppStore((s) => Boolean(s.profile)) && !isDemo();

  const start = () => {
    loadDemo();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!hasRealData) start();
    // run once on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasRealData) return null;

  return (
    <div className="container-app max-w-xl pt-12 text-center">
      <PlayCircle aria-hidden className="mx-auto size-14 text-primary-dark" />
      <h1 className="mt-4 text-3xl text-ink">Open demo mode?</h1>
      <p className="mt-2 text-ink-soft">
        Demo mode shows a sample learner, Jordan. It replaces the progress saved on this device.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={start}>
          Yes, open demo mode
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/">Keep my progress</Link>
        </Button>
      </div>
    </div>
  );
}
