import { useEffect, useRef, useState } from "react";
import {
  DragResizeBox,
  DragResizeBoxProp,
  DragResizeBoxPropOnResizeProp,
} from "./DragResizeBox";

type childrenRenderProp = {
  isOpen: boolean;
  close(): void;
  open(): void;
  toggle(): void;
};

export type CollapsibleDragResizeBoxProp = {
  children: JSX.Element | (({ isOpen }: childrenRenderProp) => JSX.Element);
} & Omit<DragResizeBoxProp, "children">;

export const CollapsibleDragResizeBox = ({
  children,
  ...restProps
}: CollapsibleDragResizeBoxProp): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const minConstraint = useRef([0, 0]);
  const savedheight = useRef(0);
  const savedWidth = useRef(0);

  const close = (): void => setIsOpen(false);
  const open = (): void => setIsOpen(false);
  const toggle = (): void => setIsOpen((state) => !state);

  const onResize: DragResizeBoxPropOnResizeProp = (
    width,
    height,
    _minConstraint
  ) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    savedheight.current = height;
    savedWidth.current = width;
    minConstraint.current = _minConstraint;
    setHeight(height);
    setWidth(width);
  };

  useEffect(() => {
    if (!isOpen) {
      setHeight(minConstraint.current[1]);
    }
    if (isOpen) {
      setHeight(savedheight.current);
    }
  }, [isOpen]);

  return (
    <DragResizeBox
      {...restProps}
      onResize={onResize}
      height={height}
      width={width}
    >
      {typeof children === "function"
        ? children({ isOpen, close, open, toggle })
        : children}
    </DragResizeBox>
  );
};
