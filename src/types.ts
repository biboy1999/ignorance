import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

type YNodePosition = Y.Map<number>;

type YNodeProp = string;

type YNodeData = Y.Map<YNodeProp>;

type YNodeGroup = string;

type YNode = Y.Map<YNodeGroup | YNodeData | YNodePosition>;

type YNodes = Y.Map<YNode>;

type Providers = {
  webrtc: { provider: WebrtcProvider | undefined; isSynced: boolean };
  websocket: { provider: WebsocketProvider | undefined; isSynced: boolean };
};

type Provider = WebrtcProvider | WebsocketProvider;

export type {
  YNodes,
  YNode,
  YNodeGroup,
  YNodeData,
  YNodePosition,
  Provider,
  Providers,
};
