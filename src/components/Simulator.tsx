import React, { useState } from 'react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';

export const Simulator = () => {
  const { t, language } = useLanguage();
  const [revenue, setRevenue] = useState(50000);
  const [expenseRatio, setExpenseRatio] = useState(30);

  const expenses = revenue * (expenseRatio / 100);
  const taxable = revenue - expenses;
  const estimatedTax = taxable * 0.20; // Simulated 20% tax on profit

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: language === 'tr' ? 'TRY' : 'USD', maximumFractionDigits: 0 })
      .format(val).replace('₺', APP_CONFIG.currency).replace('$', APP_CONFIG.currency);
  };

  return (
    <section id="tools" className="py-24 px-4 md:px-8 bg-electric-blue text-white overflow-hidden relative">
      {/* Dynamic Background shapes based on values */}
      <div 
        className="absolute bottom-0 left-0 bg-acid-lime/20 transition-all duration-700 ease-out"
        style={{ width: `${(revenue / 500000) * 100}%`, height: '50vh', borderTopRightRadius: '100px' }}
      />
      <div 
        className="absolute top-0 right-0 bg-coral/20 transition-all duration-700 ease-out"
        style={{ width: `${expenseRatio}%`, height: '100%', borderBottomLeftRadius: '200px' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-6xl font-display mb-6 leading-tight">
            {t('sim.title')}
          </h2>
          <p className="text-lg opacity-80 mb-12 max-w-md">
            {t('sim.desc')}
          </p>

          <div className="space-y-10">
            <div>
              <div className="flex justify-between mb-4">
                <label className="font-mono text-sm uppercase tracking-wider opacity-80">{t('sim.revenue')}</label>
                <span className="font-mono font-bold text-acid-lime">{formatCurrency(revenue)}</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="500000" 
                step="5000"
                value={revenue} 
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full appearance-none bg-white/20 h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-acid-lime [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <label className="font-mono text-sm uppercase tracking-wider opacity-80">{t('sim.expenseRatio')}</label>
                <span className="font-mono font-bold text-coral">%{expenseRatio}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="80" 
                step="5"
                value={expenseRatio} 
                onChange={(e) => setExpenseRatio(Number(e.target.value))}
                className="w-full appearance-none bg-white/20 h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-coral [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-deep-ink rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-acid-lime opacity-10 blur-3xl rounded-full"></div>
            
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-6">
                <p className="font-mono text-xs text-white/50 mb-2">{t('sim.estExpenses')}</p>
                <p className="text-3xl font-mono text-coral">{formatCurrency(expenses)}</p>
              </div>
              
              <div className="border-b border-white/10 pb-6">
                <p className="font-mono text-xs text-white/50 mb-2">{t('sim.taxable')}</p>
                <p className="text-3xl font-mono text-white">{formatCurrency(taxable)}</p>
              </div>

              <div>
                <p className="font-mono text-xs text-white/50 mb-2">{t('sim.estTax')}</p>
                <p className="text-5xl md:text-6xl font-mono font-bold text-acid-lime">
                  {formatCurrency(estimatedTax)}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-white/40 mt-8 font-mono max-w-sm">
              {t('sim.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
