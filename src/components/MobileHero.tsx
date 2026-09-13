import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Calculator, type CalculatorHandle } from './Calculator';
import { useLanguage } from '../context/LanguageContext';

export const MobileHero = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const calcWrapperRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<CalculatorHandle>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishRef = useRef<() => void>(() => undefined);
  const [isInteractive, setIsInteractive] = useState(false);

  const takeControl = () => {
    finishRef.current();
    setIsInteractive(true);
  };

  useGSAP(() => {
    const stage = stageRef.current;
    const calc = calcWrapperRef.current;
    const copy = copyRef.current;
    if (!stage || !calc || !copy) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const calcHeight = calc.offsetHeight || 1;
    const calcWidth = calc.offsetWidth || 1;
    const safeStageHeight = Math.max(260, stage.clientHeight - 14);
    const heightScale = safeStageHeight / calcHeight;
    const widthScale = (window.innerWidth - 24) / calcWidth;
    const finalScale = Math.max(0.48, Math.min(0.66, heightScale, widthScale));
    const initialScale = Math.max(finalScale, Math.min(0.92, widthScale));
    const initialY = Math.min(150, Math.max(92, window.innerHeight * 0.16));

    const settle = () => {
      timelineRef.current?.kill();
      gsap.set(calc, {
        x: 0,
        y: 0,
        scale: finalScale,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        opacity: 1,
      });
      gsap.set(copy, { autoAlpha: 1, y: 0 });
      setIsInteractive(true);
    };
    finishRef.current = settle;

    if (reduceMotion) {
      settle();
      return;
    }

    gsap.set(copy, { autoAlpha: 0, y: 22 });
    gsap.set(calc, {
      x: 0,
      y: initialY,
      scale: initialScale * 0.9,
      rotationX: 4,
      rotationY: 6,
      rotationZ: 0,
      opacity: 0,
      transformOrigin: '50% 50%',
    });

    const intro = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => setIsInteractive(true),
    });
    timelineRef.current = intro;

    intro.to(calc, {
      y: initialY,
      scale: initialScale,
      rotationX: 2,
      rotationY: 2,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
    }, 0);

    [
      { t: 0.9, k: '4' },
      { t: 1.0, k: '8' },
      { t: 1.1, k: '2' },
      { t: 1.2, k: '0' },
      { t: 1.65, k: '+' },
      { t: 1.92, k: '9' },
      { t: 2.02, k: '7' },
      { t: 2.12, k: '5' },
      { t: 2.55, k: '=' },
      { t: 2.95, k: 'VAT+' },
    ].forEach(({ t: at, k }) => {
      intro.call(() => calcRef.current?.simulatePress(k), undefined, at);
    });

    intro.to(calc, {
      y: 0,
      scale: finalScale,
      rotationX: 0,
      rotationY: 0,
      duration: 1.0,
      ease: 'power3.inOut',
    }, 3.45);

    intro.to(copy, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
    }, 3.9);

    return () => {
      finishRef.current = () => undefined;
      timelineRef.current?.kill();
    };
  }, { scope: containerRef });

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-deep-ink text-warm-paper"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[14%] -left-8 text-8xl font-mono text-acid-lime opacity-[0.045] rotate-12">%</div>
        <div className="absolute bottom-[9%] -right-7 text-8xl font-mono text-electric-blue opacity-[0.045] -rotate-12">€</div>
      </div>

      <div
        ref={stageRef}
        className="absolute left-0 right-0 top-[64px] bottom-[44%] z-10 flex items-center justify-center px-3"
      >
        <div
          ref={calcWrapperRef}
          className="w-full max-w-[270px] will-change-transform pointer-events-auto"
        >
          <Calculator ref={calcRef} isInteractive={isInteractive} onInteract={takeControl} />
        </div>
      </div>

      <div
        ref={copyRef}
        className="absolute left-0 right-0 bottom-0 z-20 h-[44%] px-4 pb-4 pt-2 flex flex-col justify-start gap-2.5"
      >
        <div className="text-[9px] font-mono tracking-[0.14em] text-acid-lime uppercase">
          {t('hero.eyebrow')}
        </div>

        <h1 className="font-display text-[2.22rem] leading-[0.88] flex flex-col gap-0.5 font-black tracking-tight">
          <span className="block text-fruitz-lime">{t('hero.t1')}</span>
          <span className="block text-fruitz-coral">{t('hero.t2')}</span>
          <span className="block text-fruitz-purple">{t('hero.t3')}</span>
        </h1>

        <p className="text-[12px] leading-[1.5] text-warm-paper/70 max-w-[23rem]">
          {t('hero.desc')}
        </p>

        <div className="flex gap-2 mt-0.5">
          <a
            href="#contact"
            className="bg-acid-lime text-deep-ink px-5 py-3 rounded-full font-bold uppercase tracking-widest text-[9px] inline-flex items-center justify-center"
          >
            {t('hero.cta1')}
          </a>
          <a
            href="#services"
            className="border border-white/20 px-5 py-3 rounded-full font-bold uppercase tracking-widest text-[9px] inline-flex items-center justify-center"
          >
            {t('hero.cta2')}
          </a>
        </div>
      </div>
    </section>
  );
};