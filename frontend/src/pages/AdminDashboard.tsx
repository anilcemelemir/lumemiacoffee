import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  FileText,
  Coffee,
  Palette,
  Search,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { api, auth, HttpError } from "../lib/api";
import { useTheme } from "../lib/theme";
import { ContentEditor } from "../admin/ContentEditor";
import { MenuManager } from "../admin/MenuManager";
import { AppearanceManager } from "../admin/AppearanceManager";
import { DashboardOverview } from "../admin/DashboardOverview";
import { SeoManager } from "../admin/SeoManager";

type SectionId = "dashboard" | "content" | "menu" | "appearance" | "seo" | "system";

type NavItem = {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

const NAV: NavItem[] = [
  { id: "dashboard",  label: "Genel Bakış",      icon: LayoutDashboard, description: "Hızlı istatistikler" },
  { id: "content",    label: "İçerik Yönetimi",  icon: FileText,        description: "Hero, Hakkımızda, Bölümler, Footer" },
  { id: "menu",       label: "Menü Yönetimi",    icon: Coffee,          description: "Ürünler & Kategoriler" },
  { id: "appearance", label: "Görünüm Ayarları", icon: Palette,         description: "Renkler, Logo, Tipografi" },
  { id: "seo",        label: "SEO & Analitik",   icon: Search,          description: "Meta etiketler, izleme kodları" },
  { id: "system",     label: "Sistem",           icon: Settings,        description: "Profil & API durumu" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { brand } = useTheme();
  const [section, setSection] = useState<SectionId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ status: "ok"; user: { username: string; role: string } }>("/api/v1/auth/me", true)
      .then((r) => setUser(r.user))
      .catch((e) => {
        if (e instanceof HttpError && e.status === 401) {
          navigate("/admin-giris", { replace: true });
        } else {
          setError(e instanceof Error ? e.message : "Bilinmeyen hata");
        }
      });
  }, [navigate]);

  function logout() {
    auth.clear();
    navigate("/admin-giris", { replace: true });
  }

  const current = NAV.find((n) => n.id === section)!;

  return (
    <div
      className="min-h-screen w-full max-w-full overflow-hidden flex"
      style={{
        background: "var(--surface-cream)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed overlay on mobile, in-flow on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 flex flex-col
          bg-[var(--surface-ink)] text-[var(--text-on-dark)]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex-shrink-0
        `}
      >
        {/* Mobile close button */}
        <button
          className="md:hidden absolute top-4 right-4 p-2 rounded-full text-white/70 hover:bg-white/10 transition"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 py-6 border-b border-white/10 flex items-center gap-3">
          <img
            src={brand["logo-mark-url"] || "/images/logo-mark.svg"}
            alt=""
            className="w-10 h-10"
          />
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--brand-accent)]">
              {brand["brand-name"] || "Lume Mia Coffee"}
            </p>
            <h1 className="text-lg font-display tracking-wide">Yönetim Paneli</h1>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-left ${
                  active
                    ? "bg-[var(--brand-primary)] text-[var(--text-on-dark)] border-l-4 border-[var(--brand-accent)]"
                    : "text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-60 truncate">
                    {item.description}
                  </div>
                </div>
                {active && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          {user && (
            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-white/50">Oturum</p>
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-[10px] text-[var(--brand-accent)] uppercase tracking-wider">{user.role}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-white/15 hover:bg-white/5 transition"
          >
            <LogOut className="w-4 h-4" />
            Çıkış
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-[var(--surface-ink)] text-[var(--text-on-dark)] border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 transition flex-shrink-0"
            aria-label="Menüyü aç"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src={brand["logo-mark-url"] || "/images/logo-mark.svg"}
            alt=""
            className="w-7 h-7 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--brand-accent)] leading-none">
              Yönetim Paneli
            </p>
            <h2 className="text-sm font-display tracking-wide truncate">{current.label}</h2>
          </div>
        </div>

        {/* Desktop header */}
        <header className="hidden md:block bg-[var(--surface-paper)] border-b border-[var(--border-soft)] px-8 py-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--brand-accent)]">Bölüm</p>
          <h2 className="text-2xl font-display text-[var(--brand-primary)]">{current.label}</h2>
        </header>

        <main className="flex-1 min-w-0 max-w-full overflow-auto px-4 py-4 md:px-8 md:py-8">
          {error && (
            <p className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          {section === "dashboard"  && <DashboardOverview user={user} />}
          {section === "content"    && <ContentEditor />}
          {section === "menu"       && <MenuManager />}
          {section === "appearance" && <AppearanceManager />}
          {section === "seo"        && <SeoManager />}
          {section === "system"     && <SystemPanel user={user} onLogout={logout} />}
        </main>
      </div>
    </div>
  );
}

function SystemPanel({
  user,
  onLogout,
}: {
  user: { username: string; role: string } | null;
  onLogout: () => void;
}) {
  type Status = { status?: string; database?: { reachable?: boolean } } | null;
  const [status, setStatus] = useState<Status>(null);
  useEffect(() => {
    api.get<NonNullable<Status>>("/api/v1/status").then((s) => setStatus(s)).catch(() => {});
  }, []);
  return (
    <div className="space-y-6 max-w-2xl">
      <section className="bg-[var(--surface-paper)] border border-[var(--border-soft)] rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--brand-accent)] mb-4">Yönetici Profili</h3>
        {user ? (
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-[var(--text-muted)]">Kullanıcı adı</dt>
            <dd className="text-[var(--text-primary)] font-medium">{user.username}</dd>
            <dt className="text-[var(--text-muted)]">Rol</dt>
            <dd className="text-[var(--text-primary)]">{user.role}</dd>
          </dl>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">Yükleniyor…</p>
        )}
        <button
          onClick={onLogout}
          className="mt-5 px-4 py-2 rounded-full bg-[var(--brand-primary)] text-[var(--text-on-dark)] hover:bg-[var(--brand-primary-dark)] transition text-sm"
        >
          Oturumu kapat
        </button>
      </section>

      <section className="bg-[var(--surface-paper)] border border-[var(--border-soft)] rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--brand-accent)] mb-4">API Durumu</h3>
        <p className="text-sm">
          Veritabanı:{" "}
          <span className={status?.database?.reachable ? "text-green-700" : "text-red-700"}>
            {status?.database?.reachable ? "Bağlı" : "Erişilemiyor"}
          </span>
        </p>
      </section>
    </div>
  );
}
