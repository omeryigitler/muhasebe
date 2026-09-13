import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Stats = () => {
  const { language } = useLanguage();

  const principles = language === 'tr'
    ? [
        { symbol: '+', title: 'Netlik', description: 'Rakamları karar verebileceğiniz bir dile çevir.' },
        { symbol: '−', title: 'Sürpriz', description: 'Son güne kalan belirsizliği süreçten çıkar.' },
        { symbol: '=', title: 'Düzen', description: 'Belgeleri, kayıtları ve raporları tek akışta tut.' },
        { symbol: '→', title: 'Aksiyon', description: 'Raporu arşiv değil, bir sonraki karar için kullan.' },
      ]
    : [
        { symbol: '+', title: 'Clarity', description: 'Turn numbers into information you can make a decision with.' },
        { symbol: '−', title: 'Surprises', description: 'Remove last-minute uncertainty from the process.' },
        { symbol: '=', title: 'Order', description: 'Keep documents, entries, and reporting in one clean flow.' },
        { symbol: '→', title: 'Action', description: 'Use reporting for the next decision, not just the archive.' },
      ];

  return (
    <section className="py-24 px-4 md:px-8 bg-deep-ink border-t border-white/10 text-warm-paper">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/30 mb-10">
          {language === 'tr' ? 'Sahte istatistik yok. Çalışma prensibi var.' : 'No invented stats. Just working principles.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
          {principles.map((item) => (
            <article key={item.title} className="min-h-[260px] p-7 md:p-8 border-r border-b border-white/10 flex flex-col justify-between group hover:bg-white/[0.035] transition-colors">
              <span className="font-display text-7xl md:text-8xl leading-none text-acid-lime group-hover:scale-110 origin-left transition-transform">{item.symbol}</span>
              <div>
                <h3 className="font-display text-3xl mb-3">{item.title}</h3>
                <p className="text-sm md:text-base text-white/45 leading-relaxed">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
