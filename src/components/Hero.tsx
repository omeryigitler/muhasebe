import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calculator, type CalculatorDemoPreset, type CalculatorHandle } from './Calculator';
import { useLanguage } from '../context/LanguageContext';
import { Magnetic } from './Magnetic';
import { getFinanceLocale } from '../config';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DEMO_PRESETS: CalculatorDemoPreset[] = ['bookkeeping', 'vat', 'payroll', 'reporting'];

export const Hero = () => {
  const { t, language } = useLanguage();
  const finance = getFinanceLocale(language);
  const container = useRef<HTMLElement>(null);
  const calcWrapperRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<CalculatorHandle>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishIntroRef = useRef<() => void>(() => undefined);
  const hasUserInteractedRef = useRef(false);
  const lastDemoStepRef = useRef(-1);
  const [isInteractive, setIsInteractive] = useState(false);

  const storyCopy = language === 'tr' ? {
    live: 'Canlı sistem',
    calculatorReady: 'Hesap makinesi hazır',
    calculatorRunning: 'Otomatik hesaplama',
    scroll: 'Devam etmek için kaydır',
    steps: [
      { index: '01', kicker: 'Günlük akış', title: 'Muhasebe, evrak yığını değil sistemdir.', description: 'Fatura, fiş ve banka hareketleri tek bir düzenli akışta işlenir.', symbol: '+', accent: 'text-electric-blue' },
      { index: '02', kicker: 'Vergi kontrolü', title: 'KDV’yi son gün değil, her gün gör.', description: 'KDV ekle, KDV çıkar ve nakit etkisini rakamlar büyümeden takip et.', symbol: '%', accent: 'text-acid-lime' },
      { index: '03', kicker: 'Bordro', title: 'Maaş günü sürprizsiz olsun.', description: 'Bordro, kesintiler ve ödeme toplamları net bir takvimle görünür kalır.', symbol: finance.symbol, accent: 'text-coral' },
      { index: '04', kicker: 'Raporlama', title: 'Rakamlar sonunda bir karar söylesin.', description: 'Dönem sonunda yalnızca toplam değil, neyin neden değiştiğini gör.', symbol: '=', accent: 'text-vivid-purple' },
    ],
  } : {
    live: 'Live system',
    calculatorReady: 'Calculator ready',
    calculatorRunning: 'Auto calculation',
    scroll: 'Scroll to continue',
    steps: [
      { index: '01', kicker: 'Daily flow', title: 'Bookkeeping should be a system, not a pile.', description: 'Invoices, receipts, and bank movements move through one clean accounting flow.', symbol: '+', accent: 'text-electric-blue' },
      { index: '02', kicker: 'Tax control', title: 'See VAT every day, not on the deadline.', description: 'Add VAT, extract VAT, and understand the cash impact before the numbers grow.', symbol: '%', accent: 'text-acid-lime' },
      { index: '03', kicker: 'Payroll', title: 'Make payday predictable.', description: 'Payroll, deductions, and payment totals stay visible on one clear timeline.', symbol: finance.symbol, accent: 'text-coral' },
      { index: '04', kicker: 'Reporting', title: 'Make the numbers say what to do next.', description: 'At period end, see more than totals: understand what changed and why.', symbol: '=', accent: 'text-vivid-purple' },
    ],
  };

  const storySteps = storyCopy.steps;

  const takeControl = () => {
    hasUserInteractedRef.current = true;
    finishIntroRef.current();
    setIsInteractive(true);
  };

  useGSAP(() => {
    const isDesktop = window.innerWidth > 1024;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let startX = 0;

    if (isDesktop && calcWrapperRef.current) {
      const rect = calcWrapperRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const elementCenterX = rect.left + rect.width / 2;
      startX = centerX - elementCenterX;
    }

    const headlineChildren = headlineRef.current?.children || [];
    const storyPanels = gsap.utils.toArray<HTMLElement>('.story-panel');
    const storySymbols = gsap.utils.toArray<HTMLElement>('.story-symbol');

    if (reduceMotion) {
      gsap.set(calcWrapperRef.current, { x: 0, y: 0, scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, opacity: 1 });
      gsap.set(heroCopyRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(headlineChildren, { y: 0, opacity: 1 });
      gsap.set(subtextRef.current, { y: 0, opacity: 1 });
      gsap.set(eyebrowRef.current, { y: 0, opacity: 1 });
      gsap.set(actionsRef.current, { y: 0, opacity: 1 });
      gsap.set(storyPanels, { autoAlpha: 0, y: 0 });
      gsap.set(storySymbols, { autoAlpha: 0 });
      finishIntroRef.current = () => undefined;
      setIsInteractive(true);
      return () => {
        finishIntroRef.current = () => undefined;
      };
    }

    gsap.set(calcWrapperRef.current, { scale: 0.8, rotationY: 15, rotationX: 10, y: 50, x: startX, opacity: 0 });
    gsap.set(headlineChildren, { y: 100, opacity: 0 });
    gsap.set(subtextRef.current, { y: 20, opacity: 0 });
    gsap.set(eyebrowRef.current, { y: 18, opacity: 0 });
    gsap.set(actionsRef.current, { y: 18, opacity: 0 });
    gsap.set(storyPanels, { autoAlpha: 0, y: 40 });
    gsap.set(storySymbols, { autoAlpha: 0, scale: 0.6, rotation: -16 });

    const finishIntro = () => {
      const intro = introTimelineRef.current;
      if (!intro || intro.progress() >= 1) return;
      intro.kill();
      gsap.set(calcWrapperRef.current, { x: 0, y: 0, scale: 1, rotationX: 0, rotationY: 0, opacity: 1 });
      gsap.set(headlineChildren, { y: 0, opacity: 1 });
      gsap.set(subtextRef.current, { y: 0, opacity: 1 });
      gsap.set(eyebrowRef.current, { y: 0, opacity: 1 });
      gsap.set(actionsRef.current, { y: 0, opacity: 1 });
    };

    finishIntroRef.current = finishIntro;

    const intro = gsap.timeline({ onComplete: () => setIsInteractive(true) });
    introTimelineRef.current = intro;

    intro.to(calcWrapperRef.current, { scale: 1.08, rotationY: 5, rotationX: 5, y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0);

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

    intro.to(headlineChildren, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.7)' }, 4.2);
    intro.to(subtextRef.current, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 4.5);
    intro.to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 4.7);
    intro.to(actionsRef.current, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 4.9);
    intro.to(calcWrapperRef.current, { x: 0, rotationY: 0, rotationX: 0, scale: 1, duration: 1.2, ease: 'power3.inOut' }, 5.3);

    const storyTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.012) {
            finishIntroRef.current();
            setIsInteractive(true);
          }

          if (hasUserInteractedRef.current || self.progress < 0.16) return;
          const stepIndex = Math.min(3, Math.floor((self.progress - 0.16) / 0.2));
          if (stepIndex >= 0 && stepIndex !== lastDemoStepRef.current) {
            lastDemoStepRef.current = stepIndex;
            calcRef.current?.setDemo(DEMO_PRESETS[stepIndex]);
          }
        },
      },
    });

    storyTimeline.to(heroCopyRef.current, { autoAlpha: 0, y: -50, duration: 0.55, ease: 'power2.inOut' }, 0.45);

    storySteps.forEach((_, index) => {
      const panel = storyPanels[index];
      const symbol = storySymbols[index];
      const start = 1 + index * 1.25;

      storyTimeline.to(panel, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, start);
      storyTimeline.to(symbol, { autoAlpha: 0.18, scale: 1, rotation: index % 2 === 0 ? 6 : -6, duration: 0.45, ease: 'back.out(1.4)' }, start);
      storyTimeline.to(calcWrapperRef.current, { y: index % 2 === 0 ? -8 : 8, rotationZ: index % 2 === 0 ? -1.2 : 1.2, duration: 0.55, ease: 'power2.inOut' }, start + 0.1);

      if (index < storySteps.length - 1) {
        storyTimeline.to(panel, { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power2.in' }, start + 0.92);
        storyTimeline.to(symbol, { autoAlpha: 0, scale: 1.2, duration: 0.3, ease: 'power2.in' }, start + 0.92);
      }
    });

    storyTimeline.to(calcWrapperRef.current, { y: 0, rotationZ: 0, duration: 0.5, ease: 'power2.out' }, 5.7);

    return () => {
      finishIntroRef.current = () => undefined;
    };
  }, { scope: container });

  return (
    <section id="top" ref={container} className="relative min-h-[420svh] lg:min-h-[520svh] motion-reduce:min-h-[100svh] bg-deep-ink text-warm-paper">
      <div className="sticky top-0 min-h-[100svh] h-[100svh] w-full overflow-hidden px-4 sm:px-6 md:px-12 pt-20 sm:pt-24 pb-3 sm:pb-8 flex items-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[16%] left-[8%] text-8xl lg:text-9xl font-mono text-acid-lime opacity-[0.06] rotate-12 blur-sm">%</div>
          <div className="absolute bottom-[12%] right-[8%] text-8xl lg:text-9xl font-mono text-electric-blue opacity-[0.06] -rotate-12 blur-sm">{finance.symbol}</div>
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
        </div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-4 lg:gap-16 items-center relative z-10">
          <div className="relative min-h-[245px] sm:min-h-[330px] lg:min-h-[560px] order-2 lg:order-1 lg:pr-8">
            <div ref={heroCopyRef} className="absolute inset-0 flex flex-col justify-center gap-3 sm:gap-5 lg:gap-6">
              <div className="text-[10px] sm:text-xs font-mono tracking-widest text-acid-lime uppercase overflow-hidden">
                <span ref={eyebrowRef} className="block">{t('hero.eyebrow')}</span>
              </div>

              <h1 ref={headlineRef} className="font-display text-[2.7rem] leading-[0.86] sm:text-6xl md:text-7xl lg:text-[6rem] lg:leading-[0.9] flex flex-col gap-1 sm:gap-2 font-black tracking-tight">
                <span className="block text-fruitz-lime">{t('hero.t1')}</span>
                <span className="block text-fruitz-coral">{t('hero.t2')}</span>
                <span className="block text-fruitz-purple">{t('hero.t3')}</span>
              </h1>

              <p ref={subtextRef} className="text-sm sm:text-base md:text-xl text-warm-paper/70 max-w-md leading-relaxed">{t('hero.desc')}</p>

              <div ref={actionsRef} className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2">
                <Magnetic>
                  <a href="#contact" className="bg-acid-lime text-deep-ink px-5 py-3 sm:px-8 sm:py-4 rounded-full font-bold hover:bg-white transition-colors uppercase tracking-widest text-[10px] sm:text-sm inline-block">{t('hero.cta1')}</a>
                </Magnetic>
                <Magnetic>
                  <a href="#services" className="bg-transparent border border-white/20 px-5 py-3 sm:px-8 sm:py-4 rounded-full font-bold hover:bg-white/5 transition-colors uppercase tracking-widest text-[10px] sm:text-sm inline-block">{t('hero.cta2')}</a>
                </Magnetic>
              </div>
            </div>

            {storySteps.map((step) => (
              <div key={step.index} className="story-panel absolute inset-0 flex flex-col justify-center pointer-events-none">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                  <span className="font-mono text-[9px] sm:text-xs tracking-[0.35em] text-white/35">{step.index}</span>
                  <span className="h-px w-8 sm:w-12 bg-white/20" />
                  <span className="font-mono text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] text-white/55">{step.kicker}</span>
                </div>
                <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl leading-[0.92] tracking-tight max-w-xl">{step.title}</h2>
                <p className="mt-3 sm:mt-6 text-sm sm:text-base md:text-xl text-white/60 max-w-lg leading-relaxed">{step.description}</p>
                <div className="mt-4 sm:mt-8 flex items-center gap-3 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.22em] text-white/30">
                  <span>{storyCopy.live}</span>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-acid-lime animate-pulse" />
                </div>
                <div className={`story-symbol absolute -right-2 sm:-right-4 lg:-right-12 top-1/2 -translate-y-1/2 text-[8rem] sm:text-[11rem] lg:text-[17rem] font-display font-black leading-none ${step.accent}`}>{step.symbol}</div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end perspective-1000 px-2 -translate-y-[10%] sm:translate-y-0 lg:pl-4 lg:pr-8">
            <div ref={calcWrapperRef} className="w-full max-w-[225px] sm:max-w-[285px] lg:max-w-[320px] will-change-transform">
              <Calculator ref={calcRef} isInteractive={isInteractive} onInteract={takeControl} />
              <div className="mt-2 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white/30">
                <span>{isInteractive ? storyCopy.calculatorReady : storyCopy.calculatorRunning}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isInteractive ? 'bg-acid-lime' : 'bg-coral animate-pulse'}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex motion-reduce:hidden flex-col items-center gap-2 pointer-events-none">
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">{storyCopy.scroll}</span>
          <span className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};