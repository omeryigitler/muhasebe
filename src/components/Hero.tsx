import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Calculator, type CalculatorHandle } from './Calculator';
import { cn } from '../utils/cn';
import { useLanguage } from '../context/LanguageContext';
import { Magnetic } from './Magnetic';

gsap.registerPlugin(useGSAP);

export const Hero = () => {
  const { t, language } = useLanguage();
  const container = useRef<HTMLDivElement>(null);
  const calcWrapperRef = useRef<HTMLDivElement>(null);
  const calcRef = useRef<CalculatorHandle>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  
  const [isInteractive, setIsInteractive] = useState(false);

  useGSAP(() => {
    // Initial states
    const isDesktop = window.innerWidth > 1024;
    
    // Calculate exact distance to center the calculator on screen
    let startX = 0;
    if (isDesktop && calcWrapperRef.current) {
      const rect = calcWrapperRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const elementCenterX = rect.left + rect.width / 2;
      startX = centerX - elementCenterX;
    }

    gsap.set(calcWrapperRef.current, { 
      scale: 0.8, 
      rotationY: 15, 
      rotationX: 10, 
      y: 50, 
      x: startX,
      opacity: 0 
    });
    gsap.set(headlineRef.current?.children || [], { y: 100, opacity: 0 });
    gsap.set(subtextRef.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => setIsInteractive(true)
    });

    // 0.0s - Enter
    tl.to(calcWrapperRef.current, {
      scale: 1.1,
      rotationY: 5,
      rotationX: 5,
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out'
    }, 0);

    // Simulate typing (using timeouts for simplicity to coordinate with GSAP time)
    const typeSequence = [
      { t: 1.0, k: '4' },
      { t: 1.1, k: '8' },
      { t: 1.2, k: '2' },
      { t: 1.3, k: '0' },
      { t: 1.8, k: '+' },
      { t: 2.1, k: '9' },
      { t: 2.2, k: '7' },
      { t: 2.3, k: '5' },
      { t: 2.8, k: '=' },
      { t: 3.2, k: 'VAT' }
    ];

    typeSequence.forEach(({ t, k }) => {
      tl.call(() => calcRef.current?.simulatePress(k), undefined, t);
    });

    // 4.7s - Reveal Text
    tl.to(headlineRef.current?.children || [], {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, 4.2);

    tl.to(subtextRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    }, 4.5);

    // 5.3s - Move calc to the right
    tl.to(calcWrapperRef.current, {
      x: 0,
      xPercent: 0,
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.inOut'
    }, 5.3);
  }, { scope: container, dependencies: [language] });

  return (
    <section ref={container} className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden pt-32 pb-10 px-6 md:px-12">
      
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] text-9xl font-mono text-acid-lime opacity-10 rotate-12 blur-sm">%</div>
        <div className="absolute bottom-[20%] right-[10%] text-9xl font-mono text-electric-blue opacity-10 -rotate-12 blur-sm">€</div>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        
        {/* Left: Copy */}
        <div className="flex flex-col gap-6 order-2 lg:order-1 relative z-10 lg:pr-8">
          <div className="text-xs font-mono tracking-widest text-acid-lime uppercase overflow-hidden">
            <span className="block opacity-0 translate-y-full" ref={(el) => { if(el) gsap.set(el, {y:0, opacity:1, delay: 4.8}) }}>
              {t('hero.eyebrow')}
            </span>
          </div>
          
          <h1 ref={headlineRef} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] flex flex-col gap-2 font-black tracking-tight">
            <div className="overflow-hidden pb-4">
              <span className="block text-fruitz-lime">{t('hero.t1')}</span>
            </div>
            <div className="overflow-hidden pb-4">
              <span className="block text-fruitz-coral">{t('hero.t2')}</span>
            </div>
            <div className="overflow-hidden pb-4">
              <span className="block text-fruitz-purple">{t('hero.t3')}</span>
            </div>
          </h1>
          
          <p ref={subtextRef} className="text-lg md:text-xl text-warm-paper/70 max-w-md">
            {t('hero.desc')}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 opacity-0 translate-y-4" ref={(el) => { if(el) gsap.to(el, {y:0, opacity:1, delay: 5.0, duration: 0.5}) }}>
            <Magnetic>
              <a href="#services" className="bg-acid-lime text-deep-ink px-8 py-4 rounded-full font-bold hover:bg-white transition-colors uppercase tracking-widest text-sm inline-block">
                {t('hero.cta1')}
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#tools" className="bg-transparent border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-colors uppercase tracking-widest text-sm inline-block">
                {t('hero.cta2')}
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right: Calculator */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end perspective-1000 pl-4 pr-4 lg:pr-8">
          <div ref={calcWrapperRef} className="w-full max-w-[300px]">
            <Calculator 
              ref={calcRef} 
              isInteractive={isInteractive} 
              onInteract={() => setIsInteractive(true)} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};
