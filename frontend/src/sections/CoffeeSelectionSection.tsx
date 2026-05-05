import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useT } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';

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

  useLayoutEffect(() => {
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
  }, []);

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
                {t('selection.ring', 'KAHVE SEÇKİMİZ ⬢ TEK MENŞE & EV HARMANLARI ⬢')}
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
