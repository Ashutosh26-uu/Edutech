/** Normalises program output for comparison: \r, extra spaces inside a line, trailing spaces and blank lines at the end are ignored. */
export const normalise = (s: string) =>
  s
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim().replace(/\s+/g, " "))
    .join("\n")
    .trim();
