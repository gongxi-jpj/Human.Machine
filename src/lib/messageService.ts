import { ref, push, onValue, off, type DatabaseReference } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';

export interface Message {
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

const LOCAL_STORAGE_KEY = 'graduation-messages';

export const INITIAL_MESSAGES: Message[] = [
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

export function getRandomColor(): string {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
}

export function getLocalMessages(): Message[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
  return INITIAL_MESSAGES;
}

export function saveLocalMessages(messages: Message[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
}

export async function addMessage(message: Omit<Message, 'id'>): Promise<string> {
  if (isFirebaseConfigured && database) {
    const messagesRef = ref(database, 'messages');
    const newRef = await push(messagesRef, message);
    return newRef.key || Date.now().toString();
  }

  const id = Date.now().toString();
  const localMessages = getLocalMessages();
  const newMessage: Message = { ...message, id };
  saveLocalMessages([newMessage, ...localMessages]);
  return id;
}

let listenerRef: DatabaseReference | null = null;

export function subscribeToMessages(
  callback: (messages: Message[]) => void
): () => void {
  if (isFirebaseConfigured && database) {
    const messagesRef = ref(database, 'messages');
    listenerRef = messagesRef;

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages: Message[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Message, 'id'>),
        }));
        messages.sort((a, b) => b.timestamp - a.timestamp);
        callback(messages);
      } else {
        callback(INITIAL_MESSAGES);
      }
    });

    return () => {
      off(messagesRef);
      listenerRef = null;
    };
  }

  callback(getLocalMessages());
  return () => {};
}
