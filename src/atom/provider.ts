import { atom } from "jotai";
import { atomWithStore } from "jotai/zustand";
import { useStore } from "../store/store";

export const store = atomWithStore(useStore);

export const isSyncedAtom = atom((get) =>
  Object.entries(get(store).providersStore).every(([_key, value]) =>
    // check only added provider
    value.provider ? value.isSynced : true
  )
);

export const isOnlineModeAtom = atom((get) =>
  Object.entries(get(store).providersStore).some(
    // check there is any provider
    ([_key, value]) => value.provider
  )
);
