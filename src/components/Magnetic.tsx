import React, { useRef, ReactElement } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Magnetic = ({ children }: { children: ReactElement }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;
    
    // Only apply effect on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const mouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      // Move element towards cursor (damped multiplier)
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseleave", mouseLeave);

    return () => {
      element.removeEventListener("mousemove", mouseMove);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, { scope: ref });

  return (
    <div ref={ref} className="inline-block interactive">
      {children}
    </div>
  );
};
