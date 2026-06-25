import { useState, useEffect, useRef } from 'react';
import { MessageSquareHeart, Send, Heart } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  content: string;
  timestamp: number;
  color: string;
}

const NOTE_COLORS = [
  'bg-yellow-100 border-yellow-300',
  'bg-pink-100 border-pink-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-purple-100 border-purple-300',
  'bg-orange-100 border-orange-300',
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    name: '张老师',
    content: '恭喜同学们顺利毕业！愿你们前程似锦，未来可期！',
    timestamp: Date.now() - 86400000 * 3,
    color: NOTE_COLORS[0],
  },
  {
    id: '2',
    name: '小明',
    content: '四年时光转瞬即逝，感谢遇见的每一个人，毕业快乐！',
    timestamp: Date.now() - 86400000 * 2,
    color: NOTE_COLORS[1],
  },
  {
    id: '3',
    name: '李妈妈',
    content: '宝贝女儿，你是最棒的！爸爸妈妈为你骄傲！',
    timestamp: Date.now() - 86400000,
    color: NOTE_COLORS[2],
  },
  {
    id: '4',
    name: '室友阿强',
    content: '四年同寝，一生兄弟！以后常联系，苟富贵勿相忘！',
    timestamp: Date.now() - 43200000,
    color: NOTE_COLORS[3],
  },
  {
    id: '5',
    name: '王教授',
    content: '做学问要脚踏实地，做人要光明磊落。同学们，加油！',
    timestamp: Date.now() - 21600000,
    color: NOTE_COLORS[4],
  },
  {
    id: '6',
    name: '学姐小雨',
    content: '欢迎加入校友大家庭！毕业不是终点，而是新的起点~',
    timestamp: Date.now() - 7200000,
    color: NOTE_COLORS[5],
  },
];

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('graduation-messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        setMessages(INITIAL_MESSAGES);
      }
    } else {
      setMessages(INITIAL_MESSAGES);
      localStorage.setItem('graduation-messages', JSON.stringify(INITIAL_MESSAGES));
    }

    const savedLikes = localStorage.getItem('graduation-likes');
    if (savedLikes) {
      try {
        setLikedMessages(new Set(JSON.parse(savedLikes)));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newMessage: Message = {
      id: Date.now().toString(),
      name: name.trim(),
      content: content.trim(),
      timestamp: Date.now(),
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    };

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    setNewMessageId(newMessage.id);
    localStorage.setItem('graduation-messages', JSON.stringify(updatedMessages));

    setName('');
    setContent('');
    setIsSubmitting(false);

    setTimeout(() => setNewMessageId(null), 1000);
  };

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedMessages);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedMessages(newLiked);
    localStorage.setItem('graduation-likes', JSON.stringify([...newLiked]));
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div ref={ref} className="min-h-screen py-20 px-4">
      <div
        className={`max-w-5xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-grad-red/10 mb-4">
            <MessageSquareHeart className="w-7 h-7 text-grad-gold" />
          </div>
          <h2 className="font-serif-cn text-3xl md:text-4xl font-bold text-grad-red mb-3">
            毕业祝福墙
          </h2>
          <p className="font-sans-cn text-grad-brown/70">
            写下你的祝福，留下珍贵的回忆
          </p>
        </div>

        <div className="bg-paper-texture rounded-2xl p-6 md:p-8 border-2 border-grad-gold/30 shadow-xl mb-12">
          <h3 className="font-serif-cn text-xl text-grad-brown mb-4">发表祝福</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="你的名字"
              className="w-full px-4 py-3 bg-white/70 border-2 border-grad-gold/30 rounded-xl font-sans-cn text-grad-brown placeholder-grad-brown/40 focus:outline-none focus:border-grad-gold focus:ring-4 focus:ring-grad-gold/20 transition-all"
              maxLength={20}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下你想说的话..."
              rows={3}
              className="w-full px-4 py-3 bg-white/70 border-2 border-grad-gold/30 rounded-xl font-sans-cn text-grad-brown placeholder-grad-brown/40 focus:outline-none focus:border-grad-gold focus:ring-4 focus:ring-grad-gold/20 transition-all resize-none"
              maxLength={200}
            />
            <div className="flex items-center justify-between">
              <span className="text-grad-brown/40 text-sm">
                {content.length}/200
              </span>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !content.trim() || isSubmitting}
                className="relative px-8 py-3 bg-gradient-to-r from-grad-gold to-grad-gold-light text-grad-red font-serif-cn font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-grad-gold/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    '发送中...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      发送祝福
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`relative ${msg.color} border-2 rounded-lg p-5 shadow-md transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
                newMessageId === msg.id ? 'animate-bounce' : ''
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                transform: `rotate(${(index % 3 - 1) * 1.5}deg)`,
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-grad-gold/30 rounded-full" />

              <div className="flex items-start justify-between mb-3">
                <p className="font-serif-cn font-bold text-grad-brown">
                  {msg.name}
                </p>
                <button
                  onClick={() => toggleLike(msg.id)}
                  className="flex items-center gap-1 text-sm transition-transform hover:scale-110"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      likedMessages.has(msg.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-grad-brown/40'
                    }`}
                  />
                </button>
              </div>

              <p className="font-sans-cn text-grad-brown/80 text-sm leading-relaxed mb-4">
                {msg.content}
              </p>

              <p className="text-xs text-grad-brown/50 text-right">
                {formatTime(msg.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
