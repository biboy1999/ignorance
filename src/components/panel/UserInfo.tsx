import {
  ChangeEvent,
  MutableRefObject,
  SyntheticEvent,
  useRef,
  useState,
} from "react";
import { Awareness } from "y-protocols/awareness.js";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";

const UserInfo = ({
  awarenessRef,
}: {
  awarenessRef: MutableRefObject<Awareness | undefined>;
}): JSX.Element => {
  const nodeRef = useRef(null);

  const handleUpdateUsername = (e: ChangeEvent): void => {
    if (e.target instanceof HTMLInputElement)
      awarenessRef.current?.setLocalStateField("username", e.target.value);
  };

  const handleColorOnChange = (e: ChangeEvent): void => {
    if (e.target instanceof HTMLInputElement)
      awarenessRef.current?.setLocalStateField("color", e.target.value);
  };

  const [width, setWidth] = useState(370);
  const [height, setHeight] = useState(70);
  const onResize = (
    e: SyntheticEvent<Element, Event>,
    { size }: { size: { width: number; height: number } }
  ) => {
    setWidth(size.width);
    setHeight(size.height);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      cancel=".react-resizable-handle"
    >
      <Resizable
        onResize={onResize}
        width={width}
        height={height}
        resizeHandles={["se"]}
        minConstraints={[300, 70]}
        maxConstraints={[500, 500]}
      >
        <div
          ref={nodeRef}
          className="absolute z-50 border p-3 bg-slate-100 h-full w-full"
          style={{ width: width + "px", height: height + "px" }}
        >
          <input
            type="text"
            id="username"
            placeholder="username"
            onChange={handleUpdateUsername}
          />
          <input type="color" id="user-color" onChange={handleColorOnChange} />
        </div>
      </Resizable>
    </Draggable>
  );
};

export { UserInfo };
