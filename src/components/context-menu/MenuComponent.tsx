import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import mergeRefs from "react-merge-refs";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useRole,
  useDismiss,
  useFloating,
  useFocusTrap,
  useHover,
  useInteractions,
  useListNavigation,
  useTypeahead,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  FloatingNode,
  FloatingContext,
} from "@floating-ui/react-dom-interactions";
import { ProviderDocContext } from "../../App";

type Props = {
  cy?: cytoscape.Core;
  label?: string;
  buttonClassName?: string;
  nested?: boolean;
};

export const MenuComponent = forwardRef<
  unknown,
  Props & React.HTMLProps<HTMLButtonElement>
>(({ children, cy, label, className, buttonClassName }, ref) => {
  const globalContext = useContext(ProviderDocContext);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = useRef(
    Children.map(children, (child) =>
      isValidElement(child) ? child.props.label : null
    ) as Array<string | null>
  );

  const blockMouseEventsRef = useRef(false);

  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();
  const nested = parentId != null;

  const { x, y, reference, floating, strategy, refs, update, context } =
    useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset({ mainAxis: 1, alignmentAxis: 0 }), flip(), shift()],
      placement: nested ? "right-start" : "bottom-start",
    });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { handleClose: safePolygon(), enabled: nested }),
    useRole(context, { role: "menu" }),
    useDismiss(context),
    useFocusTrap(context, {
      inert: true,
    }),
    useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex,
      onNavigate: setActiveIndex,
      nested,
      focusItemOnOpen: false,
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      onMatch: open ? setActiveIndex : undefined,
      activeIndex,
    }),
  ]);

  useEffect(() => {
    function onTreeOpenChange({
      open,
      reference,
      parentId,
    }: {
      open: boolean;
      reference: Element;
      parentId: string;
    }): void {
      if (parentId !== nodeId) {
        return;
      }

      listItemsRef.current.forEach((item) => {
        if (item && item !== reference) {
          item.style.pointerEvents = open ? "none" : "";
        }
      });
    }

    function onTreeFocusOnHover({
      parentId,
      target,
    }: {
      parentId: string;
      target: HTMLButtonElement;
    }): void {
      if (nodeId === parentId) {
        setActiveIndex(listItemsRef.current.indexOf(target));
      }
    }

    tree?.events.on("openChange", onTreeOpenChange);
    tree?.events.on("focusOnHover", onTreeFocusOnHover);

    return (): void => {
      tree?.events.off("openChange", onTreeOpenChange);
      tree?.events.off("focusOnHover", onTreeFocusOnHover);
    };
  }, [tree, nodeId, refs.reference, refs.floating]);

  useLayoutEffect(() => {
    tree?.events.emit("openChange", {
      open,
      parentId,
      reference: refs.reference.current,
    });
  }, [tree, open, parentId, refs.reference]);

  useEffect(() => {
    if (open && refs.reference.current && refs.floating.current) {
      if (!nested && !refs.floating.current.contains(document.activeElement)) {
        refs.floating.current.focus({ preventScroll: true });
      }
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, nested, update, refs.reference, refs.floating]);

  function getParentContext(): FloatingContext | undefined {
    return tree?.nodesRef.current.find((node) => node.id === parentId)?.context;
  }

  function setActiveIndexOnHover({ currentTarget }: React.PointerEvent): void {
    if (blockMouseEventsRef.current) {
      return;
    }

    const target = currentTarget as HTMLButtonElement | null;
    if (target) {
      target.focus({ preventScroll: true });
      const index = listItemsRef.current.indexOf(target);

      if (index !== -1) {
        setActiveIndex(index);
      } else {
        tree?.events.emit("focusOnHover", { parentId, target: currentTarget });
      }
    }
  }

  const pointerFocusListeners: React.HTMLProps<HTMLButtonElement> = {
    // Safari
    // onClick({ currentTarget }) {
    //   currentTarget.focus();
    // },
    onPointerMove: setActiveIndexOnHover,

    // All browsers
    onPointerEnter: setActiveIndexOnHover,
    onPointerLeave() {
      if (blockMouseEventsRef.current) {
        return;
      }

      if (nested) {
        getParentContext()?.refs.floating.current?.focus({
          preventScroll: true,
        });
      } else {
        refs.floating.current?.focus({ preventScroll: true });
      }
    },
  };

  const mergedReferenceRef = useMemo(
    () => mergeRefs([ref, reference]),
    [reference, ref]
  );

  useEffect(() => {
    function onContextMenu(ce: cytoscape.EventObject): void {
      const e = ce.originalEvent;
      ce.preventDefault();
      mergedReferenceRef({
        getBoundingClientRect() {
          return {
            x: e.clientX,
            y: e.clientY,
            width: 0,
            height: 0,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          };
        },
      });
      setOpen(true);
    }
    if (!nested) globalContext.cy.current?.on("cxttap", "*", onContextMenu);
    return (): void => {
      if (!nested) globalContext.cy.current?.off("cxttap", onContextMenu);
    };
  }, [mergedReferenceRef, cy]);

  return (
    <FloatingNode id={nodeId}>
      {nested && (
        <button
          {...getReferenceProps({
            ref: mergedReferenceRef,
            onKeyDown() {
              blockMouseEventsRef.current = true;
            },

            ...pointerFocusListeners,
            role: "menuitem",
            className: buttonClassName,
          })}
        >
          {label} {nested && <span className="mr-1">➔</span>}
        </button>
      )}
      <FloatingPortal>
        {open && (
          <div
            {...getFloatingProps({
              className,
              ref: floating,
              style: {
                position: strategy,
                top: y ?? "",
                left: x ?? "",
              },
              onPointerMove() {
                blockMouseEventsRef.current = false;
              },
              onKeyDown() {
                blockMouseEventsRef.current = true;
              },
            })}
          >
            {Children.map(
              children,
              (child, index) =>
                isValidElement(child) &&
                cloneElement(child, {
                  ref(node: HTMLButtonElement) {
                    listItemsRef.current[index] = node;
                  },
                  onClick: (
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => {
                    child.props.onClick(e);
                    setOpen(false);
                    // safari
                    e.currentTarget.focus();
                  },
                  ...pointerFocusListeners,
                })
            )}
          </div>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
});
