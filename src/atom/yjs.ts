import { atom } from "jotai";
import { Doc as YDoc } from "yjs";
import { Edge, TransformProvider, TransformsJob, YNode } from "../types/types";

export const ydocAtom = atom(new YDoc());
export const ynodesAtom = atom((get) => get(ydocAtom).getMap<YNode>("nodes"));
export const yedgesAtom = atom((get) => get(ydocAtom).getMap<Edge>("edges"));
export const ytransformProvidersAtom = atom((get) =>
  get(ydocAtom).getMap<TransformProvider>("transform-providers")
);
export const ytransformJobsAtom = atom((get) =>
  get(ydocAtom).getMap<TransformsJob>("transform-jobs")
);
