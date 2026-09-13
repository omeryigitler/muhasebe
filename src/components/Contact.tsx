import React, { useState } from 'react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';

export const Contact = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <section id="contact" className="bg-deep-ink text-warm-paper py-32 px-4 relative overflow-hidden">
      
      {/* Final CTA Text */}
      <div className="max-w-7xl mx-auto mb-32 text-center relative z-10">
        <h2 className="text-6xl md:text-[8rem] leading-[0.9] font-display mb-8">
          {t('contact.t1')}<br/>
          <span className="text-acid-lime">{t('contact.t2')}</span>
        </h2>
        <p className="text-xl md:text-3xl opacity-80 font-mono">
          {t('contact.desc')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        
        <div>
          <h3 className="text-3xl font-display mb-8">{t('contact.meet')}</h3>
          <div className="space-y-6 font-mono text-lg opacity-80">
            <p>Email: <br/><a href={`mailto:${APP_CONFIG.email}`} className="text-electric-blue hover:text-white transition-colors">{APP_CONFIG.email}</a></p>
            <p>{t('contact.find')} <br/>İstanbul, TR</p>
          </div>
        </div>

        <div>
          {status === 'success' ? (
            <div className="bg-[#1A1C21] p-8 rounded-2xl border border-white/10 font-mono flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-acid-lime text-4xl">✓</div>
              <p className="text-xl uppercase tracking-widest">{t('contact.form.success')}</p>
              <p className="opacity-50 text-sm">{t('contact.form.successDesc')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.name')}</label>
                <input required type="text" className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 outline-none focus:border-acid-lime focus:bg-white/10 transition-all duration-300 font-mono text-white placeholder-white/30" />
              </div>
              <div>
                <label className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.email')}</label>
                <input required type="email" className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 outline-none focus:border-acid-lime focus:bg-white/10 transition-all duration-300 font-mono text-white placeholder-white/30" />
              </div>
              <div>
                <label className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.help')}</label>
                <textarea required rows={4} className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 outline-none focus:border-acid-lime focus:bg-white/10 transition-all duration-300 font-mono resize-none text-white placeholder-white/30"></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-electric-blue text-white py-4 rounded-xl font-bold hover:-translate-y-1 hover:shadow-[4px_4px_0px_#D9FF43] border-2 border-transparent hover:border-acid-lime transition-all duration-300 disabled:opacity-50 uppercase tracking-widest mt-4"
              >
                {status === 'submitting' ? t('contact.form.submitting') : t('contact.form.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
