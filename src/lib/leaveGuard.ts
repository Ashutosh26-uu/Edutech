"use client";

import { useEffect } from "react";

/**
 * While `active`, asks before the page is left: the browser's own prompt on reload, close or an
 * external link (beforeunload), and a confirm on in-app links, which would otherwise swap the page
 * without asking. Used only while a timed test runs or a practice set is part-way through.
 */
export function useLeaveGuard(active: boolean, message: string) {
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Older browsers show the prompt only when returnValue is set.
      e.returnValue = "";
    };
    // Capture phase on document runs before Next's <Link> handler (React listens lower down).
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      // Other sites unload the page, so beforeunload asks; a #hash on this page leaves nothing.
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      if (!window.confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [active, message]);
}
