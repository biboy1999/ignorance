import { StateCreator } from "zustand";
import { InternalTransform } from "../types/types";

export type InternalTransformSlice = {
  internalTransforms: InternalTransform[];
  addInternalTransforms: (transforms: InternalTransform[]) => void;
};

export const createInternalTransformSlice: StateCreator<
  InternalTransformSlice,
  [],
  [],
  InternalTransformSlice
> = (set, get) => ({
  internalTransforms: [],
  addInternalTransforms: (transforms): void => {
    set({ internalTransforms: [...get().internalTransforms, ...transforms] });
  },
});
