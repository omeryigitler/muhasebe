import React, { ReactElement, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '../utils/cn';

type MagneticProps = {
  children: ReactElement;
  className?: string;
  strength?: number;
  radius?: number;
  maxOffset?: number;
};

export const Magnetic = ({
  children,
  className,
  strength = 0.52,
  radius = 92,
  maxOffset = 26,
}: MagneticProps) => {
  const hitAreaRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const hitArea = hitAreaRef.current;
    const mover = moverRef.current;
    if (!hitArea || !mover) return;

    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarsePointer || reduceMotion) return;

    const xTo = gsap.quickTo(mover, 'x', {
      duration: 0.42,
      ease: 'power3.out',
    });
    const yTo = gsap.quickTo(mover, 'y', {
      duration: 0.42,
      ease: 'power3.out',
    });

    let active = false;

    const reset = () => {
      if (!active) return;
      active = false;
      gsap.to(mover, {
        x: 0,
        y: 0,
        duration: 0.85,
        ease: 'elastic.out(1, 0.38)',
        overwrite: true,
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      const rect = hitArea.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;
      const outsideX = Math.max(Math.abs(dx) - halfWidth, 0);
      const outsideY = Math.max(Math.abs(dy) - halfHeight, 0);
      const distanceOutside = Math.hypot(outsideX, outsideY);

      if (distanceOutside > radius) {
        reset();
        return;
      }

      active = true;
      const proximity = 1 - Math.min(distanceOutside / radius, 1);
      const targetX = gsap.utils.clamp(-maxOffset, maxOffset, dx * strength * proximity);
      const targetY = gsap.utils.clamp(-maxOffset, maxOffset, dy * strength * proximity);

      xTo(targetX);
      yTo(targetY);
    };

    const handleWindowBlur = () => reset();

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, { scope: hitAreaRef, dependencies: [strength, radius, maxOffset] });

  return (
    <div ref={hitAreaRef} className={cn('inline-block', className)}>
      <div ref={moverRef} className="interactive will-change-transform">
        {children}
      </div>
    </div>
  );
};
