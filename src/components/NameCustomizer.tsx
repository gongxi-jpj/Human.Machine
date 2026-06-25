import { useState, useRef, useEffect } from 'react';
import { Sparkles, UserPen, Share2 } from 'lucide-react';

interface NameCustomizerProps {
  onNameChange: (name: string) => void;
  currentName: string;
}

export default function NameCustomizer({ onNameChange, currentName }: NameCustomizerProps) {
  const [inputName, setInputName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
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

  const handleGenerate = () => {
    if (!inputName.trim()) return;

    setIsGenerating(true);
    setShowResult(false);

    setTimeout(() => {
      onNameChange(inputName.trim());
      setIsGenerating(false);
      setShowResult(true);
    }, 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '毕业典礼邀请函',
          text: `${currentName}的毕业典礼邀请函`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板！');
    }
  };

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center py-20 px-4">
      <div
        className={`max-w-xl w-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-grad-red/10 mb-4">
            <UserPen className="w-7 h-7 text-grad-gold" />
          </div>
          <h2 className="font-serif-cn text-3xl md:text-4xl font-bold text-grad-red mb-3">
            定制专属邀请函
          </h2>
          <p className="font-sans-cn text-grad-brown/70">
            输入你的名字，生成专属的毕业典礼邀请函
          </p>
        </div>

        <div className="bg-paper-texture rounded-2xl p-8 border-2 border-grad-gold/30 shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="block font-serif-cn text-grad-brown mb-2 text-sm">
                毕业生姓名
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="请输入您的姓名"
                  className="w-full px-5 py-4 bg-white/70 border-2 border-grad-gold/30 rounded-xl font-serif-cn text-lg text-grad-brown placeholder-grad-brown/40 focus:outline-none focus:border-grad-gold focus:ring-4 focus:ring-grad-gold/20 transition-all"
                  maxLength={20}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-grad-brown/40 text-sm">
                  {inputName.length}/20
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!inputName.trim() || isGenerating}
              className="w-full relative py-4 px-6 bg-gradient-to-r from-grad-red to-grad-red-dark text-white font-serif-cn text-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-grad-red/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    生成专属邀请函
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {showResult && currentName && (
            <div className="mt-8 pt-8 border-t border-grad-gold/20 animate-fade-in-up">
              <p className="text-center text-grad-brown/60 text-sm mb-4">
                您的专属邀请函已生成
              </p>
              <div className="bg-gradient-to-br from-grad-gold/10 to-grad-red/5 rounded-xl p-6 text-center border border-grad-gold/20">
                <p className="font-sans-cn text-grad-brown/60 text-sm mb-2">
                  诚挚邀请
                </p>
                <p className="font-serif-cn text-2xl md:text-3xl text-grad-red font-bold mb-2">
                  {currentName}
                </p>
                <p className="font-sans-cn text-grad-brown/60 text-sm">
                  同学出席毕业典礼
                </p>
              </div>

              <button
                onClick={handleShare}
                className="w-full mt-4 py-3 px-6 border-2 border-grad-gold/50 text-grad-gold font-serif-cn rounded-xl hover:bg-grad-gold/10 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                分享邀请函
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
