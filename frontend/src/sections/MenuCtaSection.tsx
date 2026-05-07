import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useT } from '../lib/content';
import { useTheme } from '../lib/theme';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  className?: string;
}

export default function MenuCtaSection({ className = '' }: Props) {
  const t = useT();
  const { layout } = useTheme();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLAnchorElement>(null);

  const bgStyle = layout?.['menu_cta.background'] ?? 'dotted';
  const isDotted = bgStyle !== 'cream';

  useLayoutEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 35%',
          scrub: 0.4,
        },
      });
      tl.fromTo(eyebrowRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0);
      tl.fromTo(titleRef.current,   { y: 32, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05);
      tl.fromTo(bodyRef.current,    { y: 24, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.12);
      tl.fromTo(ctaRef.current,     { y: 16, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, ease: 'none' }, 0.2);
    }, section);
    return () => ctx.revert();
  }, [isDotted, isMobile]);

  return (
    <section
      ref={sectionRef}
      id="menu"
      className={`section-flowing relative ${
        isDotted
          ? 'bg-[var(--brand-primary-dark)] dotted-grid'
          : 'bg-[var(--surface-cream)]'
      } py-24 sm:py-32 px-6 ${className}`}
    >
      <div className="max-w-3xl mx-auto text-center mobile-reveal-stagger">
        <p
          ref={eyebrowRef}
          className="text-micro tracking-[0.4em] uppercase mb-4 text-[var(--brand-accent)]"
        >
          {t('menu.cta.eyebrow', 'MENÜMÜZ')}
        </p>
        <h2
          ref={titleRef}
          className={`font-display text-4xl sm:text-6xl leading-[1.05] mb-6 ${
            isDotted ? 'text-[var(--text-on-dark)]' : 'text-[var(--brand-primary)]'
          }`}
        >
          {t('menu.cta.title', 'TÜM TATLAR\nBİR ARADA')
            .split('\n')
            .map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
        </h2>
        <p
          ref={bodyRef}
          className={`text-base sm:text-lg max-w-prose mx-auto mb-10 ${
            isDotted
              ? 'text-[color-mix(in_srgb,var(--text-on-dark)_78%,transparent)]'
              : 'text-[var(--text-muted)]'
          }`}
        >
          {t(
            'menu.cta.body',
            'Mevsime göre değişen kahvelerimiz, bitkisel demlerimiz ve atıştırmalıklarımız için menünün tamamına göz atın.',
          )}
        </p>
        <Link
          ref={ctaRef}
          to="/menu"
          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full transition-all duration-300 text-sm tracking-[0.2em] uppercase font-medium hover:gap-3 ${
            isDotted
              ? 'bg-[var(--brand-accent)] text-[var(--brand-primary-dark)] hover:bg-[var(--brand-accent-soft)]'
              : 'bg-[var(--brand-primary)] text-[var(--text-on-dark)] hover:bg-[var(--brand-primary-dark)]'
          }`}
        >
          {t('menu.cta.button', 'Menüyü Gör')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
