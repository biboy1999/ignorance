import create from "zustand";

type OnlineUsersState = {
  usernames: { id: number; username: string }[];
  setUsernames: (userList: { id: number; username: string }[]) => void;
};

const useOnlineUsers = create<OnlineUsersState>((set) => ({
  usernames: [],
  setUsernames: (userList): void => set({ usernames: userList }),
}));

export { useOnlineUsers };
