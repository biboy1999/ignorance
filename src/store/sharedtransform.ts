import { StateCreator } from "zustand";
import { YMap } from "yjs/dist/src/internals";
import { SharedTransform, TransformsJob } from "../types/types";
import { YjsSlice } from "./yjs";

// TODO: add transform and job
export type SharedTransformSlice = {
  sharedTransforms: () => YMap<SharedTransform>;
  // addSharedTransforms: (transforms: SharedTransform[]) => void;
  transformJobs: () => YMap<TransformsJob>;
  // addTransformJobs: (jobs: TransformsJob[]) => void;
};

export const createSharedTransformSlice: StateCreator<
  SharedTransformSlice & YjsSlice,
  [],
  [],
  SharedTransformSlice
> = (_set, get) => ({
  sharedTransforms: () => get().ydoc.getMap<SharedTransform>("transforms"),
  // addSharedTransforms: (transforms): void => {
  //   console.log("TODO");
  // },
  transformJobs: () => get().ydoc.getMap<TransformsJob>("transform-jobs"),
  // addTransformJobs: (jobs): void => {
  //   console.log("TODO");
  // },
});
