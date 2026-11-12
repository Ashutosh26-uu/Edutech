"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

/** A small notice while the browser is offline; it goes away by itself on reconnect. */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  // The live region is always there, so screen readers hear the notice when it appears.
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4 print:hidden">
      {offline && (
        <p className="pointer-events-auto flex max-w-md items-start gap-2 rounded-xl bg-ink px-3.5 py-2.5 text-xs font-medium text-on-ink shadow-lg">
          <WifiOff className="mt-px h-4 w-4 shrink-0" aria-hidden />
          <span>You’re offline. Pages you opened before still work; practice sets need internet.</span>
        </p>
      )}
    </div>
  );
}
