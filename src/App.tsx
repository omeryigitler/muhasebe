/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AccountingStory } from './components/AccountingStory';
import { Services } from './components/Services';
import { KineticMarquee } from './components/KineticMarquee';
import { Simulator } from './components/Simulator';
import { ChaosToOrder } from './components/ChaosToOrder';
import { Process } from './components/Process';
import { Stats } from './components/Stats';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CustomCursor } from './components/CustomCursor';

const LayoutRefresh = () => {
  const { language } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (cancelled) return;
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    } else {
      refresh();
    }

    return () => {
      cancelled = true;
    };
  }, [language]);

  return null;
};

export default function App() {
  return (
    <LanguageProvider>
      <LayoutRefresh />
      <CustomCursor />
      <div className="w-full min-h-screen bg-deep-ink relative">
        <Header />
        <main id="site-content">
          <Hero />
          <AccountingStory />
          <Services />
          <KineticMarquee />
          <Simulator />
          <ChaosToOrder />
          <Process />
          <Stats />
          <FAQ />
          <Contact />
          <Footer />
          <BackToTop />
        </main>
      </div>
    </LanguageProvider>
  );
}
