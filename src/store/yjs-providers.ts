import produce from "immer";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";
import { StateCreator } from "zustand";
import { YjsProvider, YjsProvidersStore } from "../types/types";
import { YjsSlice } from "./yjs";

export type YjsProviderSlice = {
  providersStore: YjsProvidersStore;
  awareness: Awareness | undefined;
  getAwareness: () => Awareness;
  addProvider: (provider: YjsProvider) => void;
};

export const createYjsProviderSlice: StateCreator<
  YjsProviderSlice & YjsSlice,
  [],
  [],
  YjsProviderSlice
> = (set, get) => ({
  providersStore: {
    webrtc: { provider: undefined, isSynced: false },
    websocket: { provider: undefined, isSynced: false },
  },
  awareness: undefined,
  getAwareness: (): Awareness => {
    const storedAwareness = get().awareness;
    if (storedAwareness == null) {
      const awareness = new Awareness(get().ydoc);
      set(() => ({ awareness }));
      return awareness;
    }
    return storedAwareness;
  },
  addProvider: (provider): void => {
    if (provider instanceof WebrtcProvider) {
      // set isSynced
      provider.on("synced", (_synced: unknown) => {
        set(
          produce((state: YjsProviderSlice) => {
            state.providersStore.webrtc.isSynced = true;
          })
        );
      });
      // set provider
      set(
        produce((state: YjsProviderSlice) => {
          state.providersStore.webrtc.provider = provider;
        })
      );
    } else if (provider instanceof WebsocketProvider) {
      // set isSynced
      provider.on("sync", (_synced: boolean) => {
        set(
          produce((state: YjsProviderSlice) => {
            state.providersStore.websocket.isSynced = true;
          })
        );
      });
      // set provider
      set(
        produce((state: YjsProviderSlice) => {
          state.providersStore.websocket.provider = provider;
        })
      );
    } else {
      throw new Error("Provider not supported.");
    }
  },
});
