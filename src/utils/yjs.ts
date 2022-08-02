import { nanoid } from "nanoid";
import { Map as YMap } from "yjs";
import { Edge, EdgeData, NodeData } from "../types/types";
import {
  isYNodeData,
  YNode,
  YNodeData,
  YNodeGroup,
  YNodePosition,
} from "../types/yjs";
import { renderedPositionToModel } from "./canvas";

export type AddNodeReturnValue = {
  nodeId: string;
  node: YMap<string | YNodeData | YNodePosition>;
};

export type AddEdgeReturnValue = {
  edgeId: string;
  edge: Edge;
};

export const addYjsEdge = (
  edgeData: EdgeData,
  source: string,
  target: string,
  opt?: {
    yedges: YMap<Edge>;
  }
): AddEdgeReturnValue => {
  const { id: preDefindedId } = edgeData;
  const edgeId = preDefindedId ?? nanoid();

  if (opt?.yedges.has(edgeId)) {
    const existedEdgeData = opt.yedges.get(edgeId) as Edge;
    const newEdgeData = { ...existedEdgeData, ...edgeData, id: edgeId };
    opt.yedges.set(edgeId, newEdgeData);
    return { edgeId, edge: newEdgeData };
  }

  const edge = { source, target, id: edgeId, label: "", ...edgeData };

  if (opt?.yedges) opt.yedges.set(edgeId, edge);

  return { edgeId, edge };
};

export const addYjsNode = (
  nodeData: NodeData,
  x: number,
  y: number,
  opt?: {
    ynodes?: YMap<YNode>;
    pan?: { x: number; y: number };
    zoom?: number;
  }
): AddNodeReturnValue => {
  const { id: preDefindedId, ...remainData } = nodeData;
  const nodeId = preDefindedId ?? nanoid();
  // TODO: refactor :/
  // update node if exist
  if (opt?.ynodes?.has(nodeId)) {
    const ynode = opt.ynodes.get(nodeId) as YNode;
    const ynodedata = ynode?.get("data") as YNodeData;
    const yposition = ynode?.get("position") as YNodePosition;

    Object.entries(remainData).forEach(([k, v]) => {
      if (v) ynodedata.set(k, v);
    });

    yposition.set("x", x);
    yposition.set("y", y);

    return { nodeId, node: ynode };
  }
  // set data
  const data = new YMap<string>();
  data.set("id", nodeId);
  data.set("label", "New Node");
  data.set("type", "*");

  Object.entries(remainData).forEach(([k, v]) => {
    if (v) data.set(k, v);
  });

  // set position
  const position = new YMap<number>();
  if (opt?.zoom && opt?.pan)
    ({ x, y } = renderedPositionToModel({ x, y }, opt.zoom, opt.pan));

  position.set("x", x);
  position.set("y", y);

  const node = new YMap<YNodeGroup | YNodeData | YNodePosition>();
  node.set("group", "nodes");
  node.set("data", data);
  node.set("position", position);

  if (opt?.ynodes) {
    if (opt.ynodes.get(nodeId) != null) opt.ynodes.delete(nodeId);
    opt?.ynodes.set(nodeId, node);
  }

  return { nodeId, node };
};

export const deleteYjsNodes = (ids: string[], ynodes: YMap<YNode>): void => {
  ynodes.doc?.transact(() => {
    ids.forEach((id) => ynodes.delete(id));
  });
};

export const deleteYjsEdges = (ids: string[], yedges: YMap<Edge>): void => {
  yedges.doc?.transact(() => {
    ids.forEach((id) => yedges.delete(id));
  });
};

export const moveYjsNodes = (
  ynodes: YMap<YNode>,
  childrenIds: string[],
  parentId: string | null
): void => {
  ynodes.doc?.transact(() => {
    childrenIds.forEach((cid) => {
      const ynodeData = ynodes.get(cid)?.get("data");
      if (!isYNodeData(ynodeData)) return;
      if (parentId == null) ynodeData.delete("parent");
      else ynodeData.set("parent", parentId);
    });
  });
};
