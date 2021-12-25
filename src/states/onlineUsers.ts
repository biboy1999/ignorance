import create from "zustand";

type onlineUsers = {
  usernames: string[];
  setUsernames: (userList: string[]) => void;
};

const useOnlineUsers = create<onlineUsers>((set) => ({
  usernames: [],
  setUsernames: (userList): void => set({ usernames: userList }),
}));

export { useOnlineUsers };
