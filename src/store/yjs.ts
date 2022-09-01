import { Doc, Map as YMap } from "yjs";
import { StateCreator } from "zustand";
import { YElement } from "../types/yjs";

export type YjsSlice = {
  ydoc: Doc;
  yelements: () => YMap<YElement>;
};

export const createYjsSlice: StateCreator<YjsSlice, [], [], YjsSlice> = (
  _set,
  get
) => ({
  ydoc: new Doc(),
  yelements: () => get().ydoc.getMap<YElement>("elements"),
});
