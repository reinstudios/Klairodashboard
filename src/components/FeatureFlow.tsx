import React, { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import unifiedPlatformImg from 'figma:asset/7138fe525ffc7f9b3ea178bbfe10556743c122bc.png';
// "Image 2" for Chat directly with your business (hand holding phone)
import chatDirectlyImg from 'figma:asset/dcc43a28f76866125cfd3c68e60e06bbe26d75b0.png';
// "Image 1" for Marketing insights to inventory (K logo with icons)
import marketingInsightsImg from 'figma:asset/a5216bec8fa950d04d9c90a8e695e12a84df9771.png';

export const FeatureFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const features = [
    {
      id: 0,
      title: "One unified platform",
      description: "Shopify, Meta, Google Ads, Klaviyo, TikTok, ShipBob — connected in clicks, synced automatically, reconciled daily.",
      image: unifiedPlatformImg
    },
    {
      id: 1,
      title: "Chat directly with your business",
      description: "Ask anything about your business in plain English. From 'How are sales today?' to 'Why is ROAS dropping?', Klairo gives you instant answers.",
      image: chatDirectlyImg
    },
    {
      id: 2,
      title: "From marketing insights to inventory questions",
      description: "Don't just see the data—act on it. Get proactive alerts on inventory levels, ad performance, and customer trends before they become problems.",
      image: marketingInsightsImg
    }
  ];

  const DURATION = 5000; // 5 seconds per step
  const UPDATE_INTERVAL = 50; // Update progress every 50ms

  useEffect(() => {
    const startTime = Date.now();
    
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / DURATION) * 100, 100);
      
      setProgress(newProgress);

      if (elapsed < DURATION) {
        intervalRef.current = setTimeout(tick, UPDATE_INTERVAL);
      } else {
        // Move to next step
        setActiveStep((prev) => (prev + 1) % features.length);
        // Reset for next step effect
      }
    };

    intervalRef.current = setTimeout(tick, UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [activeStep, features.length]); 

  // Handle manual click
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
    // Clear existing timeout to restart the timer
    if (intervalRef.current) clearTimeout(intervalRef.current);
  };

  return (
    <section className="py-12 md:py-24 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Left: Illustration - changes based on active step */}
        <div className="sticky top-24 z-10">
          <div className="relative bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center h-[250px] md:h-[550px] w-full overflow-hidden transition-all duration-300">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full p-4 md:p-8 flex items-center justify-center"
                >
                   <ImageWithFallback 
                      src={features[activeStep].image}
                      alt={features[activeStep].title}
                      className="w-full h-full object-contain opacity-90 mix-blend-multiply"
                   />
                </motion.div>
             </AnimatePresence>
             
             {/* Subtle overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 pointer-events-none"></div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col space-y-6 md:space-y-8 pt-2">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#888888] uppercase">
            One Platform
            <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5]"></span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] leading-tight text-balance">
            Everything flows <br className="hidden md:block" /> into Klairo.
          </h2>

          <p className="text-lg text-[#555555] max-w-md">
            Connect once. Ask anything. Every tool, every team, one source of truth.
          </p>

          <div className="flex flex-col relative pl-6">
            {/* Continuous background line */}
            <div className="absolute left-[0px] top-4 bottom-4 w-0.5 bg-[#E5E5E5]"></div>
            
            {features.map((feature, index) => {
              const isActive = index === activeStep;
              
              return (
                <div 
                  key={feature.id} 
                  className="relative pb-8 cursor-pointer group"
                  onClick={() => handleStepClick(index)}
                >
                   {/* Progress Line for this segment */}
                   {/* We position it absolutely to the left to overlay the background line */}
                   <div className="absolute left-[-24px] top-0 bottom-0 w-0.5 overflow-hidden">
                      {isActive && (
                        <motion.div 
                          className="w-full bg-[#1C1C1C]"
                          initial={{ height: "0%" }}
                          animate={{ height: `${progress}%` }}
                          transition={{ ease: "linear", duration: 0 }}
                          style={{ height: `${progress}%` }}
                        />
                      )}
                      {/* If past step, show full line */}
                      {index < activeStep && (
                         <div className="w-full h-full bg-[#1C1C1C]"></div>
                      )}
                   </div>

                   <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}>
                      <h4 className="font-bold text-[#1C1C1C] text-lg mb-2">{feature.title}</h4>
                      
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                             <p className="text-[#666666] leading-relaxed text-sm pb-2">
                               {feature.description}
                             </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
