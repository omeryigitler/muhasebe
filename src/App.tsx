/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
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
import { LanguageProvider } from './context/LanguageContext';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  return (
    <LanguageProvider>
      <CustomCursor />
      <div className="w-full min-h-screen bg-deep-ink relative">
        <Header />
        <Hero />
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
      </div>
    </LanguageProvider>
  );
}
