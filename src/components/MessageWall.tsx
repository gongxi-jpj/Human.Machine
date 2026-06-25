import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquareHeart, Heart, RefreshCw, ExternalLink, Github } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  content: string;
  timestamp: number;
  color: string;
  avatarUrl?: string;
}

interface GitHubComment {
  id: number;
  user: { login: string; avatar_url: string } | null;
  body: string;
  created_at: string;
}

const NOTE_COLORS = [
  'bg-yellow-100 border-yellow-300',
  'bg-pink-100 border-pink-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-purple-100 border-purple-300',
  'bg-orange-100 border-orange-300',
];

const GITHUB_OWNER = 'gongxi-jpj';
const GITHUB_REPO = 'Human.Machine';
const GITHUB_ISSUE_NUMBER = 1;

const FALLBACK_MESSAGES: Message[] = [
  {
    id: 'fallback-1',
    name: '张老师',
    content: '恭喜同学们顺利毕业！愿你们前程似锦，未来可期！',
    timestamp: Date.now() - 86400000 * 3,
    color: NOTE_COLORS[0],
  },
  {
    id: 'fallback-2',
    name: '小明',
    content: '四年时光转瞬即逝，感谢遇见的每一个人，毕业快乐！',
    timestamp: Date.now() - 86400000 * 2,
    color: NOTE_COLORS[1],
  },
  {
    id: 'fallback-3',
    name: '李妈妈',
    content: '宝贝女儿，你是最棒的！爸爸妈妈为你骄傲！',
    timestamp: Date.now() - 86400000,
    color: NOTE_COLORS[2],
  },
  {
    id: 'fallback-4',
    name: '室友阿强',
    content: '四年同寝，一生兄弟！以后常联系，苟富贵勿相忘！',
    timestamp: Date.now() - 43200000,
    color: NOTE_COLORS[3],
  },
  {
    id: 'fallback-5',
    name: '王教授',
    content: '做学问要脚踏实地，做人要光明磊落。同学们，加油！',
    timestamp: Date.now() - 21600000,
    color: NOTE_COLORS[4],
  },
  {
    id: 'fallback-6',
    name: '学姐小雨',
    content: '欢迎加入校友大家庭！毕业不是终点，而是新的起点~',
    timestamp: Date.now() - 7200000,
    color: NOTE_COLORS[5],
  },
];

function parseCommentBody(body: string): { name: string; content: string } {
  const lines = body.trim().split('\n');
  const firstLine = lines[0] || '';
  const nameMatch = firstLine.match(/^【(.+?)】/);

  if (nameMatch) {
    const name = nameMatch[1];
    const content = lines.slice(1).join('\n').trim() || firstLine.replace(/^【.+?】/, '').trim();
    return { name, content: content || name };
  }

  const dashMatch = firstLine.match(/^(.+?)\s*[-—]\s*(.+)$/);
  if (dashMatch) {
    return { name: dashMatch[1].trim(), content: dashMatch[2].trim() };
  }

  return { name: '', content: body.trim() };
}

function hashStringToIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % max;
}

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${GITHUB_ISSUE_NUMBER}/comments?per_page=100&sort=created&direction=desc`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API 请求失败: ${response.status}`);
      }

      const comments: GitHubComment[] = await response.json();

      const parsedMessages: Message[] = comments
        .filter((comment) => comment.body?.trim())
        .map((comment, index) => {
          const { name, content } = parseCommentBody(comment.body);
          const displayName = name || comment.user?.login || '匿名校友';
          const colorIndex = hashStringToIndex(comment.id.toString(), NOTE_COLORS.length);

          return {
            id: `gh-${comment.id}`,
            name: displayName,
            content,
            timestamp: new Date(comment.created_at).getTime(),
            color: NOTE_COLORS[colorIndex],
            avatarUrl: comment.user?.avatar_url,
          };
        });

      if (parsedMessages.length > 0) {
        setMessages(parsedMessages);
        localStorage.setItem('graduation-messages-cache', JSON.stringify(parsedMessages));
      } else {
        setMessages(FALLBACK_MESSAGES);
      }
    } catch (error) {
      console.error('加载祝福失败:', error);
      const cached = localStorage.getItem('graduation-messages-cache');
      if (cached) {
        try {
          setMessages(JSON.parse(cached));
        } catch {
          setMessages(FALLBACK_MESSAGES);
        }
      } else {
        setMessages(FALLBACK_MESSAGES);
      }
      setLoadError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem('graduation-messages-cache');
    if (cached) {
      try {
        setMessages(JSON.parse(cached));
      } catch {
        setMessages(FALLBACK_MESSAGES);
      }
    } else {
      setMessages(FALLBACK_MESSAGES);
    }

    fetchMessages();

    const savedLikes = localStorage.getItem('graduation-likes');
    if (savedLikes) {
      try {
        setLikedMessages(new Set(JSON.parse(savedLikes)));
      } catch {
        // ignore
      }
    }
  }, [fetchMessages]);

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

        <div className="bg-paper-texture rounded-2xl p-6 md:p-8 border-2 border-grad-gold/30 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-serif-cn text-xl text-grad-brown mb-2">写下你的祝福</h3>
              <p className="font-sans-cn text-grad-brown/60 text-sm">
                在 GitHub Issue 中发表评论，祝福将展示在这里（评论首行格式：【你的名字】祝福内容）
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchMessages}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-grad-gold/30 rounded-xl font-sans-cn text-grad-brown hover:bg-grad-gold/10 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                刷新
              </button>
              <a
                href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${GITHUB_ISSUE_NUMBER}#new_comment_field`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-6 py-2.5 bg-gradient-to-r from-grad-gold to-grad-gold-light text-grad-red font-serif-cn font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-grad-gold/30 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  去写祝福
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              </a>
            </div>
          </div>
          {loadError && (
            <p className="mt-4 text-sm text-red-500 font-sans-cn">
              加载失败，当前显示缓存数据：{loadError}
            </p>
          )}
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
