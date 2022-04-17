import { nanoid } from "nanoid";
import { Map as YMap } from "yjs";
import { YNodeData, YNodeGroup, YNodePosition } from "../types/types";

export const AddNode = (
  x: number,
  y: number
): {
  nodeId: string;
  node: YMap<string | YNodeData | YNodePosition>;
} => {
  const nodeId = nanoid();

  const data = new YMap<string>();
  data.set("id", nodeId);
  data.set("name", "New Node");
  data.set("type", "people");
  data.set("testattr", "test");

  const position = new YMap<number>();
  position.set("x", x);
  position.set("y", y);

  const node = new YMap<YNodeGroup | YNodeData | YNodePosition>();
  node.set("group", "nodes");
  node.set("data", data);
  node.set("renderedPosition", position);

  return { nodeId, node };
  // ynodes.current?.set(nodeId, node);
};
