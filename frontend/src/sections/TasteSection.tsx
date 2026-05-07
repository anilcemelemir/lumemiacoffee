import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface TasteSectionProps {
  className?: string;
}

const TasteSection = ({ className = '' }: TasteSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const centerCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const textPanelRef = useRef<HTMLDivElement>(null);
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

      scrollTl.fromTo(
        leftCardRef.current,
        { x: '-60vw', rotateZ: -5, opacity: 0 },
        { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        centerCardRef.current,
        { y: '-40vh', rotateZ: 3, opacity: 0 },
        { y: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        rightCardRef.current,
        { x: '60vw', rotateZ: 5, opacity: 0 },
        { x: 0, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        textPanelRef.current,
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

      scrollTl.to(
        leftCardRef.current,
        { x: '-30vw', opacity: 0, rotateZ: -2, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        centerCardRef.current,
        { y: '-25vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.to(
        rightCardRef.current,
        { x: '30vw', opacity: 0, rotateZ: 2, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className={`section-flowing bg-[var(--brand-primary-dark)] dotted-grid py-20 ${className}`}>
        <div className="max-w-xl mx-auto px-5 space-y-4 mobile-reveal-stagger">
          <div className="card-collage overflow-hidden aspect-[4/5]"><DynamicImage src={t('media.taste.hand', '/images/moment_hand.jpg')} alt="Hand holding coffee cup" className="w-full h-full object-cover" /></div>
          <div className="card-collage overflow-hidden aspect-[4/3]"><DynamicImage src={t('media.taste.latte', '/images/moment_latte.jpg')} alt="Latte art" className="w-full h-full object-cover" /></div>
          <div className="card-collage overflow-hidden aspect-[4/5]"><DynamicImage src={t('media.taste.pour', '/images/moment_pour.jpg')} alt="Coffee moment" className="w-full h-full object-cover" /></div>
          <div className="card-cream card-collage p-5">
            <h2 className="font-display text-h3 text-[var(--brand-primary-dark)] mb-2">{t('taste.title', 'ANI TADIN')}</h2>
            <p className="text-body text-[color-mix(in_srgb,var(--brand-primary-dark)_80%,transparent)]">{t('taste.body', 'Spesiyalite kahve, hafif lezzetler ve sehrin yemyesil bir kosesinde sakin sabahlar.')}</p>
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
      <div
        ref={leftCardRef}
        className="absolute card-collage overflow-hidden"
        style={{
          left: '6vw',
          top: '18vh',
          width: '28vw',
          height: '64vh',
        }}
      >
        <DynamicImage
          src={t('media.taste.hand', '/images/moment_hand.jpg')}
          alt="Hand holding coffee cup"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        ref={centerCardRef}
        className="absolute card-collage overflow-hidden"
        style={{
          left: '36vw',
          top: '18vh',
          width: '26vw',
          height: '30vh',
        }}
      >
        <DynamicImage
          src={t('media.taste.latte', '/images/moment_latte.jpg')}
          alt="Latte art"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        ref={rightCardRef}
        className="absolute card-collage overflow-hidden"
        style={{
          left: '64vw',
          top: '18vh',
          width: '30vw',
          height: '64vh',
        }}
      >
        <DynamicImage
          src={t('media.taste.pour', '/images/moment_pour.jpg')}
          alt="Coffee moment"
          className="w-full h-full object-cover"
        />

        <div
          ref={textPanelRef}
          className="absolute z-20 bottom-0 left-0 right-0 card-cream p-6"
        >
          <h2 className="font-display text-h3 text-[var(--brand-primary-dark)] mb-3">
            {t('taste.title', 'ANI TADIN')}
          </h2>
          <p className="text-body text-[color-mix(in_srgb,var(--brand-primary-dark)_80%,transparent)] leading-relaxed">
            {t('taste.body', 'Spesiyalite kahve, hafif lezzetler ve sehrin yemyesil bir kosesinde sakin sabahlar.')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TasteSection;
