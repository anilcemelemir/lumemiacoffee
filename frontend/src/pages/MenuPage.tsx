import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Search, ChevronLeft, Star, X, Play } from "lucide-react";
import Navigation from "../components/Navigation";
import FooterSection from "../sections/FooterSection";
import { ContentProvider, useT } from "../lib/content";
import { useTheme } from "../lib/theme";
import { useMenu, formatPrice, type MenuProduct, type MenuCategory } from "../lib/useMenu";

export default function MenuPage() {
  return (
    <ContentProvider>
      <MenuPageShell />
    </ContentProvider>
  );
}

function MenuPageShell() {
  const { layout } = useTheme();
  const compactFooter = (layout?.["menu.compact_footer"] ?? "true") === "true";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--surface-cream)]">
      <Navigation />
      <MenuPageBody />
      <FooterSection compact={compactFooter} />
    </div>
  );
}

// ---------------------------------------------------------------
// Body
// ---------------------------------------------------------------

function MenuPageBody() {
  const t = useT();
  const { categories, loading } = useMenu();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  // Normalised search helper (Turkish-aware)
  const norm = (s: string) =>
    s
      .toLocaleLowerCase("tr")
      .replace(/i̇/g, "i")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const q = norm(query.trim());

  // Filter categories/products
  const filtered = useMemo<MenuCategory[]>(() => {
    if (!q) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        products: cat.products.filter(
          (p) => norm(p.name).includes(q) || norm(p.description ?? "").includes(q),
        ),
      }))
      .filter((cat) => cat.products.length > 0);
  }, [categories, q]);

  // Featured products (across categories) — only when not searching
  const featured = useMemo<MenuProduct[]>(() => {
    if (q) return [];
    return categories.flatMap((c) => c.products.filter((p) => p.is_featured));
  }, [categories, q]);

  const totalCount = filtered.reduce((sum, c) => sum + c.products.length, 0);

  // Scroll-spy for sticky category tabs
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    if (filtered.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const slug = (visible[0].target as HTMLElement).dataset.slug;
          if (slug) setActiveCat(slug);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    for (const slug of Object.keys(sectionRefs.current)) {
      const el = sectionRefs.current[slug];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [filtered]);

  function jumpTo(slug: string) {
    const el = sectionRefs.current[slug];
    if (!el) return;
    // Account for fixed nav (~64px) + sticky bar (~110px on mobile)
    const offset = window.innerWidth < 640 ? 188 : 206;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <main className="flex-1 pt-28 sm:pt-32 pb-8">
      {/* Page header */}
      <header className="px-5 sm:px-8 max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[var(--brand-primary)] hover:text-[var(--brand-primary-dark)] transition mb-4"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Ana sayfa
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--brand-primary)] leading-tight">
          {t("menu.title", "MENÜ")}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)] max-w-prose">
          {t(
            "menu.subtitle",
            "Mevsime göre değişir, her gün taze. Tüm fiyatlara KDV dahildir.",
          )}
        </p>
      </header>

      {/* Sticky search + tabs */}
      <div className="sticky top-[88px] z-40 bg-[var(--surface-cream)]/90 backdrop-blur-md border-b border-[var(--border-soft)] mt-6">
        <div className="px-5 sm:px-8 max-w-3xl mx-auto py-3 space-y-3">
          <SearchBar value={query} onChange={setQuery} />
          {filtered.length > 0 && (
            <CategoryTabs
              categories={filtered}
              active={activeCat}
              onJump={jumpTo}
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-8 max-w-3xl mx-auto pt-6 space-y-10">
        {loading && <SkeletonGrid />}

        {!loading && featured.length > 0 && (
          <FeaturedRail products={featured} />
        )}

        {!loading && filtered.length === 0 && (
          <EmptyState query={query} />
        )}

        {!loading &&
          filtered.map((cat) => (
            <section
              key={cat.id}
              data-slug={cat.slug}
              ref={(el) => {
                sectionRefs.current[cat.slug] = el;
              }}
              className="scroll-mt-[180px] sm:scroll-mt-[210px]"
            >
              <h2 className="font-display text-xl sm:text-2xl tracking-wider text-[var(--brand-primary)] mb-4 flex items-baseline gap-3">
                {cat.name}
                <span className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                  {cat.products.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {cat.products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </ul>
            </section>
          ))}

        {!loading && totalCount > 0 && (
          <p className="text-center text-xs uppercase tracking-[0.3em] text-[var(--text-muted)] pt-6">
            {totalCount} ürün
          </p>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------
// Search bar
// ---------------------------------------------------------------

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Menüde ara… (örn. latte, vegan, nitro)"
        className="w-full pl-10 pr-10 py-3 rounded-full bg-white border border-[var(--border-soft)] text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 transition"
        autoComplete="off"
        inputMode="search"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Aramayı temizle"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--surface-mist)]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------
// Category tabs (horizontal, sticky, scroll-spy)
// ---------------------------------------------------------------

function CategoryTabs({
  categories,
  active,
  onJump,
}: {
  categories: MenuCategory[];
  active: string | null;
  onJump: (slug: string) => void;
}) {
  return (
    <nav
      aria-label="Kategoriler"
      className="-mx-5 sm:-mx-8 px-5 sm:px-8 overflow-x-auto scrollbar-none"
    >
      <ul className="flex gap-2 whitespace-nowrap">
        {categories.map((c) => {
          const isActive = active === c.slug;
          return (
            <li key={c.id}>
              <button
                onClick={() => onJump(c.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-[var(--brand-primary)] text-[var(--text-on-dark)] border-[var(--brand-primary)] shadow-sm scale-105"
                    : "bg-white text-[var(--text-primary)] border-[var(--border-soft)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                }`}
              >
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ---------------------------------------------------------------
// Product card (single)
// ---------------------------------------------------------------

function ProductCard({ product, index }: { product: MenuProduct; index: number }) {
  const [showVideo, setShowVideo] = useState(false);
  const hasMedia = !!(product.image_url || product.video_url);

  return (
    <li
      className="group bg-white border border-[var(--border-soft)] rounded-2xl overflow-hidden flex gap-3 sm:gap-4 hover:border-[var(--brand-primary)]/30 hover:shadow-[0_4px_20px_rgba(139,18,37,0.08)] hover:-translate-y-0.5 transition-all duration-300 menu-fade-in"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* Media */}
      {hasMedia && (
        <div className="relative w-24 sm:w-32 flex-shrink-0 bg-[var(--surface-mist)] overflow-hidden">
          {product.video_url && showVideo ? (
            <video
              src={product.video_url}
              poster={product.image_url ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full" />
          )}

          {product.video_url && !showVideo && (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              aria-label="Videoyu oynat"
              className="absolute inset-0 flex items-center justify-center bg-[var(--brand-primary-dark)]/20 hover:bg-[var(--brand-primary-dark)]/40 transition"
            >
              <span className="w-9 h-9 rounded-full bg-[var(--brand-primary)] text-[var(--text-on-dark)] flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
              </span>
            </button>
          )}

          {product.is_featured && (
            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 bg-[var(--brand-accent)] text-[var(--surface-ink)] text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5" fill="currentColor" />
              Öne çıkan
            </span>
          )}
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0 py-3 pr-3 sm:py-4 sm:pr-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-display text-base sm:text-lg text-[var(--brand-primary)] leading-snug">
            {product.name}
            {!hasMedia && product.is_featured && (
              <Star
                className="inline w-3.5 h-3.5 ml-1.5 text-[var(--brand-accent)]"
                fill="currentColor"
              />
            )}
          </h3>
          <span className="font-display text-base sm:text-lg text-[var(--brand-primary)] whitespace-nowrap tabular-nums">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
        {product.description && (
          <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </li>
  );
}

// ---------------------------------------------------------------
// Featured rail (only shown on initial view, not while searching)
// ---------------------------------------------------------------

function FeaturedRail({ products }: { products: MenuProduct[] }) {
  return (
    <section aria-label="Öne çıkanlar" className="-mx-5 sm:-mx-8">
      <div className="px-5 sm:px-8 mb-3 flex items-baseline gap-2">
        <Star className="w-4 h-4 text-[var(--brand-accent)]" fill="currentColor" />
        <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--brand-primary)]">
          Öne çıkanlar
        </h2>
      </div>
      <ul className="flex gap-3 overflow-x-auto px-5 sm:px-8 pb-3 scrollbar-none snap-x snap-mandatory">
        {products.map((p, i) => (
          <li
            key={`feat-${p.id}`}
            className="snap-start flex-shrink-0 w-56 bg-white border border-[var(--border-soft)] rounded-2xl overflow-hidden menu-fade-in hover:border-[var(--brand-primary)]/30 hover:shadow-[0_4px_16px_rgba(139,18,37,0.08)] hover:-translate-y-0.5 transition-all duration-300"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="w-full h-28 object-cover"
              />
            )}
            <div className="p-3">
              <p className="font-display text-sm text-[var(--brand-primary)] leading-snug truncate">
                {p.name}
              </p>
              <p className="text-xs text-[var(--brand-primary)] mt-1 tabular-nums">
                {formatPrice(p.price, p.currency)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------
// Skeleton & Empty
// ---------------------------------------------------------------

function SkeletonGrid() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-2xl bg-white/60 border border-[var(--border-soft)] animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-base text-[var(--text-primary)] mb-1">Sonuç bulunamadı</p>
      <p className="text-sm text-[var(--text-muted)]">
        "{query}" için eşleşen ürün yok. Farklı bir kelime deneyin.
      </p>
    </div>
  );
}
