import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useT } from '../lib/content';
import { useTheme } from '../lib/theme';

const Navigation = () => {
  const t = useT();
  const { brand } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoText = t('brand.logo_text', '').trim();

  type NavItem = { label: string; to?: string; section?: string };
  const navItems: NavItem[] = [
    { label: t('nav.menu', 'Menu'), to: '/menu' },
    { label: t('nav.story', 'Hikayemiz'), to: '/hikayemiz' },
    { label: t('nav.visit', 'Ziyaret'), section: 'visit' },
    { label: t('nav.contact', 'Iletisim'), section: 'contact' },
  ];

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
        className="glass-nav fixed top-0 inset-x-0 z-[1000] h-20 w-full max-w-[100dvw] overflow-x-clip pointer-events-auto transition-all duration-500"
      >
        <div className="flex h-full w-full max-w-full items-center justify-between gap-4 px-5 sm:px-6 lg:px-12">
          <a
            href="#"
            className="min-w-0 flex items-center gap-3 group"
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
              className="h-10 w-10 transition-transform duration-300 group-hover:rotate-6"
            />
            {logoText && (
              <span className="font-display text-xl tracking-[0.22em] uppercase text-[var(--text-on-dark)]">
                {logoText}
              </span>
            )}
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavItem(item)}
                className="text-micro text-[var(--text-on-dark)] hover:text-[var(--brand-accent)] transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--brand-accent)] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          <button
            className="md:hidden shrink-0 rounded-full p-2 text-[var(--text-on-dark)] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--text-on-dark)_10%,transparent)]"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[999] w-full max-w-[100dvw] overflow-hidden pt-20 bg-[color-mix(in_srgb,var(--brand-primary-dark)_98%,transparent)] backdrop-blur-xl transition-all duration-500 ease-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => handleNavItem(item)}
              className="font-display text-3xl tracking-[0.2em] uppercase text-[var(--text-on-dark)] hover:text-[var(--brand-accent)] transition-all duration-500 ease-out"
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
