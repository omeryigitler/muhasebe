import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const ChaosToOrder = () => {
  const { t, language } = useLanguage();
  const container = useRef<HTMLElement>(null);

  const rows = language === 'tr'
    ? [
        ['FATURA 0294', 'SATIŞ', '+₺34.200'],
        ['FİŞ 1182', 'GİDER', '−₺8.750'],
        ['BANKA 08/12', 'TAHSİLAT', '+₺12.400'],
        ['BORDRO 08', 'PERSONEL', '−₺19.680'],
        ['KDV 08', 'VERGİ', '−₺3.420'],
      ]
    : [
        ['INVOICE 0294', 'SALES', '+₺34,200'],
        ['RECEIPT 1182', 'EXPENSE', '−₺8,750'],
        ['BANK 08/12', 'COLLECTION', '+₺12,400'],
        ['PAYROLL 08', 'PEOPLE', '−₺19,680'],
        ['VAT 08', 'TAX', '−₺3,420'],
      ];

  useGSAP(() => {
    const ledgerRows = gsap.utils.toArray<HTMLElement>('.ledger-row');
    const rules = gsap.utils.toArray<HTMLElement>('.ledger-rule');

    ledgerRows.forEach((row) => {
      gsap.set(row, {
        x: gsap.utils.random(-260, 260),
        y: gsap.utils.random(-120, 160),
        rotation: gsap.utils.random(-18, 18),
        scale: gsap.utils.random(0.86, 1.08),
        opacity: 0.5,
      });
    });
    gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set('.ledger-header, .ledger-total', { autoAlpha: 0, y: 20 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 35%',
        end: 'bottom 70%',
        scrub: 1,
      },
    });

    ledgerRows.forEach((row, index) => {
      timeline.to(row, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.inOut',
      }, index * 0.08);
    });

    timeline.to(rules, {
      scaleX: 1,
      stagger: 0.05,
      duration: 0.45,
      ease: 'power2.out',
    }, 0.35);

    timeline.to('.ledger-header', {
      autoAlpha: 1,
      y: 0,
      duration: 0.35,
    }, 0.55);

    timeline.to('.ledger-total', {
      autoAlpha: 1,
      y: 0,
      duration: 0.45,
      ease: 'back.out(1.4)',
    }, 0.72);
  }, { scope: container, dependencies: [language] });

  return (
    <section ref={container} className="relative bg-deep-ink text-warm-paper py-36 px-4 md:px-8 overflow-hidden min-h-[110vh] flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[12%] left-[7%] text-[8rem] font-display text-coral/10 rotate-12">%</span>
        <span className="absolute bottom-[10%] right-[6%] text-[10rem] font-display text-electric-blue/10 -rotate-12">€</span>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.4fr] gap-10 lg:gap-20 items-end mb-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-acid-lime mb-5">
              {language === 'tr' ? 'Evraktan sisteme' : 'From paperwork to system'}
            </p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.94]">
              {t('chaos.t1')}<br />
              <span className="text-acid-lime">{t('chaos.t2')}</span>
            </h2>
          </div>
          <p className="text-lg md:text-xl text-white/55 max-w-xl lg:justify-self-end">
            {language === 'tr'
              ? 'Dağınık belgeler tek tek kaybolmaz. Her hareket sınıflanır, satıra oturur ve sonunda okunabilir bir finansal tabloya dönüşür.'
              : 'Nothing disappears inside a pile. Every movement gets classified, lands on a ledger line, and becomes a financial picture you can actually read.'}
          </p>
        </div>

        <div className="relative bg-[#15171B] border border-white/10 rounded-[28px] p-5 md:p-8 shadow-2xl overflow-hidden">
          <div className="ledger-header grid grid-cols-[1.2fr_0.8fr_auto] gap-4 pb-4 font-mono text-[10px] md:text-xs uppercase tracking-[0.24em] text-white/30">
            <span>{language === 'tr' ? 'Belge' : 'Document'}</span>
            <span>{language === 'tr' ? 'Kategori' : 'Category'}</span>
            <span className="text-right">{language === 'tr' ? 'Tutar' : 'Amount'}</span>
          </div>

          <div>
            {rows.map((row) => (
              <div key={row[0]} className="relative">
                <div className="ledger-rule absolute top-0 left-0 right-0 h-px bg-white/10" />
                <div className="ledger-row grid grid-cols-[1.2fr_0.8fr_auto] gap-4 items-center py-5 md:py-6 font-mono will-change-transform">
                  <span className="text-sm md:text-base text-white/80">{row[0]}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/35">{row[1]}</span>
                  <span className={`text-right text-base md:text-lg ${row[2].startsWith('+') ? 'text-acid-lime' : 'text-coral'}`}>
                    {row[2]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="ledger-rule h-px bg-white/10" />
          <div className="ledger-total flex flex-col md:flex-row md:items-end justify-between gap-4 pt-7">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30 mb-2">
                {language === 'tr' ? 'Net hareket' : 'Net movement'}
              </p>
              <p className="font-display text-4xl md:text-6xl text-acid-lime">+₺14.750</p>
            </div>
            <p className="font-mono text-xs text-white/35 max-w-xs md:text-right">
              {language === 'tr' ? '5 belge → 5 sınıflandırılmış kayıt → 1 okunabilir sonuç' : '5 documents → 5 classified entries → 1 readable result'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
