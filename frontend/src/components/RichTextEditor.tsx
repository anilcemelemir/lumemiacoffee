import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Eraser } from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  /** Optional minimum height in CSS units. */
  minHeight?: string;
};

/**
 * Lightweight contenteditable rich-text editor.
 *
 * - No third-party dependency (zero bundle cost beyond a few icons).
 * - Emits HTML via onChange; output is server-sanitized through HtmlSanitizer
 *   (only an explicit allowlist of tags + attributes survives).
 * - Toolbar: bold, italic, underline, h2, h3, list, ordered list, quote, link, clear.
 */
export function RichTextEditor({ value, onChange, minHeight = "12rem" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const savedSelection = useRef<Range | null>(null);

  // Keep editor DOM in sync only when external value changes (avoid caret jumps
  // on every keystroke).
  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  function emit() {
    if (!ref.current) return;
    onChange(ref.current.innerHTML);
  }

  function exec(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  }

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const range = savedSelection.current;
    if (!range) return;
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function applyLink() {
    restoreSelection();
    const url = linkUrl.trim();
    if (!url) {
      exec("unlink");
    } else {
      const safe = /^(https?:|mailto:|tel:|\/|#)/.test(url) ? url : `https://${url}`;
      exec("createLink", safe);
    }
    setLinkOpen(false);
    setLinkUrl("");
  }

  return (
    <div className="border border-[var(--border-soft)] rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-[var(--border-soft)] bg-[var(--surface-cream)]">
        <ToolbarButton title="Kalın (Ctrl+B)"     onClick={() => exec("bold")}><Bold className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton title="İtalik (Ctrl+I)"    onClick={() => exec("italic")}><Italic className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton title="Altı çizili"         onClick={() => exec("underline")}><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
        <Divider />
        <ToolbarButton title="Başlık 2"           onClick={() => exec("formatBlock", "<H2>")}><Heading2 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton title="Başlık 3"           onClick={() => exec("formatBlock", "<H3>")}><Heading3 className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton title="Paragraf"           onClick={() => exec("formatBlock", "<P>")}>P</ToolbarButton>
        <Divider />
        <ToolbarButton title="Madde işaretli liste" onClick={() => exec("insertUnorderedList")}><List className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton title="Numaralı liste"     onClick={() => exec("insertOrderedList")}><ListOrdered className="w-4 h-4" /></ToolbarButton>
        <ToolbarButton title="Alıntı"             onClick={() => exec("formatBlock", "<BLOCKQUOTE>")}><Quote className="w-4 h-4" /></ToolbarButton>
        <Divider />
        <ToolbarButton
          title="Bağlantı ekle"
          onClick={() => {
            saveSelection();
            setLinkOpen((v) => !v);
          }}
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Biçimi temizle"     onClick={() => exec("removeFormat")}><Eraser className="w-4 h-4" /></ToolbarButton>
      </div>

      {/* Inline link composer */}
      {linkOpen && (
        <div className="flex items-center gap-2 px-2 py-1.5 border-b border-[var(--border-soft)] bg-[var(--surface-paper)]">
          <input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") {
                setLinkOpen(false);
                setLinkUrl("");
              }
            }}
            placeholder="https://… veya /sayfa"
            className="flex-1 px-2 py-1 text-sm border border-[var(--border-soft)] rounded focus:outline-none focus:border-[var(--brand-primary)]"
          />
          <button
            type="button"
            onClick={applyLink}
            className="px-3 py-1 text-xs font-medium bg-[var(--brand-primary)] text-[var(--text-on-dark)] rounded hover:bg-[var(--brand-primary-dark)]"
          >
            Uygula
          </button>
          <button
            type="button"
            onClick={() => { setLinkOpen(false); setLinkUrl(""); }}
            className="px-3 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--brand-primary)]"
          >
            İptal
          </button>
        </div>
      )}

      {/* Editor surface */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        className="px-4 py-3 prose-rt focus:outline-none text-sm leading-relaxed"
        style={{ minHeight }}
      />
    </div>
  );
}

function ToolbarButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 text-xs font-medium text-[var(--text-primary)] rounded hover:bg-white hover:text-[var(--brand-primary)] transition-colors"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 inline-block w-px h-5 bg-[var(--border-soft)]" />;
}
