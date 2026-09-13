import React from 'react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-deep-ink text-warm-paper py-8 px-4 border-t border-white/10 text-center md:text-left overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-display font-bold text-xl flex-1">
          {APP_CONFIG.companyName}.
        </div>

        <div className="flex-1 flex justify-center">
          <a
            href={`mailto:${APP_CONFIG.email}`}
            className="font-mono text-xs md:text-sm text-white/55 hover:text-acid-lime transition-colors underline underline-offset-4 decoration-white/15"
          >
            {APP_CONFIG.email}
          </a>
        </div>

        <div className="font-mono text-xs opacity-50 flex gap-4 uppercase tracking-wider flex-1 justify-end">
          <span>&copy; {new Date().getFullYear()} {APP_CONFIG.companyName}.</span>
          <span className="hidden md:inline">{t('footer.closed')}</span>
        </div>
      </div>
    </footer>
  );
};
