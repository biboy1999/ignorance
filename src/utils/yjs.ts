import { nanoid } from "nanoid";
import * as Y from "yjs";
import { Edge, Elements, isNode, Node } from "../types/types";
import {
  isYData,
  YEdge,
  YElement,
  YNode,
  YData,
  YElementGroup,
  YNodePosition,
} from "../types/yjs";

export type AddNodeReturnValue = {
  nodeId: string;
  ynode: YNode;
};

export const addYjsNode = (
  node: Node,
  yelements?: Y.Map<YElement>
): AddNodeReturnValue => {
  const { data, position } = node;
  const { id, ...remainData } = data;
  const nodeId = id ?? nanoid();

  const { x, y } = position;

  // update node if exist
  if (yelements?.has(nodeId)) {
    const exist_ynode = yelements.get(nodeId) as YNode;
    const exist_ydata = exist_ynode?.get("data") as YData;
    const exist_yposition = exist_ynode?.get("position") as YNodePosition;

    Object.entries(remainData).forEach(([k, v]) => {
      if (v) exist_ydata.set(k, v);
    });

    exist_yposition.set("x", x);
    exist_yposition.set("y", y);

    return { nodeId, ynode: exist_ynode };
  }

  // set data
  const ydata = new Y.Map<string>();
  ydata.set("id", nodeId);
  ydata.set("label", "New Node");
  ydata.set("type", "*");

  Object.entries(remainData).forEach(([k, v]) => {
    if (v) ydata.set(k, v);
  });

  // set position
  const yposition = new Y.Map<number>();

  yposition.set("x", x);
  yposition.set("y", y);

  const ynode = new Y.Map<YElementGroup | YData | YNodePosition>();
  ynode.set("group", "nodes");
  ynode.set("data", ydata);
  ynode.set("position", yposition);

  if (yelements) {
    yelements.set(nodeId, ynode);
  }

  return { nodeId, ynode };
};

export const deleteYjsNodes = (ids: string[], ynodes: Y.Map<YNode>): void => {
  ynodes.doc?.transact(() => {
    ids.forEach((id) => ynodes.delete(id));
  });
};

export const moveYjsNodes = (
  ynodes: Y.Map<YNode>,
  childrenIds: string[],
  parentId: string | null
): void => {
  ynodes.doc?.transact(() => {
    childrenIds.forEach((cid) => {
      const ynodeData = ynodes.get(cid)?.get("data");
      if (!isYData(ynodeData)) return;
      if (parentId == null) ynodeData.delete("parent");
      else ynodeData.set("parent", parentId);
    });
  });
};

export type AddEdgeReturnValue = {
  edgeId: string;
  yedge: YEdge;
};

export const addYjsEdge = (
  edge: Edge,
  yelements?: Y.Map<YElement>
): AddEdgeReturnValue => {
  const { data } = edge;
  const { id, source, target, ...remainData } = data;
  const edgeId = id ?? nanoid();

  if (yelements?.has(edgeId)) {
    const exist_yedge = yelements.get(edgeId) as YEdge;
    const yedgeData = exist_yedge.get("data") as YData;

    Object.entries(remainData).forEach(([k, v]) => {
      if (v) yedgeData.set(k, v);
    });

    return { edgeId, yedge: exist_yedge };
  }

  const ydata = new Y.Map<string>();
  ydata.set("id", edgeId);
  ydata.set("target", target);
  ydata.set("source", source);
  ydata.set("type", "*");
  ydata.set("label", "");

  Object.entries(remainData).forEach(([k, v]) => {
    if (v) ydata.set(k, v);
  });

  const yedge = new Y.Map<YElementGroup | YData>();
  yedge.set("group", "edges");
  yedge.set("data", ydata);

  if (yelements) {
    yelements.set(edgeId, yedge);
  }

  return { edgeId, yedge };
};

export const deleteYjsEdges = (ids: string[], yedges: Y.Map<Edge>): void => {
  yedges.doc?.transact(() => {
    ids.forEach((id) => yedges.delete(id));
  });
};

export const addYjsElements = (
  elements: Elements[],
  yelements?: Y.Map<YElement>
): YElement[] => {
  const result: YElement[] = [];
  for (const element of elements) {
    if (isNode(element)) {
      addYjsNode(element, yelements);
    } else {
      addYjsEdge(element, yelements);
    }
  }
  return result;
};
