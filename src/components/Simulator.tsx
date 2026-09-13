import React, { useState } from 'react';
import { APP_CONFIG, getFinanceLocale } from '../config';
import { useLanguage } from '../context/LanguageContext';

export const Simulator = () => {
  const { t, language } = useLanguage();
  const { simulator } = APP_CONFIG;
  const finance = getFinanceLocale(language);
  const [revenue, setRevenue] = useState(50000);
  const [expenseRatio, setExpenseRatio] = useState(30);
  const [scenarioRate, setScenarioRate] = useState(APP_CONFIG.taxScenarioRate);

  const expenses = revenue * (expenseRatio / 100);
  const taxable = Math.max(0, revenue - expenses);
  const estimatedTax = taxable * (scenarioRate / 100);

  const copy = language === 'tr'
    ? {
        rate: 'Senaryo Vergi Oranı',
        note: 'Oran, mevzuat sonucu değil; senaryo girdisidir.',
        kicker: 'Canlı senaryo',
      }
    : {
        rate: 'Scenario Tax Rate',
        note: 'The rate is a scenario input, not a statutory result.',
        kicker: 'Live scenario',
      };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(finance.locale, {
      style: 'currency',
      currency: finance.code,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const sliderClass = 'w-full appearance-none bg-white/20 h-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-acid-lime focus-visible:ring-offset-4 focus-visible:ring-offset-electric-blue [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-acid-lime [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer';

  return (
    <section id="tools" className="py-20 md:py-28 px-4 md:px-8 bg-electric-blue text-white overflow-hidden relative">
      <div
        className="absolute bottom-0 left-0 bg-acid-lime/20 transition-all duration-700 ease-out pointer-events-none"
        style={{ width: `${Math.min(100, (revenue / simulator.maxRevenue) * 100)}%`, height: '50vh', borderTopRightRadius: '100px' }}
      />
      <div
        className="absolute top-0 right-0 bg-coral/20 transition-all duration-700 ease-out pointer-events-none"
        style={{ width: `${expenseRatio}%`, height: '100%', borderBottomLeftRadius: '200px' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-acid-lime mb-4 md:mb-5">{copy.kicker}</p>
          <h2 className="text-4xl md:text-7xl font-display mb-5 md:mb-6 leading-[0.95] tracking-tight">
            {t('sim.title')}
          </h2>
          <p className="text-base md:text-lg opacity-80 mb-8 md:mb-12 max-w-lg leading-relaxed">
            {t('sim.desc')}
          </p>

          <div className="space-y-7 md:space-y-9">
            <div>
              <div className="flex justify-between gap-4 mb-4">
                <label htmlFor="revenue-range" className="font-mono text-[10px] md:text-xs uppercase tracking-wider opacity-80">{t('sim.revenue')}</label>
                <span className="font-mono text-sm md:text-base font-bold text-acid-lime tabular-nums">{formatCurrency(revenue)}</span>
              </div>
              <input
                id="revenue-range"
                aria-label={t('sim.revenue')}
                type="range"
                min={simulator.minRevenue}
                max={simulator.maxRevenue}
                step={simulator.revenueStep}
                value={revenue}
                onChange={(event) => setRevenue(Number(event.target.value))}
                className={sliderClass}
              />
            </div>

            <div>
              <div className="flex justify-between gap-4 mb-4">
                <label htmlFor="expense-range" className="font-mono text-[10px] md:text-xs uppercase tracking-wider opacity-80">{t('sim.expenseRatio')}</label>
                <span className="font-mono text-sm md:text-base font-bold text-coral tabular-nums">%{expenseRatio}</span>
              </div>
              <input
                id="expense-range"
                aria-label={t('sim.expenseRatio')}
                type="range"
                min={simulator.minExpenseRatio}
                max={simulator.maxExpenseRatio}
                step={simulator.expenseStep}
                value={expenseRatio}
                onChange={(event) => setExpenseRatio(Number(event.target.value))}
                className={sliderClass}
              />
            </div>

            <div>
              <div className="flex justify-between gap-4 mb-4">
                <div>
                  <label htmlFor="tax-rate-range" className="font-mono text-[10px] md:text-xs uppercase tracking-wider opacity-80">{copy.rate}</label>
                  <p className="font-mono text-[9px] md:text-[10px] text-white/45 mt-1">{copy.note}</p>
                </div>
                <span className="font-mono text-sm md:text-base font-bold text-white tabular-nums">%{scenarioRate}</span>
              </div>
              <input
                id="tax-rate-range"
                aria-label={copy.rate}
                type="range"
                min={simulator.minScenarioRate}
                max={simulator.maxScenarioRate}
                step={simulator.scenarioRateStep}
                value={scenarioRate}
                onChange={(event) => setScenarioRate(Number(event.target.value))}
                className={sliderClass}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-deep-ink rounded-[24px] md:rounded-[30px] p-6 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-acid-lime opacity-10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute top-6 right-6 md:top-8 md:right-8 font-display text-[5rem] md:text-[7rem] leading-none text-white/[0.035] pointer-events-none">%</div>

            <div className="space-y-6 md:space-y-8 relative z-10">
              <div className="border-b border-white/10 pb-5 md:pb-6">
                <p className="font-mono text-[10px] md:text-xs text-white/50 mb-2 uppercase tracking-wider">{t('sim.estExpenses')}</p>
                <p className="text-2xl md:text-3xl font-mono text-coral tabular-nums">{formatCurrency(expenses)}</p>
              </div>

              <div className="border-b border-white/10 pb-5 md:pb-6">
                <p className="font-mono text-[10px] md:text-xs text-white/50 mb-2 uppercase tracking-wider">{t('sim.taxable')}</p>
                <p className="text-2xl md:text-3xl font-mono text-white tabular-nums">{formatCurrency(taxable)}</p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <p className="font-mono text-[10px] md:text-xs text-white/50 uppercase tracking-wider">{t('sim.estTax')}</p>
                  <span className="font-mono text-[9px] md:text-[10px] border border-white/15 rounded-full px-3 py-1 text-white/50">%{scenarioRate}</span>
                </div>
                <p className="text-4xl md:text-6xl font-mono font-bold text-acid-lime tabular-nums break-words">
                  {formatCurrency(estimatedTax)}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-white/40 mt-6 md:mt-8 font-mono max-w-md leading-relaxed">
              {t('sim.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
