import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { useT, splitLines } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';

gsap.registerPlugin(ScrollTrigger);

interface VisitSectionProps {
  className?: string;
}

const VisitSection = ({ className = '' }: VisitSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) return;

    const ctx = gsap.context(() => {
      // Photo parallax
      gsap.fromTo(
        photoRef.current,
        { y: 0 },
        {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Info card animation
      gsap.fromTo(
        infoRef.current,
        { x: '6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: infoRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visit"
      className={`section-flowing bg-[var(--brand-primary-dark)] dotted-grid py-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Photo Card */}
          <div
            ref={photoRef}
            className="card-collage overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-full relative"
            style={{ minHeight: '400px' }}
          >
            <DynamicImage
              src={t('media.visit.interior', '/images/visit_interior.jpg')}
              alt="Lume Mia Coffee interior"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Info Card */}
          <div
            ref={infoRef}
            className="card-cream card-collage p-8 lg:p-10"
          >
            <h2 className="font-display text-h2 text-[var(--brand-primary-dark)] mb-8">
              {t('visit.title', 'BİZİ ZİYARET EDİN')}
            </h2>

            {/* Address */}
            <div className="flex items-start gap-4 mb-6">
              <MapPin className="w-5 h-5 text-[var(--brand-accent)] mt-1 flex-shrink-0" />
              <div>
                {splitLines(t('visit.address', 'Bomonti Mah. Cumhuriyet Cad. No:14\nŞişli / İstanbul — Botanik Bahçe yakını')).map((line, i) => (
                  <p
                    key={i}
                    className={i === 0
                      ? 'text-body text-[var(--brand-primary-dark)] font-medium'
                      : 'text-body text-[color-mix(in_srgb,var(--brand-primary-dark)_60%,transparent)] text-sm'}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4 mb-6">
              <Clock className="w-5 h-5 text-[var(--brand-accent)] mt-1 flex-shrink-0" />
              <div>
                <p className="text-body text-[var(--brand-primary-dark)] font-medium mb-1">
                  {t('visit.hours_label', 'Çalışma Saatleri')}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between gap-8 text-sm">
                    <span className="text-[color-mix(in_srgb,var(--brand-primary-dark)_70%,transparent)]">{t('visit.weekday_label', 'Pzt – Cum')}</span>
                    <span className="text-[var(--brand-primary-dark)]">{t('visit.weekday_hours', '07:00 – 21:00')}</span>
                  </div>
                  <div className="flex justify-between gap-8 text-sm">
                    <span className="text-[color-mix(in_srgb,var(--brand-primary-dark)_70%,transparent)]">{t('visit.weekend_label', 'Cmt – Paz')}</span>
                    <span className="text-[var(--brand-primary-dark)]">{t('visit.weekend_hours', '08:00 – 22:00')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 mb-4">
              <Phone className="w-5 h-5 text-[var(--brand-accent)] flex-shrink-0" />
              <a
                href={`tel:${t('visit.phone', '+90 (212) 555 01 19').replace(/\s|\(|\)/g, '')}`}
                className="text-body text-[var(--brand-primary-dark)] hover:text-[var(--brand-accent)] transition-colors"
              >
                {t('visit.phone', '+90 (212) 555 01 19')}
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 mb-8">
              <Mail className="w-5 h-5 text-[var(--brand-accent)] flex-shrink-0" />
              <a
                href={`mailto:${t('visit.email', 'merhaba@lumemia.coffee')}`}
                className="text-body text-[var(--brand-primary-dark)] hover:text-[var(--brand-accent)] transition-colors"
              >
                {t('visit.email', 'merhaba@lumemia.coffee')}
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary inline-flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('visit.cta_directions', 'Yol tarifi al')}
              </button>
              <button className="btn-outline inline-flex items-center gap-2 group">
                {t('visit.cta_reserve', 'Masa ayırt')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitSection;
