import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface HeroSectionProps {
  onEnter: () => void;
}

export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [phase, setPhase] = useState(0);
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setShowEnter(true), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-paper-texture flex flex-col items-center justify-center overflow-hidden">
      <div
        className={`absolute top-20 transition-all duration-1000 ${
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <GraduationCap size={80} className="text-grad-gold" />
      </div>

      <div className="text-center px-4">
        <h1
          className={`font-serif-cn text-4xl md:text-6xl lg:text-7xl font-bold text-grad-red mb-6 transition-all duration-1000 ${
            phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <span className="text-gradient-gold">毕业典礼</span>
        </h1>

        <h2
          className={`font-serif-cn text-2xl md:text-4xl font-semibold text-grad-brown mb-8 transition-all duration-1000 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          邀请函
        </h2>

        <div
          className={`w-32 h-0.5 bg-gradient-to-r from-transparent via-grad-gold to-transparent mx-auto mb-8 transition-all duration-1000 ${
            phase >= 2 ? 'opacity-100 w-48' : 'opacity-0 w-0'
          }`}
          style={{ transitionDelay: '0.6s' }}
        />

        <p
          className={`font-sans-cn text-lg md:text-xl text-grad-brown/80 mb-4 transition-all duration-1000 ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          诚邀您共同见证这一荣耀时刻
        </p>

        <p
          className={`font-serif-cn text-base md:text-lg text-grad-gold font-medium mb-12 transition-all duration-1000 ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1s' }}
        >
          2026 · 毕业季
        </p>

        <button
          onClick={onEnter}
          className={`relative px-10 py-4 font-serif-cn text-lg md:text-xl text-grad-red bg-gradient-to-r from-grad-gold-light to-grad-gold rounded-full overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-grad-gold/30 ${
            showEnter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="relative z-10 font-medium">开启邀请函</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>

      <div
        className={`absolute bottom-8 flex flex-col items-center transition-all duration-1000 ${
          showEnter ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1.2s' }}
      >
        <p className="text-grad-brown/60 text-sm mb-2">向下滚动</p>
        <div className="w-6 h-10 border-2 border-grad-gold/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-grad-gold rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
