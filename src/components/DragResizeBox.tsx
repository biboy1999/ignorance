import { SyntheticEvent, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import useWindowDimensions from "../utils/hooks/useWindowDimensions";

const DragResizeBox = ({
  children,
  sizeOffset = [0, 0],
  constraintOffset = [0, 0],
  left,
  right,
  top,
  bottom,
  handle = "",
  onResize,
}: {
  children: JSX.Element;
  sizeOffset?: [number, number];
  constraintOffset?: [number, number];
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  handle?: string;
  onResize?: (width: number, height: number) => void;
}): JSX.Element => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [minConstraint, setMinConstraints] = useState<[number, number]>([0, 0]);
  const [maxConstraint, setMaxConstraints] = useState<[number, number]>([
    windowWidth,
    windowHeight,
  ]);

  const [width, setWidth] = useState(-1);
  const [height, setHeight] = useState(-1);

  useEffect(() => {
    const width = nodeRef.current?.offsetWidth ?? -1;
    const height = nodeRef.current?.offsetHeight ?? -1;
    const [widthOffset, heightOffset] = sizeOffset;
    const [constraintWidthOffset, constraintHeightOffset] = constraintOffset;
    const finalWidth = width + widthOffset;
    const finalHeight = height + heightOffset;
    setWidth(finalWidth);
    setHeight(finalHeight);
    if (typeof onResize !== "undefined") onResize(finalWidth, finalHeight);
    setMinConstraints([
      width - constraintWidthOffset,
      height - constraintHeightOffset,
    ]);

    if (typeof right !== "undefined")
      setXPos(windowWidth - width - widthOffset - right);
    else if (typeof left !== "undefined") setXPos(left);

    if (typeof top !== "undefined") setYPos(top);
    else if (typeof bottom !== "undefined")
      setYPos(windowHeight - height - heightOffset - bottom);
  }, []);

  const onDraggableDrag = (
    _e: DraggableEvent,
    { x, y }: DraggableData
  ): void => {
    setMaxConstraints([windowWidth - x, windowHeight - y]);
    setXPos(x);
    setYPos(y);
  };

  const onResizableResize = (
    e: SyntheticEvent<Element, Event>,
    { size: { height, width } }: ResizeCallbackData
  ): void => {
    setWidth(width);
    setHeight(height);
    if (typeof onResize !== "undefined") onResize(width, height);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      onDrag={onDraggableDrag}
      position={{ x: xPos, y: yPos }}
      bounds="parent"
      cancel=".react-resizable-handle"
      handle={handle}
    >
      <Resizable
        onResize={onResizableResize}
        width={width}
        height={height}
        minConstraints={minConstraint}
        maxConstraints={maxConstraint}
        resizeHandles={["se"]}
      >
        <div
          className="z-50 h-min w-max flex flex-col bg-slate-100"
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
