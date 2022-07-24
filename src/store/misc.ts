import create from "zustand";
import { persist } from "zustand/middleware";

export type MiscState = {
  darkMode: boolean;
  toggleDarkMode: (state?: boolean) => void;
};

export const useLocalStorage = create<MiscState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: (state): void =>
        set({
          darkMode: document.documentElement.classList.toggle("dark", state),
        }),
    }),
    {
      name: "misc",
    }
  )
);
