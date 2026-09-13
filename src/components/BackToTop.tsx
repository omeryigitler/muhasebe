import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../utils/cn';
import { useLanguage } from '../context/LanguageContext';

export const BackToTop = () => {
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const mobile = window.innerWidth < 768;
      const threshold = window.innerHeight * (mobile ? 1.35 : 0.8);
      setIsVisible(window.scrollY > threshold);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    window.addEventListener('resize', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-3 right-3 md:bottom-8 md:right-8 z-50 w-11 h-11 md:w-auto md:h-auto md:p-4 rounded-full bg-acid-lime text-deep-ink shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-deep-ink',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      )}
      aria-label={language === 'tr' ? 'Sayfanın başına dön' : 'Back to top'}
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUp size={19} strokeWidth={2.4} className="md:w-[22px] md:h-[22px]" aria-hidden="true" />
    </button>
  );
};
