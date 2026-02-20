import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp, ArrowRight, Package, Check, Loader2, Send, FileText, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import logos
import tiktokAdsLogo from 'figma:asset/266bfd97bcaec9d45964864f947a4e2d257dc483.png';
import googleAdsLogo from 'figma:asset/064496ec95abfa6c46f97d5a2143a881742e1419.png';
import klaviyoLogo from 'figma:asset/847d22593cd53834f4d6fbb668a666948ba18312.png';
import shopifyLogo from 'figma:asset/72dc7c3cedb6bee4f8612b02bb8fb24aecf9d4f9.png';
import metaLogo from 'figma:asset/376db47e4203e2259c0a7cf20f1b55d7b6b5285c.png';

const Typewriter = ({ text, speed = 30, onComplete, className }: { text: string, speed?: number, onComplete?: () => void, className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText(''); 
    let index = 0;
    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        if (onCompleteRef.current) onCompleteRef.current();
        return;
      }
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayedText}</span>;
};

// Loading Logos Component
const ConnectingLogos = ({ onComplete }: { onComplete: () => void }) => {
  const logos = [shopifyLogo, metaLogo, googleAdsLogo, klaviyoLogo, tiktokAdsLogo];
  const [activeIdx, setActiveIdx] = useState(-1);
  const onCompleteRef = useRef(onComplete);
  const hasRunRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    let current = 0;
    // Iterate through logos
    const interval = setInterval(() => {
      setActiveIdx(current);
      current++;
      if (current > logos.length) {
        clearInterval(interval);
        if (onCompleteRef.current) setTimeout(onCompleteRef.current, 500);
      }
    }, 400); 
    
    return () => clearInterval(interval);
  }, []); // Run only once on mount

  return (
    null
  );
};

// Action Card Component
const ActionCard = ({ 
  logo, 
  platform, 
  title, 
  subtitle,
  desc, 
}: { 
  logo: string | React.ReactNode, 
  platform: string, 
  title: string, 
  subtitle: string,
  desc: string, 
}) => {
  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all h-full min-h-[260px]">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
              {typeof logo === 'string' ? (
                <ImageWithFallback src={logo} alt={platform} className="w-3 h-3 object-contain" />
              ) : (
                logo
              )}
          </div>
          <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">{platform}</span>
        </div>
        
        <div className="mb-2">
            <h4 className="font-serif font-bold text-sm text-[#1C1C1C] leading-tight mb-1">
            {title}
            </h4>
            <p className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-wide">{subtitle}</p>
        </div>
        
        <p className="text-[11px] text-[#555555] leading-relaxed mb-4">
          {desc}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-gray-50">
        <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-medium text-[#1C1C1C] transition-colors">
                <FileText size={10} /> Review
            </button>
            <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-medium text-[#1C1C1C] transition-colors">
                <Send size={10} /> Send
            </button>
        </div>
        <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-[#1C1C1C] hover:bg-black text-white rounded text-[10px] font-bold transition-colors w-full">
            <Play size={8} className="fill-current" /> Do It
        </button>
      </div>
    </div>
  );
};

export const Hero = () => {
  const [step, setStep] = useState<'idle' | 'typing_user' | 'connecting' | 'showing_data' | 'processing' | 'done' | 'showing_cards'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sequence Controller
    const runSequence = async () => {
      await new Promise(r => setTimeout(r, 800));
      setStep('typing_user');
    };

    runSequence();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        // Smooth scroll to bottom when step changes
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    }
  }, [step]);

  const handleUserTypingComplete = useCallback(() => {
    setStep('connecting');
  }, []);
  
  const handleConnectingComplete = useCallback(() => {
    // Wait a bit after connecting before showing data
    setTimeout(() => {
      setStep('showing_data');
      
      // Auto-advance to processing
      setTimeout(() => {
        setStep('processing');
        
        // Auto-advance to done
        setTimeout(() => {
          setStep('done');
          
          // Auto-advance to showing cards
          setTimeout(() => {
            setStep('showing_cards');
          }, 800); 
          
        }, 1500); 
        
      }, 3000); // Increased reading time
      
    }, 500);
  }, []);

  return (
    <section className="relative pt-24 pb-16 px-4 md:pt-32 flex flex-col items-center text-center max-w-[90rem] mx-auto min-h-screen">
      
      {/* Headlines */}
      <h1 className="font-serif leading-[1.1] mb-6 text-[#1C1C1C] max-w-4xl tracking-tight text-[32px]">
        Finally, your business has a brain.
      </h1>

      <p className="font-sans text-[#555555] text-base md:text-lg max-w-xl mb-12 leading-relaxed">
        Klairo connects your tools, makes sense of the data, and takes action to grow your business.
      </p>

      {/* Main Chat Interface - Fixed Height */}
      <div className="w-full max-w-6xl h-[650px] bg-white rounded-3xl border border-[#E5E5E5] overflow-hidden flex flex-col relative z-10 text-left">
        
        {/* Connection Status Indicators - Absolute Positioned */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 pointer-events-none">
             {step === 'idle' || step === 'typing_user' ? (
                <div className="flex gap-4 items-center grayscale opacity-30">
                   {[shopifyLogo, metaLogo, googleAdsLogo, klaviyoLogo, tiktokAdsLogo].map((l, i) => (
                      <div key={i} className="w-6 h-6 flex items-center justify-center">
                         <ImageWithFallback src={l} alt="logo" className="w-3.5 h-3.5 object-contain" />
                      </div>
                   ))}
                </div>
             ) : (
                <ConnectingLogos onComplete={handleConnectingComplete} />
             )}
        </div>

        {/* Chat Content - Scrollable */}
        <div className="flex-1 bg-white p-6 md:p-8 space-y-8 overflow-y-auto scroll-smooth pt-20">
           
           {/* User Message */}
           <div className="flex justify-end relative z-10">
             <div className="bg-[#1C1C1C] text-white px-5 py-3 rounded-2xl rounded-tr-sm text-sm font-medium shadow-sm">
                {step === 'idle' ? (
                  <span className="opacity-0">How were sales yesterday?</span>
                ) : step === 'typing_user' ? (
                   <Typewriter text="How were sales yesterday?" speed={40} onComplete={handleUserTypingComplete} />
                ) : (
                  "How were sales yesterday?"
                )}
             </div>
           </div>

           {/* AI Response Area */}
           <div className="space-y-6 pb-4">
              <AnimatePresence>
                 {(step === 'showing_data' || step === 'processing' || step === 'done' || step === 'showing_cards') && (
                    <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="bg-[#F9F8F4] rounded-2xl overflow-hidden border border-[#F0F0F0]"
                    >
                       {/* Top Section */}
                       <div className="p-6 md:p-8 bg-[#FDFBF7]">
                          <h2 className="font-serif font-bold text-[#1C1C1C] mb-3 text-[20px]">
                             $14,200 — up 22% vs. last Tuesday
                          </h2>
                          <p className="text-sm text-[#555555] leading-relaxed max-w-3xl">
                             Your Meta campaign 'Summer UGC — Hook 3' is outperforming every other ad set by 120% with a 4.2x ROAS. The Klaviyo welcome flow converted at an exceptional 8.2% which is double the norm, and Google brand search lifted significantly from a podcast mention last week.
                          </p>
                       </div>

                       {/* Stats Grid */}
                       <div className="grid grid-cols-4 border-t border-[#F0F0F0] bg-white">
                          {[
                             { label: 'Revenue', val: '$14,200', sub: null },
                             { label: 'ROAS', val: '4.2x', sub: 'on winning campaign' },
                             { label: 'MER', val: '3.7x', sub: null },
                             { label: 'Conv. Rate', val: '4.1%', sub: null },
                          ].map((s, i) => (
                             <div key={i} className={`p-5 text-center ${i !== 3 ? 'border-r border-[#F0F0F0]' : ''}`}>
                                <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wide mb-1">{s.label}</div>
                                <div className="text-xl font-bold text-[#1C1C1C]">{s.val}</div>
                                {s.sub && <div className="text-[9px] text-[#888888] mt-1">{s.sub}</div>}
                             </div>
                          ))}
                       </div>

                       {/* Action Bar */}
                       <div className="bg-[#D1E9FF]/30 p-4 border-t border-[#D1E9FF]/50 flex items-center justify-between gap-4">
                          <AnimatePresence mode="wait">
                             {step === 'showing_data' && (
                                <motion.div 
                                   key="proposal"
                                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                   className="flex items-center justify-between w-full"
                                >
                                   <span className="text-xs md:text-sm font-medium text-[#1C4E80]">
                                      Scale 'Summer UGC — Hook 3' — increase daily budget from $200 to $500 while ROAS holds above 3.5x
                                   </span>
                                   <div className="bg-[#1C1C1C] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1 opacity-50 shrink-0">
                                      Do it <ArrowRight size={12} />
                                   </div>
                                </motion.div>
                             )}

                             {step === 'processing' && (
                                <motion.div 
                                   key="processing"
                                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                   className="flex items-center gap-3 w-full"
                                >
                                   <Loader2 className="animate-spin text-[#5D9DF5]" size={18} />
                                   <span className="text-xs md:text-sm font-medium text-[#1C4E80]">
                                      Updating Meta Ads Manager budget...
                                   </span>
                                </motion.div>
                             )}

                             {(step === 'done' || step === 'showing_cards') && (
                                <motion.div 
                                   key="done"
                                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                   className="flex items-center gap-2 w-full"
                                >
                                   <div className="w-5 h-5 rounded-full bg-[#2E7D32] flex items-center justify-center text-white shrink-0">
                                      <Check size={12} strokeWidth={3} />
                                   </div>
                                   <span className="text-xs md:text-sm font-bold text-[#1C1C1C]">
                                      Done. Budget updated to $500/day.
                                   </span>
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
              
              {/* Follow-up Cards - "The Ripples" - Responsive Grid/Swipe Layout */}
              <AnimatePresence>
                 {step === 'showing_cards' && (
                    <motion.div
                       initial="hidden"
                       animate="visible"
                       variants={{
                          hidden: { opacity: 0 },
                          visible: {
                             opacity: 1,
                             transition: {
                                staggerChildren: 0.2
                             }
                          }
                       }}
                       className="space-y-4"
                    >
                       <motion.div 
                          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                          className="flex items-center gap-2 px-1"
                       >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5]"></div>
                          <span className="text-xs font-bold text-[#888888] uppercase tracking-widest">Also recommended based on this spike</span>
                       </motion.div>

                       <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:pb-0 md:overflow-visible scrollbar-hide">
                             
                          <motion.div 
                            className="min-w-[280px] w-[85%] snap-center md:w-auto md:min-w-0"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
                            <ActionCard 
                              logo={metaLogo}
                              platform="Meta Ads"
                              title="Creative Fatigue Alert"
                              subtitle='"Hook 3" is fatiguing'
                              desc="Your top performer 'Summer UGC — Hook 3' is losing attention. I've drafted 2 new hooks using the same UGC footage matched to your brand voice."
                            />
                          </motion.div>

                          <motion.div 
                            className="min-w-[280px] w-[85%] snap-center md:w-auto md:min-w-0"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
                            <ActionCard 
                              logo={tiktokAdsLogo}
                              platform="TikTok Shop"
                              title="TikTok Shop Alert"
                              subtitle="Trending product detected"
                              desc='"Blue Crewneck" got picked up by 3 affiliate creators overnight — 84 orders in 12 hours, no ad spend. Conversion rate is 8.4%.'
                            />
                          </motion.div>

                          <motion.div 
                            className="min-w-[280px] w-[85%] snap-center md:w-auto md:min-w-0"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
                            <ActionCard 
                              logo={klaviyoLogo}
                              platform="Klaviyo"
                              title="Flow Opportunity"
                              subtitle="340 new subscribers"
                              desc="Your welcome flow is only 3 emails. Brands with similar traffic spikes convert 2x better with a 5-email sequence. Emails 4 & 5 drafted."
                            />
                          </motion.div>

                          <motion.div 
                            className="min-w-[280px] w-[85%] snap-center md:w-auto md:min-w-0"
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}>
                            <ActionCard 
                              logo={<Package size={14} className="text-[#1C1C1C]" />}
                              platform="ShipBob"
                              title="Inventory Alert"
                              subtitle="Stock out in 6 days"
                              desc="Selling 3x forecast since the TikTok spike. Draft PO ready. If you approve today, restock arrives with 2 days of buffer."
                            />
                          </motion.div>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
              
              {/* Ref for auto-scrolling */}
              <div ref={scrollRef} />
           </div>
        </div>
      </div>

      <Link
        to="/onboarding"
        className="inline-flex items-center gap-2 bg-[#1C1C1C] text-white px-7 py-3 rounded-full font-medium text-sm hover:bg-black hover:scale-105 transition-all duration-200 mt-12"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        Get started <ArrowRight size={14} />
      </Link>
    </section>
  );
};