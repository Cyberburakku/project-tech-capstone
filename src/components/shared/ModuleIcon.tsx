import { MessageCircle, Smartphone, Users } from "lucide-react";
import type { LearningModule } from "@/types";

export function ModuleIcon({ icon, className }: { icon: LearningModule["icon"]; className?: string }) {
  const Icon = icon === "smartphone" ? Smartphone : icon === "users" ? Users : MessageCircle;
  return <Icon aria-hidden className={className} />;
}
