import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";

type Entry = { value: string; kind: string };
type AppearanceResponse = {
  status: "ok";
  theme: Record<string, Entry>;       // colors → CSS vars
  brand: Record<string, Entry>;       // logo url, name
  typography: Record<string, Entry>;  // font families
  layout?: Record<string, Entry>;     // layout/feature toggles
};

export type ThemeContextValue = {
  ready: boolean;
  colors: Record<string, string>;
  brand: Record<string, string>;
  layout: Record<string, string>;
  refresh: () => Promise<void>;
};

const FALLBACK: ThemeContextValue = {
  ready: false,
  colors: {
    "brand-primary": "#6B1F2A",
    "brand-primary-dark": "#4A1218",
    "brand-accent": "#C9A961",
    "brand-accent-soft": "#E2C68A",
    "surface-cream": "#F4EFE6",
    "surface-paper": "#FAF6EE",
    "surface-ink": "#2A1A1C",
    "surface-mist": "#EDE4D3",
    "text-primary": "#2A1A1C",
    "text-on-dark": "#F4EFE6",
    "text-muted": "#7A6B5D",
    "border-soft": "#E0D4BE",
  },
  brand: {
    "logo-url": "/images/logo.svg",
    "logo-mark-url": "/images/logo-mark.svg",
    "brand-name": "Lume Mia Coffee",
  },
  layout: {
    "menu_cta.background": "dotted",
    "nav.solid_on_subpages": "true",
    "menu.compact_footer": "true",
  },
  refresh: async () => {},
};

function applyToRoot(colors: Record<string, string>, fonts: Record<string, string>) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(colors)) {
    root.style.setProperty(`--${k}`, v);
  }
  for (const [k, v] of Object.entries(fonts)) {
    root.style.setProperty(`--${k}`, v);
  }
}

const ThemeCtx = createContext<ThemeContextValue>(FALLBACK);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<Record<string, string>>(FALLBACK.colors);
  const [brand, setBrand] = useState<Record<string, string>>(FALLBACK.brand);
  const [layout, setLayout] = useState<Record<string, string>>(FALLBACK.layout);
  const [fonts, setFonts] = useState<Record<string, string>>({
    "font-display": "Cormorant Garamond, serif",
    "font-body": "Inter, sans-serif",
  });
  const [ready, setReady] = useState(false);

  // Apply fallback immediately so the page never flashes unstyled.
  useEffect(() => { applyToRoot(FALLBACK.colors, fonts); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function load() {
    try {
      const r = await api.get<AppearanceResponse>("/api/v1/appearance");
      const c: Record<string, string> = {};
      for (const [k, e] of Object.entries(r.theme || {})) c[k] = e.value;
      const b: Record<string, string> = {};
      for (const [k, e] of Object.entries(r.brand || {})) b[k] = e.value;
      const f: Record<string, string> = {};
      for (const [k, e] of Object.entries(r.typography || {})) f[k] = e.value;
      const l: Record<string, string> = {};
      for (const [k, e] of Object.entries(r.layout || {})) l[k] = e.value;
      setColors({ ...FALLBACK.colors, ...c });
      setBrand({ ...FALLBACK.brand, ...b });
      setFonts((prev) => ({ ...prev, ...f }));
      setLayout({ ...FALLBACK.layout, ...l });
      applyToRoot({ ...FALLBACK.colors, ...c }, { ...fonts, ...f });
    } catch {
      /* keep fallback */
    } finally {
      setReady(true);
    }
  }

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ ready, colors, brand, layout, refresh: load }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, colors, brand, layout],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
