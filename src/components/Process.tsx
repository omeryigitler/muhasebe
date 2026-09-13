import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Process = () => {
  const { t } = useLanguage();
  const container = useRef<HTMLDivElement>(null);

  const steps = [
    { 
      id: '01', 
      title: t('process.s1.t'), 
      text: t('process.s1.d'),
      color: 'bg-electric-blue text-white border-electric-blue',
      rot: '-rotate-1',
      icon: '✓'
    },
    { 
      id: '02', 
      title: t('process.s2.t'), 
      text: t('process.s2.d'),
      color: 'bg-acid-lime text-deep-ink border-acid-lime',
      rot: 'rotate-1',
      icon: '✦'
    },
    { 
      id: '03', 
      title: t('process.s3.t'), 
      text: t('process.s3.d'),
      color: 'bg-coral text-deep-ink border-coral',
      rot: '-rotate-1',
      icon: '★'
    },
  ];

  useGSAP(() => {
    const cards = gsap.utils.toArray('.process-card') as HTMLElement[];
    
    // Animate cards fading in as they scroll into view
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4 md:px-8 bg-warm-paper text-deep-ink relative">
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-5xl md:text-7xl font-display leading-tight">
          {t('process.title')}
        </h2>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-[35vh] pb-[10vh]">
        {steps.map((step, i) => (
          <div 
            key={i}
            className="sticky w-full"
            style={{ 
              top: `calc(150px + ${i * 45}px)`, 
              zIndex: i + 1,
            }}
          >
            <div className={cn(
              "process-card w-full shadow-[8px_8px_0px_#101114] border-4 rounded-3xl p-8 md:p-12 transition-all duration-500 hover:translate-y-[-4px]",
              step.color,
              step.rot
            )}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <p className="font-mono text-xl opacity-70 mb-4 font-bold">{step.id}</p>
                  <h3 className="text-4xl md:text-5xl font-display mb-4 leading-tight">{step.title}</h3>
                  <p className="text-xl md:text-2xl opacity-90 font-mono max-w-2xl">
                    {step.text}
                  </p>
                </div>
                
                <div className="hidden md:flex flex-shrink-0 w-32 h-32 rounded-full border-4 border-current items-center justify-center text-6xl opacity-50 bg-black/5 mix-blend-overlay">
                  {step.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
