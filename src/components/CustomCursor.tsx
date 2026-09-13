import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorSize = isHovered ? 80 : 16;
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const smoothOptions = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, smoothOptions);
  const smoothY = useSpring(mouseY, smoothOptions);

  useEffect(() => {
    // Check if the device has a fine pointer (like a mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX.set(e.clientX - cursorSize / 2);
      mouseY.set(e.clientY - cursorSize / 2);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if we are hovering over an interactive element
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive') ||
        target.closest('.interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor on body when custom cursor is active
    document.body.classList.add('hide-cursor');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('hide-cursor');
    };
  }, [mouseX, mouseY, cursorSize]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        left: smoothX,
        top: smoothY,
        width: cursorSize,
        height: cursorSize,
      }}
      animate={{
        backgroundColor: isHovered ? 'transparent' : '#D9FF43',
        border: isHovered ? '2px solid #D9FF43' : '0px solid #D9FF43',
      }}
      transition={{ type: 'tween', ease: 'circOut', duration: 0.15 }}
      className="fixed rounded-full pointer-events-none z-[100] mix-blend-difference flex items-center justify-center"
    >
      <motion.span 
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
        className="text-acid-lime font-mono text-[10px] uppercase font-bold tracking-widest"
      >
        Tıkla
      </motion.span>
    </motion.div>
  );
};
