import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';
import { useT } from '../lib/content';
import { useTheme } from '../lib/theme';

gsap.registerPlugin(ScrollTrigger);

const Navigation = () => {
  const t = useT();
  const { brand, layout } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoText = t('brand.logo_text', '').trim();

  const isHome = location.pathname === '/';
  const solidOnSubpages = (layout?.['nav.solid_on_subpages'] ?? 'true') === 'true';
  const forceSolid = !isHome && solidOnSubpages;
  const useSolidStyle = forceSolid || isScrolled;

  type NavItem = { label: string; to?: string; section?: string };
  const navItems: NavItem[] = [
    { label: t('nav.menu', 'Menu'), to: '/menu' },
    { label: t('nav.story', 'Hikayemiz'), to: '/hikayemiz' },
    { label: t('nav.visit', 'Ziyaret'), section: 'visit' },
    { label: t('nav.contact', 'Iletisim'), section: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
      );
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavItem = (item: { to?: string; section?: string }) => {
    setIsMobileMenuOpen(false);
    if (item.to) {
      navigate(item.to);
      return;
    }

    if (item.section) {
      if (location.pathname === '/') {
        const el = document.getElementById(item.section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(`/#${item.section}`);
      }
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-[1000] w-full max-w-[100dvw] overflow-x-clip pointer-events-auto transition-all duration-500 ${
          useSolidStyle ? 'glass-nav h-16 sm:h-20' : 'bg-transparent h-20'
        }`}
      >
        <div className="flex h-full w-full max-w-full items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-12">
          <a
            href="#"
            className="group flex min-w-0 items-center gap-2 sm:gap-3"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname !== '/') {
                navigate('/');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img
              src={brand['logo-mark-url'] || '/images/logo-mark.svg'}
              alt=""
              className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:rotate-6 sm:h-10 sm:w-10"
            />
            {(logoText || t('brand.watermark', 'Lume Mia')) && (
              <span className="truncate font-display text-sm uppercase tracking-[0.18em] text-[var(--text-on-dark)] sm:text-xl sm:tracking-[0.22em]">
                {logoText || t('brand.watermark', 'Lume Mia')}
              </span>
            )}
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavItem(item)}
                className="text-micro group relative text-[var(--text-on-dark)] transition-colors duration-300 hover:text-[var(--brand-accent)]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--brand-accent)] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            className={`relative z-[1002] inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 md:hidden ${
              isMobileMenuOpen || useSolidStyle
                ? 'bg-[var(--brand-accent)] text-[var(--brand-primary-dark)]'
                : 'bg-[color-mix(in_srgb,var(--brand-primary-dark)_55%,transparent)] text-[var(--text-on-dark)] ring-1 ring-[color-mix(in_srgb,var(--text-on-dark)_30%,transparent)] backdrop-blur'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" strokeWidth={2.25} /> : <Menu className="h-6 w-6" strokeWidth={2.25} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[999] w-full max-w-[100dvw] overflow-hidden bg-[color-mix(in_srgb,var(--brand-primary-dark)_98%,transparent)] pt-20 backdrop-blur-xl transition-all duration-500 ease-out md:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleNavItem(item)}
              className="font-display text-3xl uppercase tracking-[0.2em] text-[var(--text-on-dark)] transition-all duration-500 ease-out hover:text-[var(--brand-accent)]"
              style={{
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
