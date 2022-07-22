import { StateCreator } from "zustand";

export type MiscSlice = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const createMiscSliceSlice: StateCreator<
  MiscSlice,
  [],
  [],
  MiscSlice
> = (set) => ({
  darkMode: false,
  toggleDarkMode: (): void =>
    set({ darkMode: document.documentElement.classList.toggle("dark") }),
});
