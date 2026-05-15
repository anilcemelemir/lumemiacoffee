import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Star, Image as ImageIcon, Video, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { api } from "../lib/api";
import { MediaDropzone } from "../components/MediaDropzone";

type Category = { id: number; name: string; slug: string; sort_order: number };

type Product = {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  video_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
};

type CatList = { status: "ok"; data: Category[] };
type ProdList = { status: "ok"; data: Product[] };

const emptyCategory: Omit<Category, "id"> = {
  name: "",
  slug: "",
  sort_order: 0,
};

const empty: Omit<Product, "id" | "category_name"> = {
  category_id: 0,
  name: "",
  slug: "",
  description: "",
  price: 0,
  currency: "TRY",
  image_url: "",
  video_url: "",
  is_available: true,
  is_featured: false,
  sort_order: 0,
};

export function MenuManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | typeof empty | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | typeof emptyCategory | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const productCountsByCategory = useMemo(() => {
    const counts = new Map<number, number>();
    for (const product of products) {
      counts.set(product.category_id, (counts.get(product.category_id) ?? 0) + 1);
    }
    return counts;
  }, [products]);

  async function reload() {
    const [c, p] = await Promise.all([
      api.get<CatList>("/api/v1/admin/categories", true),
      api.get<ProdList>("/api/v1/admin/products", true),
    ]);
    setCategories(c.data);
    setProducts(p.data);
  }

  useEffect(() => {
    reload()
      .catch((e) => setError(e instanceof Error ? e.message : "Yükleme hatası"))
      .finally(() => setLoading(false));
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError(null);
    try {
      if ("id" in editing) {
        await api.put(`/api/v1/admin/products/${editing.id}`, editing, true);
        setMessage("Ürün güncellendi.");
      } else {
        await api.post("/api/v1/admin/products", editing, true);
        setMessage("Ürün eklendi.");
      }
      setEditing(null);
      await reload();
      window.setTimeout(() => setMessage(null), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydetme hatası");
    }
  }

  async function onSaveCategory(e: FormEvent) {
    e.preventDefault();
    if (!editingCategory) return;
    setError(null);

    const payload = {
      name: editingCategory.name.trim(),
      slug: editingCategory.slug.trim() || editingCategory.name.trim(),
      sort_order: Number(editingCategory.sort_order) || 0,
    };

    try {
      if ("id" in editingCategory) {
        await api.put(`/api/v1/admin/categories/${editingCategory.id}`, payload, true);
        setMessage("Kategori güncellendi.");
      } else {
        await api.post("/api/v1/admin/categories", payload, true);
        setMessage("Kategori eklendi.");
      }
      setEditingCategory(null);
      await reload();
      window.setTimeout(() => setMessage(null), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kategori kaydedilemedi.");
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Bu ürün silinsin mi?")) return;
    try {
      await api.delete(`/api/v1/admin/products/${id}`, true);
      setMessage("Ürün silindi.");
      await reload();
      window.setTimeout(() => setMessage(null), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silme hatası");
    }
  }

  async function onDeleteCategory(category: Category) {
    const productCount = productCountsByCategory.get(category.id) ?? 0;
    if (productCount > 0) {
      setError("Bu kategoride ürün var. Önce ürünleri başka kategoriye taşıyın veya silin.");
      window.setTimeout(() => setError(null), 4000);
      return;
    }

    if (!confirm(`"${category.name}" kategorisi silinsin mi?`)) return;

    try {
      await api.delete(`/api/v1/admin/categories/${category.id}`, true);
      setMessage("Kategori silindi.");
      await reload();
      window.setTimeout(() => setMessage(null), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kategori silinemedi.");
    }
  }

  async function togglePin(p: Product) {
    try {
      await api.put(`/api/v1/admin/products/${p.id}`, { is_featured: !p.is_featured }, true);
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, is_featured: !p.is_featured } : x)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sabitleme hatası");
    }
  }

  if (loading) return <p className="text-[var(--text-muted)]">Yükleniyor…</p>;

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 overflow-hidden">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-display text-[var(--brand-primary)]">Menü Yönetimi</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {products.length} ürün · {categories.length} kategori · {products.filter((p) => p.is_featured).length} sabitlenmiş
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...empty, category_id: categories[0]?.id ?? 0 })}
          disabled={categories.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-[var(--text-on-dark)] rounded-full hover:bg-[var(--brand-primary-dark)] transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Yeni ürün
        </button>
      </div>

      {message && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <section className="bg-[var(--surface-paper)] rounded-2xl border border-[var(--border-soft)] overflow-hidden">
        <div className="flex items-center justify-between gap-3 flex-wrap px-4 py-3 sm:px-5 sm:py-4 bg-[var(--surface-cream)] border-b border-[var(--border-soft)]">
          <div>
            <h3 className="font-display text-lg text-[var(--brand-primary)]">
              Kategori Düzenleme
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {categories.length} kategori
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditingCategory({ ...emptyCategory })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-primary)] text-[var(--text-on-dark)] text-sm font-medium hover:bg-[var(--brand-primary-dark)] transition"
          >
            <Plus className="w-4 h-4" />
            Yeni kategori
          </button>
        </div>

        <div className="w-full max-w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="text-left text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right">Sıra</th>
                <th className="px-4 py-3 text-right">Ürün</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const productCount = productCountsByCategory.get(category.id) ?? 0;

                return (
                  <tr
                    key={category.id}
                    className="border-t border-[var(--border-soft)] hover:bg-[var(--surface-cream)]/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">
                      <code>{category.slug}</code>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{category.sort_order}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{productCount}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(category)}
                        className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline mr-3"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCategory(category)}
                        disabled={productCount > 0}
                        title={productCount > 0 ? "Önce bu kategorideki ürünleri taşıyın veya silin" : "Sil"}
                        className={`inline-flex items-center gap-1 ${
                          productCount > 0
                            ? "text-[var(--text-muted)] cursor-not-allowed"
                            : "text-red-700 hover:underline"
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Sil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="w-full max-w-full min-w-0 overflow-x-auto bg-[var(--surface-paper)] rounded-2xl border border-[var(--border-soft)]">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-[var(--surface-cream)] text-left text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Medya</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Ürün</th>
              <th className="px-4 py-3 text-right">Fiyat</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-[var(--border-soft)] hover:bg-[var(--surface-cream)]/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePin(p)}
                    title={p.is_featured ? "Sabitlemeyi kaldır" : "Öne çıkar (üste sabitle)"}
                    className={`p-1.5 rounded-full transition ${
                      p.is_featured
                        ? "bg-[var(--brand-accent)] text-[var(--surface-ink)]"
                        : "bg-[var(--surface-mist)] text-[var(--text-muted)] hover:text-[var(--brand-primary)]"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" fill={p.is_featured ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-[var(--border-soft)]"
                        onError={(e) => ((e.currentTarget.style.display = "none"))}
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-lg bg-[var(--surface-mist)] flex items-center justify-center text-[var(--text-muted)]">
                        <ImageIcon className="w-4 h-4" />
                      </span>
                    )}
                    {p.video_url && (
                      <span
                        className="w-6 h-6 rounded-full bg-[var(--brand-primary)] text-[var(--text-on-dark)] flex items-center justify-center"
                        title="Video var"
                      >
                        <Video className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{p.category_name}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-[var(--text-primary)]">{p.name}</div>
                  <div className="text-xs text-[var(--text-muted)] truncate max-w-[18rem] xl:max-w-md">
                    {p.description}
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-[var(--brand-primary)]">
                  {p.price.toFixed(2)} {p.currency === "TRY" ? "₺" : p.currency}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      p.is_available
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {p.is_available ? "Satışta" : "Pasif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => setEditing(p)}
                    className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline mr-3"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Düzenle
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="inline-flex items-center gap-1 text-red-700 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div
          className="fixed inset-0 bg-stone-900/60 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setEditing(null)}
        >
          <form
            onSubmit={onSave}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--surface-paper)] rounded-2xl p-4 sm:p-6 w-full max-w-[min(42rem,calc(100vw-1.5rem))] min-w-0 space-y-4 max-h-[90dvh] overflow-y-auto overflow-x-hidden"
          >
            <h3 className="text-xl font-display text-[var(--brand-primary)]">
              {"id" in editing ? "Ürünü düzenle" : "Yeni ürün"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Ürün adı">
                <input
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={input}
                />
              </Field>

              <Field label="Kategori">
                <select
                  required
                  value={editing.category_id}
                  onChange={(e) => setEditing({ ...editing, category_id: Number(e.target.value) })}
                  className={input}
                >
                  {categories.length === 0 && <option value={0}>Kategori yok</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Fiyat (₺)">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  className={input}
                />
              </Field>

              <Field label="Para birimi">
                <input
                  value={editing.currency}
                  onChange={(e) =>
                    setEditing({ ...editing, currency: e.target.value.toUpperCase() })
                  }
                  className={input}
                />
              </Field>

              <Field label="Sıralama">
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  className={input}
                />
              </Field>
            </div>

            <MediaDropzone
              kind="image"
              value={editing.image_url ?? null}
              onChange={(url) => setEditing({ ...editing, image_url: url })}
              aspect="1:1"
              prefix="product"
              label="Ürün görseli"
              hint="Yüklediğiniz görsel otomatik olarak WebP'ye çevrilir ve 1:1 olarak kırpılır."
            />

            <MediaDropzone
              kind="video"
              value={editing.video_url ?? null}
              onChange={(url) => setEditing({ ...editing, video_url: url })}
              prefix="product"
              label="Ürün videosu (opsiyonel)"
              hint="Cinemagraph efekti için kısa, sessiz video. En fazla 10 MB."
            />

            <Field label="Açıklama">
              <textarea
                rows={3}
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className={input}
              />
            </Field>

            <div className="flex flex-wrap gap-4 pt-2">
              <Toggle
                label="Satışta"
                checked={editing.is_available}
                onChange={(v) => setEditing({ ...editing, is_available: v })}
              />
              <Toggle
                label="Öne çıkar (menü üstüne sabitle)"
                checked={editing.is_featured}
                onChange={(v) => setEditing({ ...editing, is_featured: v })}
                accent
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-soft)]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 border border-[var(--border-soft)] rounded-full text-sm"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[var(--brand-primary)] text-[var(--text-on-dark)] rounded-full text-sm hover:bg-[var(--brand-primary-dark)]"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {editingCategory && (
        <div
          className="fixed inset-0 bg-stone-900/60 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setEditingCategory(null)}
        >
          <form
            onSubmit={onSaveCategory}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--surface-paper)] rounded-2xl p-4 sm:p-6 w-full max-w-[min(34rem,calc(100vw-1.5rem))] min-w-0 space-y-4 max-h-[90dvh] overflow-y-auto overflow-x-hidden"
          >
            <h3 className="text-xl font-display text-[var(--brand-primary)]">
              {"id" in editingCategory ? "Kategoriyi düzenle" : "Yeni kategori"}
            </h3>

            <Field label="Kategori adı">
              <input
                required
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
                className={input}
              />
            </Field>

            <Field label="Slug" hint="Boş bırakırsanız kategori adından otomatik üretilir.">
              <input
                value={editingCategory.slug}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, slug: e.target.value })
                }
                className={input}
              />
            </Field>

            <Field label="Sıralama">
              <input
                type="number"
                value={editingCategory.sort_order}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    sort_order: Number(e.target.value),
                  })
                }
                className={input}
              />
            </Field>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-soft)]">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 border border-[var(--border-soft)] rounded-full text-sm"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[var(--brand-primary)] text-[var(--text-on-dark)] rounded-full text-sm hover:bg-[var(--brand-primary-dark)]"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const input =
  "w-full px-3 py-2 bg-white border border-[var(--border-soft)] rounded-lg font-sans text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-[var(--text-muted)] mt-1">{hint}</span>}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  accent = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border transition ${
        checked
          ? accent
            ? "bg-[var(--brand-accent)] text-[var(--surface-ink)] border-[var(--brand-accent)]"
            : "bg-emerald-50 text-emerald-800 border-emerald-300"
          : "bg-[var(--surface-mist)] text-[var(--text-muted)] border-transparent"
      }`}
    >
      {checked ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {label}
    </button>
  );
}
