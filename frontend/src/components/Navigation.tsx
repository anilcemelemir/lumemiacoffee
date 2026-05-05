import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
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

  // Subpages (anything other than the homepage) get a solid header by default
  // so cream-text remains legible on cream backgrounds. Toggle via Görünüm Ayarları.
  const isHome = location.pathname === '/';
  const solidOnSubpages = (layout?.['nav.solid_on_subpages'] ?? 'true') === 'true';
  const forceSolid = !isHome && solidOnSubpages;
  const useSolidStyle = forceSolid || isScrolled;

  type NavItem = { label: string; to?: string; section?: string };
  const navItems: NavItem[] = [
    { label: t('nav.menu', 'Menü'),       to: '/menu' },
    { label: t('nav.story', 'Hikâyemiz'), to: '/hikayemiz' },
    { label: t('nav.visit', 'Ziyaret'),   section: 'visit'   },
    { label: t('nav.contact', 'İletişim'),section: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

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
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          useSolidStyle ? 'glass-nav py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 sm:gap-3 group min-w-0"
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
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-300 group-hover:rotate-6"
            />
            <span className="font-display text-sm sm:text-lg tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[var(--text-on-dark)] truncate">
              {t('brand.watermark', 'Lume Mia')}
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavItem(item)}
                className="text-micro text-[var(--text-on-dark)] hover:text-[var(--brand-accent)] transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--brand-accent)] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={isMobileMenuOpen}
            className={`md:hidden relative z-[1002] inline-flex items-center justify-center w-11 h-11 rounded-full shrink-0 transition-colors duration-300 ${
              isMobileMenuOpen || useSolidStyle
                ? 'bg-[var(--brand-accent)] text-[var(--brand-primary-dark)]'
                : 'bg-[color-mix(in_srgb,var(--brand-primary-dark)_55%,transparent)] backdrop-blur text-[var(--text-on-dark)] ring-1 ring-[color-mix(in_srgb,var(--text-on-dark)_30%,transparent)]'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" strokeWidth={2.25} /> : <Menu className="w-6 h-6" strokeWidth={2.25} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[999] bg-[color-mix(in_srgb,var(--brand-primary-dark)_98%,transparent)] backdrop-blur-xl transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleNavItem(item)}
              className="font-display text-3xl tracking-[0.2em] uppercase text-[var(--text-on-dark)] hover:text-[var(--brand-accent)] transition-colors duration-300"
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
