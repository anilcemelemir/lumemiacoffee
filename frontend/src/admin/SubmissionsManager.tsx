import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Archive, Check, Inbox, Loader2, RefreshCw, Trash2, Users } from "lucide-react";
import { api } from "../lib/api";

type Subscriber = {
  id: number;
  email: string;
  source: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "archived";
  consent: boolean;
  created_at: string;
  updated_at: string;
};

type ListResponse<T> = { status: "ok"; data: T[] };
type Tab = "messages" | "subscribers";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export function SubmissionsManager() {
  const [tab, setTab] = useState<Tab>("messages");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const unreadCount = useMemo(
    () => messages.filter((message) => message.status === "new").length,
    [messages],
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [messageResp, subscriberResp] = await Promise.all([
        api.get<ListResponse<ContactMessage>>("/api/v1/admin/contact-messages", true),
        api.get<ListResponse<Subscriber>>("/api/v1/admin/newsletter-subscribers", true),
      ]);
      setMessages(messageResp.data);
      setSubscribers(subscriberResp.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıtlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setMessageStatus(id: number, status: ContactMessage["status"]) {
    setUpdatingId(id);
    setError(null);
    try {
      await api.patch(`/api/v1/admin/contact-messages/${id}`, { status }, true);
      setMessages((current) =>
        current.map((message) => (message.id === id ? { ...message, status } : message)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj güncellenemedi.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteMessage(id: number) {
    if (!window.confirm("Bu mesaj kalıcı olarak silinsin mi?")) return;

    setDeletingId(`message-${id}`);
    setError(null);
    try {
      await api.delete(`/api/v1/admin/contact-messages/${id}`, true);
      setMessages((current) => current.filter((message) => message.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj silinemedi.");
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteSubscriber(id: number) {
    if (!window.confirm("Bu abone kalıcı olarak silinsin mi?")) return;

    setDeletingId(`subscriber-${id}`);
    setError(null);
    try {
      await api.delete(`/api/v1/admin/newsletter-subscribers/${id}`, true);
      setSubscribers((current) => current.filter((subscriber) => subscriber.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Abone silinemedi.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-display text-[var(--brand-primary)]">Gelenler</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Abonelik e-postaları ve footer not formundan gelen mesajlar burada listelenir.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-paper)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:border-[var(--brand-primary)]"
        >
          <RefreshCw className="h-4 w-4" />
          Yenile
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--border-soft)] pb-3">
        <TabButton active={tab === "messages"} onClick={() => setTab("messages")}>
          <Inbox className="h-4 w-4" />
          Mesajlar
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </TabButton>
        <TabButton active={tab === "subscribers"} onClick={() => setTab("subscribers")}>
          <Users className="h-4 w-4" />
          Aboneler
          <Badge>{subscribers.length}</Badge>
        </TabButton>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Kayıtlar yükleniyor...
        </div>
      ) : tab === "messages" ? (
        <MessageList
          messages={messages}
          updatingId={updatingId}
          deletingId={deletingId}
          onStatus={setMessageStatus}
          onDelete={deleteMessage}
        />
      ) : (
        <SubscriberList
          subscribers={subscribers}
          deletingId={deletingId}
          onDelete={deleteSubscriber}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--text-on-dark)]"
          : "border-[var(--border-soft)] bg-[var(--surface-paper)] text-[var(--text-primary)] hover:border-[var(--brand-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--brand-accent)] px-1.5 text-[10px] font-bold text-[var(--surface-ink)]">
      {children}
    </span>
  );
}

function MessageList({
  messages,
  updatingId,
  deletingId,
  onStatus,
  onDelete,
}: {
  messages: ContactMessage[];
  updatingId: number | null;
  deletingId: string | null;
  onStatus: (id: number, status: ContactMessage["status"]) => void;
  onDelete: (id: number) => void;
}) {
  if (messages.length === 0) {
    return <EmptyState text="Henüz not formundan gelen mesaj yok." />;
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <article
          key={message.id}
          className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-paper)] p-4 sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{message.name}</h3>
                <StatusLabel status={message.status} />
              </div>
              <a className="mt-1 block text-sm text-[var(--brand-primary)]" href={`mailto:${message.email}`}>
                {message.email}
              </a>
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                {formatDate(message.created_at)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.status !== "read" && (
                <ActionButton disabled={updatingId === message.id} onClick={() => onStatus(message.id, "read")}>
                  <Check className="h-4 w-4" />
                  Okundu
                </ActionButton>
              )}
              {message.status !== "archived" && (
                <ActionButton disabled={updatingId === message.id} onClick={() => onStatus(message.id, "archived")}>
                  <Archive className="h-4 w-4" />
                  Arşivle
                </ActionButton>
              )}
              <ActionButton
                destructive
                disabled={deletingId === `message-${message.id}`}
                onClick={() => onDelete(message.id)}
              >
                <Trash2 className="h-4 w-4" />
                Sil
              </ActionButton>
            </div>
          </div>
          <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[var(--surface-cream)] p-4 text-sm leading-relaxed text-[var(--text-primary)]">
            {message.message}
          </p>
        </article>
      ))}
    </div>
  );
}

function SubscriberList({
  subscribers,
  deletingId,
  onDelete,
}: {
  subscribers: Subscriber[];
  deletingId: string | null;
  onDelete: (id: number) => void;
}) {
  if (subscribers.length === 0) {
    return <EmptyState text="Henüz bülten abonesi yok." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-paper)]">
      {subscribers.map((subscriber) => (
        <div
          key={subscriber.id}
          className="flex flex-col gap-3 border-b border-[var(--border-soft)] px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <a className="text-sm font-medium text-[var(--brand-primary)]" href={`mailto:${subscriber.email}`}>
              {subscriber.email}
            </a>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
              <span>{subscriber.source}</span>
              <span>{formatDate(subscriber.created_at)}</span>
            </div>
          </div>
          <ActionButton
            destructive
            disabled={deletingId === `subscriber-${subscriber.id}`}
            onClick={() => onDelete(subscriber.id)}
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </ActionButton>
        </div>
      ))}
    </div>
  );
}

function ActionButton({
  disabled,
  destructive = false,
  onClick,
  children,
}: {
  disabled: boolean;
  destructive?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium transition disabled:cursor-wait disabled:opacity-60 ${
        destructive
          ? "border-red-200 text-red-700 hover:border-red-400 hover:bg-red-50"
          : "border-[var(--border-soft)] text-[var(--text-primary)] hover:border-[var(--brand-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

function StatusLabel({ status }: { status: ContactMessage["status"] }) {
  const label = status === "new" ? "Yeni" : status === "read" ? "Okundu" : "Arşiv";
  return (
    <span className="rounded-full bg-[var(--surface-cream)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
      {label}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-soft)] bg-[var(--surface-paper)] p-8 text-center text-sm text-[var(--text-muted)]">
      {text}
    </div>
  );
}
