import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { DynamicImage } from '../components/DynamicImage';
import { useT } from '../lib/content';

interface CorporateIntroSectionProps {
  className?: string;
}

const CorporateIntroSection = ({ className = '' }: CorporateIntroSectionProps) => {
  const t = useT();

  return (
    <section className={`relative mt-[var(--nav-h)] min-h-[calc(100svh-var(--nav-h))] overflow-hidden bg-[var(--brand-primary-dark)] [--nav-h:80px] ${className}`}>
      <DynamicImage
        src={t('media.intro.banner', '/images/visit_interior.jpg')}
        alt="Lume Mia Coffee interior"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.82]"
        loading="eager"
      />
      <div className="pointer-events-none absolute inset-0 bg-[var(--brand-primary-dark)]/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--brand-primary-dark)]/88 via-[var(--brand-primary-dark)]/58 to-[var(--brand-primary-dark)]/74" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--brand-primary-dark)]/18 via-transparent to-[var(--brand-primary-dark)]/42" />
      <div className="pointer-events-none absolute inset-0 dotted-grid opacity-30" />

      <div className="relative z-10 flex min-h-[calc(100svh-var(--nav-h))] items-center px-5 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-6xl mobile-reveal-stagger">
          <p className="text-micro mb-4 text-[var(--brand-accent)]">
            {t('intro.kicker', 'Lume Mia Coffee')}
          </p>
          <h1 className="font-display text-h1 max-w-4xl text-[var(--text-on-dark)]">
            {t('intro.title', 'Kurumsal kahve deneyimi')}
          </h1>
          <p className="text-body mt-6 max-w-2xl text-[color-mix(in_srgb,var(--text-on-dark)_84%,transparent)]">
            {t(
              'intro.body',
              'Lume Mia, seçili çekirdekleri, sakin servis dilini ve botanik atmosferini aynı standartta buluşturan çağdaş bir kahve evidir. Her fincan; izlenebilir tedarik, dikkatli kavurma ve tutarlı misafir deneyimi üzerine kurulur.',
            )}
          </p>
          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 border-y border-[color-mix(in_srgb,var(--text-on-dark)_16%,transparent)] py-5 text-[var(--text-on-dark)] sm:grid-cols-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--text-on-dark)_72%,transparent)]">
              {t('intro.metric_1', 'Seçili tedarik')}
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--text-on-dark)_72%,transparent)]">
              {t('intro.metric_2', 'Günlük hazırlık')}
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--text-on-dark)_72%,transparent)]">
              {t('intro.metric_3', 'Net servis standardı')}
            </p>
          </div>
          <Link
            to="/hikayemiz"
            className="mt-8 inline-flex items-center gap-2 text-micro text-[var(--text-on-dark)] transition-colors hover:text-[var(--brand-accent)]"
          >
            {t('intro.cta', 'Hikâyemizi incele')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CorporateIntroSection;
