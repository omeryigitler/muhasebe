import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const CustomCursor = () => {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const cursorSize = isHovered ? 80 : 16;
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const smoothOptions = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, smoothOptions);
  const smoothY = useSpring(mouseY, smoothOptions);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer || reduceMotion) {
      document.body.classList.remove('hide-cursor');
      setEnabled(false);
      return;
    }

    setEnabled(true);
    document.body.classList.add('hide-cursor');

    const handleMouseMove = (event: MouseEvent) => {
      setIsVisible(true);
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setIsHovered(Boolean(target.closest('button, a, input, textarea, select, .interactive')));
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.body.classList.remove('hide-cursor');
    };
  }, [mouseX, mouseY, reduceMotion]);

  if (!enabled || !isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        left: smoothX,
        top: smoothY,
        width: cursorSize,
        height: cursorSize,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        backgroundColor: isHovered ? 'transparent' : '#D9FF43',
        borderWidth: isHovered ? 2 : 0,
        borderColor: '#D9FF43',
      }}
      transition={{ type: 'tween', ease: 'circOut', duration: 0.15 }}
      className="fixed rounded-full pointer-events-none z-[100] mix-blend-difference flex items-center justify-center border-solid"
    >
      <motion.span
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
        className="text-acid-lime font-mono text-[10px] uppercase font-bold tracking-widest"
      >
        {language === 'tr' ? 'Tıkla' : 'Open'}
      </motion.span>
    </motion.div>
  );
};
