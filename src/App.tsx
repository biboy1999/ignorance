import { Map as YMap } from "yjs";
import { nanoid } from "nanoid";
import { Provider as StateProvider, useAtomValue } from "jotai";
import "./App.css";
import { YNodeGroup, YNodeData, YNodePosition } from "./types/types";
import { UserInfo } from "./components/windows/UserInfo";
import { Transforms } from "./components/windows/Transforms/Transforms";
import { Graph } from "./components/graph/Graph";
import { Controlbar } from "./components/Controlbar";
import { Statusbar } from "./components/Statusbar";
import { doLayout } from "./utils/graph";
import { isOnlineModeAtom } from "./atom/provider";
import { useStore } from "./store/store";

function App(): JSX.Element {
  const ynodes = useStore((state) => state.ynodes());
  const cyotscape = useStore((state) => state.cytoscape);
  const isOnlineMode = useAtomValue(isOnlineModeAtom);

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
    <>
      <StateProvider>
        <UserInfo />
        <Transforms />
        <Controlbar
          onAdd={handleAddNode}
          onDelete={handleDeleteNode}
          onLayout={handleLayout}
        />
        <div className="flex flex-col h-screen w-screen">
          <Graph />
          <Statusbar isOnlineMode={isOnlineMode} />
        </div>
      </StateProvider>
    </>
  );
}

export default App;
