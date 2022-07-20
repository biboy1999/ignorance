import {
  CollectionReturnValue,
  EdgeCollection,
  NodeCollection,
} from "cytoscape";
import { StateCreator } from "zustand";

export type SelectedNodesSlice = {
  selectedElements: CollectionReturnValue | undefined;
  setSelectedElements: (eles: CollectionReturnValue) => void;
  selectedNodes: () => NodeCollection | undefined;
  selectedEdges: () => EdgeCollection | undefined;
};

export const createSelectedNodesSlice: StateCreator<
  SelectedNodesSlice,
  [],
  [],
  SelectedNodesSlice
> = (set, get) => ({
  selectedElements: undefined,
  setSelectedElements: (eles) => set({ selectedElements: eles }),
  selectedNodes: () => get().selectedElements?.nodes(),
  selectedEdges: () => get().selectedElements?.edges(),
});
