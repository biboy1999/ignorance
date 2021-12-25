import { SyntheticEvent, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import useWindowDimensions from "../utils/hooks/useWindowDimensions";

const DragResizeBox = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [minConstraint, setMinConstraints] = useState<[number, number]>([0, 0]);
  const [maxConstraint, setMaxConstraints] = useState<[number, number]>([0, 0]);

  const [width, setWidth] = useState(-1);
  const [height, setHeight] = useState(-1);

  useEffect(() => {
    const width = nodeRef.current?.offsetWidth ?? -1;
    const height = nodeRef.current?.offsetHeight ?? -1;
    setWidth(width);
    setHeight(height);
    setMinConstraints([width, height]);
  }, []);

  const onDrag = (_e: DraggableEvent, { x, y }: DraggableData): void => {
    setMaxConstraints([windowWidth - x, windowHeight - y]);
  };

  const onResize = (
    e: SyntheticEvent<Element, Event>,
    { size: { width, height } }: ResizeCallbackData
  ): void => {
    setWidth(width);
    setHeight(height);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      onDrag={onDrag}
      bounds="parent"
      cancel=".react-resizable-handle"
    >
      <Resizable
        onResize={onResize}
        width={width}
        height={height}
        minConstraints={minConstraint}
        maxConstraints={maxConstraint}
        resizeHandles={["se"]}
      >
        <div
          className="z-50 border h-min w-max flex flex-col bg-slate-100"
          style={{ width: width + "px", height: height + "px" }}
          ref={nodeRef}
        >
          {children}
        </div>
      </Resizable>
    </Draggable>
  );
};

export { DragResizeBox };
