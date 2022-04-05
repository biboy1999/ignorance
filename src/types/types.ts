import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type Edge = { source: string; target: string; id: string };

export type Node = {
  data: {
    id: string;
    [key: string]: string;
  };
  position: { x: number; y: number };
};

export type YNodePosition = Y.Map<number>;

// export type YNodeId = string;
// export type YNodeProp = { attrid: string; value: string };

export type YNodeData = Y.Map<string>;

export type YNodeGroup = string;

export type YNode = Y.Map<YNodeGroup | YNodeData | YNodePosition>;

export function isYNodeData(x: any): x is Y.Map<string> {
  return x instanceof Y.Map && x.has("id");
}

export function isYNodePosition(x: any): x is Y.Map<number> {
  return (
    x instanceof Y.Map &&
    typeof x.get("x") === "number" &&
    typeof x.get("y") === "number"
  );
}

export type YEdges = Y.Array<Edge>;

export type YNodes = Y.Map<YNode>;

type ResponseNode = {
  data: {
    id?: string;
    [key: string]: string | undefined;
  };
  position?: { x: number; y: number };
};

type TransformsResponse = {
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

type TransformsRequest = {
  nodes?: Node[];
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

type TransformsJob = {
  JobId: string;
  fromClientId: number;
  transformId: string;
  request: TransformsJobParameter;
};

type YTransformJobsBuffer = Y.Array<TransformsJob>;

type TransformOffer = {
  clientId: number;
  elementType: string[];
  transformId: string;
  name: string;
  desription: string;
  parameter: {
    [option: string]: string;
  };
};

export type Providers = {
  webrtc: { provider: WebrtcProvider | undefined; isSynced: boolean };
  websocket: { provider: WebsocketProvider | undefined; isSynced: boolean };
};

export type Provider = WebrtcProvider | WebsocketProvider;
