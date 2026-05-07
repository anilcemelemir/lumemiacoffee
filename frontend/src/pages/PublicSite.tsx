import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import CorporateIntroSection from '../sections/CorporateIntroSection';
import HeroSection from '../sections/HeroSection';
import TasteSection from '../sections/TasteSection';
import BotanicalBrewsSection from '../sections/BotanicalBrewsSection';
import PlantBasedSection from '../sections/PlantBasedSection';
import FreshlyRoastedSection from '../sections/FreshlyRoastedSection';
import BaristaCraftSection from '../sections/BaristaCraftSection';
import SlowDownSection from '../sections/SlowDownSection';
import CoffeeSelectionSection from '../sections/CoffeeSelectionSection';
import MenuCtaSection from '../sections/MenuCtaSection';
import VisitSection from '../sections/VisitSection';
import NewsletterSection from '../sections/NewsletterSection';
import FooterSection from '../sections/FooterSection';
import { ContentProvider } from '../lib/content';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

export default function PublicSite() {
  const mainRef = useRef<HTMLDivElement>(null);
  const snapTriggerRef = useRef<ReturnType<typeof ScrollTrigger.create> | null>(null);
  const location = useLocation();
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (location.hash) return;
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => window.scrollTo(0, 0), 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  // Scroll to hash target when arriving via /#section links
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return true;
      }
      return false;
    };
    if (!tryScroll()) {
      const t = window.setTimeout(tryScroll, 600);
      return () => window.clearTimeout(t);
    }
  }, [location]);

  useEffect(() => {
    if (isMobile) return;
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      snapTriggerRef.current = ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    const timer = setTimeout(setupGlobalSnap, 500);
    return () => {
      clearTimeout(timer);
      snapTriggerRef.current?.kill();
      snapTriggerRef.current = null;
    };
  }, [isMobile]);

  // Synchronously reveal above-the-fold elements before first paint — eliminates blank flash.
  useLayoutEffect(() => {
    if (!isMobile) return;
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>('.mobile-reveal, .mobile-reveal-stagger').forEach(el => {
      if (el.getBoundingClientRect().top < vh) {
        el.classList.add('is-visible');
      }
    });
  }, [isMobile, location.pathname]);

  useEffect(() => {
    if (!isMobile) return;

    // Only observe elements not already revealed above the fold.
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>('.mobile-reveal, .mobile-reveal-stagger')
    ).filter(el => !el.classList.contains('is-visible'));

    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isMobile, location.pathname]);

  return (
    <ContentProvider>
      <div ref={mainRef} className="relative">
        {!isMobile && <div className="grain-overlay" />}
        {!isMobile && <div className="vignette" />}
        <Navigation />
        <main className="relative">
          <CorporateIntroSection className="z-[5]" />
          <HeroSection className="z-10" />
          <TasteSection className="z-20" />
          <BotanicalBrewsSection className="z-30" />
          <PlantBasedSection className="z-40" />
          <FreshlyRoastedSection className="z-50" />
          <BaristaCraftSection className="z-[60]" />
          <SlowDownSection className="z-[70]" />
          <CoffeeSelectionSection className="z-[80]" />
          <MenuCtaSection className="z-[90]" />
          <VisitSection className="z-[100]" />
          <NewsletterSection className="z-[110]" />
          <FooterSection className="z-[120]" />
        </main>
      </div>
    </ContentProvider>
  );
}
