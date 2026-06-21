/**
 * Carbon Buddy Earth Bloom Store
 *
 * Responsible for:
 * - Virtual sustainability growth companion
 * - Eco progress visualization
 * - Environmental achievement feedback
 * - Positive reinforcement for green behavior
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Default sustainability growth message.
 */
const DEFAULT_BLOOM_MESSAGE =
  'Your Earth Bloom ecosystem is thriving through your sustainable lifestyle choices.';

/**
 * Store contract.
 */
interface BloomState {
  bloomMessage: string;

  setBloomMessage: (
    message: string
  ) => void;

  resetBloom: () => void;
}

/**
 * Earth Bloom persistence store.
 */
export const useBloomStore =
  create<BloomState>()(
    persist(
      (set) => ({
        bloomMessage:
          DEFAULT_BLOOM_MESSAGE,

        /**
         * Updates environmental progress message.
         */
        setBloomMessage: (
          bloomMessage
        ) =>
          set({
            bloomMessage,
          }),

        /**
         * Resets virtual ecosystem state.
         */
        resetBloom: () =>
          set({
            bloomMessage:
              DEFAULT_BLOOM_MESSAGE,
          }),
      }),

      {
        name:
          'carbon-buddy-bloom-store',
      }
    )
  );