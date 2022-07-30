import { nanoid } from "nanoid";
import { Map as YMap } from "yjs";
import { Edge, NodeData } from "../types/types";
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
  source: string,
  target: string,
  opt?: {
    id?: string;
    yedges: YMap<Edge>;
  }
): AddEdgeReturnValue => {
  const edgeId = opt?.id ?? nanoid();
  const edge = { source, target, id: edgeId };

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
  // set data
  const data = new YMap<string>();
  data.set("id", nodeId);
  data.set("name", "New Node");
  data.set("type", "*");

  if (remainData) {
    Object.entries(remainData).forEach(([k, v]) => {
      if (v) data.set(k, v);
    });
  }

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

export const deleteYjsNodes = (id: string[], ynodes: YMap<YNode>): void => {
  ynodes.doc?.transact(() => {
    id.forEach((id) => ynodes.delete(id));
  });
};

export const deleteYjsEdges = (id: string[], ynodes: YMap<Edge>): void => {
  ynodes.doc?.transact(() => {
    id.forEach((id) => ynodes.delete(id));
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
