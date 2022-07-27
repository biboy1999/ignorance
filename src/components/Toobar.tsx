import { nanoid } from "nanoid";
import { Map as YMap } from "yjs";
import { YNodeGroup, YNodeData, YNodePosition } from "../types/types";
import { useStore } from "../store/store";
import { doLayout } from "../utils/graph";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  ShareIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/solid";
import { useLocalStorage } from "../store/misc";
import { useEffect } from "react";

export const Toolbar = (): JSX.Element => {
  const ynodes = useStore((state) => state.ynodes());
  const cytoscape = useStore((state) => state.cytoscape);
  const toggleDarkMode = useLocalStorage((state) => state.toggleDarkMode);
  const darkMode = useLocalStorage((state) => state.darkMode);

  useEffect(() => {
    toggleDarkMode(darkMode);
  }, []);

  const handleAddNode = (): void => {
    const nodeId = nanoid();

    const data = new YMap<string>();
    data.set("id", nodeId);
    data.set("name", "New Node");
    data.set("type", "people");
    data.set("testattr", "test");

    const { x1, y1, w, h } = cytoscape?.extent() ?? {
      x1: 0,
      y1: 0,
      w: 0,
      h: 0,
    };

    const position = new YMap<number>();
    position.set("x", x1 + w / 2);
    position.set("y", y1 + h / 2);

    const node = new YMap<YNodeGroup | YNodeData | YNodePosition>();
    node.set("group", "nodes");
    node.set("data", data);
    node.set("position", position);

    ynodes.set(nodeId, node);
  };

  const handleDeleteNode = async (): Promise<void> => {
    const selectedNodes = cytoscape?.$(":selected");
    selectedNodes?.forEach((node) => ynodes.delete(node.id()));
  };

  const handleLayout = async (): Promise<void> => {
    const selectedEles = cytoscape?.$(":selected");
    if (!selectedEles) return;
    const connectedEdge = selectedEles.connectedEdges();
    const elementsToLayout = selectedEles.add(connectedEdge);
    doLayout(elementsToLayout);
  };

  return (
    <div className="styled-panel absolute mx-auto left-0 right-0 top-2 w-min h-min flex border z-50 divide-x">
      <button title="Add Node" className="styled-button w-9 h-9">
        <PlusCircleIcon
          onClick={handleAddNode}
          className="styled-svg aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
        />
      </button>
      <button title="Delete Selected Nodes" className="styled-button w-9 h-9">
        <MinusCircleIcon
          onClick={handleDeleteNode}
          className="styled-svg aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
        />
      </button>
      <button title="Layout Selected Nodes" className="styled-button w-9 h-9">
        <ShareIcon
          onClick={handleLayout}
          className="styled-svg aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
        />
      </button>
      {darkMode ? (
        <button title="Layout Selected Nodes" className="styled-button w-9 h-9">
          <MoonIcon
            onClick={(): void => toggleDarkMode()}
            className="styled-svg aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
          />
        </button>
      ) : (
        <button title="Layout Selected Nodes" className="styled-button w-9 h-9">
          <SunIcon
            onClick={(): void => toggleDarkMode()}
            className="styled-svg aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center"
          />
        </button>
      )}
    </div>
  );
};
