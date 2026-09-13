import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Stats = () => {
  const { language } = useLanguage();

  const principles = language === 'tr'
    ? [
        { symbol: '+', title: 'Netlik', description: 'Rakamları karar verebileceğiniz bir dile çevir.', layer: 'bg-electric-blue', hoverText: 'group-hover:text-white', hoverMuted: 'group-hover:text-white/65' },
        { symbol: '−', title: 'Sürpriz', description: 'Son güne kalan belirsizliği süreçten çıkar.', layer: 'bg-acid-lime', hoverText: 'group-hover:text-deep-ink', hoverMuted: 'group-hover:text-deep-ink/60' },
        { symbol: '=', title: 'Düzen', description: 'Belgeleri, kayıtları ve raporları tek akışta tut.', layer: 'bg-coral', hoverText: 'group-hover:text-deep-ink', hoverMuted: 'group-hover:text-deep-ink/60' },
        { symbol: '›', title: 'Aksiyon', description: 'Raporu arşiv değil, bir sonraki karar için kullan.', layer: 'bg-[#FF90E8]', hoverText: 'group-hover:text-deep-ink', hoverMuted: 'group-hover:text-deep-ink/60' },
      ]
    : [
        { symbol: '+', title: 'Clarity', description: 'Turn numbers into information you can make a decision with.', layer: 'bg-electric-blue', hoverText: 'group-hover:text-white', hoverMuted: 'group-hover:text-white/65' },
        { symbol: '−', title: 'Surprises', description: 'Remove last-minute uncertainty from the process.', layer: 'bg-acid-lime', hoverText: 'group-hover:text-deep-ink', hoverMuted: 'group-hover:text-deep-ink/60' },
        { symbol: '=', title: 'Order', description: 'Keep documents, entries, and reporting in one clean flow.', layer: 'bg-coral', hoverText: 'group-hover:text-deep-ink', hoverMuted: 'group-hover:text-deep-ink/60' },
        { symbol: '›', title: 'Action', description: 'Use reporting for the next decision, not just the archive.', layer: 'bg-[#FF90E8]', hoverText: 'group-hover:text-deep-ink', hoverMuted: 'group-hover:text-deep-ink/60' },
      ];

  return (
    <section className="py-24 md:py-28 px-4 md:px-8 bg-deep-ink border-t border-white/10 text-warm-paper">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/30 mb-10">
          {language === 'tr' ? 'Sahte istatistik yok. Çalışma prensibi var.' : 'No invented stats. Just working principles.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10">
          {principles.map((item, index) => (
            <article key={item.title} className="group relative min-h-[270px] p-7 md:p-8 border-r border-b border-white/10 flex flex-col justify-between overflow-hidden isolate">
              <div className={`absolute inset-0 z-0 ${item.layer} translate-y-[calc(100%_-_6px)] lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]`} />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <span className={`font-display font-bold text-7xl md:text-8xl leading-none text-acid-lime transition-[transform,color] duration-500 lg:group-hover:scale-110 lg:group-hover:rotate-[4deg] origin-left ${item.hoverText}`}>
                  {item.symbol}
                </span>
                <span className={`font-mono text-[9px] tracking-[0.24em] text-white/25 transition-colors duration-300 ${item.hoverMuted}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className={`relative z-10 transition-colors duration-300 ${item.hoverText}`}>
                <h3 className="font-display text-3xl md:text-[2rem] mb-3 tracking-tight">{item.title}</h3>
                <p className={`text-sm md:text-base text-white/45 leading-relaxed transition-colors duration-300 ${item.hoverMuted}`}>
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};