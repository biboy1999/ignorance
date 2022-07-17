import { atom } from "jotai";
import { atomWithStore } from "jotai/zustand";
import { Awareness } from "y-protocols/awareness";
import { ydocAtom } from "./yjs";
import { providersStore } from "../store/providers";

export const providersStoreAtom = atomWithStore(providersStore);

// export const awarenessAtom = atom<Awareness>(
//   (get) =>
//     Object.entries(get(providersStoreAtom).providers).find(
//       ([_key, value]) => value.provider?.awareness != null
//     )?.[1].provider?.awareness ?? new Awareness(get(ydocAtom))
// );

// export const awarenessAtom = atom<Awareness | undefined>(
//   (get) =>
//     Object.entries(get(providersStoreAtom).providers).find(
//       ([_key, value]) => value.provider?.awareness != null
//     )?.[1].provider?.awareness
// );

export const awarenessAtom = atom<Awareness | null, unknown>(
  (get) => get(providersStoreAtom).awareness,
  (get, set, _arg) => {
    if (get(providersStoreAtom).awareness == null) {
      set(providersStoreAtom, (prev) => ({
        ...prev,
        awareness: new Awareness(get(ydocAtom)),
      }));
    }
  }
);

awarenessAtom.onMount = (dispatch): void => {
  dispatch();
};

export const isSyncedAtom = atom((get) =>
  Object.entries(get(providersStoreAtom).providers).every(([_key, value]) =>
    // check only added provider
    value.provider ? value.isSynced : true
  )
);

export const isOnlineModeAtom = atom((get) =>
  Object.entries(get(providersStoreAtom).providers).some(
    // check there is any provider
    ([_key, value]) => value.provider
  )
);
