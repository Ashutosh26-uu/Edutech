import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SpeedDrills } from "@/components/SpeedDrills";
import { absoluteUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Speed maths drills – tables, squares, cubes, percentages",
  description: "60-second and 2-minute calculation drills for SSC, banking and railway exams: tables to 30, squares to 50, cubes to 30, roots, fraction to percentage, percentages, addition and approximation. Track your best score.",
  alternates: { canonical: absoluteUrl("/drills") },
};

export default function DrillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        path="/drills"
        title="Speed drills"
        intro="Short rounds of mental maths to make you faster at Quant. Pick a drill, type each answer and press Enter (Esc skips). Your score is correct answers per minute, and your best rounds are kept on this device."
      />
      <SpeedDrills />
    </div>
  );
}
