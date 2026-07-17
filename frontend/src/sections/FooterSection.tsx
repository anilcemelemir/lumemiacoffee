import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, Send, Coffee, Instagram, Facebook, Music2 } from 'lucide-react';
import { api } from '../lib/api';
import { useT } from '../lib/content';
import { useTheme } from '../lib/theme';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface FooterSectionProps {
  className?: string;
  /** When true, drops `section-flowing` (8vh) padding and large internal py for tight layouts (e.g. /menu) */
  compact?: boolean;
}

const FooterSection = ({ className = '', compact = false }: FooterSectionProps) => {
  const t = useT();
  const { brand } = useTheme();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [website, setWebsite] = useState('');
  const [hasConsent, setHasConsent] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) return;

    // In compact mode (subpages w/ short content), skip scroll-triggered hide-then-reveal
    // so the footer never sits as a blank dark band waiting for a scroll that won't happen.
    if (compact || isMobile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        columnsRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: columnsRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            end: 'top 80%',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [compact, isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !hasConsent || isSubmitting) return;

    setSubmitError('');
    setIsSubmitting(true);
    try {
      await api.post('/api/v1/contact-messages', { ...formData, consent: hasConsent, website });
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      setWebsite('');
      setHasConsent(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Mesaj kaydedilemedi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const brandRevealClass = compact ? '' : 'mobile-reveal';
  const columnsRevealClass = compact ? '' : 'mobile-reveal-stagger';
  const footerRevealClass = compact ? '' : 'mobile-reveal';
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`${
        compact ? 'relative' : 'section-flowing'
      } bg-[var(--brand-primary-dark)] dotted-grid ${compact ? 'py-8 sm:py-10' : 'py-20'} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Brand row */}
        <div className={`flex items-center gap-4 ${compact ? 'mb-8 pb-6' : 'mb-12 pb-8'} border-b border-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] ${brandRevealClass}`}>
          <img
            src={brand['logo-mark-url'] || '/images/logo-mark.svg'}
            alt=""
            className="w-14 h-14"
          />
          <div>
            <p className="font-display text-h3 text-[var(--text-on-dark)] tracking-[0.22em]">
              {brand['brand-name'] || 'Lume Mia Coffee'}
            </p>
            <p className="text-micro text-[var(--brand-accent)] mt-1">
              {t('brand.tagline', 'Botanik demlemeler, yavaşça servis edilir.')}
            </p>
          </div>
        </div>

        <div
          ref={columnsRef}
          className={`grid grid-cols-1 lg:grid-cols-2 ${compact ? 'gap-8 lg:gap-12 mb-10' : 'gap-12 lg:gap-20 mb-16'} ${columnsRevealClass}`}
        >
          {/* Left Column - Contact Form */}
          <div>
            <h3 className="font-display text-h3 text-[var(--text-on-dark)] mb-6">
              {t('footer.note_title', 'BİR NOT BIRAKIN')}
            </h3>

            {isSent ? (
              <div className="card-cream card-collage p-8 text-center">
                <Coffee className="w-10 h-10 text-[var(--brand-accent)] mx-auto mb-4" />
                <p className="text-body text-[var(--brand-primary-dark)] font-medium">
                  {t('footer.note_sent', 'Mesajınız gönderildi!')}
                </p>
                <p className="text-body text-[color-mix(in_srgb,var(--brand-primary-dark)_60%,transparent)] text-sm mt-2">
                  {t('footer.note_sent_sub', '24 saat içinde size dönüş yapacağız.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-4">
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
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('footer.field_name', 'Adınız')}
                  className="w-full px-5 py-3.5 bg-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] border border-[color-mix(in_srgb,var(--text-on-dark)_20%,transparent)] rounded-xl text-[var(--text-on-dark)] placeholder:text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)] focus:outline-none focus:border-[var(--brand-accent)] transition-colors text-sm"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('footer.field_email', 'E-posta adresiniz')}
                  className="w-full px-5 py-3.5 bg-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] border border-[color-mix(in_srgb,var(--text-on-dark)_20%,transparent)] rounded-xl text-[var(--text-on-dark)] placeholder:text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)] focus:outline-none focus:border-[var(--brand-accent)] transition-colors text-sm"
                />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('footer.field_message', 'Mesajınız')}
                  rows={4}
                  className="w-full px-5 py-3.5 bg-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] border border-[color-mix(in_srgb,var(--text-on-dark)_20%,transparent)] rounded-xl text-[var(--text-on-dark)] placeholder:text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)] focus:outline-none focus:border-[var(--brand-accent)] transition-colors text-sm resize-none"
                />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <button
                    type="submit"
                    disabled={!hasConsent || isSubmitting}
                    className={`btn-primary inline-flex items-center justify-center gap-2 ${
                      hasConsent && !isSubmitting ? '' : 'cursor-not-allowed opacity-55'
                    }`}
                  >
                    {isSubmitting ? 'Kaydediliyor...' : t('footer.field_submit', 'Mesajı gönder')}
                    <Send className="w-4 h-4" />
                  </button>
                  <label className="flex min-w-0 items-start gap-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--text-on-dark)_66%,transparent)]">
                    <input
                      type="checkbox"
                      required
                      checked={hasConsent}
                      onChange={(e) => setHasConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-[color-mix(in_srgb,var(--text-on-dark)_28%,transparent)] bg-transparent accent-[var(--brand-accent)]"
                    />
                    <span>
                      {t(
                        'footer.consent',
                        'Gönderdiğim verilerimin toplanmasını ve saklanmasını kabul ediyorum.',
                      )}{' '}
                      <Link
                        to="/gizlilik"
                        className="underline decoration-[color-mix(in_srgb,var(--brand-accent)_55%,transparent)] underline-offset-2 hover:text-[var(--brand-accent)]"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Gizlilik metni
                      </Link>
                    </span>
                  </label>
                </div>
                {submitError && (
                  <p className="text-sm text-[color-mix(in_srgb,#fff_76%,#f87171)]">
                    {submitError}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div>
            <h3 className="font-display text-h3 text-[var(--text-on-dark)] mb-6">
              {t('footer.call_title', 'ARAMAK MI İSTERSİNİZ?')}
            </h3>

            <div className="space-y-4 mb-8">
              <a
                href={`tel:${t('footer.phone', '+90 (212) 555 01 19').replace(/\s|\(|\)/g, '')}`}
                className="flex items-center gap-4 text-[color-mix(in_srgb,var(--text-on-dark)_80%,transparent)] hover:text-[var(--brand-accent)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] flex items-center justify-center group-hover:bg-[color-mix(in_srgb,var(--brand-accent)_20%,transparent)] transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-body">{t('footer.phone', '+90 (212) 555 01 19')}</span>
              </a>

              <a
                href={`mailto:${t('footer.email', 'merhaba@lumemia.coffee')}`}
                className="flex items-center gap-4 text-[color-mix(in_srgb,var(--text-on-dark)_80%,transparent)] hover:text-[var(--brand-accent)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] flex items-center justify-center group-hover:bg-[color-mix(in_srgb,var(--brand-accent)_20%,transparent)] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-body">{t('footer.email', 'merhaba@lumemia.coffee')}</span>
              </a>
            </div>

            {/* Quick Links */}
            <div className="pt-6 border-t border-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)]">
              <p className="text-micro text-[color-mix(in_srgb,var(--text-on-dark)_50%,transparent)] mb-4">{t('footer.links_title', 'Hızlı Erişim')}</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/menu"
                  className="text-sm text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] hover:text-[var(--brand-accent)] transition-colors"
                >
                  {t('footer.link_menu', 'Menü')}
                </Link>
                <Link
                  to="/hikayemiz"
                  className="text-sm text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] hover:text-[var(--brand-accent)] transition-colors"
                >
                  {t('footer.link_story', 'Hikâyemiz')}
                </Link>
                <Link
                  to="/#visit"
                  className="text-sm text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] hover:text-[var(--brand-accent)] transition-colors"
                >
                  {t('footer.link_visit', 'Ziyaret')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div
          ref={footerRef}
          className={`pt-8 border-t border-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] flex flex-col sm:flex-row items-center justify-between gap-4 ${footerRevealClass}`}
        >
          <p className="text-micro text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)]">
            {t('footer.copyright', '© 2026 Lume Mia Coffee. Tüm hakları saklıdır.')}
          </p>
          <div className="flex gap-6">
            {socialLinks.map(({ label, url, Icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)] hover:text-[var(--brand-accent)] transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav
          aria-label="Yasal bağlantılar"
          className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-center"
        >
          <Link
            to="/teslimat-ve-iade"
            className="text-xs text-[color-mix(in_srgb,var(--text-on-dark)_55%,transparent)] transition-colors hover:text-[var(--brand-accent)]"
          >
            {t('footer.link_delivery', 'Teslimat ve İade')}
          </Link>
          <Link
            to="/gizlilik"
            className="text-xs text-[color-mix(in_srgb,var(--text-on-dark)_55%,transparent)] transition-colors hover:text-[var(--brand-accent)]"
          >
            {t('footer.link_privacy', 'Gizlilik')}
          </Link>
          <Link
            to="/mesafeli-satis-sozlesmesi"
            className="text-xs text-[color-mix(in_srgb,var(--text-on-dark)_55%,transparent)] transition-colors hover:text-[var(--brand-accent)]"
          >
            {t('footer.link_distance', 'Mesafeli Satış Sözleşmesi')}
          </Link>
        </nav>

        <div className="mt-6 flex justify-center">
          <img
            src="/images/payment-methods-white.png"
            alt="iyzico ile ode, Mastercard, Visa, American Express ve Troy"
            loading="lazy"
            className="h-auto w-full max-w-[680px] opacity-70"
          />
        </div>

        <p className="mt-6 text-center text-micro text-[color-mix(in_srgb,var(--text-on-dark)_60%,transparent)]">
          <a
            href="https://teknoparkyazilim.com"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--brand-accent)] hover:text-[var(--text-on-dark)] transition-colors"
          >
            TeknoPark Yazılım
          </a>{' '}
          tarafından hazırlanmıştır.
        </p>
      </div>
    </section>
  );
};

export default FooterSection;
