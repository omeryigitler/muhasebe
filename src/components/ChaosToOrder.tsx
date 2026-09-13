import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const ChaosToOrder = () => {
  const { t } = useLanguage();
  const container = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const scatteredItems = [
    { text: t('chaos.items.0'), style: 'text-2xl font-mono border-b-2 border-red-500 pb-1 rotate-6' },
    { text: '€829.40', style: 'text-5xl font-mono text-acid-lime -rotate-12' },
    { text: t('chaos.items.1'), style: 'text-4xl font-display bg-electric-blue text-white px-4 py-2 rotate-12' },
    { text: t('chaos.items.2'), style: 'text-xl tracking-[0.5em] rotate-3' },
    { text: '12/08', style: 'text-3xl font-mono text-coral -rotate-6' },
    { text: '+€3,420', style: 'text-4xl font-mono bg-white text-deep-ink px-4 py-1 rotate-6' },
    { text: '−€875', style: 'text-3xl font-mono text-red-500 -rotate-3' },
    { text: t('chaos.items.3'), style: 'text-xl border border-white/30 p-2 border-dashed rotate-12' },
    { text: '%', style: 'text-8xl font-display text-vivid-purple opacity-50 -rotate-12' },
  ];

  useGSAP(() => {
    // Initial random scattered positions (limited Y bounds to avoid overlapping with text)
    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      gsap.set(item, {
        x: () => gsap.utils.random(-300, 300),
        y: () => gsap.utils.random(-150, 200),
        rotation: () => gsap.utils.random(-45, 45),
        scale: () => gsap.utils.random(0.8, 1.2),
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 30%',
        end: 'bottom 80%',
        scrub: 1,
      }
    });

    // Snap to order
    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      tl.to(item, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        ease: 'power2.inOut',
      }, 0); // all start at the same time
    });

  }, { scope: container });

  return (
    <section ref={container} className="py-32 px-4 bg-deep-ink text-warm-paper overflow-hidden flex flex-col justify-center items-center relative">
      <div className="text-center z-10 relative mix-blend-difference mb-32">
        <h2 className="text-5xl md:text-7xl font-display leading-[1.1]">
          {t('chaos.t1')}<br/>
          <span className="text-acid-lime">{t('chaos.t2')}</span>
        </h2>
      </div>

      <div className="relative w-full max-w-4xl min-h-[300px] flex items-center justify-center">
        {/* We use a grid for the ordered state, but items are initially scattered using GSAP absolute transforms */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full justify-items-center items-center pointer-events-none">
          {scatteredItems.map((item, i) => (
            <div 
              key={i}
              ref={el => itemsRef.current[i] = el}
              className={`whitespace-nowrap transition-colors duration-1000 ${item.style}`}
              style={{ willChange: 'transform' }}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
