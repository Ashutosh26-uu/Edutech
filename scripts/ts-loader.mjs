// Lets Node run the app's TypeScript sources directly (with --experimental-strip-types):
// resolves the "@/..." alias and extension-less imports, and stubs "server-only".
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
    let target;
    if (specifier.startsWith("@/")) target = pathToFileURL(path.join(SRC, specifier.slice(2))).href;
    else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) target = new URL(specifier, context.parentURL).href;
    else return next(specifier, context);
    const p = fileURLToPath(target);
    for (const ext of ["", ".ts", ".tsx", "/index.ts"]) {
      if (existsSync(p + ext) && !(ext === "" && !path.extname(p))) return { url: pathToFileURL(p + ext).href, shortCircuit: true };
    }
    return next(specifier, context);
  },
});
