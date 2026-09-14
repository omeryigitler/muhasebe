import React, { useEffect, useRef, useState } from 'react';
import { Instagram, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';
import { Magnetic } from './Magnetic';

export const Footer = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const socials = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      href: APP_CONFIG.socialLinks.whatsapp || '#',
      hasRealLink: Boolean(APP_CONFIG.socialLinks.whatsapp),
      icon: MessageCircle,
      hover: 'hover:bg-acid-lime hover:text-deep-ink',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: APP_CONFIG.socialLinks.linkedin || '#',
      hasRealLink: Boolean(APP_CONFIG.socialLinks.linkedin),
      icon: Linkedin,
      hover: 'hover:bg-electric-blue hover:text-white',
    },
    {
      key: 'twitter',
      label: 'X / Twitter',
      href: APP_CONFIG.socialLinks.twitter || '#',
      hasRealLink: Boolean(APP_CONFIG.socialLinks.twitter),
      icon: Twitter,
      hover: 'hover:bg-coral hover:text-deep-ink',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      href: APP_CONFIG.socialLinks.instagram || '#',
      hasRealLink: Boolean(APP_CONFIG.socialLinks.instagram),
      icon: Instagram,
      hover: 'hover:bg-[#FF90E8] hover:text-deep-ink',
    },
  ];

  return (
    <footer ref={footerRef} className="bg-deep-ink text-warm-paper px-4 md:px-8 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto py-9 md:py-10 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-7 md:gap-10 items-center">
        <div className="text-center md:text-left">
          <a href="#top" className="font-display font-bold text-xl hover:text-acid-lime transition-colors">
            {APP_CONFIG.companyName}.
          </a>
        </div>

        <div
          className={cn(
            'justify-self-center flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] p-1.5 transition-all duration-700 ease-out origin-center',
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          )}
          aria-label={language === 'tr' ? 'Sosyal medya' : 'Social media'}
        >
          {socials.map((social, index) => {
            const Icon = social.icon;

            return (
              <div
                key={social.key}
                className={cn(
                  'transition-all duration-500',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${isVisible ? 200 + index * 100 : 0}ms` }}
              >
                <Magnetic>
                  <a
                    href={social.href}
                    target={social.hasRealLink ? '_blank' : undefined}
                    rel={social.hasRealLink ? 'noreferrer' : undefined}
                    aria-label={social.label}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-white/68 transition-[background-color,color] duration-300 cursor-pointer',
                      social.hover
                    )}
                  >
                    <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                  </a>
                </Magnetic>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
          <a
            href={`mailto:${APP_CONFIG.email}`}
            className="font-mono text-xs md:text-sm text-white/58 hover:text-acid-lime transition-colors underline underline-offset-4 decoration-white/15"
          >
            {APP_CONFIG.email}
          </a>
          <div className="font-mono text-[10px] text-white/32 uppercase tracking-[0.16em] flex flex-wrap justify-center md:justify-end gap-x-3 gap-y-1">
            <span>&copy; {new Date().getFullYear()} {APP_CONFIG.companyName}</span>
            <span>{t('footer.closed')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
