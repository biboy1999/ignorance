import { NodeSingular } from "cytoscape";
import create from "zustand";

type SelectedNodes = {
  nodes: NodeSingular[];
  setNodes: (nodes: NodeSingular[]) => void;
  addNode: (node: NodeSingular) => void;
};

const useSelectedNodes = create<SelectedNodes>((set, get) => ({
  nodes: [],
  setNodes: (nodes): void => set({ nodes: nodes }),
  addNode: (node): void => {
    const nodes = get().nodes;
    const prevSelectedNodes = nodes.filter(
      (ele) => ele.selected() && ele.id() != node.id()
    );
    set({ nodes: [...prevSelectedNodes, node] });
  },
}));

export { useSelectedNodes };
