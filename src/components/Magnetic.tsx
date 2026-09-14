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
  strength = 0.48,
  radius = 88,
  maxOffset = 24,
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
      duration: 0.5,
      ease: 'elastic.out(1, 0.45)',
    });
    const yTo = gsap.quickTo(mover, 'y', {
      duration: 0.5,
      ease: 'elastic.out(1, 0.45)',
    });

    const reset = () => {
      xTo(0);
      yTo(0);
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

      const proximity = 1 - Math.min(distanceOutside / radius, 1);
      const targetX = gsap.utils.clamp(-maxOffset, maxOffset, dx * strength * proximity);
      const targetY = gsap.utils.clamp(-maxOffset, maxOffset, dy * strength * proximity);

      xTo(targetX);
      yTo(targetY);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', reset);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', reset);
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
