import create from "zustand";

type onlineUsers = {
  usernames: { id: number; username: string }[];
  setUsernames: (userList: { id: number; username: string }[]) => void;
};

const useOnlineUsers = create<onlineUsers>((set) => ({
  usernames: [],
  setUsernames: (userList): void => set({ usernames: userList }),
}));

export { useOnlineUsers };
