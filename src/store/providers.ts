import produce from "immer";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";
import create from "zustand";
import { Doc as YDoc } from "yjs";
import { Provider, Providers } from "../types/types";

type providerState = {
  providers: Providers;
  awareness: Awareness | null;
  initAwareness: (ydoc: YDoc) => void;
  setProvider: (provider: Provider) => void;
  setSynced: (provider: Provider) => void;
};

export const providersStore = create<providerState>()((set) => ({
  providers: {
    webrtc: { provider: undefined, isSynced: false },
    websocket: { provider: undefined, isSynced: false },
  },
  awareness: null,
  initAwareness: (ydoc): void =>
    set(() => ({ awareness: new Awareness(ydoc) })),
  setProvider: (provider): void => {
    if (provider instanceof WebrtcProvider) {
      // set isSynced
      provider.on("synced", (_synced: unknown) => {
        set(
          produce((state: providerState) => {
            state.providers.webrtc.isSynced = true;
          })
        );
      });
      // set provider
      set(
        produce((state: providerState) => {
          state.providers.webrtc.provider = provider;
        })
      );
    } else if (provider instanceof WebsocketProvider) {
      // set isSynced
      provider.on("sync", (_synced: boolean) => {
        set(
          produce((state: providerState) => {
            state.providers.websocket.isSynced = true;
          })
        );
      });
      // set provider
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
