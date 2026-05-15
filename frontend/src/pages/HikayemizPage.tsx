import { useEffect } from "react";
import { Link } from "react-router";
import DOMPurify from "dompurify";
import Navigation from "../components/Navigation";
import FooterSection from "../sections/FooterSection";
import { ContentProvider, useT } from "../lib/content";
import { DynamicImage } from "../components/DynamicImage";

export default function HikayemizPage() {
  return (
    <ContentProvider>
      <Shell />
    </ContentProvider>
  );
}

function Shell() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--surface-cream)]">
      <Navigation />
      <StoryBody />
      <FooterSection compact />
    </div>
  );
}

function StoryBody() {
  const t = useT();

  useEffect(() => {
    document.title = `${t("brand.watermark", "Lume Mia")} · ${t("nav.story", "Hikâyemiz")}`;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [t]);

  const eyebrow = t("story.eyebrow", "HİKÂYEMİZ");
  const title = t("story.title", "Bir fincan kahvenin\nardındaki yolculuk");
  const intro = t("story.intro", "Lume Mia, sakin sabahlar ve özenle hazırlanmış demlemeler üzerine kurulu bir botanik kahve atölyesidir.");
  const bodyHtml = t("story.body_html", "<p>Hikâyemiz çok yakında burada olacak.</p>");
  const ctaLabel = t("story.cta_label", "Menüyü İncele");
  const heroImage = t("story.image", "/images/hero_latte.jpg");

  const cleanBody = DOMPurify.sanitize(bodyHtml, {
    ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a"],
    ALLOWED_ATTR: ["href", "title", "target", "rel"],
  });

  return (
    <main className="flex-1 pt-28 pb-20">
      {/* Hero */}
      <section className="px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="text-micro tracking-[0.32em] text-[var(--brand-accent)] mb-4">
              {eyebrow}
            </p>
            <h1 className="font-display text-h1 text-[var(--brand-primary-dark)] leading-[1.05]">
              {title.split("\n").map((line, i, arr) => (
                <span key={i} className="block">
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="mt-6 text-body text-[color-mix(in_srgb,var(--brand-primary-dark)_80%,transparent)] max-w-xl leading-relaxed">
              {intro}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden card-collage">
              <DynamicImage
                key={heroImage}
                src={heroImage}
                alt={t("story.title", "Hikâyemiz")}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 lg:px-12 max-w-3xl mx-auto mt-16">
        <article
          className="prose-story text-[var(--brand-primary-dark)]"
          dangerouslySetInnerHTML={{ __html: cleanBody }}
        />

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
            {ctaLabel}
          </Link>
          <Link
            to="/"
            className="text-micro tracking-[0.2em] uppercase text-[var(--brand-primary)] hover:text-[var(--brand-accent)] transition-colors"
          >
            ← {t("nav.menu", "Ana sayfa")}
          </Link>
        </div>
      </section>
    </main>
  );
}
