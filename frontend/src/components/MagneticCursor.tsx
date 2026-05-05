import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const MagneticCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(isTouchDevice);
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const pos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Fast dot follow
      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.05,
        ease: 'none',
      });
    };

    // Smooth cursor follow
    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;

      gsap.set(cursor, {
        x: pos.x,
        y: pos.y,
      });

      requestAnimationFrame(tick);
    };

    // Interactive elements magnetic effect
    const handleMouseEnter = () => {
      cursor.classList.add('hover');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('hover');
    };

    const addInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [data-cursor-hover]'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    tick();
    addInteractiveListeners();

    // Re-add listeners when DOM changes
    const observer = new MutationObserver(addInteractiveListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div ref={cursorRef} className="cursor-custom hidden lg:block" />
      <div ref={dotRef} className="cursor-dot hidden lg:block" />
      <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default MagneticCursor;
