import { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Clock, Award } from 'lucide-react';

interface InvitationCardProps {
  graduateName: string;
}

export default function InvitationCard({ graduateName }: InvitationCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center py-20 px-4">
      <div
        className={`relative max-w-2xl w-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-grad-gold via-grad-gold-light to-grad-gold rounded-2xl opacity-50 blur-sm" />
        
        <div className="relative bg-paper-texture rounded-xl p-8 md:p-12 border-2 border-grad-gold/30 shadow-2xl">
          <div className="absolute top-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-grad-gold/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-grad-gold/60 to-transparent" />
          <div className="absolute top-4 bottom-4 left-4 w-px bg-gradient-to-b from-transparent via-grad-gold/60 to-transparent" />
          <div className="absolute top-4 bottom-4 right-4 w-px bg-gradient-to-b from-transparent via-grad-gold/60 to-transparent" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-grad-red/10 mb-4">
              <Award className="w-8 h-8 text-grad-gold" />
            </div>
            <h2 className="font-serif-cn text-3xl md:text-4xl font-bold text-grad-red mb-2">
              毕业典礼邀请函
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-grad-gold to-transparent mx-auto" />
          </div>

          {graduateName && (
            <div className="text-center mb-8 py-6 border-y border-grad-gold/20">
              <p className="font-sans-cn text-grad-brown/70 text-sm mb-2">尊敬的</p>
              <p className="font-serif-cn text-2xl md:text-3xl text-grad-red font-bold">
                {graduateName}
              </p>
              <p className="font-sans-cn text-grad-brown/70 text-sm mt-2">毕业生</p>
            </div>
          )}

          <div className="space-y-6 mb-8">
            <p className="font-sans-cn text-grad-brown leading-relaxed text-center">
              时光荏苒，岁月如歌。经过数载寒窗苦读，
              您即将踏上人生新的征程。我们诚挚邀请您
              出席毕业典礼，共同见证这一荣耀时刻。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-grad-gold/5 rounded-lg border border-grad-gold/20">
                <Calendar className="w-5 h-5 text-grad-gold flex-shrink-0" />
                <div>
                  <p className="text-xs text-grad-brown/60">日期</p>
                  <p className="font-medium text-grad-brown">2026年6月28日</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-grad-gold/5 rounded-lg border border-grad-gold/20">
                <Clock className="w-5 h-5 text-grad-gold flex-shrink-0" />
                <div>
                  <p className="text-xs text-grad-brown/60">时间</p>
                  <p className="font-medium text-grad-brown">上午 9:00 - 12:00</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-grad-gold/5 rounded-lg border border-grad-gold/20 md:col-span-2">
                <MapPin className="w-5 h-5 text-grad-gold flex-shrink-0" />
                <div>
                  <p className="text-xs text-grad-brown/60">地点</p>
                  <p className="font-medium text-grad-brown">学校大礼堂</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block text-grad-gold text-4xl font-serif-cn opacity-30">
              ❖
            </div>
            <p className="font-serif-cn text-grad-brown/60 text-sm mt-2">
              期待您的光临
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
