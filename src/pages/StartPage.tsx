import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoachMessage } from "@/components/shared/SecondTake";
import { useAppStore } from "@/store/useAppStore";
import { MAINE_COUNTIES } from "@/data/resources";

interface FormValues {
  firstName: string;
  county: string;
}

const COUNTY_OPTIONS = [...MAINE_COUNTIES, "Not sure yet", "Outside Maine"];

export default function StartPage() {
  const navigate = useNavigate();
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const hasAssessment = useAppStore((s) => s.assessments.length > 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { firstName: profile?.firstName ?? "", county: profile?.county ?? "" },
  });

  const onSubmit = (values: FormValues) => {
    setProfile(values.firstName, values.county);
    navigate(hasAssessment ? "/" : "/assessment");
  };

  return (
    <div className="container-app max-w-xl pt-8 sm:pt-12">
      <CoachMessage className="mb-6">
        Let's get to know each other. I only need two things — and you can use a nickname if you like.
      </CoachMessage>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            {profile ? "Update your details" : "Welcome! What should we call you?"}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                autoComplete="given-name"
                placeholder="e.g. Jordan"
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                {...register("firstName", {
                  required: "Please enter a first name or nickname.",
                  maxLength: { value: 40, message: "Please keep it under 40 characters." },
                  validate: (v) => v.trim().length > 0 || "Please enter a first name or nickname.",
                  pattern: {
                    value: /^[\p{L}\p{M}' .-]+$/u,
                    message: "Please use letters only (no numbers).",
                  },
                })}
              />
              {errors.firstName && (
                <p id="firstName-error" role="alert" className="text-sm font-semibold text-crisis-dark">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="county">Which Maine county will you live in?</Label>
              <p id="county-help" className="text-sm text-ink-soft">
                This helps us find resources near you.
              </p>
              <div className="relative">
              <select
                id="county"
                className="flex min-h-12 w-full appearance-none rounded-2xl border-2 border-input bg-card px-4 py-3 pr-12 text-base text-ink focus-visible:border-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 aria-[invalid=true]:border-crisis"
                aria-invalid={Boolean(errors.county)}
                aria-describedby={errors.county ? "county-help county-error" : "county-help"}
                {...register("county", { required: "Please choose a county (or “Not sure yet”)." })}
              >
                <option value="">Choose a county…</option>
                {COUNTY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink" />
              </div>
              {errors.county && (
                <p id="county-error" role="alert" className="text-sm font-semibold text-crisis-dark">
                  {errors.county.message}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {profile ? "Save" : "Continue"} <ArrowRight aria-hidden />
            </Button>
          </form>

          <p className="mt-6 flex items-start gap-2 rounded-2xl bg-primary-soft p-4 text-sm text-ink">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-primary-dark" />
            Right now, Second Take only asks for your first name and your county. It doesn't ask for your birthday,
            Social Security number, record, release date, or health information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
