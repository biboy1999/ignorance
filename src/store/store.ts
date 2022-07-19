import create from "zustand";
import {
  createInternalTransformSlice,
  InternalTransformSlice,
} from "./transforms-internal";
import { createYjsSlice, YjsSlice } from "./yjs";
import { createYjsProviderSlice, YjsProviderSlice } from "./yjsProviders";
import {
  createSharedTransformSlice,
  SharedTransformSlice,
} from "./sharedtransform";
import { createCytoscapeSlice, CytoscapeSlice } from "./cytoscape";

type StoreSlice = YjsSlice &
  YjsProviderSlice &
  InternalTransformSlice &
  SharedTransformSlice &
  CytoscapeSlice;

export const useStore = create<StoreSlice>()((...a) => ({
  ...createYjsSlice(...a),
  ...createYjsProviderSlice(...a),
  ...createInternalTransformSlice(...a),
  ...createSharedTransformSlice(...a),
  ...createCytoscapeSlice(...a),
}));
