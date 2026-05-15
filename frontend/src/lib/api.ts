// Tiny API client with JWT storage. Same-origin via Nginx (8082) in prod;
// Vite dev server proxies /api → http://localhost:8082 (see vite.config.ts).

const TOKEN_KEY = "lumemia.admin.token";

export const auth = {
  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export type ApiError = { status: "error"; message: string; detail?: string };

export class HttpError extends Error {
  status: number;
  payload: unknown;
  constructor(status: number, payload: unknown, message: string) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { authed?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  if (init.authed && auth.token) {
    headers.set("Authorization", `Bearer ${auth.token}`);
  }

  const res = await fetch(path, { ...init, headers });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      (json && typeof json === "object" && "message" in json
        ? String((json as ApiError).message)
        : `HTTP ${res.status}`) || `HTTP ${res.status}`;
    if (res.status === 401) auth.clear();
    throw new HttpError(res.status, json, msg);
  }
  return json as T;
}

export const api = {
  get:    <T>(p: string, authed = false)              => request<T>(p, { method: "GET",    authed }),
  post:   <T>(p: string, body?: unknown, authed=false)=> request<T>(p, { method: "POST",   authed, body: JSON.stringify(body ?? {}) }),
  put:    <T>(p: string, body?: unknown, authed=false)=> request<T>(p, { method: "PUT",    authed, body: JSON.stringify(body ?? {}) }),
  patch:  <T>(p: string, body?: unknown, authed=false)=> request<T>(p, { method: "PATCH",  authed, body: JSON.stringify(body ?? {}) }),
  delete: <T>(p: string, authed = false)              => request<T>(p, { method: "DELETE", authed }),
};

// ---------------------------------------------------------------
// Multipart upload with progress (XHR — fetch can't observe upload progress).
// ---------------------------------------------------------------
export type UploadProgress = (loaded: number, total: number, pct: number) => void;

export type UploadedImage = {
  filename: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
};

export type UploadedVideo = {
  filename: string;
  url: string;
  bytes: number;
};

function upload<T>(
  path: string,
  form: FormData,
  onProgress?: UploadProgress,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path);
    if (auth.token) xhr.setRequestHeader("Authorization", `Bearer ${auth.token}`);
    xhr.setRequestHeader("Accept", "application/json");

    if (onProgress) {
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          onProgress(ev.loaded, ev.total, Math.round((ev.loaded / ev.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      const text = xhr.responseText || "";
      let json: unknown = null;
      try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(json as T);
      } else {
        const msg =
          (json && typeof json === "object" && "message" in json
            ? String((json as ApiError).message)
            : `HTTP ${xhr.status}`) || `HTTP ${xhr.status}`;
        if (xhr.status === 401) auth.clear();
        reject(new HttpError(xhr.status, json, msg));
      }
    };
    xhr.onerror = () => reject(new HttpError(0, null, "Network error"));
    xhr.send(form);
  });
}

export const uploads = {
  image(
    file: File,
    opts: { aspect?: string; prefix?: string; onProgress?: UploadProgress } = {},
  ): Promise<{ status: "ok"; data: UploadedImage }> {
    const fd = new FormData();
    fd.append("file", file);
    if (opts.aspect) fd.append("aspect", opts.aspect);
    if (opts.prefix) fd.append("prefix", opts.prefix);
    return upload("/api/v1/admin/uploads/image", fd, opts.onProgress);
  },
  video(
    file: File,
    opts: { prefix?: string; onProgress?: UploadProgress } = {},
  ): Promise<{ status: "ok"; data: UploadedVideo }> {
    const fd = new FormData();
    fd.append("file", file);
    if (opts.prefix) fd.append("prefix", opts.prefix);
    return upload("/api/v1/admin/uploads/video", fd, opts.onProgress);
  },
};
