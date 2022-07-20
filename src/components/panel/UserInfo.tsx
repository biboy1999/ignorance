import { ChangeEvent, useEffect } from "react";
import { equals } from "ramda";
import { useOnlineUsers } from "../../store/online-users";
import { generateUsername } from "../../utils/username/randomUsername";
import { useStore } from "../../store/store";

export const UserInfo = (): JSX.Element => {
  const onlineUsers = useOnlineUsers((states) => states.usernames, equals);
  const getAwareness = useStore((state) => state.getAwareness);

  useEffect(() => {
    getAwareness().setLocalStateField("username", generateUsername());
  }, [getAwareness]);

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
            className="flex-1 border text-gray-900 p-1"
            onChange={handleUpdateUsername}
          />
          <input
            type="color"
            id="user-color"
            className="flex-1 border max-w-[75px] text-gray-900 m-1"
            onChange={handleColorOnChange}
          />
        </div>
        <div className="flex-1 divide-y-2 divide-solid overflow-y-auto">
          {onlineUsers.map((user) => (
            <div key={user.id} className="font-mono leading-loose">
              {user.username}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
