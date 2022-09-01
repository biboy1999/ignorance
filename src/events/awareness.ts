import { Awareness } from "y-protocols/awareness";
import { useOnlineUsers } from "../store/online-users";

export const initAwareness = (awareness: Awareness): (() => void) => {
  const setUsernames = useOnlineUsers.getState().setUsernames;
  const handleUpdateUserList = (
    _actions: {
      added: Array<number>;
      updated: Array<number>;
      removed: Array<number>;
    },
    _tx: Record<string, unknown> | string
  ): void => {
    const onlineUsers = Array.from(awareness.getStates(), ([key, value]) => ({
      id: key,
      username: value.username,
    }));
    setUsernames(onlineUsers);
  };

  awareness.on("change", handleUpdateUserList);
  return () => {
    awareness.off("change", handleUpdateUserList);
  };
};
