import { ChangeEvent, MutableRefObject } from "react";
import { Awareness } from "y-protocols/awareness.js";
import { useOnlineUsers } from "../../states/onlineUsers";
import { DragResizeBox } from "../DragResizeBox";

const UserInfo = ({
  awarenessRef,
}: {
  awarenessRef: MutableRefObject<Awareness | undefined>;
}): JSX.Element => {
  const onlineUsers = useOnlineUsers((states) => states.usernames);

  const handleUpdateUsername = (e: ChangeEvent): void => {
    if (e.target instanceof HTMLInputElement)
      awarenessRef.current?.setLocalStateField("username", e.target.value);
  };

  const handleColorOnChange = (e: ChangeEvent): void => {
    if (e.target instanceof HTMLInputElement)
      awarenessRef.current?.setLocalStateField("color", e.target.value);
  };

  return (
    <DragResizeBox>
      <div className="flex flex-col">
        <h1 className="p-3 font-mono text-white bg-purple-400">Online users</h1>
        <div className="flex items-center p-1 ">
          <input
            type="text"
            id="username"
            placeholder="username"
            className="flex-1"
            onChange={handleUpdateUsername}
          />
          <input type="color" id="user-color" onChange={handleColorOnChange} />
        </div>
        <div className="flex-1 p-3 divide-y-2 divide-solid">
          {onlineUsers.map((username) => (
            <p className="font-mono leading-relaxed">{username}</p>
          ))}
        </div>
      </div>
    </DragResizeBox>
  );
};

export { UserInfo };
