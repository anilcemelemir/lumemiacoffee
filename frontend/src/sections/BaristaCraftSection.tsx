import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT, splitList } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';

gsap.registerPlugin(ScrollTrigger);

interface BaristaCraftSectionProps {
  className?: string;
}

const BaristaCraftSection = ({ className = '' }: BaristaCraftSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPortraitRef = useRef<HTMLDivElement>(null);
  const rightCollageRef = useRef<HTMLDivElement>(null);
  const overlap1Ref = useRef<HTMLDivElement>(null);
  const overlap2Ref = useRef<HTMLDivElement>(null);
  const overlap3Ref = useRef<HTMLDivElement>(null);

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
        },
      });

      // ENTRANCE (0%-30%)
      // Left portrait
      scrollTl.fromTo(
        leftPortraitRef.current,
        { x: '-60vw', rotateZ: -3, opacity: 0 },
        { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      // Right collage
      scrollTl.fromTo(
        rightCollageRef.current,
        { x: '60vw', rotateZ: 3, opacity: 0 },
        { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      // Overlaps stagger
      scrollTl.fromTo(
        [overlap1Ref.current, overlap2Ref.current, overlap3Ref.current],
        { scale: 0.88, y: '6vh', opacity: 0 },
        { scale: 1, y: 0, opacity: 1, stagger: 0.07, ease: 'none' },
        0.12
      );

      // EXIT (70%-100%)
      scrollTl.to(
        leftPortraitRef.current,
        { x: '-35vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        rightCollageRef.current,
        { x: '35vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        [overlap1Ref.current, overlap2Ref.current, overlap3Ref.current],
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.72
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-pinned bg-[var(--brand-primary-dark)] dotted-grid ${className}`}
    >
      {/* Left Tall Photo - Barista Portrait */}
      <div
        ref={leftPortraitRef}
        className="absolute card-collage overflow-hidden"
        style={{
          left: '6vw',
          top: '16vh',
          width: '38vw',
          height: '68vh',
        }}
      >
        <DynamicImage
          src={t('media.barista.portrait', '/images/barista_portrait.jpg')}
          alt="Barista portrait"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Collage Card */}
      <div
        ref={rightCollageRef}
        className="absolute"
        style={{
          left: '48vw',
          top: '16vh',
          width: '46vw',
          height: '68vh',
        }}
      >
        {/* Base Card */}
        <div className="absolute inset-0 card-collage overflow-hidden">
          <DynamicImage
            src={t('media.barista.hands', '/images/barista_hands.jpg')}
            alt="Barista hands"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-Left Photo Card (Barista Hands) */}
        <div
          ref={overlap1Ref}
          className="absolute card-collage overflow-hidden"
          style={{
            left: '-3vw',
            top: '4vh',
            width: '16vw',
            height: '20vh',
            transform: 'rotate(3deg)',
          }}
        >
          <DynamicImage
            src={t('media.barista.at_work', '/images/roasted_barista.jpg')}
            alt="Barista at work"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom-Right Botanical Outline Card */}
        <div
          ref={overlap2Ref}
          className="absolute card-collage bg-[color-mix(in_srgb,var(--surface-cream)_15%,transparent)] backdrop-blur-sm flex items-center justify-center botanical-gentle"
          style={{
            right: '2vw',
            bottom: '18vh',
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
            <path d="M30 20 C25 15 20 18 22 25 C24 30 30 28 30 20" />
            <path d="M70 25 C75 20 78 23 76 28 C74 33 68 30 70 25" />
          </svg>
        </div>

        {/* Bottom-Left Cream Tag Card */}
        <div
          ref={overlap3Ref}
          className="absolute card-cream card-collage p-4"
          style={{
            left: '2vw',
            bottom: '3vh',
            width: '22vw',
          }}
        >
          <h3 className="font-display text-h3 text-[var(--brand-primary-dark)] mb-3">{t('barista.title', 'BARİSTA ZANAATI')}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {splitList(t('barista.tags', 'Her Gün El Emeği, Hassas Demleme, Sıcak Servis')).map((tag) => (
              <span key={tag} className="tag-chip text-[10px]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BaristaCraftSection;
