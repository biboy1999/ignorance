type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type NodeData = {
  id?: string;
  [key: string]: string | undefined;
};

export type EdgeData = {
  id?: string;
  [key: string]: string | undefined;
};

export type Edge = { source: string; target: string; id: string };

export type Node = {
  data: {
    id: string;
    [key: string]: string;
  };
  position: { x: number; y: number };
};

type ResponseNode = {
  data: {
    id?: string;
    [key: string]: string | undefined;
  };
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
