import { PartialBy } from "./transform";

export type EdgeData = {
  id: string;
  source: string;
  target: string;
  [key: string]: string;
};

export type Edge = {
  data: EdgeData | PartialBy<EdgeData, "id">;
  group: "edges";
};

export const isEdge = (x: Record<string, unknown>): x is Edge => {
  return (
    typeof x === "object" &&
    x !== null &&
    "data" in x &&
    "group" in x &&
    x.group === "edges"
  );
};

export type NodeData = {
  id: string;
  [key: string]: string | undefined;
};

export type Node = {
  data: NodeData | Partial<NodeData>;
  group: "nodes";
  position: { x: number; y: number };
};

export const isNode = (x: Record<string, unknown>): x is Node => {
  return (
    typeof x === "object" &&
    x !== null &&
    "data" in x &&
    "group" in x &&
    x.group === "nodes"
  );
};

export type Elements = Edge | Node;
