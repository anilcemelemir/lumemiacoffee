import { useEffect, useState } from "react";
import { Save, Loader2, Check, X, AlertTriangle, Globe, Code } from "lucide-react";
import { api } from "../lib/api";

type SeoItem = { key: string; value: string | null; updated_at: string };
type ListResponse = { status: "ok"; data: SeoItem[] };
type SaveState = "idle" | "saving" | "success" | "error";

const SEO_FIELDS = {
  meta: [
    { key: "meta_title",       label: "Global Meta Başlık",            placeholder: "Lume Mia Coffee — Botanik Demlemeler", type: "input" as const },
    { key: "meta_description", label: "Meta Açıklama (Description)",   placeholder: "Sitenizin arama motorlarında görünen açıklama metni…", type: "textarea" as const },
    { key: "meta_keywords",    label: "Anahtar Kelimeler (Keywords)",  placeholder: "kahve, coffee shop, istanbul, botanik…", type: "input" as const },
    { key: "og_image",         label: "Sosyal Medya Paylaşım Görseli (og:image)", placeholder: "https://lumemia.coffee/images/og-card.jpg", type: "input" as const },
  ],
  tracking: [
    { key: "tracking_head", label: "<head> İçine Eklenecek Kodlar", placeholder: "<!-- Google Analytics, Yandex Metrica, Facebook Pixel vb. -->\n<script>...</script>", type: "code" as const },
    { key: "tracking_body", label: "<body> Başına Eklenecek Kodlar", placeholder: "<!-- Google Tag Manager (noscript), Hotjar vb. -->\n<noscript>...</noscript>", type: "code" as const },
  ],
};

export function SeoManager() {
  const [items, setItems] = useState<Record<string, string>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStateMeta, setSaveStateMeta] = useState<SaveState>("idle");
  const [saveStateTrack, setSaveStateTrack] = useState<SaveState>("idle");
  const [saveMsg, setSaveMsg] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .get<ListResponse>("/api/v1/admin/seo", true)
      .then((r) => {
        const map: Record<string, string> = {};
        for (const it of r.data) map[it.key] = it.value ?? "";
        setItems(map);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Yükleme hatası"))
      .finally(() => setLoading(false));
  }, []);

  function val(key: string) {
    return edits[key] ?? items[key] ?? "";
  }
  function setEdit(key: string, value: string) {
    setEdits((p) => ({ ...p, [key]: value }));
  }
  function isDirty(key: string) {
    return edits[key] !== undefined && edits[key] !== (items[key] ?? "");
  }

  async function saveGroup(
    keys: string[],
    setState: (s: SaveState) => void,
    groupLabel: string,
  ) {
    const dirty = keys.filter(isDirty);
    if (dirty.length === 0) return;

    setState("saving");
    setSaveMsg((s) => ({ ...s, [groupLabel]: "" }));

    try {
      const payload = { items: dirty.map((k) => ({ key: k, value: edits[k] })) };
      const r = await api.put<{ status: "ok"; message: string }>(
        "/api/v1/admin/seo",
        payload,
        true,
      );
      setItems((prev) => {
        const next = { ...prev };
        for (const k of dirty) next[k] = edits[k];
        return next;
      });
      setEdits((prev) => {
        const next = { ...prev };
        for (const k of dirty) delete next[k];
        return next;
      });
      setState("success");
      setSaveMsg((s) => ({ ...s, [groupLabel]: r.message }));
      setTimeout(() => setState("idle"), 2200);
    } catch (e) {
      setState("error");
      setSaveMsg((s) => ({
        ...s,
        [groupLabel]: e instanceof Error ? e.message : "Kaydetme hatası",
      }));
      setTimeout(() => setState("idle"), 4000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        <Loader2 className="w-4 h-4 animate-spin" />
        SEO ayarları yükleniyor…
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
        {loadError}
      </p>
    );
  }

  const metaKeys = SEO_FIELDS.meta.map((f) => f.key);
  const trackKeys = SEO_FIELDS.tracking.map((f) => f.key);
  const metaDirtyCount = metaKeys.filter(isDirty).length;
  const trackDirtyCount = trackKeys.filter(isDirty).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-[var(--brand-primary)]">
          SEO & Analitik
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Arama motoru optimizasyonu ve izleme kodlarını yönetin.
        </p>
      </div>

      {/* Meta Tags Section */}
      <section className={`bg-[var(--surface-paper)] rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        saveStateMeta === "success"
          ? "border-emerald-400 ring-2 ring-emerald-100"
          : saveStateMeta === "error"
          ? "border-red-400 ring-2 ring-red-100"
          : metaDirtyCount > 0
          ? "border-[var(--brand-primary)]"
          : "border-[var(--border-soft)]"
      }`}>
        <header className="flex items-start justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-[var(--border-soft)] bg-[var(--surface-cream)]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Globe className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-display text-lg text-[var(--brand-primary)] uppercase tracking-wide">
                Meta Etiketleri
              </h3>
              {metaDirtyCount > 0 && saveStateMeta !== "success" && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                  {metaDirtyCount} değişiklik
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Arama motorlarında ve sosyal medya paylaşımlarında görünen bilgiler
            </p>
          </div>
          <SaveButton
            state={saveStateMeta}
            dirty={metaDirtyCount > 0}
            message={saveMsg["meta"] ?? ""}
            onClick={() => saveGroup(metaKeys, setSaveStateMeta, "meta")}
          />
        </header>
        <div className="px-4 py-4 sm:px-6 sm:py-5 space-y-4">
          {SEO_FIELDS.meta.map((field) => (
            <SeoField
              key={field.key}
              field={field}
              value={val(field.key)}
              dirty={isDirty(field.key)}
              onChange={(v) => setEdit(field.key, v)}
            />
          ))}
          {/* Preview */}
          <div className="mt-4 p-4 rounded-xl bg-[var(--surface-cream)] border border-[var(--border-soft)]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand-accent)] mb-3">
              Google Arama Önizlemesi
            </p>
            <div className="space-y-1">
              <p className="text-[#1a0dab] text-lg leading-tight truncate" style={{ fontFamily: "Arial, sans-serif" }}>
                {val("meta_title") || "Lume Mia Coffee"}
              </p>
              <p className="text-[#006621] text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
                lumemia.coffee
              </p>
              <p className="text-[#545454] text-sm leading-snug line-clamp-2" style={{ fontFamily: "Arial, sans-serif" }}>
                {val("meta_description") || "Meta açıklama henüz girilmedi."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Scripts Section */}
      <section className={`bg-[var(--surface-paper)] rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        saveStateTrack === "success"
          ? "border-emerald-400 ring-2 ring-emerald-100"
          : saveStateTrack === "error"
          ? "border-red-400 ring-2 ring-red-100"
          : trackDirtyCount > 0
          ? "border-[var(--brand-primary)]"
          : "border-[var(--border-soft)]"
      }`}>
        <header className="flex items-start justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-[var(--border-soft)] bg-[var(--surface-cream)]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Code className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-display text-lg text-[var(--brand-primary)] uppercase tracking-wide">
                İzleme Kodları
              </h3>
              {trackDirtyCount > 0 && saveStateTrack !== "success" && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                  {trackDirtyCount} değişiklik
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Google Analytics, Yandex Metrica, Facebook Pixel gibi izleme scriptleri
            </p>
          </div>
          <SaveButton
            state={saveStateTrack}
            dirty={trackDirtyCount > 0}
            message={saveMsg["tracking"] ?? ""}
            onClick={() => saveGroup(trackKeys, setSaveStateTrack, "tracking")}
          />
        </header>
        <div className="px-4 py-4 sm:px-6 sm:py-5 space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Dikkat: Bu alanlara eklenen kodlar doğrudan sitenizde çalışacaktır.</p>
              <p className="mt-0.5 text-amber-700">
                Yalnızca güvendiğiniz servislerin kodlarını ekleyin. Hatalı JavaScript kodu sitenizi bozabilir.
              </p>
            </div>
          </div>
          {SEO_FIELDS.tracking.map((field) => (
            <SeoField
              key={field.key}
              field={field}
              value={val(field.key)}
              dirty={isDirty(field.key)}
              onChange={(v) => setEdit(field.key, v)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------
// SeoField
// ---------------------------------------------------------------

type FieldDef = { key: string; label: string; placeholder: string; type: "input" | "textarea" | "code" };

function SeoField({
  field,
  value,
  dirty,
  onChange,
}: {
  field: FieldDef;
  value: string;
  dirty: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          {field.label}
          {dirty && (
            <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--brand-primary)]">
              · düzenlendi
            </span>
          )}
        </label>
        <code className="text-[10px] text-[var(--text-muted)]">{field.key}</code>
      </div>

      {field.type === "input" ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-3 py-2 bg-white border border-[var(--border-soft)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition"
        />
      ) : field.type === "code" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={6}
          spellCheck={false}
          className="w-full px-3 py-2 bg-[#1e1e2e] text-[#cdd6f4] border border-[var(--border-soft)] rounded-lg text-sm font-mono focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition resize-y leading-relaxed"
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-[var(--border-soft)] rounded-lg text-sm font-sans focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition resize-y"
        />
      )}

      {field.key === "og_image" && value && (
        <div className="mt-2 rounded-lg overflow-hidden border border-[var(--border-soft)] max-w-xs">
          <img src={value} alt="OG Image preview" className="w-full h-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------
// Save Button (same pattern as ContentEditor)
// ---------------------------------------------------------------

function SaveButton({
  state,
  dirty,
  message,
  onClick,
}: {
  state: SaveState;
  dirty: boolean;
  message: string;
  onClick: () => void;
}) {
  if (state === "success") {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm animate-[pulse_0.6s_ease-out]">
        <Check className="w-4 h-4" />
        Kaydedildi
      </div>
    );
  }
  if (state === "error") {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-200 text-sm max-w-xs"
        title={message}
      >
        <X className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{message || "Hata"}</span>
      </div>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={!dirty || state === "saving"}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        dirty
          ? "bg-[var(--brand-primary)] text-[var(--text-on-dark)] hover:bg-[var(--brand-primary-dark)] shadow-sm"
          : "bg-[var(--surface-mist)] text-[var(--text-muted)] cursor-not-allowed"
      }`}
    >
      {state === "saving" ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {state === "saving" ? "Kaydediliyor…" : "Kaydet"}
    </button>
  );
}
