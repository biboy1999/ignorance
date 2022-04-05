import { useEffect, useRef, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { Doc as YDoc } from "yjs";
import { Awareness } from "y-protocols/awareness";
import { useProviders } from "../../store/providers";
import { Provider, Providers } from "../../types/types";
import { generateUsername } from "../username/randomUsername";

export const useProvider = (
  ydoc: YDoc
): {
  isSynced: boolean;
  isOnlineMode: boolean;
  providers: Providers;
  awareness: Awareness;
  addProvider: (provider: Provider) => Provider;
} => {
  const [isSynced, setIsSynced] = useState(false);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const setAwareness = useProviders((states) => states.setAwareness);
  const awareness = useRef<Awareness>(new Awareness(ydoc));
  const providers = useProviders((states) => states.providers);
  const setProviders = useProviders((states) => states.setProvider);
  const setSynced = useProviders((states) => states.setSynced);
  const addProvider = (provider: Provider): Provider => {
    if (provider instanceof WebrtcProvider) {
      setProviders(provider);
      provider.on("synced", (_synced: unknown) => {
        setSynced(provider);
        setIsOnlineMode(true);
      });
    } else if (provider instanceof WebsocketProvider) {
      setProviders(provider);
      provider.on("sync", (_synced: boolean) => {
        setSynced(provider);
        setIsOnlineMode(true);
      });
    } else {
      throw new Error("Provider not supported.");
    }
    return provider;
  };

  useEffect(() => {
    setAwareness(awareness.current);
    awareness.current.setLocalStateField("username", generateUsername());
  }, []);

  useEffect(() => {
    // check synced
    const checkSynced = Object.entries(providers).every(
      ([_key, value]) => value.isSynced
    );
    setIsSynced(checkSynced);
  }, [providers, isOnlineMode]);

  useEffect(() => {
    return (): void => {
      Object.entries(providers).forEach(([_key, value]) => {
        value.provider?.destroy();
      });
    };
  }, []);

  return {
    isSynced,
    isOnlineMode,
    providers,
    awareness: awareness.current,
    addProvider,
  };
};
