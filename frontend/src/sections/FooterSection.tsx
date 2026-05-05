import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, Send, Coffee } from 'lucide-react';
import { useT } from '../lib/content';
import { useTheme } from '../lib/theme';

gsap.registerPlugin(ScrollTrigger);

interface FooterSectionProps {
  className?: string;
  /** When true, drops `section-flowing` (8vh) padding and large internal py for tight layouts (e.g. /menu) */
  compact?: boolean;
}

const FooterSection = ({ className = '', compact = false }: FooterSectionProps) => {
  const t = useT();
  const { brand } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // In compact mode (subpages w/ short content), skip scroll-triggered hide-then-reveal
    // so the footer never sits as a blank dark band waiting for a scroll that won't happen.
    if (compact) return;

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
  }, [compact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`${
        compact ? 'relative' : 'section-flowing'
      } bg-[var(--brand-primary-dark)] dotted-grid ${compact ? 'py-12' : 'py-20'} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Brand row */}
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)]">
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16"
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <button
                  type="submit"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {t('footer.field_submit', 'Mesajı gönder')}
                  <Send className="w-4 h-4" />
                </button>
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
                <a
                  href="#visit"
                  className="text-sm text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] hover:text-[var(--brand-accent)] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#visit')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('footer.link_visit', 'Ziyaret')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div
          ref={footerRef}
          className="pt-8 border-t border-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-micro text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)]">
            {t('footer.copyright', '© 2026 Lume Mia Coffee. Tüm hakları saklıdır.')}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-micro text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)] hover:text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] transition-colors">
              {t('footer.privacy', 'Gizlilik')}
            </a>
            <a href="#" className="text-micro text-[color-mix(in_srgb,var(--text-on-dark)_40%,transparent)] hover:text-[color-mix(in_srgb,var(--text-on-dark)_70%,transparent)] transition-colors">
              {t('footer.accessibility', 'Erişilebilirlik')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
