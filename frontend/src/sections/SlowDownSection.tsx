import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';

gsap.registerPlugin(ScrollTrigger);

interface SlowDownSectionProps {
  className?: string;
}

const SlowDownSection = ({ className = '' }: SlowDownSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPhotoRef = useRef<HTMLDivElement>(null);
  const centerPhotoRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const textCardRef = useRef<HTMLDivElement>(null);

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
      scrollTl.fromTo(
        leftPhotoRef.current,
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        centerPhotoRef.current,
        { y: '40vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        outlineRef.current,
        { x: '40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        textCardRef.current,
        { y: '30vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      );

      // EXIT (70%-100%)
      scrollTl.to(
        [leftPhotoRef.current, centerPhotoRef.current, outlineRef.current, textCardRef.current],
        { y: '-25vh', opacity: 0, ease: 'power2.in' },
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
      {/* Left Tall Photo - Plant Wall */}
      <div
        ref={leftPhotoRef}
        className="absolute card-collage overflow-hidden"
        style={{
          left: '6vw',
          top: '18vh',
          width: '34vw',
          height: '64vh',
        }}
      >
        <DynamicImage
          src={t('media.slowdown.plants', '/images/slow_plants.jpg')}
          alt="Plant wall"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Center-Right Photo - Interior */}
      <div
        ref={centerPhotoRef}
        className="absolute card-collage overflow-hidden"
        style={{
          left: '42vw',
          top: '18vh',
          width: '36vw',
          height: '36vh',
        }}
      >
        <DynamicImage
          src={t('media.slowdown.interior', '/images/slow_interior.jpg')}
          alt="Cafe interior"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top-Right Outline Card - Leaf */}
      <div
        ref={outlineRef}
        className="absolute card-collage bg-[color-mix(in_srgb,var(--surface-cream)_10%,transparent)] backdrop-blur-sm flex items-center justify-center botanical-gentle"
        style={{
          left: '72vw',
          top: '14vh',
          width: '22vw',
          height: '22vh',
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
          <path d="M50 85 C50 85 50 60 50 50 C50 35 35 25 25 15" />
          <path d="M50 50 C50 50 65 35 75 25" />
          <path d="M50 60 C50 60 30 50 20 40" />
          <path d="M50 40 C50 40 70 35 80 30" />
          <path d="M25 15 C20 10 15 13 18 20 C20 25 28 22 25 15" />
          <path d="M75 25 C80 20 83 23 80 28 C78 33 72 30 75 25" />
          <path d="M20 40 C15 35 12 38 15 43 C17 48 23 45 20 40" />
          <path d="M80 30 C85 25 88 28 85 33 C83 38 77 35 80 30" />
        </svg>
      </div>

      {/* Bottom-Right Text Card - Cream */}
      <div
        ref={textCardRef}
        className="absolute card-cream card-collage p-6 lg:p-8"
        style={{
          left: '42vw',
          top: '58vh',
          width: '52vw',
          height: '24vh',
        }}
      >
        <h2 className="font-display text-h2 text-[var(--brand-primary-dark)] mb-3">
          {t('slowdown.title', 'YAVAŞLAYIN')}
        </h2>
        <p className="text-body text-[color-mix(in_srgb,var(--brand-primary-dark)_80%,transparent)] mb-4">
          {t('slowdown.body', 'Doğal ışık, yapraklı köşeler ve oyalanmak için hazırlanmış bir çalma listesi.')}
        </p>
      </div>
    </section>
  );
};

export default SlowDownSection;
