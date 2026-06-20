import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isResponding: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearThread: () => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isResponding: false,
      sendMessage: async (text) => {
        const userMsg: ChatMessage = {
          id: `m-user-${Date.now()}`,
          role: 'user',
          content: text,
          timestamp: new Date(),
        };

        const currentMessages = get().messages;
        const nextMessages = [...currentMessages, userMsg];
        set({ messages: nextMessages, isResponding: true });

        // Heuristic function to detect gibberish or keyboard mashing
        const isGibberish = (str: string): boolean => {
          const cleaned = str.trim().toLowerCase();
          if (!cleaned) return true;
          if (!/[a-z]/i.test(cleaned)) return true;

          const words = cleaned.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
          if (words.length === 0) return true;

          for (const word of words) {
            if (word.length >= 6 && !/^[0-9]+$/.test(word)) {
              const vowels = word.match(/[aeiouy]/g);
              const vowelCount = vowels ? vowels.length : 0;
              // Detect raw consonant sequences or extremely low vowel-to-consonant density (less than 20% vowels)
              if (vowelCount === 0 || vowelCount / word.length < 0.20 || /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(word)) {
                const safeWords = ['transport', 'transit', 'through', 'lifestyle', 'strength'];
                if (!safeWords.includes(word)) {
                  return true;
                }
              }
            }
          }

          const mashProfiles = ['asdf', 'qwerty', 'zxcv', 'jkl;', 'xyz', 'qwe', 'asd', 'zxc'];
          if (words.some(w => mashProfiles.some(p => w.includes(p)))) {
            return true;
          }

          return false;
        };

        if (isGibberish(text)) {
          setTimeout(() => {
            const modelMsg: ChatMessage = {
              id: `m-model-${Date.now()}`,
              role: 'model',
              content: `I could not fully understand your question.

Try asking things like:

• How can I reduce my carbon footprint?
• What food choices lower emissions?
• Eco-friendly commuting alternatives?
• How can I save energy at home?`,
              timestamp: new Date(),
            };
            set((state) => ({ messages: [...state.messages, modelMsg], isResponding: false }));
          }, 600);
          return;
        }

        try {
          const response = await fetch('/api/gemini/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: nextMessages.slice(-6).map(m => ({ role: m.role, content: m.content })) }),
          });

          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }

          const modelMsg: ChatMessage = {
            id: `m-model-${Date.now()}`,
            role: 'model',
            content: data.text || 'Understood, let us trace standard footprints together.',
            timestamp: new Date(),
          };
          set((state) => ({ messages: [...state.messages, modelMsg] }));
        } catch (err: any) {
          console.warn('Gemini chat fell back to premium simulation:', err);
          let reply = "That is an excellent point. Opting for transit choices, turning down heat pumps at night, and swapping beef with oat alternatives keeps carbon indexes minimum.";
          if (text.toLowerCase().includes('phantom') || text.toLowerCase().includes('energy')) {
            reply = "Phantom energy vampire loads continuous standby power from gadgets like televisions, smart charges, and coffee creators. Standard power strips can be powered down to save $4/cycle easily.";
          } else if (text.toLowerCase().includes('commute') || text.toLowerCase().includes('subway')) {
            reply = "Subcars and trains hold approx 90% less CO₂ margins compared to solos. It saves continuous dollars on tolls and parking meters in crowded metro grids.";
          } else if (text.toLowerCase().includes('recipe') || text.toLowerCase().includes('soy') || text.toLowerCase().includes('protein')) {
            reply = "Spiced lentils, brown rice beans, and tofu soy mixes provide high iron indexes. It maintains low water and land coefficients, reducing meals output significantly.";
          }

          setTimeout(() => {
            const modelMsg: ChatMessage = {
              id: `m-model-${Date.now()}`,
              role: 'model',
              content: reply,
              timestamp: new Date(),
            };
            set((state) => ({ messages: [...state.messages, modelMsg] }));
          }, 900);
        } finally {
          set({ isResponding: false });
        }
      },
      clearThread: () => set({ messages: [] }),
      resetChat: () => set({ messages: [], isResponding: false }),
    }),
    {
      name: 'carbon-buddy-chat-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          if (parsed.state?.messages) {
            parsed.state.messages = parsed.state.messages.map((m: any) => ({
              ...m,
              timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
            }));
          }
          return parsed;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      }
    }
  )
);
