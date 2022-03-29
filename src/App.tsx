import { createContext, MutableRefObject } from "react";
import { Doc, Map as YMap } from "yjs";
import { v4 as uuidv4 } from "uuid";
import { Awareness } from "y-protocols/awareness";
import "./App.css";
import {
  YNodeGroup,
  YNodeData,
  YNodePosition,
  YNodes,
  Provider,
  Providers,
  YNodeProp,
} from "./types";
import { UserInfo } from "./components/panel/UserInfo";
import { useSelectedNodes } from "./store/selectedNodes";
import { Graph } from "./components/Graph";
import { NodeAttributes } from "./components/panel/NodeAttributes";
import { Controlbar } from "./components/Controlbar";
import { Statusbar } from "./components/Statusbar";
import { useYDoc } from "./utils/hooks/useYDoc";
import { useProvider } from "./utils/hooks/useProvider";

type ProviderDocContextProps = {
  ydoc: MutableRefObject<Doc>;
  ynodes: MutableRefObject<YNodes>;
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
  const { ydoc, ynodes } = useYDoc();

  const { isSynced, isOnlineMode, awareness, addProvider, providers } =
    useProvider(ydoc.current);

  const nodes = useSelectedNodes((states) => states.nodes);

  const handleAddNode = (): void => {
    const nodeId = uuidv4();

    const data = new YMap<string | YNodeProp>();

    data.set("id", nodeId);
    data.set("name", { attrid: uuidv4(), value: "New Node" });
    data.set("testattr", { attrid: uuidv4(), value: "test" });

    const position = new YMap<number>();
    position.set("x", 300);
    position.set("y", 200);

    const node = new YMap<YNodeGroup | YNodeData | YNodePosition>();
    node.set("group", "nodes");
    node.set("data", data);
    node.set("position", position);

    ynodes.current?.set(nodeId, node);
  };

  const handleDeleteNode = (): void => {
    const nodes = useSelectedNodes.getState().nodes;
    nodes.forEach((node) => ynodes.current?.delete(node.id()));
  };

  const contextValue = {
    ydoc,
    ynodes,
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
        <NodeAttributes nodes={nodes} ynodesRef={ynodes} />
        <Controlbar onAdd={handleAddNode} onDelete={handleDeleteNode} />
        <div className="flex flex-col h-screen w-screen">
          <Graph awareness={awareness} ydoc={ydoc} ynodes={ynodes} />
          <Statusbar isOnlineMode={isOnlineMode} />
        </div>
      </ProviderDocContext.Provider>
    </>
  );
}

export default App;
