import { nanoid } from "nanoid";
import { Map as YMap } from "yjs";
import { YNodeGroup, YNodeData, YNodePosition } from "../types/types";
import { useStore } from "../store/store";
import { doLayout } from "../utils/graph";

export const Controlbar = (): JSX.Element => {
  const ynodes = useStore((state) => state.ynodes());
  const cyotscape = useStore((state) => state.cytoscape);

  const handleAddNode = (): void => {
    const nodeId = nanoid();

    const data = new YMap<string>();
    data.set("id", nodeId);
    data.set("name", "New Node");
    data.set("type", "people");
    data.set("testattr", "test");

    const position = new YMap<number>();
    position.set("x", 300);
    position.set("y", 200);

    const node = new YMap<YNodeGroup | YNodeData | YNodePosition>();
    node.set("group", "nodes");
    node.set("data", data);
    node.set("position", position);

    ynodes.set(nodeId, node);
  };

  const handleDeleteNode = async (): Promise<void> => {
    const selectedNodes = cyotscape?.$(":selected");
    selectedNodes?.forEach((node) => ynodes.delete(node.id()));
  };

  const handleLayout = async (): Promise<void> => {
    const selectedEles = cyotscape?.$(":selected");
    if (!selectedEles) return;
    const connectedEdge = selectedEles.connectedEdges();
    const elementsToLayout = selectedEles.add(connectedEdge);
    doLayout(elementsToLayout);
  };

  return (
    <div className="absolute top-2 left-2 flex flex-col border z-50">
      <div
        onClick={handleAddNode}
        className="aspect-square w-9 h-9 cursor-pointer flex items-center justify-center bg-slate-200 hover:bg-slate-500"
      >
        <span className="font-mono">+</span>
      </div>
      <div
        className="aspect-square w-9 h-9 cursor-pointer flex items-center justify-center bg-slate-200 hover:bg-slate-500"
        onClick={handleDeleteNode}
      >
        <span className="font-mono">-</span>
      </div>
      <div
        className="aspect-square w-9 h-9 cursor-pointer flex items-center justify-center bg-slate-200 hover:bg-slate-500"
        onClick={handleLayout}
      >
        <span className="font-mono">L</span>
      </div>
    </div>
  );
};
