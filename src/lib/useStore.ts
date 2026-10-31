"use client";

import { useEffect, useState } from "react";
import { load, UPDATE_EVENT } from "./storage";

export type StoreData = ReturnType<typeof load>;

/** Saved progress that re-renders whenever anything (in this or another tab) writes to it. Null until mounted. */
export function useStore(): StoreData | null {
  const [data, setData] = useState<StoreData | null>(null);
  useEffect(() => {
    const refresh = () => setData(load());
    refresh();
    window.addEventListener(UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return data;
}
