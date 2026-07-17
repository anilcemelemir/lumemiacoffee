import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, Image as ImageIcon, Video as VideoIcon, X, Loader2 } from "lucide-react";
import { uploads, type UploadedImage, type UploadedVideo } from "../lib/api";
import { prepareImageForUpload } from "../lib/imageProcessing";

type ImageProps = {
  kind: "image";
  value: string | null;
  onChange: (url: string | null) => void;
  aspect?: string; // e.g. "1:1" for product thumbnails
  prefix?: string;
  label?: string;
  hint?: string;
};

type VideoProps = {
  kind: "video";
  value: string | null;
  onChange: (url: string | null) => void;
  prefix?: string;
  label?: string;
  hint?: string;
};

export function MediaDropzone(props: ImageProps | VideoProps) {
  const { value, onChange, label, hint } = props;
  const [busy, setBusy]       = useState(false);
  const [progress, setProg]   = useState(0);
  const [error, setError]     = useState<string | null>(null);
  const [dragOver, setDrag]   = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);

  const accept = props.kind === "image"
    ? "image/png,image/jpeg,image/webp,image/gif"
    : "video/mp4,video/webm,video/quicktime";

  const upload = useCallback(async (file: File) => {
    setError(null);
    setBusy(true);
    setProg(0);
    try {
      const onProgress = (_l: number, _t: number, pct: number) => setProg(pct);
      let result: UploadedImage | UploadedVideo;
      if (props.kind === "image") {
        setProg(5);
        const prepared = await prepareImageForUpload(file, props.aspect);
        setProg(10);
        const r = await uploads.image(prepared.file, {
          aspect: props.aspect,
          prefix: props.prefix,
          clientProcessed: true,
          onProgress: (_loaded, _total, pct) => onProgress(_loaded, _total, Math.max(10, pct)),
        });
        result = r.data;
      } else {
        const r = await uploads.video(file, { prefix: props.prefix, onProgress });
        result = r.data;
      }
      onChange(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız");
    } finally {
      setBusy(false);
      setProg(0);
    }
  }, [props, onChange]);

  function onPick(file: File | undefined) {
    if (!file) return;
    void upload(file);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer?.files?.[0];
    onPick(file);
  }

  const isImage = props.kind === "image";
  const Icon    = isImage ? ImageIcon : VideoIcon;
  const fmtLabel = label ?? (isImage ? "Görsel" : "Video");

  return (
    <div>
      <div className="flex min-w-0 items-center justify-between gap-3 mb-1">
        <span className="block text-xs uppercase tracking-widest text-[var(--text-muted)]">
          {fmtLabel}
        </span>
        {value && !busy && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1 text-[11px] text-red-700 hover:underline"
          >
            <X className="w-3 h-3" />
            Kaldır
          </button>
        )}
      </div>

      {value && !busy ? (
        <div className="min-w-0 rounded-xl overflow-hidden border border-[var(--border-soft)] bg-[var(--surface-mist)]">
          {isImage ? (
            <img
              src={value}
              alt=""
              className="w-full max-h-56 object-contain bg-white"
              onError={(e) => (e.currentTarget.style.opacity = "0.2")}
            />
          ) : (
            <video
              src={value}
              muted
              loop
              playsInline
              autoPlay
              className="w-full max-h-56 object-contain bg-black"
            />
          )}
          <div className="min-w-0 px-3 py-2 text-[11px] text-[var(--text-muted)] truncate font-mono">
            {value}
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`flex min-w-0 flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed cursor-pointer transition select-none ${
            dragOver
              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
              : "border-[var(--border-soft)] bg-[var(--surface-mist)]/40 hover:border-[var(--brand-primary)]/60"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            disabled={busy}
            onChange={(e) => onPick(e.target.files?.[0] ?? undefined)}
          />
          {busy ? (
            <>
              <Loader2 className="w-6 h-6 text-[var(--brand-primary)] animate-spin" />
              <p className="text-xs text-[var(--text-muted)]">Yükleniyor… {progress}%</p>
              <div className="w-full max-w-xs h-1.5 rounded-full bg-[var(--border-soft)] overflow-hidden">
                <div
                  className="h-full bg-[var(--brand-primary)] transition-[width] duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <span className="w-10 h-10 rounded-full bg-white border border-[var(--border-soft)] flex items-center justify-center text-[var(--brand-primary)]">
                <Upload className="w-4 h-4" />
              </span>
              <p className="text-center text-sm text-[var(--text-primary)]">
                <span className="font-medium">Sürükleyip bırakın</span> veya tıklayın
              </p>
              <p className="max-w-full text-center text-[11px] text-[var(--text-muted)] flex flex-wrap items-center justify-center gap-1">
                <Icon className="w-3 h-3" />
                {isImage
                  ? "PNG, JPG, WebP, GIF — tarayıcıda kırpılır ve WebP'ye çevrilir"
                  : "MP4 / WebM / MOV — en fazla 10 MB"}
              </p>
            </>
          )}
        </label>
      )}

      {hint && <p className="text-[11px] text-[var(--text-muted)] mt-1">{hint}</p>}
      {error && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-2 py-1 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
