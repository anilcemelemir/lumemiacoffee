import { useEffect, useMemo, useState, useRef } from "react";
import { Check, X, Save, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { MediaDropzone } from "../components/MediaDropzone";
import { RichTextEditor } from "../components/RichTextEditor";

type ContentItem = {
  key: string;
  value: string | null;
  group: string;
  label: string | null;
  updated_at: string;
};

type ListResponse = { status: "ok"; data: ContentItem[] };

type SaveState = "idle" | "saving" | "success" | "error";

// ---------------------------------------------------------------
// Category & section configuration
// ---------------------------------------------------------------

type CategoryId = "intro" | "story" | "sections" | "contact" | "media";

type CategoryDef = {
  id: CategoryId;
  label: string;
  description: string;
  /** Section groups (matches `group` column) belonging to this category */
  groups: string[];
};

const CATEGORIES: CategoryDef[] = [
  {
    id: "intro",
    label: "Giriş",
    description: "Marka, navigasyon ve sayfa başındaki Hero kartı",
    groups: ["brand", "nav", "hero"],
  },
  {
    id: "story",
    label: "Hikâyemiz",
    description: "Ana sayfadaki kısa mesajlar ve /hikayemiz sayfasının zengin metinli içeriği",
    groups: ["story", "taste", "botanical", "slowdown"],
  },
  {
    id: "sections",
    label: "Bölümler",
    description: "Bitkisel, kavurma, barista, seçki ve menü bölümleri",
    groups: ["plant", "roasted", "barista", "selection", "menu"],
  },
  {
    id: "contact",
    label: "İletişim & Footer",
    description: "Adres, ziyaret bilgileri, bülten ve footer metinleri",
    groups: ["visit", "newsletter", "footer"],
  },
  {
    id: "media",
    label: "Görsel Yönetimi",
    description: "Ana sayfadaki tüm görseller — sürükle bırak ile yükleyin, otomatik WebP'ye dönüşür",
    groups: [
      "media-hero",
      "media-taste",
      "media-plant",
      "media-roasted",
      "media-barista",
      "media-slowdown",
      "media-selection",
      "media-visit",
    ],
  },
];

// Section card titles describe WHERE the block lives on the public site.
// They no longer mirror the user's typed text — they are stable layout
// landmarks (a 'site map' for the editor).
const SECTION_LABELS: Record<string, { label: string; hint: string }> = {
  brand:      { label: "Marka Kimliği (Tüm Sayfalarda)",       hint: "Marka adı, slogan ve logo filigranı — başlık ve footer'da görünür" },
  story:      { label: "Hikâyemiz Sayfası (/hikayemiz)",        hint: "Ayrı /hikayemiz sayfasının tüm metin ve görsel alanları" },
  nav:        { label: "Navigasyon (Üst Menü Bağlantıları)",    hint: "Sağ üstteki menü bağlantı etiketleri" },
  hero:       { label: "Hero (Sayfanın En Üst Bölümü)",         hint: "Açılış kartı: üst etiket, büyük başlık ve görsel kompozisyon" },
  taste:      { label: "Anı Tadın (Hero'dan Sonraki 1. Bölüm)", hint: "Hero altındaki sakin karşılama bloğu" },
  botanical:  { label: "Botanik Demlemeler (Koyu Zeminli Geniş Bölüm)", hint: "Tam genişlik koyu arka planlı botanik bölümü" },
  slowdown:   { label: "Yavaşlayın (Mola Bölümü)",              hint: "Sayfa ortasındaki dinlenme/atmosfer bloğu" },
  plant:      { label: "Bitkisel & Vegan Bölümü",               hint: "Vegan & bitkisel seçenekler bloğu" },
  roasted:    { label: "Yeni Kavruldu (Çekirdek Mozaik Bölümü)",hint: "Kavurma vurgusu — çekirdek kareleri ve makine fotoğrafı" },
  barista:    { label: "Barista Zanaatı (Portreli Bölüm)",      hint: "Barista portresi etrafındaki başlık, etiket ve buton metinleri" },
  selection:  { label: "Kahve Seçkimiz (Dönen Halka Bölümü)",   hint: "Üç çekirdek kartlı, dönen halka bölümü" },
  menu:       { label: "Menü Önizlemesi (Anasayfa Bloğu)",      hint: "Anasayfadaki menü vurgusu — başlık, etiket ve 'Tümünü gör' butonu" },
  visit:      { label: "Bizi Ziyaret Edin (Footer Öncesi)",     hint: "Adres, çalışma saatleri, telefon ve e-posta bloğu" },
  newsletter: { label: "Bülten Bölümü (Footer Hemen Üstü)",     hint: "Newsletter formu ve sosyal medya etiketleri" },
  footer:     { label: "Footer (Sayfanın En Altı)",             hint: "Hızlı bağlantılar, küçük not formu ve telif satırı" },
  // Media groups
  "media-hero":      { label: "Görsel · Giriş (Hero)",        hint: "Sayfanın açılışındaki üç katmanlı kart kompozisyonu" },
  "media-taste":     { label: "Görsel · Anı Tadın",           hint: "Üç sütunlu sakin koleksiyon" },
  "media-plant":     { label: "Görsel · Bitkisel",            hint: "Vegan & bitkisel bölüm görselleri" },
  "media-roasted":   { label: "Görsel · Yeni Kavruldu",       hint: "Çekirdek mozaik, kavurma makinesi ve fincan" },
  "media-barista":   { label: "Görsel · Barista Zanaatı",     hint: "Barista portresi, eller ve iş başında kart" },
  "media-slowdown":  { label: "Görsel · Yavaşlayın",          hint: "Bitki duvarı ve mekân iç görselleri" },
  "media-selection": { label: "Görsel · Kahve Seçkimiz",      hint: "Üçlü çekirdek kart grubu" },
  "media-visit":     { label: "Görsel · Bizi Ziyaret Edin",   hint: "Mekân/atölye fotoğrafı" },
};

// ---------------------------------------------------------------
// Per-slot recommended aspect ratio + size hint for image uploads.
// The aspect is sent to the backend so GD center-crops to the exact
// container shape; the hint is shown to the user under the dropzone.
// ---------------------------------------------------------------

type MediaSlot = {
  /** Aspect ratio sent to /api/v1/admin/uploads/image (e.g. "3:4"). */
  aspect: string;
  /** Recommended source dimensions, shown in the helper text. */
  recommended: string;
};

const MEDIA_SLOTS: Record<string, MediaSlot> = {
  // Hero
  "media.hero.latte":         { aspect: "3:4",  recommended: "1200×1600 (portre)" },
  "media.hero.collage":       { aspect: "5:7",  recommended: "1400×1960 (portre)" },
  "media.hero.pour_overlay":  { aspect: "3:4",  recommended: "600×800 (portre)" },
  // Taste
  "media.taste.hand":         { aspect: "3:4",  recommended: "1200×1600 (portre)" },
  "media.taste.latte":        { aspect: "1:1",  recommended: "1200×1200 (kare)" },
  "media.taste.pour":         { aspect: "3:4",  recommended: "1200×1600 (portre)" },
  // Plant-based
  "media.plant.background":   { aspect: "3:4",  recommended: "1400×1860 (portre)" },
  "media.plant.jug":          { aspect: "3:4",  recommended: "600×800 (portre)" },
  // Roasted
  "media.roasted.beans_1":    { aspect: "1:1",  recommended: "800×800 (kare)" },
  "media.roasted.beans_2":    { aspect: "1:1",  recommended: "800×800 (kare)" },
  "media.roasted.beans_3":    { aspect: "1:1",  recommended: "800×800 (kare)" },
  "media.roasted.beans_4":    { aspect: "1:1",  recommended: "800×800 (kare)" },
  "media.roasted.machine":    { aspect: "3:4",  recommended: "1400×1860 (portre)" },
  "media.roasted.cup":        { aspect: "1:1",  recommended: "1000×1000 (kare)" },
  // Barista
  "media.barista.portrait":   { aspect: "3:4",  recommended: "1400×1860 (portre)" },
  "media.barista.hands":      { aspect: "3:4",  recommended: "1600×2120 (portre)" },
  "media.barista.at_work":    { aspect: "3:4",  recommended: "800×1060 (portre)" },
  // Slow down
  "media.slowdown.plants":    { aspect: "3:4",  recommended: "1200×1600 (portre)" },
  "media.slowdown.interior":  { aspect: "1:1",  recommended: "1400×1400 (kare)" },
  // Selection
  "media.selection.variety":  { aspect: "5:4",  recommended: "1400×1120 (yatay)" },
  "media.selection.closeup":  { aspect: "5:4",  recommended: "1400×1120 (yatay)" },
  "media.selection.origin":   { aspect: "5:4",  recommended: "1400×1120 (yatay)" },
  // Visit
  "media.visit.interior":     { aspect: "16:10", recommended: "1920×1200 (yatay)" },
};

function slotFor(key: string): MediaSlot {
  return MEDIA_SLOTS[key] ?? { aspect: "1:1", recommended: "Otomatik kırpılacak" };
}

// ---------------------------------------------------------------
// Component
// ---------------------------------------------------------------

export function ContentEditor() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("intro");

  // Per-section save state: keyed by group name
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
  const [saveMessage, setSaveMessage] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .get<ListResponse>("/api/v1/admin/content", true)
      .then((r) => setItems(r.data))
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Yükleme hatası"))
      .finally(() => setLoading(false));
  }, []);

  const itemsByGroup = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const it of items) (map[it.group] ??= []).push(it);
    for (const g of Object.keys(map)) {
      map[g].sort((a, b) => a.key.localeCompare(b.key));
    }
    return map;
  }, [items]);

  function setEdit(key: string, value: string) {
    setEdits((p) => ({ ...p, [key]: value }));
  }

  function dirtyKeysFor(group: string): string[] {
    const groupItems = itemsByGroup[group] ?? [];
    return groupItems
      .filter((it) => edits[it.key] !== undefined && edits[it.key] !== (it.value ?? ""))
      .map((it) => it.key);
  }

  async function saveSection(group: string) {
    const dirty = dirtyKeysFor(group);
    if (dirty.length === 0) return;

    setSaveState((s) => ({ ...s, [group]: "saving" }));
    setSaveMessage((s) => ({ ...s, [group]: "" }));

    try {
      const payload = {
        items: dirty.map((key) => ({ key, value: edits[key] })),
      };
      const r = await api.put<{ status: "ok"; message: string; count: number }>(
        "/api/v1/admin/content",
        payload,
        true,
      );

      setItems((prev) =>
        prev.map((it) => (dirty.includes(it.key) ? { ...it, value: edits[it.key] } : it)),
      );
      setEdits((prev) => {
        const next = { ...prev };
        for (const k of dirty) delete next[k];
        return next;
      });

      setSaveState((s) => ({ ...s, [group]: "success" }));
      setSaveMessage((s) => ({ ...s, [group]: r.message }));
      window.setTimeout(() => {
        setSaveState((s) => (s[group] === "success" ? { ...s, [group]: "idle" } : s));
      }, 2200);
    } catch (e) {
      setSaveState((s) => ({ ...s, [group]: "error" }));
      setSaveMessage((s) => ({
        ...s,
        [group]: e instanceof Error ? e.message : "Kaydetme hatası",
      }));
      window.setTimeout(() => {
        setSaveState((s) => (s[group] === "error" ? { ...s, [group]: "idle" } : s));
      }, 4000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        <Loader2 className="w-4 h-4 animate-spin" />
        İçerikler yükleniyor…
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

  const activeDef = CATEGORIES.find((c) => c.id === activeCategory)!;
  // Only render groups in this category that actually have items
  const visibleGroups = activeDef.groups.filter((g) => (itemsByGroup[g]?.length ?? 0) > 0);
  // Append any groups present in DB but not assigned to a category, into "sections"
  const knownGroups = new Set(CATEGORIES.flatMap((c) => c.groups));
  const orphanGroups = Object.keys(itemsByGroup).filter((g) => !knownGroups.has(g));
  const groupsToShow =
    activeCategory === "sections" ? [...visibleGroups, ...orphanGroups] : visibleGroups;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-[var(--brand-primary)]">Site İçeriği</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Her bölümü ayrı ayrı düzenleyin ve kart başındaki{" "}
          <span className="font-medium text-[var(--brand-primary)]">Kaydet</span> butonu ile yayınlayın.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-soft)] pb-3">
        {CATEGORIES.map((cat) => {
          const active = cat.id === activeCategory;
          const dirtyInCat = cat.groups.reduce(
            (sum, g) => sum + dirtyKeysFor(g).length,
            0,
          );
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                active
                  ? "bg-[var(--brand-primary)] text-[var(--text-on-dark)] border-[var(--brand-primary)] shadow-sm"
                  : "bg-[var(--surface-paper)] text-[var(--text-primary)] border-[var(--border-soft)] hover:border-[var(--brand-primary)]"
              }`}
            >
              {cat.label}
              {dirtyInCat > 0 && (
                <span
                  className={`ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-bold ${
                    active
                      ? "bg-[var(--brand-accent)] text-[var(--surface-ink)]"
                      : "bg-[var(--brand-primary)] text-[var(--text-on-dark)]"
                  }`}
                >
                  {dirtyInCat}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-accent)]">
        {activeDef.description}
      </p>

      {/* Section Cards */}
      <div className="space-y-6">
        {groupsToShow.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">Bu kategoride içerik bulunamadı.</p>
        )}
        {groupsToShow.map((group) => (
          <SectionCard
            key={group}
            group={group}
            items={itemsByGroup[group] ?? []}
            edits={edits}
            onEdit={setEdit}
            onSave={() => saveSection(group)}
            state={saveState[group] ?? "idle"}
            message={saveMessage[group] ?? ""}
            dirtyKeys={dirtyKeysFor(group)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Section Card
// ---------------------------------------------------------------

type SectionCardProps = {
  group: string;
  items: ContentItem[];
  edits: Record<string, string>;
  onEdit: (key: string, value: string) => void;
  onSave: () => void;
  state: SaveState;
  message: string;
  dirtyKeys: string[];
};

function SectionCard({
  group,
  items,
  edits,
  onEdit,
  onSave,
  state,
  message,
  dirtyKeys,
}: SectionCardProps) {
  const meta = SECTION_LABELS[group] ?? { label: group, hint: "" };
  const dirtyCount = dirtyKeys.length;
  const cardRef = useRef<HTMLDivElement>(null);

  // Card headers use stable POSITIONAL labels — they describe where the
  // section sits on the public site, not what the user is typing.
  const headerTitle = meta.label;

  const borderClass =
    state === "success"
      ? "border-emerald-400 ring-2 ring-emerald-100"
      : state === "error"
      ? "border-red-400 ring-2 ring-red-100"
      : dirtyCount > 0
      ? "border-[var(--brand-primary)]"
      : "border-[var(--border-soft)]";

  return (
    <section
      ref={cardRef}
      className={`bg-[var(--surface-paper)] rounded-2xl border-2 ${borderClass} transition-all duration-300 overflow-hidden`}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[var(--border-soft)] bg-[var(--surface-cream)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-lg text-[var(--brand-primary)] uppercase tracking-wide">
              {headerTitle}
            </h3>
            <code className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface-paper)] px-2 py-0.5 rounded">
              {group}
            </code>
            {dirtyCount > 0 && state !== "success" && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                {dirtyCount} değişiklik
              </span>
            )}
          </div>
          {meta.hint && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{meta.hint}</p>
          )}
        </div>

        <SaveButton
          state={state}
          dirty={dirtyCount > 0}
          message={message}
          onClick={onSave}
        />
      </header>

      {/* Fields */}
      <div className="px-6 py-5 space-y-4">
        {items.map((it) => (
          <ContentField
            key={it.key}
            item={it}
            value={edits[it.key] ?? it.value ?? ""}
            dirty={edits[it.key] !== undefined && edits[it.key] !== (it.value ?? "")}
            onChange={(v) => onEdit(it.key, v)}
          />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------
// Save Button
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

// ---------------------------------------------------------------
// Content Field
// ---------------------------------------------------------------

function ContentField({
  item,
  value,
  dirty,
  onChange,
}: {
  item: ContentItem;
  value: string;
  dirty: boolean;
  onChange: (v: string) => void;
}) {
  const isMedia = item.group.startsWith("media-") || item.key === "story.image";
  const isRichHtml = item.key.endsWith("_html");
  const isTagList = !isMedia && !isRichHtml && item.key.endsWith(".tags");
  const isMultiline =
    !isMedia &&
    !isRichHtml &&
    !isTagList &&
    (item.key.endsWith(".main_title") ||
      item.key.endsWith(".title") ||
      item.key.endsWith(".address") ||
      item.key.endsWith(".body") ||
      item.key.endsWith(".intro") ||
      item.key.endsWith(".success") ||
      (item.value ?? "").includes("\n") ||
      (item.value ?? "").length > 80 ||
      value.includes("\n") ||
      value.length > 80);

  const label = positionalLabel(item.key) ?? item.label ?? humanizeKey(item.key);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          {label}
          {dirty && (
            <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--brand-primary)]">
              · düzenlendi
            </span>
          )}
        </label>
        <code className="text-[10px] text-[var(--text-muted)]">{item.key}</code>
      </div>

      {isMedia ? (
        <MediaDropzone
          kind="image"
          value={value || null}
          onChange={(url) => onChange(url ?? "")}
          aspect={slotFor(item.key).aspect}
          prefix={item.group.replace(/^media-/, "site-")}
          label={label}
          hint={`Önerilen boyut: ${slotFor(item.key).recommended} · ${slotFor(item.key).aspect} oranında otomatik kırpılır.`}
        />
      ) : isRichHtml ? (
        <RichTextEditor value={value} onChange={onChange} />
      ) : isTagList ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Etiket 1, Etiket 2, Etiket 3"
          className="w-full px-3 py-2 bg-white border border-[var(--border-soft)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition"
        />
      ) : isMultiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(6, Math.max(2, value.split("\n").length + 1))}
          className="w-full px-3 py-2 bg-white border border-[var(--border-soft)] rounded-lg text-sm font-sans focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-[var(--border-soft)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition"
        />
      )}

      {isRichHtml && (
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
          Kalın, italik, başlık ve liste biçimlerini araç çubuğundan uygulayın. HTML olarak kaydedilir, render sırasında temizlenir.
        </p>
      )}
      {isTagList && (
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
          Etiketleri virgül (,) ile ayırın. Sitede ayrı rozetler olarak görünür.
        </p>
      )}
      {isMultiline && !isTagList && !isRichHtml && (
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
          Yeni satır için Enter tuşunu kullanın — sitede satır kırılması olarak görünür.
        </p>
      )}
    </div>
  );
}

function humanizeKey(key: string): string {
  const last = key.split(".").pop() ?? key;
  return last.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------
// Positional field labels.
// Each label describes WHERE the field renders on the public site
// (its visual role / position) rather than repeating the key name.
//
// Lookup order:
//   1. Exact key override  (e.g. story.image)
//   2. Trailing-segment match (e.g. *.eyebrow, *.cta_label)
//   3. null → caller falls back to DB label / humanized key
// ---------------------------------------------------------------

const EXACT_LABELS: Record<string, string> = {
  "brand.name":              "Marka Adı (Logo Metni)",
  "brand.tagline":           "Marka Sloganı (Logo Altı)",
  "brand.watermark":         "Logo Filigranı (Arka Plan)",
  "story.image":             "Hikaye Giriş Görseli (Sağ Kart)",
  "story.body_html":         "Ana Metin Bloğu (Zengin Metin)",
  "story.eyebrow":           "Bölüm Üst Başlığı (Kırmızı Küçük Yazı)",
  "story.title":             "Sayfa Başlığı (Büyük Font)",
  "story.intro":             "Hikaye Giriş Metni (Spot Paragraf)",
  "story.cta_label":         "Buton Metni (CTA — Menüye Yönlendirir)",
  "footer.copyright":        "Telif Satırı (En Alt)",
  "footer.note_title":       "Footer Not Form Başlığı",
  "footer.note_placeholder": "Footer Not Form Placeholder'ı",
  "footer.note_button":      "Footer Not Form Buton Metni",
  "footer.link_menu":        "Bağlantı Etiketi (Menü)",
  "footer.link_story":       "Bağlantı Etiketi (Hikâyemiz)",
  "visit.address":           "Adres (Tam Posta Adresi)",
  "visit.hours":             "Çalışma Saatleri",
  "visit.phone":             "Telefon",
  "visit.email":             "E-posta",
  "newsletter.success":      "Form Başarı Mesajı (Gönderim Sonrası)",
};

const SUFFIX_LABELS: Record<string, string> = {
  eyebrow:      "Bölüm Üst Başlığı (Kırmızı Küçük Yazı)",
  kicker:       "Bölüm Üst Başlığı (Kırmızı Küçük Yazı)",
  main_title:   "Ana Gövde Başlığı (Büyük Font)",
  title:        "Ana Gövde Başlığı (Büyük Font)",
  subtitle:     "Alt Başlık (Başlığın Hemen Altı)",
  intro:        "Giriş Paragrafı (Spot Metin)",
  body:         "Ana Açıklama Metni",
  body_html:    "Ana Metin Bloğu (Zengin Metin)",
  description:  "Alt Açıklama Metni",
  caption:      "Görsel Altı Notu",
  quote:        "Alıntı / Spot Söz",
  highlight:    "Vurgu Metni",
  tagline:      "Slogan / Tag Line",
  cta:          "Buton Metni (CTA)",
  cta_label:    "Buton Metni (CTA)",
  cta_text:     "Buton Metni (CTA)",
  button:       "Buton Metni (CTA)",
  button_label: "Buton Metni (CTA)",
  link_label:   "Bağlantı Etiketi",
  label:        "Form Etiketi",
  placeholder:  "Form Placeholder",
  helper:       "Form Yardım Metni",
  success:      "Form Başarı Mesajı",
  error:        "Form Hata Mesajı",
  tags:         "Etiket Listesi (Rozetler)",
  badge:        "Rozet Metni",
  meta:         "Yan Bilgi (Meta)",
  note:         "Not / Ek Açıklama",
  address:      "Adres",
  phone:        "Telefon",
  email:        "E-posta",
  hours:        "Çalışma Saatleri",
  copyright:    "Telif Satırı",
  name:         "Ad / Etiket",
  alt:          "Görsel Alt Metni (Erişilebilirlik)",
  image:        "Bölüm Görseli",
  background:   "Arka Plan Görseli",
};

function positionalLabel(key: string): string | null {
  if (EXACT_LABELS[key]) return EXACT_LABELS[key];
  const suffix = key.split(".").pop() ?? "";
  return SUFFIX_LABELS[suffix] ?? null;
}
