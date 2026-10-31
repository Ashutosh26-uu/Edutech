import type { AIProvider } from "./provider";
import { localProvider } from "./local";

/**
 * Returns the active AI provider. Only the rule-based local provider exists today.
 * To add Claude: implement AIProvider in `./claude.ts` and return it here when
 * `process.env.AI_PROVIDER === "claude"`.
 */
export function getProvider(): AIProvider {
  return localProvider;
}

export type { AIProvider };
