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
  EMAIL_NOT_VERIFIED: "Verify your email to continue.",
  INVALID_OTP: "That code is not right. Check the email and try again.",
  OTP_EXPIRED: "That code has expired. Request a new one.",
  TOO_MANY_ATTEMPTS: "Too many wrong codes. Request a new one.",
  invalid_credentials: "Incorrect email or password.",
  user_already_exists: "An account with this email already exists. Log in instead.",
  email_exists: "An account with this email already exists. Log in instead.",
  weak_password: "Password must be at least 8 characters.",
};

interface FailureShape {
  code?: string;
  message?: string;
  status?: number;
  // Thrown errors carry the server's JSON one level down.
  body?: FailureShape;
  error?: FailureShape;
}
type AuthFailure = FailureShape | null | undefined;

/** A failed Neon Auth call: the raw code (for branching) and a message to show. */
export interface AuthError {
  code: string;
  message: string;
}

function toAuthError(error: NonNullable<AuthFailure>, fallback: string): AuthError {
  // A thrown error normalises `code` and keeps the server's own code one level down; prefer the latter.
  const inner = error.error ?? error.body ?? {};
  const status = error.status ?? inner.status;
  const code = inner.code ?? error.code ?? (status === 429 ? "RATE_LIMITED" : "UNKNOWN");
  const message = status === 429 ? "Too many attempts. Please wait a minute and try again." : MESSAGES[code] || inner.message || error.message || fallback;
  return { code, message };
}

/**
 * Runs a Neon Auth call and returns the error to show, or null on success. The client reports
 * some failures in `error` and throws others (wrong password, network), so both are handled.
 */
export async function authAttempt(call: () => Promise<{ error?: AuthFailure }>, fallback: string): Promise<AuthError | null> {
  try {
    const { error } = await call();
    return error ? toAuthError(error, fallback) : null;
  } catch (e) {
    return toAuthError(e as NonNullable<AuthFailure>, fallback);
  }
}

/** Emails a fresh 6-digit verification code to an unverified account. */
export const sendVerificationCode = (email: string) =>
  authAttempt(() => authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" }), "Could not send the code. Try again in a moment.");

/** Checks the code; the branch is set to sign the user in as soon as the email is verified. */
export const verifyEmailCode = (email: string, otp: string) => authAttempt(() => authClient.emailOtp.verifyEmail({ email, otp }), "Could not verify the code.");
