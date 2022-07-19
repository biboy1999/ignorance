import { StateCreator } from "zustand";

export type CytoscapeSlice = {
  cytoscape: cytoscape.Core | undefined;
  setCytoscape: (cytoscape: cytoscape.Core) => void;
};

export const createCytoscapeSlice: StateCreator<
  CytoscapeSlice,
  [],
  [],
  CytoscapeSlice
> = (set) => ({
  cytoscape: undefined,
  setCytoscape: (cytoscape): void => set(() => ({ cytoscape })),
});
