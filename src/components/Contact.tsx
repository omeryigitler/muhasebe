import React, { useState } from 'react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';

export const Contact = () => {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const copy = language === 'tr'
    ? {
        submit: 'E-posta Oluştur',
        note: 'Bu demo form veri göndermiyor. Gönder butonu varsayılan e-posta uygulamanızı açar.',
      }
    : {
        submit: 'Create Email',
        note: 'This demo form does not submit data. The button opens your default email app.',
      };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = language === 'tr'
      ? `${APP_CONFIG.companyName} web sitesi iletişim talebi — ${name}`
      : `${APP_CONFIG.companyName} website enquiry — ${name}`;
    const body = language === 'tr'
      ? `İsim: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`
      : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    window.location.href = `mailto:${APP_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const inputClass = 'w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 outline-none focus-visible:border-acid-lime focus-visible:ring-2 focus-visible:ring-acid-lime/30 focus:bg-white/10 transition-all duration-300 font-mono text-white placeholder-white/30';

  return (
    <section id="contact" className="bg-deep-ink text-warm-paper py-32 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-28 text-center relative z-10">
        <h2 className="text-6xl md:text-[8rem] leading-[0.88] font-display mb-8 tracking-tight">
          {t('contact.t1')}<br />
          <span className="text-acid-lime">{t('contact.t2')}</span>
        </h2>
        <p className="text-xl md:text-3xl opacity-80 font-mono">
          {t('contact.desc')}
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 md:gap-20 relative z-10">
        <div>
          <h3 className="text-3xl font-display mb-8">{t('contact.meet')}</h3>
          <div className="space-y-6 font-mono text-base md:text-lg text-white/70">
            <p>
              Email:<br />
              <a href={`mailto:${APP_CONFIG.email}`} className="text-electric-blue hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
                {APP_CONFIG.email}
              </a>
            </p>
            <p>{t('contact.find')}<br />{APP_CONFIG.location}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" aria-describedby="contact-form-note">
          <div>
            <label htmlFor="contact-name" className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.name')}</label>
            <input id="contact-name" required type="text" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact-email" className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.email')}</label>
            <input id="contact-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact-message" className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.help')}</label>
            <textarea id="contact-message" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} className={`${inputClass} resize-none`} />
          </div>

          <button
            type="submit"
            className="w-full bg-electric-blue text-white py-4 rounded-xl font-bold border-2 border-acid-lime/70 shadow-[0_6px_0_#D9FF43] hover:-translate-y-1 hover:bg-[#6170ff] hover:border-coral hover:shadow-[0_8px_0_#FF6654] active:translate-y-[3px] active:shadow-[0_3px_0_#D9FF43] transition-all duration-300 uppercase tracking-widest mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid-lime focus-visible:ring-offset-4 focus-visible:ring-offset-deep-ink"
          >
            {copy.submit}
          </button>
          <p id="contact-form-note" className="font-mono text-[10px] leading-relaxed text-white/35">
            {copy.note}
          </p>
        </form>
      </div>
    </section>
  );
};
