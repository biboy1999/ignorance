import { createContext, useEffect } from "react";
import { Map as YMap } from "yjs";
import { Awareness } from "y-protocols/awareness";
import { nanoid } from "nanoid";
import "./App.css";
import {
  YNodeGroup,
  YNodeData,
  YNodePosition,
  Provider,
  Providers,
} from "./types/types";
import { UserInfo } from "./components/windows/UserInfo";
import { NodeAttributes } from "./components/windows/NodeAttributes";
import { Transforms } from "./components/windows/Transforms/Transforms";
import { useSelectedNodes } from "./store/selectedNodes";
import { Graph } from "./components/Graph";
import { Controlbar } from "./components/Controlbar";
import { Statusbar } from "./components/Statusbar";
import { useProvider } from "./utils/hooks/useProvider";
import { useGlobals } from "./store/globals";
import { doLayout } from "./utils/graph";

type ProviderDocContextProps = {
  awareness: Awareness;
  addProvider: (provider: Provider) => Provider;
  providers: Providers;
  isSynced: boolean;
  isOnlineMode: boolean;
};

// im sure is defined, i think. :/
export const ProviderDocContext = createContext<ProviderDocContextProps>(
  {} as ProviderDocContextProps
);

function App(): JSX.Element {
  const ydoc = useGlobals((state) => state.ydoc);

  const { isSynced, isOnlineMode, awareness, addProvider, providers } =
    useProvider(ydoc);

  const cy = useGlobals((state) => state.cy);
  const ynodes = useGlobals((state) => state.ynodes());
  // const cy = useRef<cytoscape.Core>();

  useEffect(() => {
    // @ts-expect-error ignore debug
    window.cyto = cy;
    // cy?.json(JSON.parse(test));
    // cy?.elements().select();
  }, [cy]);

  const nodes = useSelectedNodes((states) => states.nodes);

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

  const handleDeleteNode = (): void => {
    const nodes = useSelectedNodes.getState().nodes;
    nodes.forEach((node) => ynodes.delete(node.id()));
  };

  const handleLayout = (): void => {
    const selectedEles = cy?.$(":selected");
    if (!selectedEles) return;
    const connectedEdge = selectedEles.connectedEdges();
    const elementsToLayout = selectedEles.add(connectedEdge);
    doLayout(elementsToLayout);
  };

  const contextValue = {
    awareness,
    addProvider,
    providers,
    isSynced,
    isOnlineMode,
  };
  return (
    <>
      <ProviderDocContext.Provider value={contextValue}>
        <UserInfo />
        <Transforms />
        <NodeAttributes nodes={nodes} />
        <Controlbar
          onAdd={handleAddNode}
          onDelete={handleDeleteNode}
          onLayout={handleLayout}
        />
        <div className="flex flex-col h-screen w-screen">
          <Graph />
          <Statusbar isOnlineMode={isOnlineMode} />
        </div>
      </ProviderDocContext.Provider>
    </>
  );
}

export default App;
