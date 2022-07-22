import { StateCreator } from "zustand";
import { YMap } from "yjs/dist/src/internals";
import { SharedTransform, TransformsJob } from "../types/types";
import { YjsSlice } from "./yjs";

// TODO: add transform and job
export type SharedTransformSlice = {
  yjsSharedTransforms: () => YMap<SharedTransform>;
  sharedTransforms: { [key: string]: SharedTransform | undefined };
  setSharedTransforms: (transforms: { [key: string]: SharedTransform }) => void;
  yjsTransformJobs: () => YMap<TransformsJob>;
  transformJobs: TransformsJob[];
  setTransformJobs: (jobs: { [key: string]: TransformsJob }) => void;
  addTransformJobs: (job: TransformsJob) => void;
};

export const createSharedTransformSlice: StateCreator<
  SharedTransformSlice & YjsSlice,
  [],
  [],
  SharedTransformSlice
> = (set, get) => ({
  yjsSharedTransforms: () => get().ydoc.getMap<SharedTransform>("transforms"),
  sharedTransforms: {},
  setSharedTransforms: (transforms): void => {
    set((prev) => ({
      sharedTransforms: { ...prev.sharedTransforms, ...transforms },
    }));
  },
  yjsTransformJobs: () => get().ydoc.getMap<TransformsJob>("transform-jobs"),
  transformJobs: [],
  setTransformJobs: (jobs): void => {
    set(() => ({
      transformJobs: Array.from(Object.entries(jobs)).map(([_k, v]) => v),
    }));
  },
  addTransformJobs: (job): void => {
    get().yjsTransformJobs().set(job.jobId, job);
  },
});
