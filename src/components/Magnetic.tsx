import React, { ReactElement, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Magnetic = ({ children }: { children: ReactElement }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;

    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarsePointer || reduceMotion) return;

    const xTo = gsap.quickTo(element, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(element, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

    const mouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mousemove', mouseMove);
    element.addEventListener('mouseleave', mouseLeave);

    return () => {
      element.removeEventListener('mousemove', mouseMove);
      element.removeEventListener('mouseleave', mouseLeave);
    };
  }, { scope: ref });

  return (
    <div ref={ref} className="inline-block interactive">
      {children}
    </div>
  );
};
