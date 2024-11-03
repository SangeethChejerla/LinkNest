'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

interface GsapRevealProps {
  children: React.ReactNode;
}

export const GsapReveal = ({ children }: GsapRevealProps) => {
  const elementRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      elementRef.current,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return <div ref={elementRef}>{children}</div>;
};
