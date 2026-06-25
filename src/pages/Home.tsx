import { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import HeroSection from '@/components/HeroSection';
import InvitationCard from '@/components/InvitationCard';
import NameCustomizer from '@/components/NameCustomizer';
import MessageWall from '@/components/MessageWall';
import ScheduleTimeline from '@/components/ScheduleTimeline';
import { GraduationCap } from 'lucide-react';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [graduateName, setGraduateName] = useState('');

  const handleEnter = () => {
    setShowIntro(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-paper-texture">
      <ParticleBackground />

      {showIntro && <HeroSection onEnter={handleEnter} />}

      <div
        className={`relative z-10 transition-opacity duration-1000 ${
          showIntro ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <nav className="sticky top-0 z-40 bg-grad-cream/90 backdrop-blur-md border-b border-grad-gold/20">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-grad-gold" />
              <span className="font-serif-cn text-grad-red font-bold">
                毕业典礼
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a
                href="#invitation"
                className="text-grad-brown/70 hover:text-grad-red transition-colors"
              >
                邀请函
              </a>
              <a
                href="#customize"
                className="text-grad-brown/70 hover:text-grad-red transition-colors"
              >
                定制邀请
              </a>
              <a
                href="#schedule"
                className="text-grad-brown/70 hover:text-grad-red transition-colors"
              >
                典礼流程
              </a>
              <a
                href="#messages"
                className="text-grad-brown/70 hover:text-grad-red transition-colors"
              >
                留言墙
              </a>
            </div>
          </div>
        </nav>

        <section id="invitation">
          <InvitationCard graduateName={graduateName} />
        </section>

        <section id="customize">
          <NameCustomizer
            onNameChange={setGraduateName}
            currentName={graduateName}
          />
        </section>

        <section id="schedule">
          <ScheduleTimeline />
        </section>

        <section id="messages">
          <MessageWall />
        </section>

        <footer className="py-12 px-4 text-center border-t border-grad-gold/20">
          <div className="max-w-4xl mx-auto">
            <GraduationCap className="w-10 h-10 text-grad-gold mx-auto mb-4" />
            <p className="font-serif-cn text-grad-red text-xl font-bold mb-2">
              毕业典礼
            </p>
            <p className="font-sans-cn text-grad-brown/60 text-sm mb-4">
              2026 · 毕业季 · 青春不散场
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-grad-gold/50 to-transparent mx-auto" />
            <p className="font-sans-cn text-grad-brown/40 text-xs mt-6">
              © 2026 Graduation Ceremony. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
