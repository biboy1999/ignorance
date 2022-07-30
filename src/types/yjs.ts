import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { Map as YMap } from "yjs";

export type YNodeData = YMap<string>;

export function isYNodeData(x: unknown): x is YMap<string> {
  return x instanceof YMap && x.has("id");
}

export type YNodePosition = YMap<number>;

export function isYNodePosition(x: unknown): x is YMap<number> {
  return (
    x instanceof YMap &&
    typeof x.get("x") === "number" &&
    typeof x.get("y") === "number"
  );
}

export type YNodeGroup = string;

export type YNode = YMap<YNodeGroup | YNodeData | YNodePosition>;

export type YjsProvidersStore = {
  webrtc: { provider: WebrtcProvider | undefined; isSynced: boolean };
  websocket: { provider: WebsocketProvider | undefined; isSynced: boolean };
};

export type YjsProvider = WebrtcProvider | WebsocketProvider;
