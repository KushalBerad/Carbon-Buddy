/**
 * Carbon Buddy AI Sustainability Coach Store
 *
 * Responsible for:
 * - AI sustainability conversations
 * - Carbon reduction coaching
 * - Eco lifestyle recommendations
 * - Environmental awareness guidance
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '../types';

/**
 * Configuration constants.
 */
const CHAT_HISTORY_LIMIT = 6;
const INVALID_INPUT_DELAY = 600;
const FALLBACK_RESPONSE_DELAY = 900;

/**
 * Store contract.
 */
interface ChatState {
  messages: ChatMessage[];
  isResponding: boolean;

  sendMessage: (text: string) => Promise<void>;
  clearThread: () => void;
  resetChat: () => void;
}

/**
 * Generates chat message object.
 */
const createMessage = (
  role: 'user' | 'model',
  content: string
): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  timestamp: new Date(),
});

/**
 * Detects keyboard smashing / invalid prompts.
 */
const isInvalidPrompt = (
  input: string
): boolean => {
  const cleanedInput =
    input.trim().toLowerCase();

  if (!cleanedInput) {
    return true;
  }

  if (!/[a-z]/i.test(cleanedInput)) {
    return true;
  }

  const words = cleanedInput
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return true;
  }

  const safeWords = [
    'transport',
    'transit',
    'through',
    'lifestyle',
    'strength',
  ];

  for (const word of words) {
    if (
      word.length >= 6 &&
      !/^[0-9]+$/.test(word)
    ) {
      const vowels =
        word.match(/[aeiouy]/g);

      const vowelCount =
        vowels?.length ?? 0;

      const suspiciousPattern =
        vowelCount === 0 ||
        vowelCount / word.length <
        0.2 ||
        /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(
          word
        );

      if (
        suspiciousPattern &&
        !safeWords.includes(word)
      ) {
        return true;
      }
    }
  }

  const keyboardMashPatterns = [
    'asdf',
    'qwerty',
    'zxcv',
    'qwe',
    'asd',
    'zxc',
  ];

  return words.some((word) =>
    keyboardMashPatterns.some(
      (pattern) =>
        word.includes(pattern)
    )
  );
};

/**
 * Generates educational fallback response.
 */
const generateFallbackResponse = (
  input: string
): string => {
  const normalizedInput =
    input.toLowerCase();

  if (
    normalizedInput.includes(
      'energy'
    ) ||
    normalizedInput.includes(
      'phantom'
    )
  ) {
    return 'Reducing phantom energy consumption from idle electronics can significantly lower household electricity usage and reduce unnecessary carbon emissions.';
  }

  if (
    normalizedInput.includes(
      'commute'
    ) ||
    normalizedInput.includes(
      'subway'
    )
  ) {
    return 'Public transport systems generate dramatically lower CO₂ emissions compared to individual vehicle travel while reducing transportation costs.';
  }

  if (
    normalizedInput.includes(
      'recipe'
    ) ||
    normalizedInput.includes(
      'soy'
    ) ||
    normalizedInput.includes(
      'protein'
    )
  ) {
    return 'Plant-based protein sources such as lentils, soy, and legumes reduce agricultural emissions while maintaining strong nutritional value.';
  }

  return 'Small sustainable lifestyle improvements such as efficient transport, reducing meat consumption, and lowering energy waste can dramatically reduce long-term carbon footprint.';
};

/**
 * Persists Date objects correctly.
 */
const customStorage = {
  getItem: (name: string) => {
    const storedValue =
      localStorage.getItem(name);

    if (!storedValue) {
      return null;
    }

    const parsed =
      JSON.parse(storedValue);

    if (parsed.state?.messages) {
      parsed.state.messages =
        parsed.state.messages.map(
          (
            message: ChatMessage
          ) => ({
            ...message,
            timestamp:
              message.timestamp
                ? new Date(
                  message.timestamp
                )
                : new Date(),
          })
        );
    }

    return parsed;
  },

  setItem: (
    name: string,
    value: unknown
  ) => {
    localStorage.setItem(
      name,
      JSON.stringify(value)
    );
  },

  removeItem: (
    name: string
  ) => {
    localStorage.removeItem(name);
  },
};

/**
 * Carbon Buddy AI coach store.
 */
export const useChatStore =
  create<ChatState>()(
    persist(
      (set, get) => ({
        messages: [],
        isResponding: false,

        /**
         * Sends user query to AI sustainability coach.
         */
        sendMessage: async (
          text
        ) => {
          const userMessage =
            createMessage(
              'user',
              text
            );

          const conversationHistory =
            [
              ...get().messages,
              userMessage,
            ];

          set({
            messages:
              conversationHistory,
            isResponding: true,
          });

          /**
           * Handle invalid input.
           */
          if (
            isInvalidPrompt(
              text
            )
          ) {
            setTimeout(() => {
              const invalidReply =
                createMessage(
                  'model',
                  `I could not understand your question.

Try asking:

• How can I reduce my carbon footprint?
• Sustainable food alternatives?
• Energy saving at home?
• Eco-friendly transport options?`
                );

              set(
                (
                  state
                ) => ({
                  messages: [
                    ...state.messages,
                    invalidReply,
                  ],
                  isResponding:
                    false,
                })
              );
            }, INVALID_INPUT_DELAY);

            return;
          }

          try {
            const apiResponse =
              await fetch(
                '/api/gemini/chat',
                {
                  method:
                    'POST',
                  headers: {
                    'Content-Type':
                      'application/json',
                  },
                  body: JSON.stringify(
                    {
                      message:
                        text,
                      history:
                        conversationHistory
                          .slice(
                            -CHAT_HISTORY_LIMIT
                          )
                          .map(
                            (
                              message
                            ) => ({
                              role: message.role,
                              content:
                                message.content,
                            })
                          ),
                    }
                  ),
                }
              );

            const payload =
              await apiResponse.json();

            if (!apiResponse.ok) {
              throw new Error(
                payload.error ||
                'Gemini API request failed'
              );
            }

            const modelReply =
              createMessage(
                'model',
                payload.text ??
                'Sustainability coaching response generated successfully.'
              );

            set(
              (
                state
              ) => ({
                messages: [
                  ...state.messages,
                  modelReply,
                ],
              })
            );
          } catch (
          chatError
          ) {
            console.warn(
              'AI chat unavailable. Using local sustainability simulation.',
              chatError
            );

            const fallbackReply =
              generateFallbackResponse(
                text
              );

            const modelReply =
              createMessage(
                'model',
                fallbackReply
              );

            set((state) => ({
              messages: [
                ...state.messages,
                modelReply,
              ],
            }));
          } finally {
            set({
              isResponding: false,
            });
          }
        },

        /**
         * Clears conversation thread.
         */
        clearThread: () =>
          set({
            messages: [],
          }),

        /**
         * Full chat reset.
         */
        resetChat: () =>
          set({
            messages: [],
            isResponding: false,
          }),
      }),

      {
        name:
          'carbon-buddy-chat-store',
        storage:
          customStorage,
      }
    )
  );