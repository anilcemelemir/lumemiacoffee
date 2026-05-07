import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useTheme } from "../lib/theme";
import { MediaDropzone } from "../components/MediaDropzone";

type Item = {
  key: string;
  value: string;
  kind: "color" | "text" | "url" | "font";
  group: "theme" | "brand" | "typography" | string;
  label: string | null;
  sort_order: number;
  updated_at: string;
};

type ListResponse = { status: "ok"; data: Item[] };

const GROUP_LABELS: Record<string, string> = {
  theme: "Renk Paleti",
  brand: "Marka",
  icons: "İkonlar",
  typography: "Tipografi",
  layout: "YerleÅŸim & DavranÄ±ÅŸ",
};

function uploadPrefixFor(key: string): string {
  if (key === "logo-mark-url") return "logo-mark";
  if (key === "favicon-url") return "favicon";
  if (key === "apple-touch-icon-url") return "apple-touch-icon";
  return "logo";
}

const OPTION_CHOICES: Record<string, { value: string; label: string }[]> = {
  "menu_cta.background": [
    { value: "dotted", label: "Bordo + dotted desen" },
    { value: "cream",  label: "Krem zemin" },
  ],
  "nav.solid_on_subpages": [
    { value: "true",  label: "Evet — opak başlasın" },
    { value: "false", label: "Hayır — şeffaf başlasın" },
  ],
  "menu.compact_footer": [
    { value: "true",  label: "Evet — kompakt" },
    { value: "false", label: "Hayır — tam yükseklik" },
  ],
  "mobile.heading.scale": [
    { value: "1", label: "Normal" },
    { value: "0.9", label: "Küçültülmüş" },
    { value: "1.1", label: "Büyütülmüş" },
  ],
  "mobile.body.scale": [
    { value: "1", label: "Normal" },
    { value: "0.95", label: "Biraz küçük" },
    { value: "1.05", label: "Biraz büyük" },
  ],
  "mobile.nav.scale": [
    { value: "1", label: "Normal" },
    { value: "0.95", label: "Daha sık" },
    { value: "1.05", label: "Daha rahat" },
  ],
};

export function AppearanceManager() {
  const { refresh } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<ListResponse>("/api/v1/admin/appearance", true)
      .then((r) => setItems(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : "YÃ¼kleme hatasÄ±"))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = {};
    for (const it of items) (g[it.group] ??= []).push(it);
    return g;
  }, [items]);

  const dirtyCount = Object.keys(edits).length;

  function setField(key: string, value: string, original: string) {
    setEdits((prev) => {
      const next = { ...prev };
      if (value === original) delete next[key];
      else next[key] = value;
      return next;
    });
  }

  async function save() {
    if (dirtyCount === 0) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const items_ = Object.entries(edits).map(([key, value]) => ({ key, value }));
      const r = await api.put<{ status: "ok"; message: string }>(
        "/api/v1/admin/appearance",
        { items: items_ },
        true,
      );
      setMessage(r.message);
      // Refresh local list
      const list = await api.get<ListResponse>("/api/v1/admin/appearance", true);
      setItems(list.data);
      setEdits({});
      // Re-pull theme into the live page
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "KayÄ±t hatasÄ±");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-stone-500">YÃ¼kleniyorâ€¦</p>;

  return (
    <div className="space-y-8">
      <div className="sticky top-0 bg-[var(--surface-paper)]/95 backdrop-blur z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 border-b border-[var(--border-soft)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl sm:text-2xl font-display text-[var(--brand-primary)]">Görünüm Ayarları</h2>
            <p className="text-sm text-[var(--text-muted)]">Renkler değiştiğinde siteye anında yansır.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {message && <span className="text-sm text-green-700">{message}</span>}
            {error && <span className="text-sm text-red-700">{error}</span>}
            <button
              onClick={save}
              disabled={dirtyCount === 0 || saving}
              className="px-4 py-2 rounded-full bg-[var(--brand-primary)] text-[var(--text-on-dark)] disabled:opacity-40 hover:bg-[var(--brand-primary-dark)] transition text-sm tracking-wider uppercase"
            >
              {saving ? "Kaydediliyor…" : `Kaydet${dirtyCount ? ` (${dirtyCount})` : ""}`}
            </button>
          </div>
        </div>
      </div>

      {Object.entries(grouped).map(([group, list]) => (
        <section key={group} className="bg-[var(--surface-paper)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-6">
          <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--brand-accent)] mb-5">
            {GROUP_LABELS[group] ?? group}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {list.map((it) => {
              const current = edits[it.key] ?? it.value;
              const isDirty = it.key in edits;
              const optionChoices = OPTION_CHOICES[it.key];
              return (
                <div key={it.key} className="flex items-start gap-4">
                  {it.kind === "color" && (
                    <input
                      type="color"
                      value={/^#/.test(current) ? current : "#000000"}
                      onChange={(e) => setField(it.key, e.target.value, it.value)}
                      className="w-14 h-14 rounded-xl border border-[var(--border-soft)] cursor-pointer flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {it.label ?? it.key}
                      {isDirty && <span className="ml-2 text-[var(--brand-accent)]">â—</span>}
                    </label>
                    {it.kind === "url" ? (
                      <MediaDropzone
                        kind="image"
                        value={current || null}
                        onChange={(url) => setField(it.key, url ?? "", it.value)}
                        prefix={uploadPrefixFor(it.key)}
                        label={it.label ?? it.key}
                      />
                    ) : optionChoices ? (
                      <select
                        value={current}
                        onChange={(e) => setField(it.key, e.target.value, it.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--border-soft)] bg-white text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                      >
                        {optionChoices.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={current}
                        onChange={(e) => setField(it.key, e.target.value, it.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--border-soft)] bg-white text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                      />
                    )}
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 truncate">
                      <code>--{it.key}</code>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

