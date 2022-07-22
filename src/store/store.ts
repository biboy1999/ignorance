import create from "zustand";
import {
  createInternalTransformSlice,
  InternalTransformSlice,
} from "./transforms-internal";
import { createYjsSlice, YjsSlice } from "./yjs";
import { createYjsProviderSlice, YjsProviderSlice } from "./yjs-providers";
import {
  createSharedTransformSlice,
  SharedTransformSlice,
} from "./shared-transform";
import { createCytoscapeSlice, CytoscapeSlice } from "./cytoscape";
import { createSelectedNodesSlice, SelectedNodesSlice } from "./selected-nodes";
import { createMiscSliceSlice, MiscSlice } from "./misc";

type StoreSlice = YjsSlice &
  YjsProviderSlice &
  InternalTransformSlice &
  SharedTransformSlice &
  CytoscapeSlice &
  SelectedNodesSlice &
  MiscSlice;

export const useStore = create<StoreSlice>()((...a) => ({
  ...createYjsSlice(...a),
  ...createYjsProviderSlice(...a),
  ...createInternalTransformSlice(...a),
  ...createSharedTransformSlice(...a),
  ...createCytoscapeSlice(...a),
  ...createSelectedNodesSlice(...a),
  ...createMiscSliceSlice(...a),
}));
