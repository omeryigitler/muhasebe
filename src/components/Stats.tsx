import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Stats = () => {
  const { t } = useLanguage();
  const container = useRef<HTMLDivElement>(null);

  const stats = [
    { label: t('stats.clients'), value: 128, suffix: '+' },
    { label: t('stats.returns'), value: 3.4, suffix: 'K' },
    { label: t('stats.years'), value: 12, suffix: '' },
    { label: t('stats.response'), value: 24, suffix: 'H', prefix: '< ' },
  ];

  useGSAP(() => {
    const numbers = gsap.utils.toArray('.stat-num') as HTMLElement[];
    
    numbers.forEach((num) => {
      const targetVal = parseFloat(num.getAttribute('data-value') || '0');
      gsap.fromTo(num, 
        { textContent: 0 },
        {
          textContent: targetVal,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: targetVal % 1 === 0 ? 1 : 0.1 },
          stagger: 1,
          scrollTrigger: {
            trigger: container.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4 bg-deep-ink border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl md:text-7xl font-mono text-acid-lime mb-4 flex items-center font-bold">
              {stat.prefix}
              <span className="stat-num" data-value={stat.value}>0</span>
              {stat.suffix}
            </div>
            <p className="font-mono text-sm tracking-widest text-warm-paper/60 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
