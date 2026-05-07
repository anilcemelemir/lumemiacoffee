import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useT, splitLines } from '../lib/content';
import { DynamicImage } from '../components/DynamicImage';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface VisitSectionProps {
  className?: string;
}

const VisitSection = ({ className = '' }: VisitSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const address = t('visit.address', 'Bomonti Mah. Cumhuriyet Cad. No:14\nSisli / Istanbul - Botanik Bahce yakini');
  const phone = t('visit.phone', '+90 (212) 555 01 19');
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\s+/g, ' '))}`;
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`;
  const email = t('visit.email', 'merhaba@lumemia.coffee');

  useLayoutEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
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
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="visit"
      className={`section-flowing bg-[var(--brand-primary-dark)] dotted-grid py-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mobile-reveal-stagger">
          <div
            ref={photoRef}
            className="card-collage w-full max-w-full min-w-0 overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[400px] relative"
          >
            <DynamicImage
              src={t('media.visit.interior', '/images/visit_interior.jpg')}
              alt="Lume Mia Coffee interior"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            ref={infoRef}
            className="card-cream card-collage p-8 lg:p-10"
          >
            <h2 className="font-display text-h2 text-[var(--brand-primary-dark)] mb-8">
              {t('visit.title', 'BIZI ZIYARET EDIN')}
            </h2>

            <div className="flex items-start gap-4 mb-6">
              <MapPin className="w-5 h-5 text-[var(--brand-accent)] mt-1 flex-shrink-0" />
              <div>
                {splitLines(address).map((line, i) => (
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

            <div className="flex items-start gap-4 mb-6">
              <Clock className="w-5 h-5 text-[var(--brand-accent)] mt-1 flex-shrink-0" />
              <div>
                <p className="text-body text-[var(--brand-primary-dark)] font-medium mb-1">
                  {t('visit.hours_label', 'Calisma Saatleri')}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between gap-8 text-sm">
                    <span className="text-[color-mix(in_srgb,var(--brand-primary-dark)_70%,transparent)]">{t('visit.weekday_label', 'Pzt - Cum')}</span>
                    <span className="text-[var(--brand-primary-dark)]">{t('visit.weekday_hours', '07:00 - 21:00')}</span>
                  </div>
                  <div className="flex justify-between gap-8 text-sm">
                    <span className="text-[color-mix(in_srgb,var(--brand-primary-dark)_70%,transparent)]">{t('visit.weekend_label', 'Cmt - Paz')}</span>
                    <span className="text-[var(--brand-primary-dark)]">{t('visit.weekend_hours', '08:00 - 22:00')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Phone className="w-5 h-5 text-[var(--brand-accent)] flex-shrink-0" />
              <a
                href={phoneHref}
                className="text-body text-[var(--brand-primary-dark)] hover:text-[var(--brand-accent)] transition-colors"
              >
                {phone}
              </a>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <Mail className="w-5 h-5 text-[var(--brand-accent)] flex-shrink-0" />
              <a
                href={`mailto:${email}`}
                className="text-body text-[var(--brand-primary-dark)] hover:text-[var(--brand-accent)] transition-colors"
              >
                {email}
              </a>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              {t('visit.cta_directions', 'Yol tarifi al')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitSection;
