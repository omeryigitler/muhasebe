import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface Dictionary {
  [key: string]: string;
}

const dictionaries: Record<Language, Dictionary> = {
  tr: {
    'nav.services': 'Hizmetler',
    'nav.tools': 'Araçlar',
    'nav.process': 'Süreç',
    'nav.contact': 'İletişim',
    'nav.talk': 'Tanışalım',
    'nav.menu': 'Menü',
    'hero.eyebrow': 'Muhasebe, ama biraz daha canlı.',
    'hero.t1': 'Rakamlar',
    'hero.t2': 'Sıkıcı Olmak',
    'hero.t3': 'Zorunda Değil.',
    'hero.desc': 'Muhasebe, vergi ve finansal süreçleri karmaşadan çıkarıp anlaşılır bir sisteme dönüştürüyoruz.',
    'hero.cta1': 'Tanışalım ›',
    'hero.cta2': 'Hizmetleri Gör',
    'services.title': 'Sayıların arkasındaki işleri biz hallediyoruz.',
    'services.01': 'Muhasebe',
    'services.02': 'KDV ve Vergi',
    'services.03': 'Bordro',
    'services.04': 'Şirket Kuruluşu',
    'services.05': 'Raporlama',
    'services.06': 'Danışmanlık',
    'marquee': 'MUHASEBE ✦ KDV ✦ BORDRO ✦ RAPORLAMA ✦ VERGİ ✦ DANIŞMANLIK ✦ ',
    'sim.title': 'Rakamları kendin dene.',
    'sim.desc': 'Senaryoları değiştirerek tahmini finansal tablonuzu görün. Biz sürprizleri sevmeyiz.',
    'sim.revenue': 'Yıllık Ciro',
    'sim.expenseRatio': 'Gider Oranı (%)',
    'sim.estExpenses': 'Tahmini Giderler',
    'sim.taxable': 'Vergilendirilebilir Kâr',
    'sim.estTax': 'Tahmini Kurumlar / Gelir Vergisi',
    'sim.disclaimer': 'Bu araç yalnızca örnekleme amaçlıdır. Kesin vergi hesaplaması ve mevzuat değerlendirmesi için profesyonel danışmanlık gerekir.',
    'chaos.t1': 'Dağınık girer.',
    'chaos.t2': 'Düzenli çıkar.',
    'chaos.items.0': 'FATURA 0294',
    'chaos.items.1': 'KDV',
    'chaos.items.2': 'BORDRO',
    'chaos.items.3': 'FİŞ / MAKBUZ',
    'process.title': 'Muhasebe karmaşık olabilir. Süreç olmak zorunda değil.',
    'process.s1.t': 'Bize ulaş.',
    'process.s1.d': 'Durumunu anlat.',
    'process.s2.t': 'Belgeleri paylaş.',
    'process.s2.d': 'Biz her şeyi inceleyelim.',
    'process.s3.t': 'Planı netleştirelim.',
    'process.s3.d': 'İhtiyacı, sorumlulukları ve takvimi birlikte netleştirelim.',
    'process.s4.t': 'Gerisini bize bırak.',
    'process.s4.d': 'Sistemini kuralım ve akışı yönetelim.',
    'stats.clients': 'Müşteri',
    'stats.returns': 'Beyanname',
    'stats.years': 'Yıl',
    'stats.response': 'Yanıt Süresi',
    'contact.t1': 'Rakamları',
    'contact.t2': 'Bize Bırak.',
    'contact.desc': 'Sen işine odaklan. Biz rakamları düzene sokalım.',
    'contact.meet': 'Tanışalım.',
    'contact.find': 'Bizi bulun:',
    'contact.form.name': 'İsim',
    'contact.form.email': 'E-posta',
    'contact.form.help': 'Nasıl yardımcı olabiliriz?',
    'contact.form.submit': 'Gönder',
    'contact.form.submitting': 'Gönderiliyor...',
    'contact.form.success': 'Talep Alındı',
    'contact.form.successDesc': 'En kısa sürede dönüş yapacağız.',
    'footer.closed': 'Hesaplar Kapandı ✓',
    'calc.vat': 'KDV',
    'calc.entry': 'Giriş',
    'calc.total': 'Toplam',
    'faq.title': 'Sıkça Sorulan Sorular',
    'faq.desc': 'Aklınıza takılan soruların cevaplarını burada bulabilirsiniz. Farklı bir durumunuz varsa bizimle iletişime geçmekten çekinmeyin.',
    'faq.q1': 'Şirket kurulum süreci ne kadar sürer?',
    'faq.a1': 'Gerekli evraklar tamamlandıktan sonra genellikle 1-3 iş günü içinde şirketiniz kurulur ve fatura kesmeye başlayabilirsiniz.',
    'faq.q2': 'KDV, Muhtasar ve Kurumlar Vergisi ödemeleri ne zaman yapılır?',
    'faq.a2': 'KDV her ayın 28\'ine, Muhtasar ayın 26\'sına, Kurumlar Vergisi ise üçer aylık dönemlerde ödenir. Tüm takvimi sizin yerinize biz takip ediyoruz.',
    'faq.q3': 'Ön muhasebe programı kullanmalı mıyım?',
    'faq.a3': 'İşletmenizin hacmine göre değişir. Faturalarınızı düzenli takip etmek için web tabanlı basit bir yazılım kullanmanızı önerir ve entegrasyonu sağlarız.',
    'faq.q4': 'Mali müşavirlik ücretlerine neler dahildir?',
    'faq.a4': 'Aylık defter tutma, beyanname hazırlama, vergi danışmanlığı ve temel finansal raporlama hizmetleri aylık ücretimize dahildir.'
  },
  en: {
    'nav.services': 'Services',
    'nav.tools': 'Tools',
    'nav.process': 'Process',
    'nav.contact': 'Contact',
    'nav.talk': "Let's Talk",
    'nav.menu': 'Menu',
    'hero.eyebrow': 'Accounting, but a bit more alive.',
    'hero.t1': 'Numbers',
    'hero.t2': "Don't Have To Be",
    'hero.t3': 'Boring.',
    'hero.desc': 'We transform accounting, tax, and financial processes from chaos into a clear system.',
    'hero.cta1': "Let's meet ›",
    'hero.cta2': 'View Services',
    'services.title': 'We handle the work behind the numbers.',
    'services.01': 'Bookkeeping',
    'services.02': 'VAT & Tax',
    'services.03': 'Payroll',
    'services.04': 'Company Setup',
    'services.05': 'Reporting',
    'services.06': 'Advisory',
    'marquee': 'BOOKKEEPING ✦ VAT ✦ PAYROLL ✦ REPORTING ✦ TAX ✦ ADVISORY ✦ ',
    'sim.title': 'Test the numbers yourself.',
    'sim.desc': "Change scenarios to see your estimated financial picture. We don't like surprises.",
    'sim.revenue': 'Annual Revenue',
    'sim.expenseRatio': 'Expense Ratio (%)',
    'sim.estExpenses': 'Estimated Expenses',
    'sim.taxable': 'Taxable Profit',
    'sim.estTax': 'Estimated Corp / Income Tax',
    'sim.disclaimer': 'This tool is for illustrative purposes only. Professional consultation is required for exact tax calculation.',
    'chaos.t1': 'Chaos enters.',
    'chaos.t2': 'Order emerges.',
    'chaos.items.0': 'INVOICE 0294',
    'chaos.items.1': 'VAT',
    'chaos.items.2': 'PAYROLL',
    'chaos.items.3': 'RECEIPT',
    'process.title': "Accounting can be complex. The process shouldn't be.",
    'process.s1.t': 'Reach out.',
    'process.s1.d': 'Tell us your situation.',
    'process.s2.t': 'Share documents.',
    'process.s2.d': 'We review everything.',
    'process.s3.t': 'Define the plan.',
    'process.s3.d': 'We align the scope, responsibilities, and timeline.',
    'process.s4.t': 'Leave the rest to us.',
    'process.s4.d': 'We set up the system and manage the flow.',
    'stats.clients': 'Clients',
    'stats.returns': 'Returns Filed',
    'stats.years': 'Years',
    'stats.response': 'Response Time',
    'contact.t1': 'Leave the',
    'contact.t2': 'Numbers to Us.',
    'contact.desc': "You focus on your business. We'll organize the numbers.",
    'contact.meet': "Let's meet.",
    'contact.find': 'Find us:',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.help': 'How can we help?',
    'contact.form.submit': 'Send',
    'contact.form.submitting': 'Sending...',
    'contact.form.success': 'Request Received',
    'contact.form.successDesc': 'We will get back to you shortly.',
    'footer.closed': 'Books Closed ✓',
    'calc.vat': 'VAT',
    'calc.entry': 'Entry',
    'calc.total': 'Total',
    'faq.title': 'Frequently Asked Questions',
    'faq.desc': 'Find answers to the most common questions here. If you have a specific situation, feel free to reach out to us.',
    'faq.q1': 'How long does the company setup process take?',
    'faq.a1': 'Once all required documents are provided, your company is typically established within 1-3 business days, ready to issue invoices.',
    'faq.q2': 'When are VAT, Withholding, and Corporate Taxes due?',
    'faq.a2': 'VAT is due on the 28th of each month, Withholding on the 26th, and Corporate Tax quarterly. We track the entire calendar for you.',
    'faq.q3': 'Should I use cloud accounting software?',
    'faq.a3': 'It depends on your business volume. We highly recommend and can integrate simple web-based software to keep your invoices organized.',
    'faq.q4': 'What is included in the advisory fees?',
    'faq.a4': 'Monthly bookkeeping, tax return preparation, tax advisory, and basic financial reporting are all included in our flat monthly fee.'
  }
};

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sayisal_lang');
      if (saved === 'tr' || saved === 'en') {
        return saved as Language;
      }
    }
    return 'tr';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('sayisal_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'tr' ? 'en' : 'tr'));
  };

  const t = (key: string): string => {
    return dictionaries[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};