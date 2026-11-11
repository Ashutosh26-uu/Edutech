import type { Metadata } from "next";
import { FocusTimer } from "@/components/FocusTimer";

export const metadata: Metadata = {
  title: "Focus timer",
  description: "A Pomodoro focus timer for exam study: 25/5 or 50/10 blocks, a gentle chime, daily focus minutes and XP for every block.",
};

export default function FocusPage() {
  return <FocusTimer />;
}
