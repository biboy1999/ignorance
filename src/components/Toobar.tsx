import { useStore } from "../store/store";
import { addNode, doLayout, getCenterPosition } from "../utils/cytoscape";
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
  const cytoscape = useStore((state) => state.cytoscape);
  const toggleDarkMode = useLocalStorage((state) => state.toggleDarkMode);
  const darkMode = useLocalStorage((state) => state.darkMode);

  useEffect(() => {
    toggleDarkMode(darkMode);
  }, []);

  const handleAddNode = (): void => {
    if (cytoscape == null) return;
    addNode(
      {
        data: {},
        group: "nodes",
        position: getCenterPosition(cytoscape),
      },
      cytoscape
    );
  };

  const handleDeleteNode = async (): Promise<void> => {
    cytoscape?.$(":selected").remove();
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
      <button
        title="Layout Selected Nodes"
        className="styled-button w-9 h-9"
        onClick={(): void => toggleDarkMode()}
      >
        {darkMode ? (
          <MoonIcon className="styled-svg aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center" />
        ) : (
          <SunIcon className="styled-svg aspect-square mx-0 p-1.5 cursor-pointer flex items-center justify-center" />
        )}
      </button>
    </div>
  );
};
