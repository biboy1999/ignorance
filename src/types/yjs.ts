import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { Map as YMap } from "yjs";

export type YData = YMap<string>;

export const isYData = (x: unknown): x is YMap<string> => {
  return x instanceof YMap && x.has("id");
};

export type YNodePosition = YMap<number>;

export const isYNodePosition = (x: unknown): x is YMap<number> => {
  return (
    x instanceof YMap &&
    typeof x.get("x") === "number" &&
    typeof x.get("y") === "number"
  );
};

export type YElementGroup = string;

export type YNode = YMap<YElementGroup | YData | YNodePosition>;

export const isYNode = (x: unknown): x is YNode => {
  return (
    x instanceof YMap &&
    typeof x.get("group") === "string" &&
    x.get("group") === "nodes" &&
    isYData(x.get("data")) &&
    isYNodePosition(x.get("position"))
  );
};

export type YEdge = YMap<YElementGroup | YData>;

export type YElement = YNode | YEdge;

export type YjsProvidersStore = {
  webrtc: { provider: WebrtcProvider | undefined; isSynced: boolean };
  websocket: { provider: WebsocketProvider | undefined; isSynced: boolean };
};

export type YjsProvider = WebrtcProvider | WebsocketProvider;
