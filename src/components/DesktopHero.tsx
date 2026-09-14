import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Calculator, type CalculatorHandle } from './Calculator';
import { useLanguage } from '../context/LanguageContext';
import { Magnetic } from './Magnetic';
import { getFinanceLocale } from '../config';

gsap.registerPlugin(useGSAP);

export const DesktopHero = () => {
  const { t, language } = useLanguage();
  const finance = getFinanceLocale(language);
  const container = useRef<HTMLElement>(null);
  const calcWrapperRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<CalculatorHandle>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishIntroRef = useRef<() => void>(() => undefined);
  const [isInteractive, setIsInteractive] = useState(false);

  const takeControl = () => {
    finishIntroRef.current();
    setIsInteractive(true);
  };

  useGSAP(() => {
    const calc = calcWrapperRef.current;
    if (!calc) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headlineChildren = headlineRef.current?.children || [];
    const rect = calc.getBoundingClientRect();
    const startX = window.innerWidth / 2 - (rect.left + rect.width / 2);

    const settle = () => {
      introTimelineRef.current?.kill();
      gsap.set(calc, {
        x: 0,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        opacity: 1,
      });
      gsap.set(headlineChildren, { y: 0, opacity: 1 });
      gsap.set(subtextRef.current, { y: 0, opacity: 1 });
      gsap.set(eyebrowRef.current, { y: 0, opacity: 1 });
      gsap.set(actionsRef.current, { y: 0, opacity: 1 });
      setIsInteractive(true);
    };

    finishIntroRef.current = settle;

    if (reduceMotion) {
      settle();
      return;
    }

    gsap.set(calc, {
      x: startX,
      y: 42,
      scale: 0.82,
      rotationX: 9,
      rotationY: 14,
      opacity: 0,
      transformOrigin: '50% 50%',
    });
    gsap.set(headlineChildren, { y: 88, opacity: 0 });
    gsap.set(subtextRef.current, { y: 20, opacity: 0 });
    gsap.set(eyebrowRef.current, { y: 18, opacity: 0 });
    gsap.set(actionsRef.current, { y: 18, opacity: 0 });

    const intro = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => setIsInteractive(true),
    });
    introTimelineRef.current = intro;

    intro.to(calc, {
      scale: 1.08,
      rotationY: 5,
      rotationX: 5,
      y: 0,
      opacity: 1,
      duration: 1.15,
      ease: 'power3.out',
    }, 0);

    [
      { t: 1.0, k: '4' },
      { t: 1.1, k: '8' },
      { t: 1.2, k: '2' },
      { t: 1.3, k: '0' },
      { t: 1.8, k: '+' },
      { t: 2.1, k: '9' },
      { t: 2.2, k: '7' },
      { t: 2.3, k: '5' },
      { t: 2.8, k: '=' },
      { t: 3.2, k: 'VAT+' },
    ].forEach(({ t: at, k }) => {
      intro.call(() => calcRef.current?.simulatePress(k), undefined, at);
    });

    intro.to(headlineChildren, {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.75,
      ease: 'back.out(1.55)',
    }, 4.15);
    intro.to(subtextRef.current, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 4.45);
    intro.to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 4.62);
    intro.to(actionsRef.current, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 4.78);
    intro.to(calc, {
      x: 0,
      y: 0,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      duration: 1.05,
      ease: 'power3.inOut',
    }, 5.15);

    return () => {
      finishIntroRef.current = () => undefined;
      introTimelineRef.current?.kill();
    };
  }, { scope: container });

  return (
    <section
      id="top"
      ref={container}
      className="relative min-h-[100svh] overflow-hidden bg-deep-ink text-warm-paper px-8 xl:px-12 pt-24 pb-10 flex items-center"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[7%] text-9xl font-mono text-acid-lime opacity-[0.05] rotate-12 blur-sm">%</div>
        <div className="absolute bottom-[10%] right-[7%] text-9xl font-mono text-electric-blue opacity-[0.05] -rotate-12 blur-sm">{finance.symbol}</div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-2 items-center gap-12 xl:gap-20">
        <div className="pr-4 xl:pr-8">
          <div className="text-xs font-mono tracking-widest text-acid-lime uppercase overflow-hidden">
            <span ref={eyebrowRef} className="block">{t('hero.eyebrow')}</span>
          </div>

          <h1
            ref={headlineRef}
            className="mt-7 font-display text-[clamp(4.4rem,6.4vw,6.5rem)] leading-[0.88] flex flex-col gap-1 font-black tracking-tight"
          >
            <span className="block text-fruitz-lime">{t('hero.t1')}</span>
            <span className="block text-fruitz-coral">{t('hero.t2')}</span>
            <span className="block text-fruitz-purple">{t('hero.t3')}</span>
          </h1>

          <p ref={subtextRef} className="mt-7 text-lg xl:text-xl text-warm-paper/70 max-w-lg leading-relaxed">
            {t('hero.desc')}
          </p>

          <div ref={actionsRef} className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#contact"
                className="bg-acid-lime text-deep-ink px-8 py-4 rounded-full font-bold hover:bg-white transition-colors uppercase tracking-widest text-sm inline-block"
              >
                {t('hero.cta1')}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className="bg-transparent border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-colors uppercase tracking-widest text-sm inline-block"
              >
                {t('hero.cta2')}
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="flex justify-end perspective-1000 pr-4 xl:pr-10">
          <div ref={calcWrapperRef} className="w-full max-w-[330px] will-change-transform">
            <Calculator ref={calcRef} isInteractive={isInteractive} onInteract={takeControl} />
          </div>
        </div>
      </div>
    </section>
  );
};
