import { create } from 'zustand';

import type { Difficulty } from '@/lib/mantra-blank';

export type { Difficulty };

export type PageRangeSetting = {
  pageStart: number;
  pageEnd: number;
  difficulty: Difficulty;
};

type SettingState = {
  practice: PageRangeSetting;
  memorize: PageRangeSetting;

  fontSize: number;
  setFontSize: (value: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;

  setPracticePageRange: (start: number, end: number) => void;
  setPracticeDifficulty: (difficulty: Difficulty) => void;
  setMemorizePageRange: (start: number, end: number) => void;
  setMemorizeDifficulty: (difficulty: Difficulty) => void;
};

const TOTAL_PAGES = 12;

const defaultRange: PageRangeSetting = {
  pageStart: 1,
  pageEnd: TOTAL_PAGES,
  difficulty: 'easy',
};

const DEFAULT_FONT_SIZE = 20;
const MIN_FONT_SIZE = 18;
const MAX_FONT_SIZE = 22;
const FONT_SIZE_STEP = 1;

function clampPageRange(
  start: number,
  end: number,
): { start: number; end: number } {
  const normalizedStart = Math.max(1, Math.min(start, TOTAL_PAGES));
  const normalizedEnd = Math.max(normalizedStart, Math.min(end, TOTAL_PAGES));
  return { start: normalizedStart, end: normalizedEnd };
}

export const useSettingStore = create<SettingState>()((set) => ({
  practice: { ...defaultRange },
  memorize: { ...defaultRange },

  fontSize: DEFAULT_FONT_SIZE,
  setFontSize: (value) =>
    set({
      fontSize: Math.max(MIN_FONT_SIZE, Math.min(value, MAX_FONT_SIZE)),
    }),
  increaseFontSize: () =>
    set((state) => ({
      fontSize: Math.min(state.fontSize + FONT_SIZE_STEP, MAX_FONT_SIZE),
    })),
  decreaseFontSize: () =>
    set((state) => ({
      fontSize: Math.max(state.fontSize - FONT_SIZE_STEP, MIN_FONT_SIZE),
    })),
  resetFontSize: () => set({ fontSize: DEFAULT_FONT_SIZE }),

  setPracticePageRange: (start, end) => {
    const { start: s, end: e } = clampPageRange(start, end);
    set((state) => ({
      practice: { ...state.practice, pageStart: s, pageEnd: e },
    }));
  },
  setPracticeDifficulty: (difficulty) =>
    set((state) => ({
      practice: { ...state.practice, difficulty },
    })),

  setMemorizePageRange: (start, end) => {
    const { start: s, end: e } = clampPageRange(start, end);
    set((state) => ({
      memorize: { ...state.memorize, pageStart: s, pageEnd: e },
    }));
  },
  setMemorizeDifficulty: (difficulty) =>
    set((state) => ({
      memorize: { ...state.memorize, difficulty },
    })),
}));
