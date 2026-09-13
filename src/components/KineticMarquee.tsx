import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const KineticMarquee = () => {
  const { t } = useLanguage();
  const container = useRef<HTMLElement>(null);
  const topTrack = useRef<HTMLDivElement>(null);
  const bottomTrack = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([topTrack.current, bottomTrack.current], { xPercent: 0, skewX: 0, scaleY: 1 });
      return;
    }

    const skewTop = gsap.quickTo(topTrack.current, 'skewX', { duration: 0.24, ease: 'power3.out' });
    const skewBottom = gsap.quickTo(bottomTrack.current, 'skewX', { duration: 0.24, ease: 'power3.out' });
    const scaleTop = gsap.quickTo(topTrack.current, 'scaleY', { duration: 0.28, ease: 'power3.out' });

    gsap.to(topTrack.current, {
      xPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.75,
      },
    });

    gsap.fromTo(bottomTrack.current, { xPercent: -16 }, {
      xPercent: 3,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.75,
      },
    });

    const velocityTrigger = ScrollTrigger.create({
      trigger: container.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = gsap.utils.clamp(-5.5, 5.5, self.getVelocity() / 380);
        skewTop(velocity);
        skewBottom(-velocity * 0.55);
        scaleTop(1 + Math.min(Math.abs(velocity) / 180, 0.035));
      },
      onLeave: () => {
        skewTop(0);
        skewBottom(0);
        scaleTop(1);
      },
      onLeaveBack: () => {
        skewTop(0);
        skewBottom(0);
        scaleTop(1);
      },
    });

    return () => velocityTrigger.kill();
  }, { scope: container });

  const text = t('marquee');

  return (
    <section ref={container} className="relative py-14 md:py-20 bg-deep-ink overflow-hidden border-y border-white/5">
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.035]" />

      <div
        ref={topTrack}
        className="whitespace-nowrap font-playful text-6xl md:text-8xl lg:text-[8.2rem] leading-[0.92] tracking-[-0.035em] text-acid-lime will-change-transform"
        style={{ width: '240%', transformOrigin: 'center' }}
      >
        {text.repeat(5)}
      </div>

      <div
        ref={bottomTrack}
        className="mt-4 md:mt-7 whitespace-nowrap font-playful text-5xl md:text-7xl lg:text-[7.3rem] leading-[0.92] tracking-[-0.035em] text-transparent opacity-40 will-change-transform"
        style={{ width: '240%', WebkitTextStroke: '1px rgba(245,241,232,0.38)' }}
      >
        {text.repeat(5)}
      </div>
    </section>
  );
};
