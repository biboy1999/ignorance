import { ChangeEvent, MutableRefObject } from "react";
import { Awareness } from "y-protocols/awareness.js";
import { useOnlineUsers } from "../../store/onlineUsers";
import { DragResizeBox } from "../DragResizeBox";

const UserInfo = ({
  awarenessRef,
}: {
  awarenessRef: MutableRefObject<Awareness | undefined>;
}): JSX.Element => {
  const onlineUsers = useOnlineUsers((states) => states.usernames);

  const handleUpdateUsername = (e: ChangeEvent<HTMLInputElement>): void => {
    awarenessRef.current?.setLocalStateField("username", e.target.value);
  };

  const handleColorOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    awarenessRef.current?.setLocalStateField("color", e.target.value);
  };
  return (
    <DragResizeBox
      sizeOffset={[0, 100]}
      constraintOffset={[0, 50]}
      top={20}
      right={20}
      handle=".drag-handle"
    >
      <>
        <div className="flex drag-handle">
          <h1 className="flex-1 p-3 font-mono text-white bg-purple-400">
            Online users
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
    </DragResizeBox>
  );
};

export { UserInfo };
