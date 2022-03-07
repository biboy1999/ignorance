import produce from "immer";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import create from "zustand";
import { Provider, Providers } from "../types";

type providerState = {
  providers: Providers;
  setProvider: (provider: Provider) => void;
};

const useProviders = create<providerState>((set, get) => ({
  providers: {
    webrtc: { provider: undefined, isSynced: false },
    websocket: { provider: undefined, isSynced: false },
  },
  setProvider: (provider) => {
    if (provider instanceof WebrtcProvider) {
      set(
        produce((state: providerState) => {
          state.providers.webrtc.provider = provider;
        })
      );
    } else if (provider instanceof WebsocketProvider) {
      set(
        produce((state: providerState) => {
          state.providers.websocket.provider = provider;
        })
      );
    } else {
      throw new Error("Provider not supported.");
    }
  },
}));

export { useProviders };
