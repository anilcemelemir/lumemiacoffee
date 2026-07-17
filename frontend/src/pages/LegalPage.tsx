import { useEffect } from "react";
import DOMPurify from "dompurify";
import { Link } from "react-router";
import Navigation from "../components/Navigation";
import FooterSection from "../sections/FooterSection";
import { ContentProvider, useT } from "../lib/content";
import { LEGAL_CONTENT, type LegalPageKind } from "../content/legal";

type LegalPageProps = {
  kind: LegalPageKind;
};

export default function LegalPage({ kind }: LegalPageProps) {
  return (
    <ContentProvider>
      <LegalPageShell kind={kind} />
    </ContentProvider>
  );
}

function LegalPageShell({ kind }: LegalPageProps) {
  const t = useT();
  const definition = LEGAL_CONTENT[kind];
  const title = t(definition.titleKey, definition.fallbackTitle);
  const bodyHtml = t(definition.bodyKey, definition.fallbackBody);

  useEffect(() => {
    document.title = `Lume Mia Cafe · ${title}`;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [title]);

  const cleanBody = DOMPurify.sanitize(bodyHtml, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel"],
  });

  return (
    <div className="relative min-h-screen bg-[var(--surface-cream)]">
      <Navigation />
      <main className="px-6 pb-20 pt-28 lg:px-12 lg:pt-36">
        <header className="mx-auto max-w-4xl border-b border-[var(--border-soft)] pb-8">
          <p className="mb-4 text-micro text-[var(--brand-accent)]">YASAL BİLGİLENDİRME</p>
          <h1 className="max-w-3xl font-display text-h1 leading-[1.08] text-[var(--brand-primary-dark)]">
            {title}
          </h1>
        </header>

        <article
          className="prose-story mx-auto mt-10 max-w-4xl text-[var(--brand-primary-dark)]"
          dangerouslySetInnerHTML={{ __html: cleanBody }}
        />

        <nav
          aria-label="Diğer yasal metinler"
          className="mx-auto mt-14 flex max-w-4xl flex-wrap gap-x-6 gap-y-3 border-t border-[var(--border-soft)] pt-8"
        >
          {Object.entries(LEGAL_CONTENT).map(([pageKind, page]) => (
            <Link
              key={pageKind}
              to={page.path}
              aria-current={pageKind === kind ? "page" : undefined}
              className={`text-sm transition-colors ${
                pageKind === kind
                  ? "font-semibold text-[var(--brand-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--brand-primary)]"
              }`}
            >
              {t(page.titleKey, page.fallbackTitle)}
            </Link>
          ))}
        </nav>
      </main>
      <FooterSection compact />
    </div>
  );
}
