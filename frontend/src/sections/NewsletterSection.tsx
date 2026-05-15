import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Facebook, Music2, Send } from 'lucide-react';
import { api } from '../lib/api';
import { useT } from '../lib/content';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface NewsletterSectionProps {
  className?: string;
}

const NewsletterSection = ({ className = '' }: NewsletterSectionProps) => {
  const t = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const isMobile = useIsMobile();
  const socialLinks = [
    {
      label: t('footer.social_ig', 'Instagram'),
      url: t('footer.social_ig_url', ''),
      Icon: Instagram,
    },
    {
      label: t('footer.social_fb', 'Facebook'),
      url: t('footer.social_fb_url', ''),
      Icon: Facebook,
    },
    {
      label: t('footer.social_tt', 'TikTok'),
      url: t('footer.social_tt_url', ''),
      Icon: Music2,
    },
  ].filter((item) => item.url.trim() !== '');

  useLayoutEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        formRef.current,
        { scale: 0.98, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
            end: 'top 65%',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setSubmitError('');
    setIsSubmitting(true);
    try {
      await api.post('/api/v1/newsletter', { email, source: 'newsletter', website });
      setIsSubmitted(true);
      setEmail('');
      setWebsite('');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Abonelik kaydedilemedi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`section-flowing bg-[var(--brand-primary-dark)] dotted-grid py-20 ${className}`}
    >
      <div className="max-w-2xl mx-auto px-6 lg:px-12 text-center mobile-reveal-stagger">
        <div ref={contentRef}>
          <h2 className="font-display text-h2 text-[var(--text-on-dark)] mb-4">
            {t('newsletter.title', 'LUME MIA ÇEMBERİNE KATILIN')}
          </h2>
          <p className="text-body text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] mb-8">
            {t('newsletter.body', 'Yeni gelen kavurmalara, mevsimsel menülere ve mahalle etkinliklerine erken erişim.')}
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative flex flex-col sm:flex-row gap-3 mb-10"
        >
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute left-[-9999px] top-auto h-px w-px opacity-0"
          />
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder', 'E-posta adresiniz')}
              className="w-full px-5 py-3.5 bg-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] border border-[color-mix(in_srgb,var(--text-on-dark)_20%,transparent)] rounded-full text-[var(--text-on-dark)] placeholder:text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)] focus:outline-none focus:border-[var(--brand-accent)] transition-colors text-sm"
              disabled={isSubmitted || isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="btn-primary inline-flex items-center justify-center gap-2"
            disabled={isSubmitted || isSubmitting}
          >
            {isSubmitting ? (
              'Kaydediliyor...'
            ) : isSubmitted ? (
              t('newsletter.cta_done', 'Abone olundu!')
            ) : (
              <>
                {t('newsletter.cta', 'Abone ol')}
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {submitError && (
          <p className="text-[color-mix(in_srgb,#fff_76%,#f87171)] text-sm mb-6">
            {submitError}
          </p>
        )}

        {isSubmitted && (
          <p className="text-[var(--brand-accent)] text-sm mb-6 animate-fade-in-up">
            {t('newsletter.success', 'Katıldığınız için teşekkürler! Hoş geldin notumuz için gelen kutunuzu kontrol edin.')}
          </p>
        )}

        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-6">
            {socialLinks.map(({ label, url, Icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[color-mix(in_srgb,var(--text-on-dark)_60%,transparent)] hover:text-[var(--brand-accent)] transition-colors group"
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-micro hidden sm:inline">{label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
