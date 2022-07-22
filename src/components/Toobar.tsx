import { nanoid } from "nanoid";
import { Map as YMap } from "yjs";
import { YNodeGroup, YNodeData, YNodePosition } from "../types/types";
import { useStore } from "../store/store";
import { doLayout } from "../utils/graph";
import {
  LightBulbIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  ShareIcon,
} from "@heroicons/react/solid";

export const Toolbar = (): JSX.Element => {
  const ynodes = useStore((state) => state.ynodes());
  const cyotscape = useStore((state) => state.cytoscape);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

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
    <div className="absolute mx-auto left-0 right-0 top-2 w-min h-min flex border z-50 divide-x">
      <div title="Add Node" className="w-9 h-9">
        <PlusCircleIcon
          onClick={handleAddNode}
          className="aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
        />
      </div>
      <div title="Delete Selected Nodes" className="w-9 h-9">
        <MinusCircleIcon
          onClick={handleDeleteNode}
          className="aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
        />
      </div>
      <div title="Layout Selected Nodes" className="w-9 h-9">
        <ShareIcon
          onClick={handleLayout}
          className="aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
        />
      </div>
      <div title="Layout Selected Nodes" className="w-9 h-9">
        <LightBulbIcon
          onClick={toggleDarkMode}
          className="aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
        />
      </div>
    </div>
  );
};
