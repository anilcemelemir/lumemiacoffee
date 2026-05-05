import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT, splitList } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';

gsap.registerPlugin(ScrollTrigger);

interface PlantBasedSectionProps {
  className?: string;
}

const PlantBasedSection = ({ className = '' }: PlantBasedSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
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
      // Right collage base
      scrollTl.fromTo(
        rightCollageRef.current,
        { x: '60vw', rotateZ: 6, opacity: 0 },
        { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      // Overlaps stagger
      scrollTl.fromTo(
        [overlap1Ref.current, overlap2Ref.current, overlap3Ref.current],
        { scale: 0.85, y: '-6vh', opacity: 0 },
        { scale: 1, y: 0, opacity: 1, stagger: 0.06, ease: 'none' },
        0.1
      );

      // Left headline
      scrollTl.fromTo(
        leftTextRef.current,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.06
      );

      // EXIT (70%-100%)
      scrollTl.to(
        rightCollageRef.current,
        { x: '55vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        leftTextRef.current,
        { x: '-20vw', opacity: 0, ease: 'power2.in' },
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
      {/* Left Text Area */}
      <div
        ref={leftTextRef}
        className="absolute"
        style={{
          left: '7vw',
          top: '26vh',
          width: '34vw',
        }}
      >
        <h2 className="font-display text-h2 text-[var(--text-on-dark)] mb-4">
          {t('plant.title', 'BİTKİSEL')}
        </h2>
        <p className="text-body text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] mb-6">
          {t('plant.body', 'Süt alternatifleri ve mevsim taze malzemeler.')}
        </p>
      </div>

      {/* Right Collage Cluster */}
      <div
        ref={rightCollageRef}
        className="absolute"
        style={{
          left: '46vw',
          top: '16vh',
          width: '48vw',
          height: '68vh',
        }}
      >
        {/* Base Card */}
        <div className="absolute inset-0 card-collage overflow-hidden">
          <DynamicImage
            src={t('media.plant.background', '/images/plant_based.jpg')}
            alt="Plant-based preparation"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-Left Small Photo Card */}
        <div
          ref={overlap1Ref}
          className="absolute card-collage overflow-hidden"
          style={{
            left: '-3vw',
            top: '3vh',
            width: '14vw',
            height: '18vh',
            transform: 'rotate(-4deg)',
          }}
        >
          <DynamicImage
            src={t('media.plant.jug', '/images/plant_jug.jpg')}
            alt="Matcha jug"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Top-Right Botanical Outline Card */}
        <div
          ref={overlap2Ref}
          className="absolute card-collage bg-[color-mix(in_srgb,var(--surface-cream)_15%,transparent)] backdrop-blur-sm flex items-center justify-center botanical-gentle"
          style={{
            right: '-2vw',
            top: '2vh',
            width: '10vw',
            height: '10vw',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-3/4 h-3/4"
            fill="none"
            stroke="#8B9A7E"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M50 90 C50 90 50 60 50 45 C50 30 35 20 25 15" />
            <path d="M50 45 C50 45 65 30 75 20" />
            <path d="M50 55 C50 55 30 45 20 35" />
            <path d="M25 15 C20 10 15 13 18 20 C20 25 28 22 25 15" />
            <path d="M75 20 C80 15 83 18 80 23 C78 28 72 25 75 20" />
            <circle cx="50" cy="50" r="3" fill="#8B9A7E" />
          </svg>
        </div>

        {/* Bottom-Left Cream Tag Card */}
        <div
          ref={overlap3Ref}
          className="absolute card-cream card-collage p-4"
          style={{
            left: '2vw',
            bottom: '3vh',
            width: '20vw',
          }}
        >
          <div className="flex flex-wrap gap-2">
            {splitList(t('plant.tags', 'Yulaf / Badem / Soya, Mevsim Sebze & Meyve, Yapay Aroma Yok')).map((tag) => (
              <span key={tag} className="tag-chip text-[10px]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlantBasedSection;
