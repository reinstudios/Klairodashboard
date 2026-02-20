import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import logos with new assets
import tiktokAdsLogo from 'figma:asset/266bfd97bcaec9d45964864f947a4e2d257dc483.png';
import appleLogo from 'figma:asset/9cd59f243cfde8d0c984f60682e8ea7ff061172d.png';
import googleAdsLogo from 'figma:asset/064496ec95abfa6c46f97d5a2143a881742e1419.png';
import klaviyoLogo from 'figma:asset/847d22593cd53834f4d6fbb668a666948ba18312.png';
import shopifyLogo from 'figma:asset/72dc7c3cedb6bee4f8612b02bb8fb24aecf9d4f9.png';
import metaLogo from 'figma:asset/376db47e4203e2259c0a7cf20f1b55d7b6b5285c.png';

const Logo = ({ src, alt, className }: { src: string, alt: string, className?: string }) => (
  <div 
    className={`flex items-center justify-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 mx-6 md:mx-8 shrink-0 ${className}`}
    title={alt}
  >
    <ImageWithFallback 
      src={src} 
      alt={alt} 
      // Increased height from h-8 to h-10/h-12 and max-width for larger appearance
      className="h-10 md:h-12 w-auto object-contain max-w-[140px]" 
    />
  </div>
);

export const LogoTicker = () => {
  const logos = [
    { id: 'tiktok', src: tiktokAdsLogo, alt: 'TikTok Ads' },
    { id: 'apple', src: appleLogo, alt: 'Apple' },
    { id: 'google', src: googleAdsLogo, alt: 'Google Ads' },
    { id: 'klaviyo', src: klaviyoLogo, alt: 'Klaviyo' },
    { id: 'shopify', src: shopifyLogo, alt: 'Shopify' },
    { id: 'meta', src: metaLogo, alt: 'Meta' },
  ];

  return (
    <section className="w-full py-16 overflow-hidden bg-[#F9F8F4] border-b border-transparent relative select-none">
      <div className="flex max-w-full">
        <motion.div 
          className="flex flex-nowrap items-center"
          animate={{ x: "-33.333%" }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 40
          }}
          style={{ width: "fit-content" }}
        >
          {/* Create 3 sets of logos to ensure coverage and smooth loop */}
          {[1, 2, 3].map((setIndex) => (
            <div key={setIndex} className="flex items-center pr-6 md:pr-8">
              {logos.map((logo) => (
                <Logo key={`${setIndex}-${logo.id}`} src={logo.src} alt={logo.alt} />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Fade Gradients */}
      <div className="absolute top-0 left-0 h-full w-24 md:w-32 bg-gradient-to-r from-[#F9F8F4] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 h-full w-24 md:w-32 bg-gradient-to-l from-[#F9F8F4] to-transparent pointer-events-none z-10" />
    </section>
  );
};
