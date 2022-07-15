import create from "zustand";

type zIndexHelper = {
  zIndex: number;
  setzIndex: (index: number) => void;
  increasezIndex: () => void;
};

export const usezIndex = create<zIndexHelper>((set, get) => ({
  zIndex: 50,
  setzIndex: (zIndex): void => set({ zIndex }),
  increasezIndex: (): void => set({ zIndex: get().zIndex + 1 }),
}));
