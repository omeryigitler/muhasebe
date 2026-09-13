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
    const skewTop = gsap.quickTo(topTrack.current, 'skewX', { duration: 0.25, ease: 'power3.out' });
    const skewBottom = gsap.quickTo(bottomTrack.current, 'skewX', { duration: 0.25, ease: 'power3.out' });
    const scaleTop = gsap.quickTo(topTrack.current, 'scaleY', { duration: 0.3, ease: 'power3.out' });

    gsap.to(topTrack.current, {
      xPercent: -22,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.7,
      },
    });

    gsap.fromTo(bottomTrack.current, { xPercent: -18 }, {
      xPercent: 4,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.7,
      },
    });

    const velocityTrigger = ScrollTrigger.create({
      trigger: container.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = gsap.utils.clamp(-13, 13, self.getVelocity() / 220);
        skewTop(velocity);
        skewBottom(-velocity * 0.7);
        scaleTop(1 + Math.min(Math.abs(velocity) / 80, 0.08));
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
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/5" />
      <div
        ref={topTrack}
        className="whitespace-nowrap font-playful text-6xl md:text-8xl lg:text-[9rem] leading-none tracking-wide text-acid-lime will-change-transform"
        style={{ width: '240%', transformOrigin: 'center' }}
      >
        {text.repeat(5)}
      </div>
      <div
        ref={bottomTrack}
        className="mt-4 md:mt-6 whitespace-nowrap font-display font-black text-5xl md:text-7xl lg:text-[8rem] leading-none tracking-tight text-transparent opacity-45 will-change-transform"
        style={{ width: '240%', WebkitTextStroke: '1px rgba(245,241,232,0.45)' }}
      >
        {text.repeat(5)}
      </div>
    </section>
  );
};
