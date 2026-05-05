import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Coffee } from 'lucide-react';
import { useT } from '../lib/content';
import { useMenu, formatPrice } from '../lib/useMenu';

gsap.registerPlugin(ScrollTrigger);

interface MenuSectionProps {
  className?: string;
}

const MenuSection = ({ className = '' }: MenuSectionProps) => {
  const t = useT();
  const { categories, loading } = useMenu();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: true,
          },
        }
      );

      // Cards stagger animation
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="menu"
      className={`section-flowing bg-[var(--brand-primary-dark)] dotted-grid min-h-screen py-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Heading Block */}
        <div ref={headingRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <h2 className="font-display text-h2 text-[var(--text-on-dark)] mb-4 lg:mb-0">
            {t('menu.title', 'MEN�S')}
          </h2>
          <p className="text-body text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] max-w-sm">
            {t('menu.subtitle', 'Mevsime göre de�xi�xir, her gün taze. Tüm fiyatlara KDV dahildir.')}
          </p>
        </div>

        {loading && (
          <p className="text-center text-[color-mix(in_srgb,var(--text-on-dark)_50%,transparent)] py-12">Yükleniyor⬦</p>
        )}

        {/* Categories */}
        <div ref={cardsRef} className="space-y-12">
          {categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="font-display text-h3 text-[var(--brand-accent)] mb-6 tracking-wider">
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.products.map((p) => (
                  <div
                    key={p.id}
                    className="group bg-[color-mix(in_srgb,var(--text-on-dark)_5%,transparent)] border border-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] rounded-2xl p-5 hover:bg-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] hover:border-[color-mix(in_srgb,var(--brand-accent)_30%,transparent)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <h4 className="font-display text-lg tracking-wider text-[var(--text-on-dark)] group-hover:text-[var(--brand-accent)] transition-colors">
                        {p.name}
                      </h4>
                      <span className="font-display text-lg text-[var(--brand-accent)] whitespace-nowrap">
                        {formatPrice(p.price, p.currency)}
                      </span>
                    </div>
                    {p.description && (
                      <p className="text-body text-[color-mix(in_srgb,var(--text-on-dark)_60%,transparent)] text-sm">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Extras note */}
        <div className="mt-12 p-6 bg-[color-mix(in_srgb,var(--text-on-dark)_5%,transparent)] border border-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] rounded-2xl flex items-start gap-4">
          <Coffee className="w-5 h-5 text-[var(--brand-accent)] mt-0.5 flex-shrink-0" />
          <p className="text-body text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] text-sm">
            {t('menu.extras_note', 'Hafif tatlılar her gün taze � bugünün seçimi için baristamıza danı�xın.')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
