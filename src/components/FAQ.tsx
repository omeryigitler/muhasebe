import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  
  const isActive = isOpen || isHovered;
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "mb-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden cursor-pointer",
        isActive 
          ? `border-deep-ink ${theme.bg} shadow-[6px_6px_0px_#101114] -translate-y-1` 
          : "border-deep-ink/10 bg-transparent"
      )}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
      >
        <div className="flex items-start md:items-center gap-4 md:gap-6">
          <span className={cn(
            "font-mono text-xl md:text-2xl pt-1 md:pt-0 transition-colors duration-300",
            isActive ? theme.numActive : "text-deep-ink/40"
          )}>
            {num}
          </span>
          <h3 className={cn(
            "font-display text-2xl md:text-3xl pr-4 leading-tight transition-colors duration-300",
            isActive ? theme.text : "text-deep-ink"
          )}>
            {question}
          </h3>
        </div>
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500",
          isActive 
            ? `border-transparent bg-white ${isOpen ? 'rotate-45' : ''} text-deep-ink` 
            : "border-deep-ink/20 text-deep-ink/50"
        )}>
          <Plus size={24} strokeWidth={2.5} />
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 md:px-8 pb-8 pt-2 md:pl-[88px]">
              <p className={cn(
                "font-mono text-lg leading-relaxed max-w-3xl opacity-90",
                theme.text
              )}>
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
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  const colorThemes: Theme[] = [
    { bg: 'bg-electric-blue', text: 'text-white', numActive: 'text-white/60' },
    { bg: 'bg-acid-lime', text: 'text-deep-ink', numActive: 'text-deep-ink/60' },
    { bg: 'bg-coral', text: 'text-deep-ink', numActive: 'text-deep-ink/60' },
    { bg: 'bg-[#FF90E8]', text: 'text-deep-ink', numActive: 'text-deep-ink/60' },
    { bg: 'bg-deep-ink', text: 'text-warm-paper', numActive: 'text-warm-paper/60' },
  ];

  return (
    <section className="py-32 px-4 md:px-8 bg-warm-paper text-deep-ink relative overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-acid-lime/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        
        {/* Left Side: Sticky Title */}
        <div className="lg:col-span-5">
          <div className="sticky top-32">
            <h2 className="font-display text-5xl md:text-7xl text-deep-ink tracking-tight mb-8">
              {t('faq.title')}
            </h2>
            <p className="font-mono text-xl opacity-70 max-w-md leading-relaxed">
              {t('faq.desc')}
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Cards */}
        <div className="lg:col-span-7 flex flex-col">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              index={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === index}
              theme={colorThemes[index % colorThemes.length]}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};
