import React, { useEffect, useState } from 'react';
import { DesktopHero } from './DesktopHero';
import { MobileHero } from './MobileHero';

const MOBILE_QUERY = '(max-width: 1023px)';

export const Hero = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return isMobile ? <MobileHero /> : <DesktopHero />;
};
