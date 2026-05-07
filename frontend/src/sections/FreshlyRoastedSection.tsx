import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT, splitLines } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface FreshlyRoastedSectionProps {
  className?: string;
}

const FreshlyRoastedSection = ({ className = '' }: FreshlyRoastedSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPosterRef = useRef<HTMLDivElement>(null);
  const rightPhotoRef = useRef<HTMLDivElement>(null);
  const topPhotoRef = useRef<HTMLDivElement>(null);
  const beansRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (isMobile) return;
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
      // Left poster
      scrollTl.fromTo(
        leftPosterRef.current,
        { x: '-60vw', rotateZ: -4, opacity: 0 },
        { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      // Right photo
      scrollTl.fromTo(
        rightPhotoRef.current,
        { x: '60vw', rotateZ: 4, opacity: 0 },
        { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      // Top-center small photo
      scrollTl.fromTo(
        topPhotoRef.current,
        { y: '-30vh', scale: 0.9, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
        0.1
      );

      // Bean images stagger
      if (beansRef.current) {
        const beans = beansRef.current.children;
        scrollTl.fromTo(
          beans,
          { y: '10vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, ease: 'none' },
          0.16
        );
      }

      // EXIT (70%-100%)
      scrollTl.to(
        leftPosterRef.current,
        { x: '-40vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        rightPhotoRef.current,
        { x: '40vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        topPhotoRef.current,
        { y: '-20vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className={`section-flowing bg-[var(--brand-primary-dark)] dotted-grid py-20 ${className}`}>
        <div className="max-w-xl mx-auto px-5 space-y-5 mobile-reveal-stagger">
          <h2 className="font-display text-h2 text-[var(--surface-cream)]">
            {splitLines(t('roasted.title', 'YENİ\nKAVRULDU')).map((line, i, a) => (
              <span key={line + i}>{line}{i < a.length - 1 && <br />}</span>
            ))}
          </h2>
          <p className="text-body text-[color-mix(in_srgb,var(--text-on-dark)_78%,transparent)] mb-3">
            {t('roasted.body', 'Kahveyi küçük partilerde kavurur, gün boyu demleriz — her fincan size özel hazırlanmış gibi tat alır.')}
          </p>
          <div className="card-collage overflow-hidden aspect-[4/5]">
            <DynamicImage src={t('media.roasted.machine', '/images/roasting_machine.jpg')} alt="Coffee roasting machine" className="w-full h-full object-cover" />
          </div>
          <div className="card-collage overflow-hidden aspect-[4/3]">
            <DynamicImage src={t('media.roasted.cup', '/images/roasted_cup.jpg')} alt="Coffee cup" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-square rounded-xl overflow-hidden"><DynamicImage src={t('media.roasted.beans_1', '/images/beans_01.jpg')} alt="Coffee beans" className="w-full h-full object-cover" /></div>
            <div className="relative aspect-square rounded-xl overflow-hidden"><DynamicImage src={t('media.roasted.beans_2', '/images/beans_02.jpg')} alt="Coffee beans" className="w-full h-full object-cover" /></div>
            <div className="relative aspect-square rounded-xl overflow-hidden"><DynamicImage src={t('media.roasted.beans_3', '/images/beans_03.jpg')} alt="Coffee beans" className="w-full h-full object-cover" /></div>
            <div className="relative aspect-square rounded-xl overflow-hidden"><DynamicImage src={t('media.roasted.beans_4', '/images/beans_04.jpg')} alt="Coffee beans" className="w-full h-full object-cover" /></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`section-pinned bg-[var(--brand-primary-dark)] dotted-grid ${className}`}
    >
      {/* Left Poster Card */}
      <div
        ref={leftPosterRef}
        className="absolute card-collage card-cream overflow-hidden flex flex-col"
        style={{
          left: '6vw',
          top: '16vh',
          width: '40vw',
          height: '68vh',
        }}
      >
        <div className="p-6 lg:p-8 flex-1 flex flex-col">
          <h2 className="font-display text-h2 text-[var(--brand-primary-dark)] mb-4">
            {splitLines(t('roasted.title', 'YENİ\nKAVRULDU')).map((line, i, a) => (
              <span key={i}>
                {line}
                {i < a.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-body text-[color-mix(in_srgb,var(--brand-primary-dark)_80%,transparent)] flex-1">
            {t('roasted.body', 'Kahveyi küçük partilerde kavurur, gün boyu demleriz — her fincan size özel hazırlanmış gibi tat alır.')}
          </p>
        </div>

        {/* Bean Images Grid */}
        <div ref={beansRef} className="grid grid-cols-4 gap-2 p-4 pt-0">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <DynamicImage src={t('media.roasted.beans_1', '/images/beans_01.jpg')} alt="Coffee beans" className="w-full h-full object-cover" />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <DynamicImage src={t('media.roasted.beans_2', '/images/beans_02.jpg')} alt="Coffee beans" className="w-full h-full object-cover" />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <DynamicImage src={t('media.roasted.beans_3', '/images/beans_03.jpg')} alt="Coffee beans" className="w-full h-full object-cover" />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <DynamicImage src={t('media.roasted.beans_4', '/images/beans_04.jpg')} alt="Coffee beans" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Right Tall Photo Card */}
      <div
        ref={rightPhotoRef}
        className="absolute card-collage overflow-hidden"
        style={{
          left: '52vw',
          top: '16vh',
          width: '42vw',
          height: '68vh',
        }}
      >
        <DynamicImage
          src={t('media.roasted.machine', '/images/roasting_machine.jpg')}
          alt="Coffee roasting machine"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Small Top-Center Photo Card */}
      <div
        ref={topPhotoRef}
        className="absolute card-collage overflow-hidden"
        style={{
          left: '44vw',
          top: '10vh',
          width: '18vw',
          height: '18vh',
        }}
      >
        <DynamicImage
          src={t('media.roasted.cup', '/images/roasted_cup.jpg')}
          alt="Coffee cup"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default FreshlyRoastedSection;
