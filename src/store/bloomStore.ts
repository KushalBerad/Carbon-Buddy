import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BloomState {
  bloomMessage: string;
  setBloomMessage: (msg: string) => void;
  resetBloom: () => void;
}

export const useBloomStore = create<BloomState>()(
  persist(
    (set) => ({
      bloomMessage: 'Your Earth Bloom plant is looking healthy!',
      setBloomMessage: (bloomMessage) => set({ bloomMessage }),
      resetBloom: () => set({ bloomMessage: 'Your Earth Bloom plant is looking healthy!' }),
    }),
    {
      name: 'carbon-buddy-bloom-store',
    }
  )
);
