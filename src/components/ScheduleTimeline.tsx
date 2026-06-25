import { useEffect, useRef, useState } from 'react';
import { Calendar, Music, Award, Camera, Coffee, Users } from 'lucide-react';

const SCHEDULE = [
  {
    time: '08:30 - 09:00',
    title: '签到入场',
    description: '毕业生及来宾签到入场，领取毕业纪念册',
    icon: Users,
  },
  {
    time: '09:00 - 09:30',
    title: '开场仪式',
    description: '奏国歌、介绍出席领导及嘉宾',
    icon: Music,
  },
  {
    time: '09:30 - 10:00',
    title: '校长致辞',
    description: '校长发表毕业寄语，送上美好祝愿',
    icon: Calendar,
  },
  {
    time: '10:00 - 10:30',
    title: '学位授予',
    description: '拨穗仪式，颁发毕业证书和学位证书',
    icon: Award,
  },
  {
    time: '10:30 - 11:00',
    title: '茶歇交流',
    description: '休息交流，合影留念',
    icon: Coffee,
  },
  {
    time: '11:00 - 12:00',
    title: '毕业合影',
    description: '全体毕业生大合影，自由拍照留念',
    icon: Camera,
  },
];

export default function ScheduleTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          SCHEDULE.forEach((_, index) => {
            setTimeout(() => setActiveIndex(index), index * 200);
          });
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-screen py-20 px-4">
      <div
        className={`max-w-3xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-grad-red/10 mb-4">
            <Calendar className="w-7 h-7 text-grad-gold" />
          </div>
          <h2 className="font-serif-cn text-3xl md:text-4xl font-bold text-grad-red mb-3">
            典礼流程
          </h2>
          <p className="font-sans-cn text-grad-brown/70">
            2026年6月28日 上午
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-grad-gold via-grad-gold/60 to-grad-gold md:-translate-x-1/2" />

          <div className="space-y-8">
            {SCHEDULE.map((item, index) => {
              const Icon = item.icon;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex items-center transition-all duration-700 ${
                    activeIndex >= index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  } md:${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-grad-gold rounded-full border-4 border-grad-cream shadow-lg z-10 md:-translate-x-1/2" />

                  <div
                    className={`ml-16 md:ml-0 md:w-5/12 ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}
                  >
                    <div className="bg-paper-texture rounded-xl p-5 border border-grad-gold/30 shadow-md hover:shadow-lg transition-shadow">
                      <div
                        className={`flex items-center gap-3 mb-2 ${
                          isLeft ? 'md:justify-end' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-grad-red/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-grad-gold" />
                        </div>
                        <div>
                          <p className="font-serif-cn text-grad-gold text-sm font-medium">
                            {item.time}
                          </p>
                          <h3 className="font-serif-cn text-lg font-bold text-grad-brown">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <p className="font-sans-cn text-grad-brown/70 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block md:w-5/12" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
