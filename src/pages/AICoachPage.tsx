import {
  ArrowRight,
  HelpCircle,
  MessageSquareCode,
  RefreshCw,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useChatStore } from '../store/chatStore';

export const AICoachPage = React.memo(function AICoachPage() {
  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isResponding = useChatStore((state) => state.isResponding);
  const clearThread = useChatStore((state) => state.clearThread);

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isResponding]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();

    if (!trimmed || isResponding) {
      return;
    }

    setInput('');
    await sendMessage(trimmed);
  }, [input, isResponding, sendMessage]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void handleSend();
      }
    },
    [handleSend]
  );

  const quickPrompts = [
    'How can I reduce electricity waste at home?',
    'Which transport option produces lower carbon emissions?',
    'Suggest low carbon healthy meal alternatives',
    'How does Carbon Buddy calculate sustainability score?',
  ];

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[500px] flex-col space-y-6 font-sans">
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            AI Sustainability Coach
          </h1>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-300">
            Personalized guidance for reducing carbon footprint and improving sustainable habits.
          </p>
        </div>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearThread}
            leftIcon={<RefreshCw className="h-4 w-4" />}
            className="text-xs"
          >
            Clear Chat
          </Button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="mx-auto flex h-full max-w-sm flex-col items-center justify-center space-y-4 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <MessageSquareCode className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    Carbon Reduction Assistant
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-300">
                    Ask about transport emissions, sustainable food choices, energy saving habits and eco-friendly lifestyle decisions.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isModel = message.role === 'model';

                return (
                  <div
                    key={message.id}
                    className={`flex max-w-[85%] gap-3 ${
                      isModel
                        ? 'mr-auto'
                        : 'ml-auto flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                        isModel
                          ? 'border-emerald-400 bg-emerald-500 text-white'
                          : 'border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800'
                      }`}
                    >
                      {isModel ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`rounded-3xl p-4 text-xs leading-relaxed ${
                          isModel
                            ? 'rounded-tl-sm border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200'
                            : 'rounded-tr-sm border border-emerald-500 bg-emerald-600 text-white'
                        }`}
                      >
                        <p className="whitespace-pre-line">
                          {message.content}
                        </p>
                      </div>

                      <span className="text-[10px] text-zinc-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {isResponding && (
              <div className="mr-auto flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400 bg-emerald-500 text-white">
                  <Sparkles className="h-4 w-4 animate-spin" />
                </div>

                <div className="flex items-center gap-1 rounded-3xl rounded-tl-sm border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="flex shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <textarea
              rows={1}
              value={input}
              disabled={isResponding}
              placeholder="Ask about sustainable living..."
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="max-h-24 flex-1 resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-900 outline-none focus:ring-1 focus:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            />

            <Button
              variant="accent"
              size="sm"
              onClick={() => void handleSend()}
              disabled={!input.trim() || isResponding}
              className="flex h-10 w-10 items-center justify-center rounded-xl p-3"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        <div className="hidden w-72 shrink-0 lg:block">
          <Card className="space-y-4 p-5">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Quick Prompts
              </h3>
            </div>

            <div className="space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    if (!isResponding) {
                      void sendMessage(prompt);
                    }
                  }}
                  className="group flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left text-xs transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <span className="pr-2">{prompt}</span>

                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
});