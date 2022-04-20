import create, { GetState, SetState } from "zustand";
import { Doc as YDoc } from "yjs";
import { Edge, StoreSlice, YEdges, YNode, YNodes } from "../types/types";

type GraphSliceState = {
  cy: cytoscape.Core | undefined;
  setCy: (cy: cytoscape.Core) => void;
};

const GraphSlice: StoreSlice<GraphSliceState> = (set, _get) => ({
  cy: undefined,
  setCy: (cy) => set({ cy }),
});

type YjsSliceState = {
  ydoc: YDoc;
  ynodes: () => YNodes;
  yedges: () => YEdges;
};

const YjsSlice: StoreSlice<YjsSliceState> = (set, get) => ({
  ydoc: new YDoc(),
  ynodes: () => get().ydoc.getMap<YNode>("nodes"),
  yedges: () => get().ydoc.getArray<Edge>("edges"),
});

// eslint-disable-next-line  @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type
const createRootSlice = (set: SetState<any>, get: GetState<any>) => ({
  ...GraphSlice(set, get),
  ...YjsSlice(set, get),
});

export const useGlobals = create(createRootSlice);
