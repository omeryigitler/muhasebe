import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const KineticMarquee = () => {
  const { t } = useLanguage();
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Simple scrub animation based on scroll
    gsap.to(textRef.current, {
      xPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }, { scope: container });

  const text = t('marquee');

  return (
    <section ref={container} className="py-20 bg-deep-ink text-acid-lime overflow-hidden flex items-center border-y border-white/5">
      <div 
        ref={textRef} 
        className="whitespace-nowrap font-playful text-7xl md:text-8xl lg:text-[10rem] tracking-wide"
        style={{ width: '200%' }}
      >
        {text.repeat(4)}
      </div>
    </section>
  );
};
