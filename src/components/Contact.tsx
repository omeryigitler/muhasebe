import React, { useState } from 'react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';
import { Magnetic } from './Magnetic';

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

  const inputBase = 'w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-3 outline-none transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out font-mono text-white placeholder-white/30 hover:-translate-x-1 focus-visible:-translate-x-1 focus:bg-white/10';
  const nameInput = `${inputBase} hover:border-electric-blue focus-visible:border-electric-blue hover:shadow-[7px_7px_0_#5265FF] focus-visible:shadow-[7px_7px_0_#5265FF]`;
  const emailInput = `${inputBase} hover:border-acid-lime focus-visible:border-acid-lime hover:shadow-[7px_7px_0_#D9FF43] focus-visible:shadow-[7px_7px_0_#D9FF43]`;
  const messageInput = `${inputBase} hover:border-coral focus-visible:border-coral hover:shadow-[7px_7px_0_#FF6654] focus-visible:shadow-[7px_7px_0_#FF6654] resize-none`;

  return (
    <section id="contact" className="bg-deep-ink text-warm-paper py-20 md:py-32 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16 md:mb-28 text-center relative z-10">
        <h2 className="text-5xl md:text-[8rem] leading-[0.88] font-display mb-6 md:mb-8 tracking-tight">
          {t('contact.t1')}<br />
          <span className="text-acid-lime">{t('contact.t2')}</span>
        </h2>
        <p className="text-base md:text-3xl opacity-80 font-mono">
          {t('contact.desc')}
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-20 relative z-10">
        <div>
          <h3 className="text-2xl md:text-3xl font-display mb-6 md:mb-8">{t('contact.meet')}</h3>
          <div className="space-y-5 md:space-y-6 font-mono text-sm md:text-lg text-white/70">
            <p>
              Email:<br />
              <a href={`mailto:${APP_CONFIG.email}`} className="text-electric-blue hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
                {APP_CONFIG.email}
              </a>
            </p>
            <p>{t('contact.find')}<br />{APP_CONFIG.location}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6" aria-describedby="contact-form-note">
          <div>
            <label htmlFor="contact-name" className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.name')}</label>
            <input id="contact-name" required type="text" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className={nameInput} />
          </div>
          <div>
            <label htmlFor="contact-email" className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.email')}</label>
            <input id="contact-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className={emailInput} />
          </div>
          <div>
            <label htmlFor="contact-message" className="block font-mono text-xs opacity-60 mb-2 uppercase">{t('contact.form.help')}</label>
            <textarea id="contact-message" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} className={messageInput} />
          </div>

          <Magnetic className="block w-full" strength={0.32} radius={88} maxOffset={18}>
            <button
              type="submit"
              className="w-full bg-electric-blue text-white py-4 rounded-xl font-bold border-2 border-transparent transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out uppercase tracking-widest mt-4 hover:-translate-x-1 hover:-translate-y-1 hover:border-[#FF90E8] hover:shadow-[7px_7px_0_#FF90E8] focus-visible:-translate-x-1 focus-visible:-translate-y-1 focus-visible:border-[#FF90E8] focus-visible:shadow-[7px_7px_0_#FF90E8] active:translate-x-0 active:translate-y-[2px] active:shadow-[3px_3px_0_#FF90E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF90E8] focus-visible:ring-offset-4 focus-visible:ring-offset-deep-ink"
            >
              {copy.submit}
            </button>
          </Magnetic>
          <p id="contact-form-note" className="font-mono text-[10px] leading-relaxed text-white/35">
            {copy.note}
          </p>
        </form>
      </div>
    </section>
  );
};
