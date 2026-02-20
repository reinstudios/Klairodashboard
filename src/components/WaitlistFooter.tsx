import React from 'react';
import { ArrowRight, Twitter, Linkedin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import dogImage from 'figma:asset/4a5417c0ffb6c4ba5dd33e58e795aa54003aed52.png';

export const WaitlistFooter = () => {
  return (
    <footer className="pt-24 pb-8 px-4 border-t border-gray-100/50">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Main CTA */}
        <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] mb-4 leading-tight">
          Ready to ask your business anything?
        </h2>
        <p className="text-[#555555] text-lg mb-8">
          Join the waitlist. Be first to connect.
        </p>

        {/* Form */}
        <div className="w-full max-w-md relative mb-3">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full bg-white rounded-full py-3.5 pl-6 pr-44 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5D9DF5] shadow-sm"
          />
          <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#1C1C1C] text-white rounded-full px-5 text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
            Join the Waitlist <ArrowRight size={14} />
          </button>
        </div>
        
        <p className="text-xs text-[#888888] mb-12">
          Free early access · No credit card required.
        </p>

        {/* Illustration */}
        <div className="w-52 md:w-64 mb-8">
           <ImageWithFallback 
             src={dogImage}
             alt="Klairo Companion Dog"
             className="w-full h-auto object-contain"
           />
        </div>

        {/* Footer Bottom Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200">
          
          {/* Logo */}
          <div className="font-serif text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Klairo
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-[#666666]">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#1C1C1C] hover:text-[#5D9DF5] transition-colors">
              {/* Custom X Icon or fallback to Twitter */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="text-[#1C1C1C] hover:text-[#5D9DF5] transition-colors">
              <Linkedin size={20} fill="currentColor" strokeWidth={0} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
