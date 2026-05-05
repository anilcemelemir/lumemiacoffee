import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { api, auth, HttpError } from "../lib/api";
import { useTheme } from "../lib/theme";

type LoginResponse = {
  status: "ok";
  message: string;
  token: string;
  user: { id: number; username: string; display_name: string; role: string };
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const { brand } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await api.post<LoginResponse>("/api/v1/auth/login", { username, password });
      auth.set(r.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, var(--brand-primary-dark) 0%, var(--brand-primary) 60%, var(--surface-ink) 100%)",
        color: "var(--text-on-dark)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img
            src={brand["logo-mark-url"] || "/images/logo-mark.svg"}
            alt=""
            className="w-20 h-20 mx-auto mb-5 drop-shadow-lg"
          />
          <p className="text-xs tracking-[0.4em] uppercase text-[var(--brand-accent)]">
            {brand["brand-name"] || "Lume Mia Coffee"}
          </p>
          <h1 className="mt-3 text-3xl font-display tracking-[0.18em]">YÖNETİM PANELİ</h1>
          <p className="mt-2 text-sm text-[var(--text-on-dark)]/60">Devam etmek için giriş yapın.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-[var(--surface-ink)]/70 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl space-y-5"
        >
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-[var(--text-on-dark)]/60 mb-2">
              Kullanıcı adı
            </span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/15 rounded-lg text-[var(--text-on-dark)] focus:outline-none focus:border-[var(--brand-accent)] transition"
            />
          </label>

          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-[var(--text-on-dark)]/60 mb-2">
              Şifre
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/15 rounded-lg text-[var(--text-on-dark)] focus:outline-none focus:border-[var(--brand-accent)] transition"
            />
          </label>

          {error && (
            <p className="text-sm text-red-300 bg-red-950/40 border border-red-900/40 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-full bg-[var(--brand-accent)] text-[var(--brand-primary-dark)] font-semibold tracking-wider uppercase text-sm hover:bg-[var(--brand-accent-soft)] disabled:opacity-60 transition"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş yap"}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-on-dark)]/40 mt-6 tracking-widest uppercase">
          © 2026 Lume Mia Coffee — Yönetim
        </p>
      </div>
    </div>
  );
}
