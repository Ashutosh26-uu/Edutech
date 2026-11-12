"use client";

import { useEffect, useState } from "react";

/**
 * While a timed test runs, <body data-timed-test="1"> is set and an event fires, so floating
 * extras (the help chat) can step out of the way until it ends.
 */
const EVENT = "studyclip:timed-test";

export function setTimedTestRunning(on: boolean) {
  if (typeof document === "undefined") return;
  if (on) document.body.dataset.timedTest = "1";
  else delete document.body.dataset.timedTest;
  window.dispatchEvent(new Event(EVENT));
}

/** Marks a timed test as running while `on` is true, and clears it when it ends or the component unmounts. */
export function useMarkTimedTest(on: boolean) {
  useEffect(() => {
    if (!on) return;
    setTimedTestRunning(true);
    return () => setTimedTestRunning(false);
  }, [on]);
}

export function useTimedTestRunning(): boolean {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const refresh = () => setRunning(document.body.dataset.timedTest === "1");
    refresh();
    window.addEventListener(EVENT, refresh);
    return () => window.removeEventListener(EVENT, refresh);
  }, []);
  return running;
}
