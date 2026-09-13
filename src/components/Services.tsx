import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Services = () => {
  const { t, language } = useLanguage();
  const container = useRef<HTMLElement>(null);

  const details = language === 'tr'
    ? [
        'Günlük kayıtlar, banka hareketleri ve düzenli defter akışı.',
        'KDV takibi, beyan dönemleri ve vergi görünürlüğü.',
        'Maaş, kesinti ve ödeme sürecinin tek takvimde yönetimi.',
        'Kuruluş sürecinden ilk finansal düzene kadar temiz başlangıç.',
        'Toplamları değil, değişimin nedenini gösteren yönetim görünümü.',
        'Karar vermeden önce rakamların ne söylediğini birlikte okuma.',
      ]
    : [
        'Daily entries, bank movements, and a bookkeeping flow that stays clean.',
        'VAT tracking, filing periods, and tax visibility before deadlines.',
        'Payroll, deductions, and payment timing managed on one clear timeline.',
        'A clean financial setup from incorporation through the first reporting cycle.',
        'Management reporting that explains the movement, not only the total.',
        'Advisory that turns accounting information into a decision you can use.',
      ];

  const accents = [
    'bg-electric-blue text-white',
    'bg-acid-lime text-deep-ink',
    'bg-coral text-deep-ink',
    'bg-vivid-purple text-white',
    'bg-[#FF90E8] text-deep-ink',
    'bg-[#00E5FF] text-deep-ink',
  ];

  const symbols = ['+', '%', '€', '→', '=', '?'];
  const hoverText = ['group-hover:text-white', 'group-hover:text-deep-ink', 'group-hover:text-deep-ink', 'group-hover:text-white', 'group-hover:text-deep-ink', 'group-hover:text-deep-ink'];

  const services = Array.from({ length: 6 }, (_, index) => ({
    id: String(index + 1).padStart(2, '0'),
    title: t(`services.0${index + 1}`),
    description: details[index],
    accent: accents[index],
    symbol: symbols[index],
    hoverText: hoverText[index],
  }));

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rows = gsap.utils.toArray<HTMLElement>('.service-row');
    rows.forEach((row, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      gsap.from(row, {
        x: 70 * direction,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, { scope: container, dependencies: [language] });

  return (
    <section id="services" ref={container} className="bg-warm-paper text-deep-ink py-28 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-20 mb-20 items-end">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-deep-ink/45">
            {language === 'tr' ? 'Ne yapıyoruz' : 'What we do'}
          </p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight max-w-4xl">
            {t('services.title')}
          </h2>
        </div>

        <div className="border-t border-deep-ink/20">
          {services.map((service) => (
            <article key={service.id} className="service-row group relative border-b border-deep-ink/20 overflow-hidden">
              <div className={`absolute inset-0 ${service.accent} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]`} />

              <div className={`relative z-10 grid grid-cols-[52px_1fr_auto] md:grid-cols-[80px_1.25fr_1fr_100px] gap-4 md:gap-8 items-center py-8 md:py-10 px-2 md:px-4 transition-colors duration-300 ${service.hoverText}`}>
                <span className="font-mono text-xs md:text-sm opacity-45 group-hover:opacity-80 transition-opacity">{service.id}</span>
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight">{service.title}</h3>
                <p className="hidden md:block text-sm lg:text-base leading-relaxed max-w-md opacity-55 group-hover:opacity-80 transition-opacity">{service.description}</p>
                <div className="justify-self-end overflow-hidden w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                  <span className="font-display text-5xl md:text-7xl leading-none transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125">{service.symbol}</span>
                </div>
              </div>

              <p className="relative z-10 md:hidden pb-7 px-[68px] text-sm leading-relaxed opacity-55 group-hover:opacity-80 transition-opacity">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
