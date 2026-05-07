import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useT } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface CoffeeSelectionSectionProps {
  className?: string;
}

const CoffeeSelectionSection = ({ className = '' }: CoffeeSelectionSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const circleTextRef = useRef<HTMLDivElement>(null);
  const beanCardsRef = useRef<HTMLDivElement>(null);
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

      // ENTRANCE (0%-30%)
      // Circle card
      scrollTl.fromTo(
        circleRef.current,
        { scale: 0.65, rotateZ: -90, opacity: 0 },
        { scale: 1, rotateZ: 0, opacity: 1, ease: 'none' },
        0
      );

      // Circle text
      scrollTl.fromTo(
        circleTextRef.current,
        { rotateZ: 120, opacity: 0 },
        { rotateZ: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // Bean cards stagger
      if (beanCardsRef.current) {
        const cards = beanCardsRef.current.children;
        scrollTl.fromTo(
          cards,
          { y: '50vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, ease: 'none' },
          0.12
        );
      }

      // SETTLE (30%-70%): Circle slowly rotates
      scrollTl.to(
        circleRef.current,
        { rotateZ: 6, ease: 'none' },
        0.3
      );

      // EXIT (70%-100%)
      scrollTl.to(
        circleRef.current,
        { scale: 0.85, opacity: 0, ease: 'power2.in' },
        0.7
      );

      if (beanCardsRef.current) {
        const cards = beanCardsRef.current.children;
        scrollTl.to(
          cards,
          { y: '25vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
      }
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className={`section-flowing bg-[var(--brand-primary-dark)] dotted-grid py-20 ${className}`}>
        <div className="max-w-xl mx-auto px-5 space-y-5 text-center mobile-reveal-stagger">
          <div className="card-cream relative mx-auto flex aspect-[1.2/1] w-full max-w-[350px] rotate-[-3deg] flex-col items-center justify-center overflow-hidden rounded-[50%] px-8 py-9 shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
            <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 opacity-80">
              <defs>
                <path
                  id="mobileCirclePath"
                  d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                />
              </defs>
              <text className="fill-[var(--brand-primary-dark)]" style={{ fontSize: '12px', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                <textPath href="#mobileCirclePath">
                  {t('selection.ring', 'KAHVE SEÇKİMİZ • TEK MENŞE & EV HARMANLARI •')}
                </textPath>
              </text>
            </svg>
            <h2 className="relative z-10 font-display text-h3 max-w-[10rem] text-[var(--brand-primary-dark)]">
              {t('menu.title', 'MENÜ')}
            </h2>
            <Link to="/menu" className="relative z-10 mt-14 inline-flex items-center gap-2 text-micro text-[var(--brand-primary-dark)]">
              {t('selection.cta', 'Tüm menüyü gör')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-body mx-auto max-w-sm text-[color-mix(in_srgb,var(--text-on-dark)_78%,transparent)]">
            {t('selection.body', 'Tek menşe çekirdekler ve özenle hazırlanmış ev harmanları.')}
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="card-collage relative w-full max-w-full overflow-hidden aspect-[4/3]"><DynamicImage src={t('media.selection.variety', '/images/bean_trip_01.jpg')} alt="Coffee beans variety" className="w-full h-full object-cover" /></div>
            <div className="card-collage relative w-full max-w-full overflow-hidden aspect-[4/3]"><DynamicImage src={t('media.selection.closeup', '/images/bean_trip_02.jpg')} alt="Coffee beans close-up" className="w-full h-full object-cover" /></div>
            <div className="card-collage relative w-full max-w-full overflow-hidden aspect-[4/3]"><DynamicImage src={t('media.selection.origin', '/images/bean_trip_03.jpg')} alt="Ethiopian coffee beans" className="w-full h-full object-cover" /></div>
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
      {/* Center Circle Card */}
      <div
        ref={circleRef}
        className="absolute card-cream card-collage flex flex-col items-center justify-center"
        style={{
          left: '33vw',
          top: '12vh',
          width: '34vw',
          height: '34vw',
          maxHeight: '50vh',
          borderRadius: '50%',
        }}
      >
        <div ref={circleTextRef} className="text-center">
          {/* SVG Circular Text */}
          <svg viewBox="0 0 200 200" className="w-[28vw] h-[28vw] max-w-[280px] max-h-[280px]">
            <defs>
              <path
                id="circlePath"
                d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
              />
            </defs>
            <text className="fill-[var(--brand-primary-dark)]" style={{ fontSize: '14px', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              <textPath href="#circlePath">
                {t('selection.ring', 'KAHVE SEÇKİMİZ • TEK MENŞE & EV HARMANLARI •')}
              </textPath>
            </text>
          </svg>
        </div>

        <div className="absolute bottom-8 text-center">
          <p className="text-micro text-[color-mix(in_srgb,var(--brand-primary-dark)_70%,transparent)] mb-3">
            {t('selection.body', 'Tek menşe çekirdekler ve özenle hazırlanmış ev harmanları.')}
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-micro text-[var(--brand-primary-dark)] hover:text-[var(--brand-accent)] transition-colors group mx-auto"
          >
            {t('selection.cta', 'Tüm menüyü gör')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Three Bean Photo Cards */}
      <div ref={beanCardsRef} className="absolute bottom-[8vh] left-0 right-0 flex justify-center gap-[3vw]">
        <div
          className="card-collage overflow-hidden relative"
          style={{ width: '26vw', height: '22vh' }}
        >
          <DynamicImage
            src={t('media.selection.variety', '/images/bean_trip_01.jpg')}
            alt="Coffee beans variety"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="card-collage overflow-hidden relative"
          style={{ width: '26vw', height: '22vh' }}
        >
          <DynamicImage
            src={t('media.selection.closeup', '/images/bean_trip_02.jpg')}
            alt="Coffee beans close-up"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="card-collage overflow-hidden relative"
          style={{ width: '26vw', height: '22vh' }}
        >
          <DynamicImage
            src={t('media.selection.origin', '/images/bean_trip_03.jpg')}
            alt="Ethiopian coffee beans"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default CoffeeSelectionSection;

