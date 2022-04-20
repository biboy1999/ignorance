import { nanoid } from "nanoid";
import { Map as YMap } from "yjs";
import { YNodeData, YNodeGroup, YNodePosition, YNodes } from "../types/types";
import { renderedPositionToModel } from "./canvas";

type NodeData = {
  id?: string;
  [key: string]: string | undefined;
};

export type AddNodeReturnValue = {
  nodeId: string;
  node: YMap<string | YNodeData | YNodePosition>;
};

export const AddNode = (
  x: number,
  y: number,
  nodeData?: NodeData,
  pan?: { x: number; y: number },
  zoom?: number
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
  if (zoom && pan) ({ x, y } = renderedPositionToModel({ x, y }, zoom, pan));
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

// export const deleteEdges = (id: string[], ynodes: Edges): void => {
//   ynodes.doc?.transact(() => {
//     id.forEach((id) => ynodes.delete(id));
//   });
// };
