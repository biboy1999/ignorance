import create from "zustand";
import { TransformInternal } from "../types/types";

type TransformsState = {
  transformProviders: TransformInternal[];
  addProviders: (provider: TransformInternal[]) => void;
};

const useTransforms = create<TransformsState>((set, get) => ({
  transformProviders: [],
  addProviders: (providers): void =>
    set({ transformProviders: [...get().transformProviders, ...providers] }),
}));

export { useTransforms };
