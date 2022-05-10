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

  const test =
    '{"elements":{"nodes":[{"data":{"id":"1pln3Z2X_RbCzKo7LbRgI","name":"New Node","type":"*"},"position":{"x":170.82534185721033,"y":-104.57181865489419},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"HjOisuDMMRRd2sq0QHrgw","name":"New Node","type":"*"},"position":{"x":-5.898805221538853,"y":-36.85563226259815},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"9Ts5C4bWDoiHe9WP4WUXF","name":"New Node","type":"*"},"position":{"x":-97.21371893253789,"y":74.67046197415341},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"TVHa8p4hPYF9XzlXP87MT","name":"New Node","type":"*"},"position":{"x":-180.4060001808528,"y":1.502505546352253},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"A4kjlrTa31qlg4chaBJZo","name":"New Node","type":"*"},"position":{"x":-152.01298407423633,"y":-75.73671120344126},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"Uu4GZqb_TJaRz-PVgwJRh","name":"New Node","type":"*"},"position":{"x":-97.09201319657203,"y":-11.197002131581508},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"nq-45C27XoDmzqRl2tV24","name":"New Node","type":"*"},"position":{"x":-49.797801240279476,"y":-95.66456884428817},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"Uq_cmB4iQKmhzx6xm8w2t","name":"New Node","type":"*"},"position":{"x":42.72214993396014,"y":32.82815111664939},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"Z0ESugP4dP9VGuBybsTTa","name":"New Node","type":"*"},"position":{"x":53.83844734584833,"y":-49.07628222564569},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"amIr54UxW9cv52bercyLm","name":"New Node","type":"*"},"position":{"x":123.71907973584874,"y":29.473840718342885},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"HAnM-ZIqvf5VGlfx5C6tp","name":"New Node","type":"*"},"position":{"x":95.83442272486923,"y":95.70250793626104},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"leHwNd5WhoX88rycAb5Nc","name":"New Node","type":"*"},"position":{"x":162.81808676996593,"y":121.53985288792514},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"bClNmUg-Pst2MpL5Hw_-p","name":"New Node","type":"*"},"position":{"x":188.81413517213576,"y":55.1006649239238},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""},{"data":{"id":"sUvNl0Daw2g_aAy6rehqZ","name":"New Node","type":"*"},"position":{"x":246.1585478045368,"y":114.97857298413898},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":false,"classes":""}],"edges":[{"data":{"source":"9Ts5C4bWDoiHe9WP4WUXF","target":"Uu4GZqb_TJaRz-PVgwJRh","id":"4d9d9384-39b0-4993-bb60-cc11e898a00f"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Uu4GZqb_TJaRz-PVgwJRh","target":"TVHa8p4hPYF9XzlXP87MT","id":"319621bc-aa43-4b60-9783-32730608270e"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"TVHa8p4hPYF9XzlXP87MT","target":"A4kjlrTa31qlg4chaBJZo","id":"70797df5-421e-40d2-88de-d8a14f14151d"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Uu4GZqb_TJaRz-PVgwJRh","target":"A4kjlrTa31qlg4chaBJZo","id":"5fa85b80-8cc7-4742-9caa-714ef4f9db7e"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Uu4GZqb_TJaRz-PVgwJRh","target":"HjOisuDMMRRd2sq0QHrgw","id":"abcfdb4d-3a2d-4503-8c3b-056c1d34bd42"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Uu4GZqb_TJaRz-PVgwJRh","target":"1pln3Z2X_RbCzKo7LbRgI","id":"d1b5d053-7be0-4e89-bad4-74f1c159b005"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"1pln3Z2X_RbCzKo7LbRgI","target":"Uq_cmB4iQKmhzx6xm8w2t","id":"274620f5-e312-4bf5-83b4-b53474045843"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"nq-45C27XoDmzqRl2tV24","target":"1pln3Z2X_RbCzKo7LbRgI","id":"f1f82499-896b-4047-b758-4ee0ebb3081b"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"nq-45C27XoDmzqRl2tV24","target":"HjOisuDMMRRd2sq0QHrgw","id":"a92f5a12-be03-49c2-ae99-8368e9c5d546"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Z0ESugP4dP9VGuBybsTTa","target":"1pln3Z2X_RbCzKo7LbRgI","id":"1c1573ec-dbd6-404f-a3c4-0bc53158926c"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Z0ESugP4dP9VGuBybsTTa","target":"Uq_cmB4iQKmhzx6xm8w2t","id":"bd8d6a86-28ca-4036-ba16-52c6a430688e"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Uq_cmB4iQKmhzx6xm8w2t","target":"HjOisuDMMRRd2sq0QHrgw","id":"1ce0e4ef-1839-4a6f-9d6f-5efe4b60a422"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"HAnM-ZIqvf5VGlfx5C6tp","target":"bClNmUg-Pst2MpL5Hw_-p","id":"9bdf16b1-0068-4a16-a95b-ad4cab820aa6"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"amIr54UxW9cv52bercyLm","target":"leHwNd5WhoX88rycAb5Nc","id":"67f22d2e-0213-4879-8f79-68de21830dfa"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"amIr54UxW9cv52bercyLm","target":"HAnM-ZIqvf5VGlfx5C6tp","id":"a5acddac-f7e6-483c-89ec-dbd8fe6a3aa4"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"leHwNd5WhoX88rycAb5Nc","target":"bClNmUg-Pst2MpL5Hw_-p","id":"f6b96b7c-8802-4f2e-b599-0332991dcc68"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"HAnM-ZIqvf5VGlfx5C6tp","target":"leHwNd5WhoX88rycAb5Nc","id":"f918f03b-d974-4588-9375-92840f6c1dc4"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"bClNmUg-Pst2MpL5Hw_-p","target":"amIr54UxW9cv52bercyLm","id":"e5d7764b-ec47-4ef6-9f8f-0414ecaf5865"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"bClNmUg-Pst2MpL5Hw_-p","target":"sUvNl0Daw2g_aAy6rehqZ","id":"e6c16ace-018e-455d-a32e-54a5dd8d52a5"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"leHwNd5WhoX88rycAb5Nc","target":"sUvNl0Daw2g_aAy6rehqZ","id":"b6550cca-2b73-428a-be36-37a61f52c12f"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Uq_cmB4iQKmhzx6xm8w2t","target":"amIr54UxW9cv52bercyLm","id":"8c7770ce-cfde-4216-a868-f6145101bd79"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""},{"data":{"source":"Uq_cmB4iQKmhzx6xm8w2t","target":"HAnM-ZIqvf5VGlfx5C6tp","id":"232fe798-ac2f-4771-b858-190460c659bb"},"position":{"x":0,"y":0},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"pannable":true,"classes":""}]},"style":[{"selector":"node[name]","style":{"background-color":"rgb(102,102,102)","label":"data(name)","min-zoomed-font-size":"12px","font-size":"18px"}},{"selector":"edge","style":{"width":"2px","line-color":"rgb(204,204,204)","target-arrow-color":"rgb(204,204,204)","target-arrow-shape":"triangle","curve-style":"straight","arrow-scale":"1.5"}},{"selector":":selected","style":{"line-color":"rgb(255,0,0)","background-color":"rgb(255,0,0)","target-arrow-color":"rgb(255,0,0)"}},{"selector":".eh-handle","style":{"background-color":"rgb(255,0,0)","width":"12px","height":"12px","shape":"ellipse","overlay-opacity":"0","border-width":"12px","border-opacity":"0"}},{"selector":".eh-hover","style":{"background-color":"rgb(255,0,0)"}},{"selector":".eh-source","style":{"border-width":"2px","border-color":"rgb(255,0,0)"}},{"selector":".eh-target","style":{"border-width":"2px","border-color":"rgb(255,0,0)"}},{"selector":".eh-preview, .eh-ghost-edge","style":{"background-color":"rgb(255,0,0)","line-color":"rgb(255,0,0)","target-arrow-color":"rgb(255,0,0)","source-arrow-color":"rgb(255,0,0)"}},{"selector":".eh-ghost-edge.eh-preview-active","style":{"opacity":"0"}}],"data":{},"zoomingEnabled":true,"userZoomingEnabled":true,"zoom":2.4006893510386456,"minZoom":1e-50,"maxZoom":1e+50,"panningEnabled":true,"userPanningEnabled":true,"pan":{"x":796.885486387737,"y":345.4218116317198},"boxSelectionEnabled":true,"renderer":{"name":"canvas"},"wheelSensitivity":0.3}';
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
