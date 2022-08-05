import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react-dom-interactions";
import React, {
  Children,
  cloneElement,
  Dispatch,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
} from "react";
import mergeRefs from "react-merge-refs";

type Props = {
  clientX: number;
  clientY: number;
  isOpen: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
} & React.HTMLProps<HTMLElement>;

export const MenuComponent = forwardRef<unknown, Props>(
  ({ children, className, clientX, clientY, isOpen, setOpen }, ref) => {
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const nested = parentId != null;

    const { x, y, reference, floating, strategy, refs, update, context } =
      useFloating({
        open: isOpen,
        onOpenChange: setOpen,
        middleware: [
          offset({ mainAxis: 1, alignmentAxis: 1 }),
          flip(),
          shift(),
        ],
        placement: nested ? "right-start" : "bottom-start",
      });

    const { getFloatingProps } = useInteractions([
      useHover(context, { handleClose: safePolygon(), enabled: nested }),
      useRole(context, { role: "menu" }),
      useDismiss(context),
      useFocus(context),
    ]);

    const mergedReferenceRef = useMemo(
      () => mergeRefs([ref, reference]),
      [reference, ref]
    );

    useEffect(() => {
      if (isOpen && refs.reference.current && refs.floating.current) {
        return autoUpdate(
          refs.reference.current,
          refs.floating.current,
          update
        );
      }
    }, [isOpen, update, refs.reference, refs.floating]);

    useEffect(() => {
      if (!isOpen) return;
      mergedReferenceRef({
        getBoundingClientRect() {
          return {
            x: clientX,
            y: clientY,
            width: 0,
            height: 0,
            top: clientY,
            right: clientX,
            bottom: clientY,
            left: clientX,
          };
        },
      });
    }, [mergedReferenceRef, isOpen]);

    return (
      <FloatingNode id={nodeId}>
        <FloatingPortal>
          {isOpen && (
            <FloatingFocusManager context={context}>
              <div
                {...getFloatingProps({
                  className,
                  ref: floating,
                  style: {
                    position: strategy,
                    top: y ?? "",
                    left: x ?? "",
                  },
                })}
              >
                {Children.map(
                  children,
                  (child) =>
                    isValidElement(child) &&
                    cloneElement(child, {
                      onClick: (
                        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => {
                        if (child.props.onClick) {
                          child.props.onClick(e);
                        }
                        setOpen(false);
                        // safari
                        e.currentTarget.focus();
                      },
                    })
                )}
              </div>
            </FloatingFocusManager>
          )}
        </FloatingPortal>
      </FloatingNode>
    );
  }
);
