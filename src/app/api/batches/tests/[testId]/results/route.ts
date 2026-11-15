import { z } from "zod";
import { requireUser } from "@/server/auth";
import { batchTestResults, resultsCsv } from "@/server/batches";
import { HttpError, json, route } from "@/server/http";

/** The trainer's results for an assigned test, as JSON or (?format=csv) a spreadsheet file. */
export const GET = route(async (req, { params }) => {
  const user = await requireUser(req);
  const { testId } = await params;
  if (!z.uuid().safeParse(testId).success) throw new HttpError(404, "Test not found.");
  const results = await batchTestResults(user, testId);
  if (req.nextUrl.searchParams.get("format") === "csv") {
    const name = `${results.batch.name}-${results.test.title}`.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").slice(0, 80) || "results";
    // A byte-order mark makes Excel read the names as UTF-8.
    return new Response("\uFEFF" + resultsCsv(results), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}.csv"`, "Cache-Control": "no-store" },
    });
  }
  return json(results, { headers: { "Cache-Control": "no-store" } });
});
