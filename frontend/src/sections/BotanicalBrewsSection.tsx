import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { DynamicImage } from '../components/DynamicImage';
import { useIsMobile } from '../hooks/use-mobile';
import { splitLines, useT } from '../lib/content';

gsap.registerPlugin(ScrollTrigger);

interface BotanicalBrewsSectionProps {
  className?: string;
}

const BotanicalBrewsSection = ({ className = '' }: BotanicalBrewsSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      scrollTl.fromTo(line1Ref.current, { y: '40vh', rotateX: 55, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(line2Ref.current, { y: '40vh', rotateX: 55, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, ease: 'none' }, 0.08);
      scrollTl.fromTo(subRef.current, { y: '6vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.14);
      scrollTl.fromTo(ctaRef.current, { y: '3vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.2);
      scrollTl.to([line1Ref.current, line2Ref.current], { y: '-35vh', rotateX: -25, opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.to(subRef.current, { y: '-20vh', opacity: 0, ease: 'power2.in' }, 0.65);
      scrollTl.to(ctaRef.current, { y: '-15vh', opacity: 0, ease: 'power2.in' }, 0.68);
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    const lines = splitLines(t('botanical.title', 'BOTANIK\nDEMLEMELER'));
    return (
      <section id="story" className={`section-flowing bg-[var(--brand-primary-dark)] dotted-grid py-20 ${className}`}>
        <div className="max-w-xl mx-auto px-5 mobile-reveal-stagger">
          <div className="text-center">
            <h2 className="font-display text-h1 text-[var(--text-on-dark)]">{lines[0] ?? ''}</h2>
            <h2 className="font-display text-h1 text-[var(--brand-accent)]">{lines[1] ?? ''}</h2>
          </div>

          <div className="card-collage overflow-hidden aspect-[4/5] my-6">
            <DynamicImage
              src={t('media.plant.jug', '/images/plant_jug.jpg')}
              alt="Botanical brew being prepared"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="card-cream card-collage p-5 text-left">
            <p className="text-body text-[color-mix(in_srgb,var(--brand-primary-dark)_78%,transparent)]">
              {t('botanical.body', 'Taze yapraklar. Berrak notalar. Sakin enerji.')}
            </p>
            <Link to="/hikayemiz" className="mt-5 inline-flex items-center gap-2 text-micro text-[var(--brand-primary-dark)] hover:text-[var(--brand-accent)] transition-colors group">
              {t('botanical.cta', 'Hikayemizi okuyun')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="story"
      className={`section-pinned bg-[var(--brand-primary-dark)] dotted-grid flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-center px-6" style={{ perspective: '1000px' }}>
        {(() => {
          const lines = splitLines(t('botanical.title', 'BOTANIK\nDEMLEMELER'));
          return (
            <>
              <div ref={line1Ref} className="overflow-hidden">
                <h2 className="font-display text-h1 text-[var(--text-on-dark)]">{lines[0] ?? ''}</h2>
              </div>
              <div ref={line2Ref} className="overflow-hidden">
                <h2 className="font-display text-h1 text-[var(--brand-accent)]">{lines[1] ?? ''}</h2>
              </div>
            </>
          );
        })()}

        <p
          ref={subRef}
          className="text-body text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] mt-6 max-w-md mx-auto"
        >
          {t('botanical.body', 'Taze yapraklar. Berrak notalar. Sakin enerji.')}
        </p>

        <Link
          ref={ctaRef}
          to="/hikayemiz"
          className="btn-outline mt-8 inline-flex items-center gap-2 group"
        >
          {t('botanical.cta', 'Hikayemizi okuyun')}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="absolute top-20 left-20 opacity-20 botanical-gentle">
        <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none" stroke="var(--brand-accent)" strokeWidth="1">
          <circle cx="40" cy="40" r="35" />
          <path d="M40 15 C40 15 40 40 40 55" />
          <path d="M40 35 C40 35 25 30 20 25" />
          <path d="M40 35 C40 35 55 30 60 25" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-20 opacity-20 botanical-gentle" style={{ animationDelay: '-4s' }}>
        <svg viewBox="0 0 80 80" className="w-24 h-24" fill="none" stroke="#8B9A7E" strokeWidth="1">
          <path d="M40 70 C40 70 40 50 40 40 C40 25 25 15 20 10" />
          <path d="M40 40 C40 40 55 25 60 15" />
          <path d="M40 50 C40 50 20 40 15 30" />
        </svg>
      </div>
    </section>
  );
};

export default BotanicalBrewsSection;
