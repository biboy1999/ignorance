import produce from "immer";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";
import create from "zustand";
import { Provider, Providers } from "../types/types";

type providerState = {
  providers: Providers;
  awareness: Awareness | undefined;
  setAwareness: (awareness: Awareness) => Awareness;
  setProvider: (provider: Provider) => void;
  setSynced: (provider: Provider) => void;
};

const useProviders = create<providerState>((set) => ({
  providers: {
    webrtc: { provider: undefined, isSynced: false },
    websocket: { provider: undefined, isSynced: false },
  },
  awareness: undefined,
  setAwareness: (awareness): Awareness => {
    set({ awareness: awareness });
    return awareness;
  },
  setProvider: (provider): void => {
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
  setSynced: (provider): void => {
    if (provider instanceof WebrtcProvider) {
      set(
        produce((state: providerState) => {
          state.providers.webrtc.isSynced = true;
        })
      );
    } else if (provider instanceof WebsocketProvider) {
      set(
        produce((state: providerState) => {
          state.providers.websocket.isSynced = true;
        })
      );
    } else {
      throw new Error("Provider not supported.");
    }
  },
}));

export { useProviders };
