import { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useT, splitLines, splitList } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className = '' }: HeroSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCollageRef = useRef<HTMLDivElement>(null);
  const textPanelRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Auto-play entrance animation on load
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Left image card entrance
      tl.fromTo(
        leftCardRef.current,
        { opacity: 0, x: '-12vw', rotateZ: -2, scale: 0.98 },
        { opacity: 1, x: 0, rotateZ: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
        0
      );

      // Right collage entrance
      tl.fromTo(
        rightCollageRef.current,
        { opacity: 0, x: '14vw', rotateZ: 2, scale: 0.98 },
        { opacity: 1, x: 0, rotateZ: 0, scale: 1, duration: 0.9, ease: 'power2.out' },
        0
      );

      // Text panel entrance
      tl.fromTo(
        textPanelRef.current,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        0.25
      );

      // Tags stagger entrance
      if (tagsRef.current) {
        const tags = tagsRef.current.children;
        tl.fromTo(
          tags,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
          0.4
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back
            gsap.set(leftCardRef.current, { x: 0, opacity: 1 });
            gsap.set(rightCollageRef.current, { x: 0, opacity: 1 });
          },
        },
      });

      // ENTRANCE (0%-30%): Hold (already visible from load)
      // SETTLE (30%-70%): Hold
      // EXIT (70%-100%): Elements exit

      // Left card exit
      scrollTl.fromTo(
        leftCardRef.current,
        { x: 0, opacity: 1 },
        { x: '-55vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Right collage exit
      scrollTl.fromTo(
        rightCollageRef.current,
        { x: 0, opacity: 1 },
        { x: '55vw', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned bg-[var(--brand-primary-dark)] dotted-grid ${className}`}
    >
      {/* Left Image Card */}
      <div
        ref={leftCardRef}
        className="absolute card-collage overflow-hidden z-0"
        style={{
          left: '6vw',
          top: '18vh',
          width: '34vw',
          height: '64vh',
        }}
      >
        <DynamicImage
          src={t('media.hero.latte', '/images/hero_latte.jpg')}
          alt="Latte art"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Right Rotating Collage */}
      <div
        ref={rightCollageRef}
        className="absolute z-0"
        style={{
          left: '52vw',
          top: '16vh',
          width: '40vw',
          height: '68vh',
        }}
      >
        {/* Base Photo Card */}
        <div className="absolute inset-0 card-collage overflow-hidden">
          <DynamicImage
            src={t('media.hero.collage', '/images/hero_collage.jpg')}
            alt="Coffee shop scene"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Overlapping Photo Strip (Top-Left) */}
        <div
          className="absolute card-collage overflow-hidden"
          style={{
            left: '-3vw',
            top: '2vh',
            width: '12vw',
            height: '16vh',
            transform: 'rotate(-5deg)',
          }}
        >
          <DynamicImage
            src={t('media.hero.pour_overlay', '/images/moment_pour.jpg')}
            alt="Coffee moment"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Botanical Outline Card (Top-Right) */}
        <div
          className="absolute card-collage bg-[color-mix(in_srgb,var(--surface-cream)_10%,transparent)] backdrop-blur-sm flex items-center justify-center botanical-gentle"
          style={{
            right: '-2vw',
            top: '3vh',
            width: '10vw',
            height: '10vw',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-3/4 h-3/4"
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M50 85 C50 85 50 60 50 50 C50 35 35 25 30 20" />
            <path d="M50 50 C50 50 65 35 70 25" />
            <path d="M50 60 C50 60 30 50 25 40" />
            <path d="M50 40 C50 40 70 35 75 30" />
            <path d="M30 20 C25 15 20 18 22 25 C24 30 30 28 30 20" />
            <path d="M70 25 C75 20 78 23 76 28 C74 33 68 30 70 25" />
          </svg>
        </div>

        {/* Cream Text Panel with Tags (Bottom) */}
        <div
          ref={textPanelRef}
          className="absolute z-20 card-cream card-collage p-6 lg:p-8"
          style={{
            left: '2vw',
            right: '2vw',
            bottom: '3vh',
          }}
        >
          <h1 className="font-display text-h2 text-[var(--brand-primary-dark)] mb-4">
            {splitLines(t('hero.main_title', 'BOTANİK\nDEMLEMELER')).map((line, i, a) => (
              <span key={i}>
                {line}
                {i < a.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <div ref={tagsRef} className="flex flex-wrap gap-2 mb-4">
            {splitList(t('hero.tags', 'Tek Menşe, Küçük Parti, Yerinde Kavrulmuş')).map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-micro text-[var(--brand-primary-dark)] hover:text-[var(--brand-accent)] transition-colors group"
          >
            {t('hero.cta', 'Menüyü keşfet')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Logo Watermark */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
        style={{ opacity: 0.04 }}
      >
        <span className="font-display text-[20vw] tracking-[0.3em] uppercase text-[var(--text-on-dark)] whitespace-nowrap">
          {t('brand.watermark', 'Lume Mia')}
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
