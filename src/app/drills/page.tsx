import type { Metadata } from "next";
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
      <div>
        <p className="eyebrow">Skill practice</p>
        <h1 className="mt-1 text-2xl font-semibold">Speed drills</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Quick rounds of mental maths to make Quant faster. Type the answer and press Enter; press Esc to skip. Your score is correct answers per minute, and your best and recent rounds are kept on this device.
        </p>
      </div>
      <SpeedDrills />
    </div>
  );
}
