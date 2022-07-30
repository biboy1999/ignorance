import { Edge, Node, NodeData } from "./types";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<T>;

type ResponseNode = {
  data: NodeData;
  linkToNodeId?: string;
  position?: { x: number; y: number };
};

export type TransformsResponse = {
  add?: {
    nodes?: ResponseNode[];
    edges?: PartialBy<Edge, "id">[];
  };
  delete?: {
    nodesId?: string[];
    edgesId?: string[];
  };
  update?: {
    nodes?: PartialBy<Node, "position">[];
  };
};

// export type TransformsResponse = {
//   nodes: ResponseNode[];
//   edges: PartialBy<Edge, "id">[];
// };

export function isTransformsResponse(x: object): x is TransformsResponse {
  return x instanceof Object;
}

export type TransformRequest = {
  nodes?: PartialBy<Node, "position">[];
  edges?: Edge[];
  parameter?: {
    [option: string]: string;
  };
};

type TransformsJobParameter = {
  nodesId?: string[];
  edgesId?: string[];
  parameter: {
    [option: string]: string;
  };
};

export type TransformJob = {
  jobId: string;
  status: "failed" | "rejected" | "completed" | "pending" | "running";
  fromClientId: number;
  transformId: string;
  request: TransformsJobParameter;
};

// used in ydoc
export type SharedTransform = Omit<InternalTransform, "apiUrl"> & {
  clientId: number;
};

export function isTrnasformProvider(x: unknown): x is SharedTransform {
  return (
    x != null &&
    typeof x === "object" &&
    "transformId" in x &&
    "clientId" in x &&
    "name" in x &&
    "description" in x &&
    "elementType" in x &&
    "parameter" in x
  );
}

// used in local state
export type InternalTransform = {
  transformId: string;
  name: string;
  description: string;
  elementType: string[];
  apiUrl: string;
  parameter: {
    [option: string]: string;
  };
};
