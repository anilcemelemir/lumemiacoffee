import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";

type Dict = Record<string, string>;
type ContentResponse = { status: "ok"; locale: string; content: Dict };

type Ctx = {
  ready: boolean;
  t: (key: string, fallback?: string) => string;
};

const ContentCtx = createContext<Ctx>({ ready: false, t: (_k, fb) => fb ?? "" });

export function ContentProvider({ children }: { children: ReactNode }) {
  const [dict, setDict] = useState<Dict>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get<ContentResponse>("/api/v1/content")
      .then((r) => { if (!cancelled) setDict(r.content); })
      .catch(() => { /* leave dict empty; t() will use fallbacks */ })
      .finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      t: (key, fallback) => dict[key] ?? fallback ?? key,
    }),
    [dict, ready],
  );

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

export function useT() {
  return useContext(ContentCtx).t;
}

export function useContentReady() {
  return useContext(ContentCtx).ready;
}

/** Split a multi-line content value on \n (literal or escaped). */
export function splitLines(value: string): string[] {
  return value.replace(/\\n/g, "\n").split("\n").map((s) => s.trim()).filter(Boolean);
}

/** Split a comma-separated content value into trimmed items. */
export function splitList(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}
