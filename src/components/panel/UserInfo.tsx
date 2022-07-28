import { ChangeEvent, useEffect } from "react";
import { useOnlineUsers } from "../../store/online-users";
import { generateUsername } from "../../utils/username/randomUsername";
import { useStore } from "../../store/store";
import { TabData } from "rc-dock";

export const UserInfo = (): JSX.Element => {
  const onlineUsers = useOnlineUsers((states) => states.usernames);
  const getAwareness = useStore((state) => state.getAwareness);

  useEffect(() => {
    getAwareness().setLocalStateField("username", generateUsername());
  }, []);

  const handleUpdateUsername = (e: ChangeEvent<HTMLInputElement>): void => {
    getAwareness().setLocalStateField("username", e.target.value);
  };

  const handleColorOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    getAwareness().setLocalStateField("color", e.target.value);
  };
  return (
    <>
      <div className="flex flex-col p-1 overflow-hidden">
        <div className="flex items-center">
          <input
            type="text"
            id="username"
            placeholder="username"
            className="flex-1 p-1 min-w-0"
            onChange={handleUpdateUsername}
          />
          <input
            type="color"
            id="user-color"
            className="flex-1 max-w-[75px] m-1"
            onChange={handleColorOnChange}
          />
        </div>
        <div className="flex-1 divide-y-2 divide-solid overflow-y-auto">
          {onlineUsers.map((user) => (
            <div key={user.id} className="styled-panel font-mono leading-loose">
              {user.username}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const UserInfoTab: TabData = {
  id: "userinfo",
  title: "Userinfo",
  content: <UserInfo />,
  cached: true,
  closable: false,
};
