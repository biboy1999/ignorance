import { useEffect, useState } from "react";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { useProviders } from "../../store/providers";
import { Provider } from "../../types";

export const useProvider = () => {
  const [isSynced, setIsSynced] = useState(false);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const providers = useProviders((states) => states.providers);

  const addProviders = (provider: Provider) => {
    if (provider instanceof WebrtcProvider) {
    } else if (provider instanceof WebsocketProvider) {
    } else {
      throw new Error("Provider not supported.");
    }
  };

  useEffect(() => {
    // check synced
    const checkSynced = Object.entries(providers).every(
      ([_key, value]) => value.isSynced
    );
    setIsSynced(checkSynced);
  }, [providers]);

  return { isSynced, isOnlineMode, providers };
};
