import React, { useEffect, useRef, useState } from 'react';
import { Calculator, type CalculatorDemoPreset, type CalculatorHandle } from './Calculator';
import { useLanguage } from '../context/LanguageContext';
import { getFinanceLocale } from '../config';

const DEMO_PRESETS: CalculatorDemoPreset[] = ['bookkeeping', 'vat', 'payroll', 'reporting'];

export const AccountingStory = () => {
  const { language } = useLanguage();
  const finance = getFinanceLocale(language);
  const calcRef = useRef<CalculatorHandle>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const userInteractedRef = useRef(false);
  const [activeStep, setActiveStep] = useState(0);

  const copy = language === 'tr'
    ? [
        {
          index: '01',
          kicker: 'Günlük akış',
          title: 'Muhasebe, evrak yığını değil sistemdir.',
          description: 'Fatura, fiş ve banka hareketleri tek bir düzenli akışta işlenir.',
          symbol: '+',
          accent: 'text-electric-blue',
        },
        {
          index: '02',
          kicker: 'Vergi kontrolü',
          title: 'KDV’yi son gün değil, her gün gör.',
          description: 'KDV ekle, KDV çıkar ve nakit etkisini rakamlar büyümeden takip et.',
          symbol: '%',
          accent: 'text-acid-lime',
        },
        {
          index: '03',
          kicker: 'Bordro',
          title: 'Maaş günü sürprizsiz olsun.',
          description: 'Bordro, kesintiler ve ödeme toplamları net bir takvimle görünür kalır.',
          symbol: finance.symbol,
          accent: 'text-coral',
        },
        {
          index: '04',
          kicker: 'Raporlama',
          title: 'Rakamlar sonunda bir karar söylesin.',
          description: 'Dönem sonunda yalnızca toplam değil, neyin neden değiştiğini gör.',
          symbol: '=',
          accent: 'text-vivid-purple',
        },
      ]
    : [
        {
          index: '01',
          kicker: 'Daily flow',
          title: 'Bookkeeping should be a system, not a pile.',
          description: 'Invoices, receipts, and bank movements move through one clean accounting flow.',
          symbol: '+',
          accent: 'text-electric-blue',
        },
        {
          index: '02',
          kicker: 'Tax control',
          title: 'See VAT every day, not on the deadline.',
          description: 'Add VAT, extract VAT, and understand the cash impact before the numbers grow.',
          symbol: '%',
          accent: 'text-acid-lime',
        },
        {
          index: '03',
          kicker: 'Payroll',
          title: 'Make payday predictable.',
          description: 'Payroll, deductions, and payment totals stay visible on one clear timeline.',
          symbol: finance.symbol,
          accent: 'text-coral',
        },
        {
          index: '04',
          kicker: 'Reporting',
          title: 'Make the numbers say what to do next.',
          description: 'At period end, see more than totals: understand what changed and why.',
          symbol: '=',
          accent: 'text-vivid-purple',
        },
      ];

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const next = Number((visible.target as HTMLElement).dataset.step ?? 0);
        if (!Number.isFinite(next)) return;

        setActiveStep(next);
        if (!userInteractedRef.current) {
          calcRef.current?.setDemo(DEMO_PRESETS[next]);
        }
      },
      { rootMargin: '-30% 0px -42% 0px', threshold: [0.2, 0.4, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [language]);

  return (
    <section className="relative overflow-hidden bg-deep-ink text-warm-paper border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:gap-16">
        <div className="relative">
          {copy.map((step, index) => (
            <div
              key={step.index}
              ref={(node) => {
                stepRefs.current[index] = node;
              }}
              data-step={index}
              className="relative min-h-[46svh] sm:min-h-[50svh] lg:min-h-[72vh] flex items-center border-b border-white/10 py-12 sm:py-16 lg:py-20 overflow-hidden"
            >
              <div className="relative z-10 max-w-2xl pr-8 sm:pr-16">
                <div className="mb-4 sm:mb-6 flex items-center gap-3 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.26em] text-white/40">
                  <span className={step.accent}>{step.index}</span>
                  <span className="h-px w-8 bg-white/15" />
                  <span>{step.kicker}</span>
                </div>

                <h2 className="font-display text-[2.35rem] leading-[0.9] sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight max-w-2xl">
                  {step.title}
                </h2>
                <p className="mt-5 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-white/60">
                  {step.description}
                </p>
              </div>

              <div
                aria-hidden="true"
                className={`absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 font-display text-[8rem] sm:text-[11rem] lg:text-[14rem] font-black leading-none opacity-[0.09] ${step.accent}`}
              >
                {step.symbol}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block relative">
          <div className="sticky top-20 h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="w-full max-w-[330px]">
              <div className="mb-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
                <span>{language === 'tr' ? 'Canlı sistem' : 'Live system'}</span>
                <span className={copy[activeStep].accent}>{copy[activeStep].index}</span>
              </div>
              <Calculator
                ref={calcRef}
                isInteractive
                onInteract={() => {
                  userInteractedRef.current = true;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
