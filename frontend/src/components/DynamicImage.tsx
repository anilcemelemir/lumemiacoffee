import { useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

/**
 * Drop-in replacement for <img> that fades in over a Boho-Chic skeleton
 * shimmer while loading. The skeleton is an absolutely-positioned sibling,
 * so the parent should be `position: relative` (existing card containers
 * already are).
 *
 * IMPORTANT: the rendered <img> intentionally does NOT set `position` or
 * `z-index`, so it stays in the parent's normal flow and will not cover
 * sibling text overlays inside the same card.
 */
export function DynamicImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  decoding = "async",
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <>
      {!loaded && !errored && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-[var(--surface-cream)] via-[var(--surface-mist)] to-[var(--surface-cream)]"
        />
      )}
      {!errored && (
        <img
          {...rest}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`transition-opacity duration-700 ease-out ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
      {errored && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[var(--surface-mist)] flex items-center justify-center text-[var(--text-muted)] text-xs"
        >
          {alt || "Görsel yüklenemedi"}
        </span>
      )}
    </>
  );
}
