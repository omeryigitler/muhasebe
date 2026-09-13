import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

export const Header = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past top
      setIsScrolled(currentScrollY > 50);

      // Determine scroll direction for hiding/showing
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true);  // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '#services', label: t('nav.services') },
    { href: '#tools', label: t('nav.tools') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        !isVisible && !isMenuOpen ? "-translate-y-full" : "translate-y-0",
        isScrolled && !isMenuOpen ? "bg-deep-ink/80 backdrop-blur-md border-b border-white/10 py-4" : "py-6",
        isMenuOpen ? "text-warm-paper" : "text-white mix-blend-difference"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-50 px-4 md:px-8">
          <div className="font-display font-black text-2xl tracking-tighter">
            {APP_CONFIG.companyName}.
          </div>
          
          <nav className="hidden md:flex gap-8 font-mono text-sm uppercase tracking-widest items-center">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:opacity-50 transition-opacity">
                {link.label}
              </a>
            ))}
            
            <div 
              onClick={toggleLanguage}
              className="flex items-center ml-4 cursor-pointer relative w-16 h-8 rounded-md bg-[#1A1C21] border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] overflow-hidden group"
            >
              {/* Background track text */}
              <div className="absolute inset-0 flex justify-between items-center px-2 font-mono text-[10px] text-white/30 z-0 select-none">
                <span className={cn("transition-colors", language === 'en' ? 'text-white/50' : 'opacity-0')}>TR</span>
                <span className={cn("transition-colors", language === 'tr' ? 'text-white/50' : 'opacity-0')}>EN</span>
              </div>
              
              {/* Sliding physical calculator button thumb */}
              <div className={cn(
                "absolute top-1 bottom-1 w-7 rounded z-10 calc-btn flex items-center justify-center font-mono text-[10px] font-bold text-deep-ink transition-all duration-300 ease-out",
                language === 'tr' 
                  ? "left-1 bg-acid-lime translate-x-0" 
                  : "left-1 bg-electric-blue translate-x-[calc(100%+0.25rem)] text-white"
              )}>
                {language.toUpperCase()}
              </div>
            </div>
          </nav>
          
          <div className="hidden md:block">
            <a href="#contact" className="inline-block border border-white/30 px-6 py-2 rounded-full font-mono text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              {t('nav.talk')}
            </a>
          </div>

          {/* Mobile menu controls */}
          <div className="md:hidden flex items-center gap-4">
            <div 
              onClick={toggleLanguage}
              className="flex items-center cursor-pointer relative w-14 h-7 rounded-md bg-[#1A1C21] border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 flex justify-between items-center px-1.5 font-mono text-[9px] text-white/30 z-0">
                <span className={cn("transition-colors", language === 'en' ? 'text-white/50' : 'opacity-0')}>TR</span>
                <span className={cn("transition-colors", language === 'tr' ? 'text-white/50' : 'opacity-0')}>EN</span>
              </div>
              <div className={cn(
                "absolute top-1 bottom-1 w-6 rounded z-10 calc-btn flex items-center justify-center font-mono text-[9px] font-bold text-deep-ink transition-all duration-300 ease-out",
                language === 'tr' 
                  ? "left-1 bg-acid-lime translate-x-0" 
                  : "left-1 bg-electric-blue translate-x-[calc(100%+0.125rem)] text-white"
              )}>
                {language.toUpperCase()}
              </div>
            </div>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="font-mono text-sm uppercase relative w-12 h-6 flex items-center justify-end"
            >
              <span className={cn("transition-opacity duration-300", isMenuOpen ? "opacity-0" : "opacity-100")}>{t('nav.menu')}</span>
              <span className={cn("absolute right-0 transition-opacity duration-300", isMenuOpen ? "opacity-100" : "opacity-0")}>X</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-deep-ink z-40 md:hidden flex flex-col justify-center px-6 transition-all duration-500 ease-in-out",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-8 font-display text-5xl">
          {navLinks.map((link, i) => (
            <a 
              key={link.href} 
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "text-warm-paper hover:text-acid-lime transition-all duration-300 ease-out",
                isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: `${isMenuOpen ? 100 + i * 100 : 0}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a 
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className={cn(
              "mt-8 inline-block w-max border-2 border-white/20 px-8 py-4 rounded-full font-mono text-lg uppercase tracking-widest text-warm-paper hover:bg-white hover:text-deep-ink transition-all duration-300",
              isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
            style={{ transitionDelay: `${isMenuOpen ? 100 + navLinks.length * 100 : 0}ms` }}
          >
            {t('nav.talk')}
          </a>
        </nav>
      </div>
    </>
  );
};
