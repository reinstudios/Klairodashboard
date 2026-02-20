import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import hourglassImg from 'figma:asset/c400c796329d2aba49273de795843ba865559b23.png';
import lightbulbImg from 'figma:asset/ae652316db1ab4009fba3b0dac560b5f4cf7e651.png';
import paperPlaneImg from 'figma:asset/159d46d326f91449b619ffc631dafc15bafe9f55.png';

export const ValueCards = () => {
  const cards = [
    {
      title: "A 10-second question shouldn't take 20 minutes.",
      desc: "Instantly access data and insights without waiting for reports or analysts. Get answers when you need them.",
      img: hourglassImg
    },
    {
      title: "Know what to do, not just what happened.",
      desc: "Go beyond historical data to receive actionable recommendations and proactive guidance for growth.",
      img: lightbulbImg
    },
    {
      title: "Move faster than everyone else.",
      desc: "Accelerate decision-making and execution to stay ahead of the competition and seize opportunities quickly.",
      img: paperPlaneImg
    }
  ];

  return (
    <section className="py-24 px-4 bg-[#F9F8F4]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-[#888888] uppercase mb-4">
            Why Klairo
            <span className="w-1.5 h-1.5 rounded-full bg-[#5D9DF5]"></span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-[#1C1C1C] max-w-3xl mx-auto leading-[1.1] text-balance">
            Your business can now move at the speed of AI.
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300">
              <div className="h-48 w-full flex items-center justify-center mb-6 overflow-hidden rounded-lg">
                <ImageWithFallback 
                  src={card.img} 
                  alt={card.title}
                  className="h-full object-contain mix-blend-multiply opacity-90"
                />
              </div>
              <h3 className="font-bold text-xl text-[#1C1C1C] mb-4 leading-snug p-[0px]">
                {card.title}
              </h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
