"use client";

import { createAuthClient } from "@neon/auth/next";

/** Neon Auth in the browser, through this app's /api/auth/* proxy (server deployment only). */
export const authClient = createAuthClient();

const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Incorrect email or password.",
  USER_ALREADY_EXISTS: "An account with this email already exists. Log in instead.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "An account with this email already exists. Log in instead.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
  INVALID_EMAIL: "Enter a valid email address.",
  invalid_credentials: "Incorrect email or password.",
  user_already_exists: "An account with this email already exists. Log in instead.",
  email_exists: "An account with this email already exists. Log in instead.",
  weak_password: "Password must be at least 8 characters.",
};

type AuthFailure = { code?: string; message?: string; status?: number } | null | undefined;

/** A user-facing message for a Neon Auth error. */
function authErrorMessage(error: NonNullable<AuthFailure>, fallback: string) {
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  return (error.code && MESSAGES[error.code]) || error.message || fallback;
}

/**
 * Runs a Neon Auth call and returns a message to show, or null on success. The client reports
 * some failures in `error` and throws others (wrong password, network), so both are handled.
 */
export async function authAttempt(call: () => Promise<{ error?: AuthFailure }>, fallback: string): Promise<string | null> {
  try {
    const { error } = await call();
    return error ? authErrorMessage(error, fallback) : null;
  } catch (e) {
    return authErrorMessage(e as NonNullable<AuthFailure>, fallback);
  }
}
