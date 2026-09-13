export type AppLanguage = 'tr' | 'en';

export const FINANCE_LOCALES = {
  tr: {
    symbol: '₺',
    code: 'TRY',
    locale: 'tr-TR',
  },
  en: {
    symbol: '€',
    code: 'EUR',
    locale: 'en-IE',
  },
} as const;

export const getFinanceLocale = (language: AppLanguage) => FINANCE_LOCALES[language];

export const APP_CONFIG = {
  companyName: 'Sayısal',
  tagline: 'Muhasebe, Ama Biraz Daha Canlı.',
  email: 'hello@sayisal.co',
  location: 'İstanbul, TR',
  vatRate: 20,
  taxScenarioRate: 20,
  simulator: {
    minRevenue: 10000,
    maxRevenue: 500000,
    revenueStep: 5000,
    minExpenseRatio: 10,
    maxExpenseRatio: 80,
    expenseStep: 5,
    minScenarioRate: 5,
    maxScenarioRate: 40,
    scenarioRateStep: 1,
  },
  socialLinks: {
    whatsapp: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  },
};