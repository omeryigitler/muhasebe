import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '../utils/cn';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Services = () => {
  const { t } = useLanguage();
  const container = useRef<HTMLDivElement>(null);

  const services = [
    { id: '01', title: t('services.01'), color: 'bg-electric-blue text-white', span: 'col-span-1 md:col-span-2 md:row-span-2' },
    { id: '02', title: t('services.02'), color: 'bg-acid-lime text-deep-ink', span: 'col-span-1' },
    { id: '03', title: t('services.03'), color: 'bg-coral text-deep-ink', span: 'col-span-1' },
    { id: '04', title: t('services.04'), color: 'bg-[#1A1C21] text-warm-paper', span: 'col-span-1 md:col-span-2' },
    { id: '05', title: t('services.05'), color: 'bg-[#FF90E8] text-deep-ink', span: 'col-span-1 md:row-span-2' },
    { id: '06', title: t('services.06'), color: 'bg-[#00E5FF] text-deep-ink', span: 'col-span-1' },
  ];

  useGSAP(() => {
    const cards = gsap.utils.toArray('.service-card') as HTMLElement[];
    
    cards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: (i % 3) * 0.1
      });
    });
  }, { scope: container });

  return (
    <section id="services" ref={container} className="py-24 px-4 md:px-8 bg-warm-paper text-deep-ink">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-display mb-16 max-w-2xl leading-tight">
          {t('services.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {services.map((s) => (
            <div 
              key={s.id} 
              className={cn(
                "service-card group relative p-6 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-transparent hover:border-white/20",
                s.color,
                s.span
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 right-0 p-6 opacity-20 font-mono text-8xl -translate-y-4 translate-x-4 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
                {['+','-','×','÷','%','='][parseInt(s.id)-1]}
              </div>
              
              <div className="font-mono text-xl opacity-70 transition-transform duration-500 group-hover:scale-110 origin-top-left relative z-10">
                {s.id}
              </div>
              
              <h3 className="text-3xl font-display mt-auto transition-transform duration-500 group-hover:translate-x-2 relative z-10">
                {s.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
