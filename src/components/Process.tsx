import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Process = () => {
  const { t, language } = useLanguage();
  const container = useRef<HTMLElement>(null);

  const steps = [
    {
      id: '01',
      title: t('process.s1.t'),
      text: t('process.s1.d'),
      color: 'bg-electric-blue text-white',
      subtle: 'text-white/55 border-white/18 bg-white/8',
      icon: '✓',
      label: language === 'tr' ? 'Başlangıç' : 'Start',
    },
    {
      id: '02',
      title: t('process.s2.t'),
      text: t('process.s2.d'),
      color: 'bg-acid-lime text-deep-ink',
      subtle: 'text-deep-ink/55 border-deep-ink/15 bg-deep-ink/[0.045]',
      icon: '↗',
      label: language === 'tr' ? 'Toplama' : 'Collect',
    },
    {
      id: '03',
      title: t('process.s3.t'),
      text: t('process.s3.d'),
      color: 'bg-coral text-deep-ink',
      subtle: 'text-deep-ink/55 border-deep-ink/15 bg-deep-ink/[0.045]',
      icon: '→',
      label: language === 'tr' ? 'Plan' : 'Plan',
    },
    {
      id: '04',
      title: t('process.s4.t'),
      text: t('process.s4.d'),
      color: 'bg-[#FF90E8] text-deep-ink',
      subtle: 'text-deep-ink/55 border-deep-ink/15 bg-deep-ink/[0.045]',
      icon: '=',
      label: language === 'tr' ? 'Yönetim' : 'Manage',
    },
  ];

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = gsap.utils.toArray<HTMLElement>('.process-card');
    cards.forEach((card, index) => {
      gsap.from(card, {
        y: 60,
        scale: 0.985,
        opacity: 0,
        duration: 0.85,
        delay: index * 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative bg-warm-paper text-deep-ink py-24 md:py-32 px-4 md:px-8 overflow-clip">
      <div className="max-w-6xl mx-auto mb-16 md:mb-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-deep-ink/40 mb-6">
          {language === 'tr' ? 'Dört adım. Gereksiz sürtünme yok.' : 'Four steps. No unnecessary friction.'}
        </p>
        <h2 className="max-w-5xl text-5xl md:text-7xl lg:text-[5.8rem] font-display leading-[0.93] tracking-[-0.04em]">
          {t('process.title')}
        </h2>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-[24vh] md:gap-[29vh] motion-reduce:gap-8 pb-[8vh] motion-reduce:pb-0">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="sticky motion-reduce:static w-full"
            style={{ top: `calc(118px + ${index * 34}px)`, zIndex: index + 1 }}
          >
            <article
              className={`process-card relative overflow-hidden w-full ${step.color} rounded-[34px] md:rounded-[44px] border border-deep-ink/10 p-7 md:p-10 lg:p-12 shadow-[0_24px_70px_rgba(16,17,20,0.18)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(16,17,20,0.22)]`}
            >
              <div className="absolute inset-x-8 top-0 h-px bg-white/30 mix-blend-overlay" />

              <div className="flex items-center justify-between gap-4 mb-12 md:mb-16">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold tracking-[0.2em]">{step.id}</span>
                  <span className="w-8 h-px bg-current opacity-25" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-55">{step.label}</span>
                </div>
                <span className={`hidden sm:inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] ${step.subtle}`}>
                  {language === 'tr' ? 'Süreç' : 'Process'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-14 items-end">
                <div className="max-w-2xl">
                  <h3 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-[-0.035em] mb-5">
                    {step.title}
                  </h3>
                  <p className="font-body text-lg md:text-xl leading-relaxed opacity-72 max-w-xl">
                    {step.text}
                  </p>
                </div>

                <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full border flex items-center justify-center ${step.subtle}`}>
                  <span className="font-display text-4xl md:text-6xl leading-none" aria-hidden="true">{step.icon}</span>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};