import React, { useEffect, useRef, useState } from 'react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { Twitter, Linkedin, Instagram, MessageCircle } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { cn } from '../utils/cn';

export const Footer = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socials = [
    { icon: <MessageCircle size={18} />, href: '#', label: 'WhatsApp', color: 'hover:text-acid-lime' },
    { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn', color: 'hover:text-electric-blue' },
    { icon: <Twitter size={18} />, href: '#', label: 'Twitter', color: 'hover:text-coral' },
    { icon: <Instagram size={18} />, href: '#', label: 'Instagram', color: 'hover:text-[#FF90E8]' },
  ];

  return (
    <footer ref={footerRef} className="bg-deep-ink text-warm-paper py-8 px-4 border-t border-white/10 text-center md:text-left overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-display font-bold text-xl flex-1">
          {APP_CONFIG.companyName}.
        </div>

        {/* Centered Social Icons in a capsule */}
        <div className="flex-1 flex justify-center">
          <div 
            className={cn(
              "flex flex-row gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all duration-700 ease-out origin-center",
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
            )}
          >
            {socials.map((social, i) => (
              <div 
                key={social.label}
                className={cn(
                  "transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${isVisible ? 200 + i * 100 : 0}ms` }}
              >
                <Magnetic>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full text-white/70 transition-colors duration-300",
                      social.color
                    )}
                  >
                    {social.icon}
                  </a>
                </Magnetic>
              </div>
            ))}
          </div>
        </div>

        <div className="font-mono text-xs opacity-50 flex gap-4 uppercase tracking-wider flex-1 justify-end">
          <span>&copy; {new Date().getFullYear()} {APP_CONFIG.companyName}.</span>
          <span className="hidden md:inline">{t('footer.closed')}</span>
        </div>
      </div>
    </footer>
  );
};
