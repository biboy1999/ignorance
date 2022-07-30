import { Doc } from "yjs";
import { YMap } from "yjs/dist/src/internals";
import { StateCreator } from "zustand";
import { Edge } from "../types/types";
import { YNode } from "../types/yjs";

export type YjsSlice = {
  ydoc: Doc;
  ynodes: () => YMap<YNode>;
  yedges: () => YMap<Edge>;
};

export const createYjsSlice: StateCreator<YjsSlice, [], [], YjsSlice> = (
  set,
  get
) => ({
  ydoc: new Doc(),
  ynodes: () => get().ydoc.getMap<YNode>("nodes"),
  yedges: () => get().ydoc.getMap<Edge>("edges"),
});
