"use client";

import { Bell, BellOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_REMINDER_HOUR, hourLabel, isReminderHour, REMINDER_HOURS } from "@/lib/reminders";

/**
 * "Daily reminder" card on /today: opt-in Web Push. Permission is asked only when the user turns
 * it on. Hidden on the static build and when no VAPID public key is configured.
 */

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const IS_STATIC = process.env.NEXT_PUBLIC_STATIC === "1";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const HOUR_KEY = "studyclip:reminder-hour";

type Status = "loading" | "unsupported" | "ios-install" | "denied" | "off" | "on";

function readHour(): number {
  try {
    const h = Number(localStorage.getItem(HOUR_KEY));
    return isReminderHour(h) ? h : DEFAULT_REMINDER_HOUR;
  } catch {
    return DEFAULT_REMINDER_HOUR;
  }
}
function saveHour(h: number) {
  try {
    localStorage.setItem(HOUR_KEY, String(h));
  } catch {}
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
function isStandalone(): boolean {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
}
const pushSupported = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const b64 = (base64url + "=".repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** The service worker registration, registering /sw.js on demand (it is only auto-registered in production). */
async function swRegistration(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration();
  if (!existing) await navigator.serviceWorker.register(`${BASE}/sw.js`);
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Service worker did not start. Reload the page and try again.")), 10_000)),
  ]);
}

async function currentSubscription(): Promise<PushSubscription | null> {
  const reg = await navigator.serviceWorker.getRegistration();
  return (await reg?.pushManager.getSubscription()) ?? null;
}

async function saveOnServer(sub: PushSubscription, hour: number, examId?: string) {
  const res = await fetch(`${BASE}/api/push/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...sub.toJSON(), hour, examId: examId ?? null }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Could not save your reminder. Please try again.");
}

export function DailyReminder({ examId }: { examId?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [hour, setHour] = useState(DEFAULT_REMINDER_HOUR);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lastExam = useRef(examId);

  useEffect(() => {
    if (IS_STATIC || !PUBLIC_KEY) return;
    setHour(readHour());
    if (isIos() && !isStandalone()) return setStatus("ios-install");
    if (!pushSupported()) return setStatus("unsupported");
    if (Notification.permission === "denied") return setStatus("denied");
    currentSubscription()
      .then((s) => setStatus(s && Notification.permission === "granted" ? "on" : "off"))
      .catch(() => setStatus("off"));
  }, []);

  // Keep the exam in the reminder text up to date when the user changes exam.
  useEffect(() => {
    if (status !== "on" || lastExam.current === examId) return;
    lastExam.current = examId;
    currentSubscription()
      .then((s) => s && saveOnServer(s, hour, examId))
      .catch(() => {});
  }, [examId, status, hour]);

  const turnOn = useCallback(
    async (h: number) => {
      setBusy(true);
      setError("");
      try {
        const permission = await Notification.requestPermission();
        if (permission === "denied") return setStatus("denied");
        if (permission !== "granted") return setError("Notifications were not allowed. Turn the reminder on again to retry.");
        const reg = await swRegistration();
        const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(PUBLIC_KEY) }));
        try {
          await saveOnServer(sub, h, examId);
        } catch (e) {
          await sub.unsubscribe().catch(() => {});
          throw e;
        }
        lastExam.current = examId;
        setStatus("on");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not turn on reminders.");
      } finally {
        setBusy(false);
      }
    },
    [examId],
  );

  const turnOff = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const sub = await currentSubscription();
      if (sub) {
        await fetch(`${BASE}/api/push/subscribe`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) }).catch(() => {});
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch {
      setError("Could not turn off reminders. Please try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  const changeHour = async (h: number) => {
    setHour(h);
    saveHour(h);
    if (status !== "on") return;
    setBusy(true);
    setError("");
    try {
      const sub = await currentSubscription();
      if (sub) await saveOnServer(sub, h, examId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not change the time.");
    } finally {
      setBusy(false);
    }
  };

  if (IS_STATIC || !PUBLIC_KEY || status === "loading") return null;

  const on = status === "on";
  const canToggle = status === "on" || status === "off";
  return (
    <section className="card">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10">
          {status === "denied" || status === "unsupported" ? <BellOff className="h-5 w-5" strokeWidth={1.75} /> : <Bell className="h-5 w-5" strokeWidth={1.75} />}
        </span>
        <div className="min-w-0 flex-1 text-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-slate-900">Daily reminder</h2>
            {canToggle && (
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label="Daily reminder"
                disabled={busy}
                onClick={() => (on ? turnOff() : turnOn(hour))}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${on ? "bg-brand-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
              </button>
            )}
          </div>
          {status === "unsupported" && <p className="mt-1 text-slate-600">This browser can’t show notifications from websites. Try Chrome, Edge or Firefox.</p>}
          {status === "ios-install" && (
            <p className="mt-1 text-slate-600">
              On iPhone and iPad, reminders work only from the home-screen app (iOS 16.4 or later). In Safari, tap <b>Share</b> → <b>Add to Home Screen</b>, open StudyClip from there and turn this on.
            </p>
          )}
          {status === "denied" && (
            <p className="mt-1 text-slate-600">
              Notifications are blocked for this site. Allow them in your browser’s site settings (the lock or settings icon next to the address bar → Notifications → Allow), then reload this page.
            </p>
          )}
          {canToggle && (
            <>
              <p className="mt-1 text-slate-600">{on ? `We’ll nudge you once a day at ${hourLabel(hour)} (India time).` : "One notification a day when today’s question is ready. Turn off any time."}</p>
              <label className="mt-2 flex items-center gap-2 text-slate-600">
                Time
                <select className="input w-auto py-1.5 text-sm" value={hour} disabled={busy} onChange={(e) => changeHour(Number(e.target.value))} aria-label="Reminder time">
                  {REMINDER_HOURS.map((h) => (
                    <option key={h} value={h}>
                      {hourLabel(h)} IST
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>
      </div>
    </section>
  );
}
