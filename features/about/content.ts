import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  Handshake,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

/**
 * Objective ids mapped to `AboutPage.objectives.items.*` message keys.
 */
export type AboutObjectiveId =
  | "management"
  | "advice"
  | "protection"
  | "integrity";

export type AboutObjective = {
  id: AboutObjectiveId;
  icon: LucideIcon;
};

/** Ordered core objectives for the About page carousel. */
export const ABOUT_OBJECTIVES: readonly AboutObjective[] = [
  { id: "management", icon: ClipboardCheck },
  { id: "advice", icon: Lightbulb },
  { id: "protection", icon: ShieldCheck },
  { id: "integrity", icon: Handshake },
] as const;
