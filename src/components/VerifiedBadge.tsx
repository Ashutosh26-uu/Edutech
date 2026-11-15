import { BadgeCheck } from "lucide-react";

/** Verified institutes were checked by the site admin; others show that they are not. */
export function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="chip bg-emerald-50 text-emerald-700" title="Checked by StudyClip">
      <BadgeCheck className="h-3.5 w-3.5" /> Verified
    </span>
  ) : (
    <span className="chip bg-slate-100 text-slate-500" title="Created by its users; not yet checked by StudyClip">
      Not verified yet
    </span>
  );
}
