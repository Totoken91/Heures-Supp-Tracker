import { create } from 'zustand';
import { OvertimeEntry, Settings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import * as db from '../database';

interface AppState {
  entries: OvertimeEntry[];
  settings: Settings;
  currentMonth: string; // format YYYY-MM
  isLoading: boolean;

  // Actions
  loadEntries: (yearMonth?: string) => Promise<void>;
  addEntry: (entry: Omit<OvertimeEntry, 'id' | 'created_at'>) => Promise<void>;
  updateEntry: (id: number, entry: Omit<OvertimeEntry, 'id' | 'created_at'>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  setCurrentMonth: (yearMonth: string) => void;
  loadSettings: () => Promise<void>;
  saveSettings: (settings: Settings) => Promise<void>;
}

const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const useAppStore = create<AppState>((set, get) => ({
  entries: [],
  settings: DEFAULT_SETTINGS,
  currentMonth: getCurrentMonth(),
  isLoading: false,

  loadEntries: async (yearMonth?: string) => {
    const month = yearMonth ?? get().currentMonth;
    set({ isLoading: true });
    const entries = await db.getEntriesByMonth(month);
    set({ entries, isLoading: false });
  },

  addEntry: async (entry) => {
    await db.addEntry(entry);
    await get().loadEntries();
  },

  updateEntry: async (id, entry) => {
    await db.updateEntry(id, entry);
    await get().loadEntries();
  },

  deleteEntry: async (id) => {
    await db.deleteEntry(id);
    await get().loadEntries();
  },

  setCurrentMonth: (yearMonth: string) => {
    set({ currentMonth: yearMonth });
    get().loadEntries(yearMonth);
  },

  loadSettings: async () => {
    const settings = await db.getSettings();
    set({ settings });
  },

  saveSettings: async (settings: Settings) => {
    await db.saveSettings(settings);
    set({ settings });
  },
}));
