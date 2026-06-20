import { ArrowRight, HelpCircle, MessageSquareCode, RefreshCw, Send, Sparkles, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useChatStore } from '../store/chatStore';
import { useUserStore } from '../store/userStore';
import { ChatMessage, UserProfile } from '../types';

export interface AICoachPageProps {
  profile?: UserProfile;
  messages?: ChatMessage[];
  onSendMessage?: (text: string) => Promise<void>;
  isResponding?: boolean;
  onClearThread?: () => void;
}

export const AICoachPage = React.memo(function AICoachPage({ 
  profile: propProfile, 
  messages: propMessages, 
  onSendMessage: propOnSendMessage, 
  isResponding: propIsResponding, 
  onClearThread: propOnClearThread 
}: AICoachPageProps) {
  const storeProfile = useUserStore((s) => s.profile);
  const storeMessages = useChatStore((s) => s.messages);
  const storeSendMessage = useChatStore((s) => s.sendMessage);
  const storeIsResponding = useChatStore((s) => s.isResponding);
  const storeClearThread = useChatStore((s) => s.clearThread);

  const profile = propProfile || storeProfile;
  const messages = propMessages || storeMessages;
  const onSendMessage = propOnSendMessage || storeSendMessage;
  const isResponding = propIsResponding || storeIsResponding;
  const onClearThread = propOnClearThread || storeClearThread;

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest speech balloons on active message change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isResponding]);

  const handleSend = () => {
    if (!input.trim() || isResponding) return;
    const txt = input.trim();
    setInput('');
    onSendMessage(txt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'How do I minimize continuous phantom energy loads?',
    'Carbon offsets of subway commutes versus single rider cars?',
    'Introduce healthy soy alternatives with lower emissions',
    'Explain how Carbon Buddy calculates milestone points',
  ];

  return (
    <div className="space-y-6 font-sans flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
      
      {/* Thread Header */}
      <div className="flex items-center justify-between border-b border-zinc-250/20 dark:border-zinc-800 pb-3 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            AI Coach Conversational Chat
          </h1>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-300 font-light mt-0.5">
            Query our integrated Google Gemini system server-side regarding daily carbon-conscious decisions.
          </p>
        </div>

        {onClearThread && messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearThread}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="text-[11px]"
          >
            Clear conversation
          </Button>
        )}
      </div>

      {/* Main Conversation Stage Panel */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Side: Speech Balloons Thread (Takes rest of space) */}
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-850 rounded-3xl overflow-hidden min-h-0 shadow-lg">
          
          {/* Scrollable chat body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* If empty chat show guide */}
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4 py-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <MessageSquareCode className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Welcome to your AI Green Coach!</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-300 font-light leading-relaxed">
                    Ask regarding specific recipes, carbon factors of train transits, or ways to customize and extend your sustainable green streaks.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isModel = msg.role === 'model';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] ${isModel ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                  >
                    {/* Avatar Bubble */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                      isModel 
                        ? 'bg-emerald-500 border-emerald-400 text-white' 
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-650 dark:text-zinc-350'
                    }`}>
                      {isModel ? <Sparkles className="w-4.5 h-4.5 fill-white/10" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Speech box wrapper */}
                    <div className="space-y-1">
                      <div className={`p-4 rounded-3xl text-xs leading-relaxed font-light ${
                        isModel 
                          ? 'bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-150/40 dark:border-zinc-800 rounded-tl-sm' 
                          : 'bg-emerald-600 border border-emerald-500 text-white rounded-tr-sm'
                      }`}>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-300 font-mono">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* If Responding indicator */}
            {isResponding && (
              <div className="flex gap-3 max-w-[80%] mr-auto text-left">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white border border-emerald-400 shrink-0">
                  <Sparkles className="w-4.5 h-4.5 animate-spin" />
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-3xl rounded-tl-sm border border-zinc-150/40 dark:border-zinc-800 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Typing input bar footer */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-150/30 dark:border-zinc-800/80 flex items-center gap-2 shrink-0">
            <textarea
              rows={1}
              placeholder="Ask anything about sustainable lifestyle..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isResponding}
              className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-2xl text-xs text-zinc-900 dark:text-zinc-50 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/20 max-h-24 leading-relaxed font-sans placeholder-zinc-400"
            />
            
            <Button
              variant="accent"
              size="sm"
              onClick={handleSend}
              disabled={!input.trim() || isResponding}
              className="p-3 w-10 h-10 flex items-center justify-center rounded-xl cursor-all"
              aria-label="Send user message"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>

        </div>

        {/* Right Side: Quick Suggestions Column (Desktop-only sidebar style) */}
        <div className="hidden lg:block w-72 space-y-4 shrink-0">
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100">Coach Starters</h3>
            </div>
            <p className="text-[10px] text-zinc-405 dark:text-zinc-300 font-light leading-relaxed">Click any quick prompt to automatically query the integrated Gemini model:</p>
            
            <div className="space-y-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isResponding) onSendMessage(q);
                  }}
                  className="w-full text-left p-3 border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 hover:border-emerald-550/50 hover:bg-emerald-500/5 hover:text-emerald-500 rounded-xl text-[11px] text-zinc-650 dark:text-zinc-300 font-light leading-relaxed cursor-pointer transition-all duration-200 outline-none flex items-center justify-between group"
                >
                  <span className="truncate flex-1 pr-2">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
});

