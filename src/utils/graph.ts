import { nanoid } from "nanoid";
import { Map as YMap } from "yjs";
import {
  Edge,
  YNodeData,
  YNodeGroup,
  YNodePosition,
  YNodes,
} from "../types/types";
import { renderedPositionToModel } from "./canvas";

type NodeData = {
  id?: string;
  [key: string]: string | undefined;
};

export type AddNodeReturnValue = {
  nodeId: string;
  node: YMap<string | YNodeData | YNodePosition>;
};

export type AddEdgeReturnValue = {
  edgeId: string;
  edge: Edge;
};

export const AddNode = (
  x: number,
  y: number,
  nodeData?: NodeData,
  opt?: {
    pan?: { x: number; y: number };
    zoom?: number;
  }
): AddNodeReturnValue => {
  const { id: preDefindedId, ...remainData } = nodeData ?? {};
  const nodeId = preDefindedId ?? nanoid();

  const data = new YMap<string>();
  data.set("id", nodeId);
  data.set("name", "New Node");
  data.set("type", "*");

  if (remainData) {
    Object.entries(remainData).forEach(([k, v]) => {
      if (v) data.set(k, v);
    });
  }

  const position = new YMap<number>();
  if (opt?.zoom && opt?.pan)
    ({ x, y } = renderedPositionToModel({ x, y }, opt.zoom, opt.pan));
  position.set("x", x);
  position.set("y", y);

  const renderPosition = new YMap<number>();
  renderPosition.set("x", x);
  renderPosition.set("y", y);

  const node = new YMap<YNodeGroup | YNodeData | YNodePosition>();
  node.set("group", "nodes");
  node.set("data", data);
  node.set("position", position);

  return { nodeId, node };
};

export const deleteNodes = (id: string[], ynodes: YNodes): void => {
  ynodes.doc?.transact(() => {
    id.forEach((id) => ynodes.delete(id));
  });
};

export const addEdge = (
  source: string,
  target: string,
  id?: string
): AddEdgeReturnValue => {
  const edgeId = id ?? nanoid();

  return { edgeId, edge: { source, target, id: edgeId } };
};

export const deleteEdges = (id: string[], ynodes: YMap<Edge>): void => {
  ynodes.doc?.transact(() => {
    id.forEach((id) => ynodes.delete(id));
  });
};

export const doLayout = (
  elementsToLayout: cytoscape.CollectionReturnValue
): void => {
  const layout = elementsToLayout.layout({
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
    animate: false,
    // Duration of animation in ms, if enabled
    animationDuration: 1000,
    // Easing of animation, if enabled
    animationEasing: undefined,
    // Fit the viewport to the repositioned nodes
    fit: false,
    // Padding around layout
    padding: 30,
    // Whether to include labels in node dimensions. Valid in "proof" quality
    nodeDimensionsIncludeLabels: true,
    // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
    uniformNodeDimensions: false,
    // Whether to pack disconnected components - cytoscape-layout-utilities extension should be registered and initialized
    packComponents: true,
    // Layout step - all, transformed, enforced, cose - for debug purpose only
    step: "all",

    /* spectral layout options */

    // False for random, true for greedy sampling
    samplingType: true,
    // Sample size to construct distance matrix
    sampleSize: 25,
    // Separation amount between nodes
    nodeSeparation: 150,
    // Power iteration tolerance
    piTol: 0.0000001,

    /* incremental layout options */

    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: (_node) => 1000,
    // Ideal edge (non nested) length
    idealEdgeLength: (_edge) => 180,
    // Divisor to compute edge forces
    edgeElasticity: (_edge) => 0.5,
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 0.1,
    // Maximum number of iterations to perform - this is a suggested value and might be adjusted by the algorithm as required
    numIter: 10000,
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
