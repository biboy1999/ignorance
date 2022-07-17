import { useEffect } from "react";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { providersStore } from "../../store/providers";
import { Provider } from "../../types/types";

export const useProvider = (): {
  addProvider: (provider: Provider) => Provider;
} => {
  const providers = providersStore((states) => states.providers);
  const setProviders = providersStore((states) => states.setProvider);
  const setSynced = providersStore((states) => states.setSynced);
  const addProvider = (provider: Provider): Provider => {
    if (provider instanceof WebrtcProvider) {
      setProviders(provider);
      provider.on("synced", (_synced: unknown) => {
        setSynced(provider);
      });
    } else if (provider instanceof WebsocketProvider) {
      setProviders(provider);
      provider.on("sync", (_synced: boolean) => {
        setSynced(provider);
      });
    } else {
      throw new Error("Provider not supported.");
    }
    return provider;
  };

  useEffect(() => {
    return (): void => {
      Object.entries(providers).forEach(([_key, value]) => {
        value.provider?.destroy();
      });
    };
  }, []);

  return {
    addProvider,
  };
};
