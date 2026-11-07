import { Fragment } from "react";

/**
 * Question and explanation text. Line breaks are kept, and code between ``` fences is shown as a
 * monospaced block that keeps its indentation (Python needs it), scrolling sideways on phones.
 */
export function RichText({ text }: { text: string }) {
  if (!text.includes("```")) return <>{text}</>;
  return (
    <>
      {text.split("```").map((part, i) =>
        i % 2 ? (
          <pre key={i} className="my-2 overflow-x-auto rounded-lg bg-slate-100 px-3 py-2 font-mono text-[13px] leading-relaxed font-normal whitespace-pre text-slate-800">
            {part.replace(/^[a-z+#]*\n/i, "").replace(/\n$/, "")}
          </pre>
        ) : (
          <Fragment key={i}>{part.replace(/^\n|\n$/g, "")}</Fragment>
        ),
      )}
    </>
  );
}
