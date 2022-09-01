import { Edge, Node, NodeData } from "./types";

export type PartialBy<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

type RelationRule = {
  method: "regex" | "selector";
  filter: "attribute" | "value" | "all";
  field: string | "type" | "all";
  value: string;
};

type RelationRuleGruop = RelationRule[];

type ResponseNode = {
  data: NodeData;
  // linkToNodeId?: string;
  position?: { x: number; y: number };
};

export type TransformsResponse = {
  nodes: ResponseNode[];
  edges: Edge[];
  removeIds: string[];
  relation: RelationRuleGruop[];
  // TODO: error return type
  error?: Record<string, string>;
};

export function isTransformsResponse(x: object): x is TransformsResponse {
  return x instanceof Object;
}

export type TransformRequest = {
  nodes?: PartialBy<Node, "position" | "group">[];
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
