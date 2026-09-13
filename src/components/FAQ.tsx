import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

interface Theme {
  bg: string;
  text: string;
  numActive: string;
}

interface FAQItemProps {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  theme: Theme;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ index, question, answer, isOpen, theme, onClick }) => {
  const num = String(index + 1).padStart(2, '0');
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const isActive = isOpen || isHovered;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'mb-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden',
        isActive
          ? `border-deep-ink ${theme.bg} shadow-[6px_6px_0px_#101114] -translate-y-1`
          : 'border-deep-ink/10 bg-transparent'
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-ink focus-visible:ring-inset"
      >
        <div className="flex items-start md:items-center gap-4 md:gap-6">
          <span className={cn('font-mono text-xl md:text-2xl pt-1 md:pt-0 transition-colors duration-300', isActive ? theme.numActive : 'text-deep-ink/40')}>
            {num}
          </span>
          <h3 className={cn('font-display text-2xl md:text-3xl pr-4 leading-tight transition-colors duration-300', isActive ? theme.text : 'text-deep-ink')}>
            {question}
          </h3>
        </div>
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500',
          isActive ? `border-transparent bg-white ${isOpen ? 'rotate-45' : ''} text-deep-ink` : 'border-deep-ink/20 text-deep-ink/50'
        )}>
          <Plus size={24} strokeWidth={2.5} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 md:px-8 pb-8 pt-2 md:pl-[88px]">
              <p className={cn('font-mono text-base md:text-lg leading-relaxed max-w-3xl opacity-90', theme.text)}>
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQ = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = language === 'tr'
    ? [
        {
          q: 'Şirket kuruluş süreci ne kadar sürer?',
          a: 'Süre; şirket türü, belgelerin hazır olup olmaması ve ilgili kurumların işlem yoğunluğuna göre değişir. İlk görüşmede gerekli adımları ve gerçekçi zaman planını birlikte netleştiririz.',
        },
        {
          q: 'Vergi ve beyanname tarihlerini nasıl takip edeceğim?',
          a: 'Takvim; mükellefiyet türüne, döneme ve güncel mevzuata göre değişebilir. Sabit tarih ezberletmek yerine işletmenize ait yükümlülük takvimini takip eder ve yaklaşan işlemleri görünür tutarız.',
        },
        {
          q: 'Ön muhasebe programı kullanmalı mıyım?',
          a: 'İşlem hacmi, ekip yapısı ve kullandığınız satış/ödeme kanallarına göre değerlendirilir. Gereksiz karmaşıklık yaratmadan ihtiyacınıza uygun akışı seçmek daha önemlidir.',
        },
        {
          q: 'Aylık hizmet kapsamına neler dahil?',
          a: 'Hizmet kapsamı işletmenin ihtiyaçlarına göre belirlenir. Defter ve kayıt süreci, beyannameler, bordro, raporlama veya danışmanlık gibi kalemler teklif aşamasında açıkça listelenir.',
        },
      ]
    : [
        {
          q: 'How long does company setup take?',
          a: 'Timing depends on the entity type, document readiness, and processing times at the relevant authorities. We map the required steps and a realistic timeline before you start.',
        },
        {
          q: 'How are tax and filing deadlines tracked?',
          a: 'Deadlines can vary by taxpayer status, filing period, and current rules. Rather than relying on generic dates, we keep a clear obligation calendar for your business.',
        },
        {
          q: 'Should I use bookkeeping software?',
          a: 'It depends on transaction volume, team structure, and the sales or payment systems you already use. The goal is a clean workflow, not software for its own sake.',
        },
        {
          q: 'What is included in the monthly service?',
          a: 'Scope is defined around the business. Bookkeeping, filings, payroll, reporting, and advisory items are listed explicitly in the proposal so there are no assumed inclusions.',
        },
      ];

  const colorThemes: Theme[] = [
    { bg: 'bg-electric-blue', text: 'text-white', numActive: 'text-white/60' },
    { bg: 'bg-acid-lime', text: 'text-deep-ink', numActive: 'text-deep-ink/60' },
    { bg: 'bg-coral', text: 'text-deep-ink', numActive: 'text-deep-ink/60' },
    { bg: 'bg-[#FF90E8]', text: 'text-deep-ink', numActive: 'text-deep-ink/60' },
  ];

  return (
    <section className="py-32 px-4 md:px-8 bg-warm-paper text-deep-ink relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-acid-lime/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        <div className="lg:col-span-5">
          <div className="sticky top-32">
            <h2 className="font-display text-5xl md:text-7xl text-deep-ink tracking-tight mb-8">{t('faq.title')}</h2>
            <p className="font-mono text-lg md:text-xl opacity-70 max-w-md leading-relaxed">{t('faq.desc')}</p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.q}
              index={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === index}
              theme={colorThemes[index]}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
