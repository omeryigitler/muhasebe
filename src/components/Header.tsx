import React, { useEffect, useRef, useState } from 'react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';
import { Magnetic } from './Magnetic';

const SECTION_IDS = ['services', 'tools', 'process', 'contact'] as const;
type SectionId = typeof SECTION_IDS[number];

export const Header = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const lastDecisionScrollRef = useRef(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  const navLinks = [
    {
      id: 'services' as const,
      href: '#services',
      label: t('nav.services'),
      index: '01',
      bgAccent: 'bg-electric-blue',
      textAccent: 'text-electric-blue',
      hoverAccent: 'group-hover:text-electric-blue',
    },
    {
      id: 'tools' as const,
      href: '#tools',
      label: t('nav.tools'),
      index: '02',
      bgAccent: 'bg-acid-lime',
      textAccent: 'text-acid-lime',
      hoverAccent: 'group-hover:text-acid-lime',
    },
    {
      id: 'process' as const,
      href: '#process',
      label: t('nav.process'),
      index: '03',
      bgAccent: 'bg-coral',
      textAccent: 'text-coral',
      hoverAccent: 'group-hover:text-coral',
    },
    {
      id: 'contact' as const,
      href: '#contact',
      label: t('nav.contact'),
      index: '04',
      bgAccent: 'bg-[#FF90E8]',
      textAccent: 'text-[#FF90E8]',
      hoverAccent: 'group-hover:text-[#FF90E8]',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 36);

      if (window.innerWidth >= 768) {
        setIsVisible(true);
        lastDecisionScrollRef.current = currentY;
        return;
      }

      if (currentY < 72) {
        setIsVisible(true);
        lastDecisionScrollRef.current = currentY;
        return;
      }

      const delta = currentY - lastDecisionScrollRef.current;
      if (Math.abs(delta) < 28) return;

      setIsVisible(delta < 0);
      lastDecisionScrollRef.current = currentY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const elements = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id && SECTION_IDS.includes(visible.target.id as SectionId)) {
          setActiveSection(visible.target.id as SectionId);
        }
      },
      {
        rootMargin: '-24% 0px -58% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const siteContent = document.getElementById('site-content');
    document.body.style.overflow = 'hidden';
    if (siteContent) siteContent.inert = true;

    const getFocusable = () => {
      const panel = menuPanelRef.current;
      if (!panel) return [] as HTMLElement[];
      return Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((element) => !element.hasAttribute('disabled'));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (siteContent) siteContent.inert = false;
    };
  }, [isMenuOpen]);

  const selectLanguage = (next: 'tr' | 'en') => {
    if (language !== next) toggleLanguage();
  };

  const menuLabel = isMenuOpen
    ? (language === 'tr' ? 'Menüyü kapat' : 'Close menu')
    : (language === 'tr' ? 'Menüyü aç' : 'Open menu');

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 text-warm-paper transition-[transform,background-color,border-color,padding,box-shadow] duration-300',
          isVisible || isMenuOpen ? 'translate-y-0' : '-translate-y-full md:translate-y-0',
          isScrolled && !isMenuOpen
            ? 'bg-deep-ink/[0.94] border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.18)] py-2.5 md:py-3 backdrop-blur-xl'
            : 'bg-deep-ink/35 md:bg-transparent border-b border-transparent py-3 md:py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4 min-h-11">
            <div className="justify-self-start">
              <a
                href="#top"
                aria-label={language === 'tr' ? `${APP_CONFIG.companyName} ana sayfa` : `${APP_CONFIG.companyName} home`}
                className="font-display font-black text-xl md:text-2xl tracking-tighter hover:text-acid-lime transition-colors focus-visible:rounded-sm"
              >
                {APP_CONFIG.companyName}.
              </a>
            </div>

            <nav className="hidden md:flex items-center justify-center gap-7 lg:gap-9 font-mono text-[11px] uppercase tracking-[0.16em]" aria-label={language === 'tr' ? 'Ana navigasyon' : 'Primary navigation'}>
              {navLinks.map((link) => {
                const active = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    aria-current={active ? 'location' : undefined}
                    className={cn(
                      'group relative py-3 transition-colors',
                      active ? 'text-white' : 'text-white/58 hover:text-white'
                    )}
                  >
                    <span className={cn(
                      'mr-1.5 text-[8px] transition-colors',
                      active ? link.textAccent : `text-white/25 ${link.hoverAccent}`
                    )}>
                      {link.index}
                    </span>
                    {link.label}
                    <span
                      className={cn(
                        'absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full origin-left transition-transform duration-300',
                        link.bgAccent,
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      )}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center justify-end gap-3">
              <div className="flex items-center h-10 rounded-full border border-white/12 bg-white/[0.045] p-1 font-mono text-[10px]" role="group" aria-label={language === 'tr' ? 'Dil seçimi' : 'Language selection'}>
                {(['tr', 'en'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectLanguage(item)}
                    aria-pressed={language === item}
                    className={cn(
                      'min-w-9 h-8 px-2 rounded-full transition-colors uppercase',
                      language === item
                        ? item === 'tr' ? 'bg-acid-lime text-deep-ink' : 'bg-electric-blue text-white'
                        : 'text-white/45 hover:text-white'
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <Magnetic strength={0.44} radius={82} maxOffset={18}>
                <a
                  href="#contact"
                  className="inline-flex h-10 items-center rounded-full bg-electric-blue border border-acid-lime px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-white shadow-[4px_4px_0_#D9FF43] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#D9FF43] active:translate-x-0 active:translate-y-[1px] active:shadow-[2px_2px_0_#D9FF43]"
                >
                  {t('nav.talk')}
                </a>
              </Magnetic>
            </div>

            <div className="md:hidden justify-self-end flex items-center gap-2">
              <div className="flex items-center h-11 rounded-full border border-white/12 bg-white/[0.05] p-1 font-mono text-[9px]" role="group" aria-label={language === 'tr' ? 'Dil seçimi' : 'Language selection'}>
                {(['tr', 'en'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectLanguage(item)}
                    aria-pressed={language === item}
                    className={cn(
                      'min-w-9 h-9 rounded-full uppercase transition-colors',
                      language === item
                        ? item === 'tr' ? 'bg-acid-lime text-deep-ink' : 'bg-electric-blue text-white'
                        : 'text-white/45'
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={menuLabel}
                className="min-w-12 h-11 px-2 flex items-center justify-end font-mono text-[11px] uppercase tracking-[0.12em] focus-visible:rounded-sm"
              >
                {isMenuOpen ? 'X' : t('nav.menu')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={menuPanelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={language === 'tr' ? 'Mobil navigasyon' : 'Mobile navigation'}
        aria-hidden={!isMenuOpen}
        className={cn(
          'fixed inset-0 bg-deep-ink z-40 md:hidden flex flex-col justify-center px-6 pt-20 transition-[opacity,transform] duration-400 ease-out',
          isMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-3'
        )}
      >
        <nav className="flex flex-col border-t border-white/10">
          {navLinks.map((link, index) => (
            <a
              ref={index === 0 ? firstMobileLinkRef : undefined}
              key={link.id}
              href={link.href}
              tabIndex={isMenuOpen ? 0 : -1}
              aria-current={activeSection === link.id ? 'location' : undefined}
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-center justify-between gap-5 py-5 border-b border-white/10 text-warm-paper"
            >
              <span className="flex items-baseline gap-4 min-w-0">
                <span className={cn('font-mono text-[10px] transition-colors', activeSection === link.id ? link.textAccent : `text-white/28 ${link.hoverAccent}`)}>{link.index}</span>
                <span className={cn('font-display text-4xl min-[390px]:text-5xl leading-none transition-colors truncate', link.hoverAccent)}>{link.label}</span>
              </span>
              <span className={cn('font-display text-4xl leading-none transition-colors', activeSection === link.id ? link.textAccent : `text-white/20 ${link.hoverAccent}`)}>›</span>
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={() => setIsMenuOpen(false)}
          className="mt-8 min-h-12 inline-flex items-center justify-center self-start bg-electric-blue text-white px-7 rounded-full border border-acid-lime shadow-[4px_4px_0_#D9FF43] font-mono text-sm uppercase tracking-widest"
        >
          {t('nav.talk')} ›
        </a>
      </div>
    </>
  );
};
