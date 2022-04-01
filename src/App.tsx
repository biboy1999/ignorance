import { createContext, MutableRefObject, useEffect, useRef } from "react";
import { Doc, Map as YMap } from "yjs";
import { v4 as uuidv4 } from "uuid";
import { Awareness } from "y-protocols/awareness";
import { Core } from "cytoscape";
import "./App.css";
import {
  YNodeGroup,
  YNodeData,
  YNodePosition,
  YNodes,
  Provider,
  Providers,
  YNodeProp,
  YEdges,
} from "./types";
import { UserInfo } from "./components/panel/UserInfo";
import { useSelectedNodes } from "./store/selectedNodes";
import { Graph } from "./components/Graph";
import { NodeAttributes } from "./components/panel/NodeAttributes";
import { Controlbar } from "./components/Controlbar";
import { Statusbar } from "./components/Statusbar";
import { useYDoc } from "./utils/hooks/useYDoc";
import { useProvider } from "./utils/hooks/useProvider";
import { Transforms } from "./components/panel/Transforms";
import { WebrtcProvider } from "y-webrtc";

type ProviderDocContextProps = {
  ydoc: MutableRefObject<Doc>;
  ynodes: MutableRefObject<YNodes>;
  yedges: MutableRefObject<YEdges>;
  awareness: Awareness;
  addProvider: (provider: Provider) => Provider;
  providers: Providers;
  isSynced: boolean;
  isOnlineMode: boolean;
  cy: MutableRefObject<Core | undefined>;
};

// im sure is defined, i think. :/
export const ProviderDocContext = createContext<ProviderDocContextProps>(
  {} as ProviderDocContextProps
);

function App(): JSX.Element {
  const { ydoc, ynodes, yedges } = useYDoc();

  const { isSynced, isOnlineMode, awareness, addProvider, providers } =
    useProvider(ydoc.current);

  const cy = useRef<cytoscape.Core>();

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

  const doLayout = (): void => {
    const selectedEles = cy.current?.$(":selected");
    if (!selectedEles) return;
    const layout = selectedEles.layout({
      name: "fcose",
      // 'draft', 'default' or 'proof'
      // - "draft" only applies spectral layout
      // - "default" improves the quality with incremental layout (fast cooling rate)
      // - "proof" improves the quality with incremental layout (slow cooling rate)
      // @ts-expect-error fcose not typped
      quality: "proof",
      // Use random node positions at beginning of layout
      // if this is set to false, then quality option must be "proof"
      randomize: true,
      // Whether or not to animate the layout
      animate: true,
      // Duration of animation in ms, if enabled
      animationDuration: 1000,
      // Easing of animation, if enabled
      animationEasing: undefined,
      // Fit the viewport to the repositioned nodes
      fit: true,
      // Padding around layout
      padding: 30,
      // Whether to include labels in node dimensions. Valid in "proof" quality
      nodeDimensionsIncludeLabels: false,
      // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
      uniformNodeDimensions: true,
      // Whether to pack disconnected components - cytoscape-layout-utilities extension should be registered and initialized
      packComponents: true,
      // Layout step - all, transformed, enforced, cose - for debug purpose only
      step: "all",

      /* spectral layout options */

      // False for random, true for greedy sampling
      // samplingType: true,
      // Sample size to construct distance matrix
      // sampleSize: 25,
      // Separation amount between nodes
      // nodeSeparation: 150,
      // Power iteration tolerance
      // piTol: 0.0000001,

      /* incremental layout options */

      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: (_node) => 4500,
      // Ideal edge (non nested) length
      idealEdgeLength: (_edge) => 200,
      // Divisor to compute edge forces
      edgeElasticity: (_edge) => 0.45,
      // Nesting factor (multiplier) to compute ideal edge length for nested edges
      nestingFactor: 0.1,
      // Maximum number of iterations to perform - this is a suggested value and might be adjusted by the algorithm as required
      numIter: 2500,
      // For enabling tiling
      tile: true,
      // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingVertical: 10,
      // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
      tilingPaddingHorizontal: 10,
      // Gravity force (constant)
      gravity: 0.25,
      // Gravity range (constant) for compounds
      gravityRangeCompound: 1.5,
      // Gravity force (constant) for compounds
      gravityCompound: 1.0,
      // Gravity range (constant)
      gravityRange: 3.8,
      // Initial cooling factor for incremental layout
      initialEnergyOnIncremental: 0.3,

      /* constraint options */

      // Fix desired nodes to predefined positions
      // [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
      // fixedNodeConstraint: undefined,
      // Align desired nodes in vertical/horizontal direction
      // {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
      // alignmentConstraint: undefined,
      // Place two nodes relatively in vertical/horizontal direction
      // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
      // relativePlacementConstraint: undefined,

      /* layout event callbacks */
      // ready: () => {}, // on layoutready
      // stop: () => {}, // on layoutstop
    });
    layout?.run();
  };

  const contextValue = {
    ydoc,
    ynodes,
    yedges,
    awareness,
    addProvider,
    providers,
    isSynced,
    isOnlineMode,
    cy,
  };
  return (
    <>
      <ProviderDocContext.Provider value={contextValue}>
        <UserInfo />
        <Transforms />
        <NodeAttributes nodes={nodes} ynodesRef={ynodes} />
        <Controlbar
          onAdd={handleAddNode}
          onDelete={handleDeleteNode}
          onLayout={doLayout}
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
