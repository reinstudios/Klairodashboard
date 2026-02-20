import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import brainImage from 'figma:asset/49415f1a9191cc6bbf67abe61ee23a764f52f7d3.png';

export const BrainFooter = () => {
  return (
    <section className="py-24 px-4 overflow-hidden relative">
      <div className="max-w-4xl mx-auto text-center mb-8 relative z-10">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-[#888888] uppercase mb-4">
          The Connected Brain
          <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5]"></span>
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] mb-6 leading-[1.1] text-balance">
          You shouldn't need a data team to <br className="hidden md:block" /> know how your business is doing.
        </h2>
        <p className="text-lg text-[#666666] max-w-2xl mx-auto">
          Connect your stack. Ask any question, Klairo does the rest.
        </p>
      </div>

      {/* Diagram Area */}
      <div className="relative w-full max-w-[1400px] mx-auto flex items-center justify-center">
        <div className="w-full px-2">
           <ImageWithFallback 
              src={brainImage}
              alt="Klairo Connected Brain Diagram"
              className="w-full h-auto object-contain"
           />
        </div>
      </div>
    </section>
  );
};
