import { ChangeEvent, useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { equals } from "ramda";
import { useOnlineUsers } from "../../store/onlineUsers";
import { CollapsibleDragResizeBox } from "../CollapsibleDragResizeBox";
import { generateUsername } from "../../utils/username/randomUsername";
import { useStore } from "../../store/store";

export const UserInfo = (): JSX.Element => {
  const onlineUsers = useOnlineUsers((states) => states.usernames, equals);
  const awareness = useStore((state) => state.getAwareness());

  useEffect(() => {
    awareness.setLocalStateField("username", generateUsername());
  }, [awareness]);

  const handleUpdateUsername = (e: ChangeEvent<HTMLInputElement>): void => {
    awareness.setLocalStateField("username", e.target.value);
  };

  const handleColorOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    awareness.setLocalStateField("color", e.target.value);
  };
  return (
    <CollapsibleDragResizeBox
      sizeOffset={[0, 200]}
      constraintOffset={[0, 50]}
      top={20}
      right={20}
      handle=".drag-handle"
    >
      {({ isOpen, toggle }): JSX.Element => (
        <>
          <div className="flex drag-handle">
            <h1 className="flex justify-between flex-1 p-3 font-mono text-white bg-purple-400">
              <span>Online users</span>
              <ChevronUpIcon
                className={`${
                  isOpen ? "transform rotate-180" : ""
                } w-6 h-6 text-white cursor-pointer hover:bg-purple-300`}
                onClick={toggle}
              />
            </h1>
          </div>
          <div className="flex-1 flex flex-col p-1 overflow-hidden">
            <div className="flex items-center">
              <input
                type="text"
                id="username"
                placeholder="username"
                className="flex-1 border text-gray-900 m-1 p-1"
                onChange={handleUpdateUsername}
              />
              <input
                type="color"
                id="user-color"
                className="flex-1 border text-gray-900 m-1"
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
      )}
    </CollapsibleDragResizeBox>
  );
};
