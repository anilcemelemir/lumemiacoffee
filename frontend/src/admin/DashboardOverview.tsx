import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useTheme } from "../lib/theme";

type StatusResp = {
  status: "ok";
  service?: string;
  database?: { connected?: boolean; reachable?: boolean; server?: string; driver?: string };
};

export function DashboardOverview({ user }: { user: { username: string; role: string } | null }) {
  const { brand } = useTheme();
  const [status, setStatus] = useState<StatusResp | null>(null);
  const [counts, setCounts] = useState<{ products: number; categories: number; content: number } | null>(null);
  const databaseConnected = status?.database?.connected ?? status?.database?.reachable ?? false;
  const databaseLabel = status?.database?.server ?? status?.database?.driver ?? "—";

  useEffect(() => {
    api.get<StatusResp>("/api/v1/status").then(setStatus).catch(() => {});
    Promise.all([
      api.get<{ data: unknown[] }>("/api/v1/admin/products", true),
      api.get<{ data: unknown[] }>("/api/v1/admin/categories", true),
      api.get<{ data: unknown[] }>("/api/v1/admin/content", true),
    ])
      .then(([p, c, s]) =>
        setCounts({ products: p.data.length, categories: c.data.length, content: s.data.length })
      )
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-[var(--text-on-dark)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <img
          src={brand["logo-mark-url"] || "/images/logo-mark.svg"}
          alt=""
          className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--brand-accent)]">
            {brand["brand-name"] || "Lume Mia Coffee"}
          </p>
          <h2 className="text-2xl sm:text-3xl font-display mt-1">
            Hoş geldiniz{user ? `, ${user.username}` : ""}
          </h2>
          <p className="text-sm text-[var(--text-on-dark)]/70 mt-2">
            Bugün siteni nasıl güzelleştirelim?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Ürün" value={counts?.products ?? "—"} />
        <Stat label="Kategori" value={counts?.categories ?? "—"} />
        <Stat label="İçerik anahtarı" value={counts?.content ?? "—"} />
      </div>

      <div className="bg-[var(--surface-paper)] border border-[var(--border-soft)] rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--brand-accent)] mb-4">Sistem Durumu</h3>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-[var(--text-muted)]">Servis</dt>
          <dd className="text-[var(--text-primary)]">{status?.service ?? "—"}</dd>
          <dt className="text-[var(--text-muted)]">Veritabanı</dt>
          <dd className="text-[var(--text-primary)]">
            {databaseConnected ? "✓ Bağlı" : "✗ Erişilemiyor"} ({databaseLabel})
          </dd>
        </dl>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-[var(--surface-paper)] border border-[var(--border-soft)] rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="text-3xl font-display text-[var(--brand-primary)] mt-2">{value}</p>
    </div>
  );
}
