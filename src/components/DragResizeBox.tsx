import { SyntheticEvent, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import useWindowDimensions from "../utils/hooks/useWindowDimensions";
import { usezIndex } from "../store/zIndexManager";

export type DragResizeBoxPropOnResizeProp = (
  width: number,
  height: number,
  minConstraint: [number, number],
  maxConstraint?: [number, number]
) => void;

export type DragResizeBoxProp = {
  children: JSX.Element;
  sizeOffset?: [number, number];
  constraintOffset?: [number, number];
  isBounded?: boolean;
  height?: number;
  width?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  handle?: string;
  onResize?: DragResizeBoxPropOnResizeProp;
};

export const DragResizeBox = ({
  children,
  sizeOffset = [0, 0],
  constraintOffset = [0, 0],
  isBounded = false,
  height,
  width,
  left,
  right,
  top,
  bottom,
  handle = "",
  onResize,
}: DragResizeBoxProp): JSX.Element => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // [width, height]:[number, number]
  const [minConstraint, setMinConstraints] = useState<[number, number]>([0, 0]);
  const [maxConstraint, setMaxConstraints] = useState<[number, number]>([
    windowWidth,
    windowHeight,
  ]);

  const [_width, setWidth] = useState(-1);
  const [_height, setHeight] = useState(-1);

  const zIndex = usezIndex((states) => states.zIndex);
  const increasezIndex = usezIndex((states) => states.increasezIndex);

  //  init calc min constraint
  useEffect(() => {
    const width = nodeRef.current?.offsetWidth ?? -1;
    const height = nodeRef.current?.offsetHeight ?? -1;
    const [widthOffset, heightOffset] = sizeOffset;
    const [constraintWidthOffset, constraintHeightOffset] = constraintOffset;
    const finalWidth = width + widthOffset;
    const finalHeight = height + heightOffset;
    setWidth(finalWidth);
    setHeight(finalHeight);

    const minConstraintWidth = width - constraintWidthOffset;
    const minConstraintHeight = height - constraintHeightOffset;
    setMinConstraints([minConstraintWidth, minConstraintHeight]);

    if (typeof right !== "undefined")
      setXPos(windowWidth - width - widthOffset - right);
    else if (typeof left !== "undefined") setXPos(left);

    if (typeof top !== "undefined") setYPos(top);
    else if (typeof bottom !== "undefined")
      setYPos(windowHeight - height - heightOffset - bottom);

    if (typeof onResize !== "undefined")
      onResize(finalWidth, finalHeight, [
        minConstraintWidth,
        minConstraintHeight,
      ]);
  }, []);

  // when manually controll
  useEffect(() => {
    if (width) {
      setWidth(width);
    }
    if (height) {
      setHeight(height);
    }
  }, [width, height]);

  const onDraggableDrag = (
    _e: DraggableEvent,
    { x, y }: DraggableData
  ): void => {
    if (isBounded) setMaxConstraints([windowWidth - x, windowHeight - y]);
    setXPos(x);
    setYPos(y);
  };

  const onDraggableStart = (): void => {
    if (nodeRef.current) {
      nodeRef.current.style.zIndex = zIndex.toString();
      increasezIndex();
    }
  };

  const onResizableResize = (
    e: SyntheticEvent<Element, Event>,
    { size: { height, width } }: ResizeCallbackData
  ): void => {
    setWidth(width);
    setHeight(height);
    if (typeof onResize !== "undefined")
      onResize(width, height, minConstraint, maxConstraint);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      onDrag={onDraggableDrag}
      onStart={onDraggableStart}
      position={{ x: xPos, y: yPos }}
      bounds={isBounded && "parent"}
      cancel=".react-resizable-handle"
      handle={handle}
    >
      <Resizable
        onResize={onResizableResize}
        width={_width}
        height={_height}
        minConstraints={minConstraint}
        maxConstraints={maxConstraint}
        resizeHandles={["se"]}
      >
        <div
          className="z-10 h-min w-max flex flex-col bg-slate-100"
          style={{ width: _width + "px", height: _height + "px" }}
          ref={nodeRef}
        >
          {children}
        </div>
      </Resizable>
    </Draggable>
  );
};
