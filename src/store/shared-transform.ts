import { StateCreator } from "zustand";
import { YMap } from "yjs/dist/src/internals";
import { SharedTransform, TransformJob } from "../types/transform";
import { YjsSlice } from "./yjs";

export type SharedTransformSlice = {
  yjsSharedTransforms: () => YMap<SharedTransform>;
  sharedTransforms: { [key: string]: SharedTransform | undefined };
  setSharedTransforms: (transforms: { [key: string]: SharedTransform }) => void;
  yjsTransformJobs: () => YMap<TransformJob>;
  transformJobs: TransformJob[];
  setTransformJobs: (jobs: { [key: string]: TransformJob }) => void;
  addTransformJobs: (job: TransformJob) => void;
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
  yjsTransformJobs: () => get().ydoc.getMap<TransformJob>("transform-jobs"),
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
