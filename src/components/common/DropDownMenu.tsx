import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  useListNavigation,
  useHover,
  useTypeahead,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  autoUpdate,
  safePolygon,
  FloatingPortal,
  useFloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
  FloatingNode,
  FloatingTree,
  FloatingFocusManager,
} from "@floating-ui/react-dom-interactions";
import mergeRefs from "react-merge-refs";
import { ArrowSmRightIcon } from "@heroicons/react/solid";

interface Props {
  label?: string;
  nested?: boolean;
  children?: React.ReactNode;
}

export const MenuItem = forwardRef<
  HTMLButtonElement,
  { label: string; disabled?: boolean }
>(({ label, disabled, ...props }, ref) => {
  return (
    <button {...props} ref={ref} role="menuitem" disabled={disabled}>
      {label}
    </button>
  );
});

export const MenuComponent = forwardRef<
  unknown,
  Props & React.HTMLProps<HTMLButtonElement>
>(({ children, label, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [allowHover, setAllowHover] = useState(false);

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = useRef(
    Children.map(children, (child) =>
      isValidElement(child) ? child.props.label : null
    ) as Array<string | null>
  );

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const nested = parentId != null;

  const { x, y, reference, floating, strategy, refs, context } =
    useFloating<HTMLButtonElement>({
      open,
      onOpenChange: setOpen,
      middleware: [
        offset({ mainAxis: 3, alignmentAxis: nested ? -1 : 0 }),
        flip(),
        shift(),
      ],
      placement: nested ? "right-start" : "bottom-start",
      nodeId,
      whileElementsMounted: autoUpdate,
    });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useHover(context, {
        handleClose: safePolygon({ restMs: 25 }),
        enabled: nested && allowHover,
        delay: { open: 75 },
      }),
      useClick(context, {
        toggle: !nested,
        pointerDown: true,
        ignoreMouse: nested,
      }),
      useRole(context, { role: "menu" }),
      useDismiss(context),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        nested,
        onNavigate: setActiveIndex,
      }),
      useTypeahead(context, {
        listRef: listContentRef,
        onMatch: open ? setActiveIndex : undefined,
        activeIndex,
      }),
    ]
  );

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  useEffect(() => {
    function onTreeClick(): void {
      setOpen(false);

      if (parentId === null) {
        refs.reference.current?.focus();
      }
    }

    tree?.events.on("click", onTreeClick);
    return (): void => {
      tree?.events.off("click", onTreeClick);
    };
  }, [parentId, tree, refs]);

  // Determine if "hover" logic can run based on the modality of input. This
  // prevents unwanted focus synchronization as menus open and close with
  // keyboard navigation and the cursor is resting on the menu.
  useEffect(() => {
    function onPointerMove(): void {
      setAllowHover(true);
    }

    function onKeyDown(): void {
      setAllowHover(false);
    }

    window.addEventListener("pointermove", onPointerMove, {
      once: true,
      capture: true,
    });
    window.addEventListener("keydown", onKeyDown, true);
    return (): void => {
      window.removeEventListener("pointermove", onPointerMove, {
        capture: true,
      });
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [allowHover]);

  const mergedReferenceRef = useMemo(
    () => mergeRefs([ref, reference]),
    [reference, ref]
  );

  return (
    <FloatingNode id={nodeId}>
      <button
        {...getReferenceProps({
          ...props,
          ref: mergedReferenceRef,
          onClick(event) {
            event.stopPropagation();
            (event.currentTarget as HTMLButtonElement).focus();
          },
          ...(nested
            ? {
                className: `MenuItem ${open ? "open" : ""}`,
                role: "menuitem",
                onKeyDown(event): void {
                  // Prevent more than one menu from being open.
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    setOpen(false);
                  }
                },
              }
            : {
                className: `RootMenu ${open ? "open" : ""}`,
              }),
        })}
      >
        {label} {nested && <ArrowSmRightIcon className="w-5" />}
      </button>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            preventTabbing
            modal={!nested}
            // Touch-based screen readers will be able to navigate back to the
            // reference and click it to dismiss the menu without clicking an item.
            // This acts as a touch-based `Esc` key. A visually-hidden dismiss button
            // is an alternative.
            order={["reference", "content"]}
          >
            <div
              {...getFloatingProps({
                className: "Menu",
                ref: floating,
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                },
                onKeyDown(event) {
                  if (event.key === "Tab") {
                    setOpen(false);
                  }
                },
              })}
            >
              {Children.map(
                children,
                (child, index) =>
                  isValidElement(child) &&
                  cloneElement(
                    child,
                    getItemProps({
                      role: "menuitem",
                      className: "MenuItem",
                      ref(node: HTMLButtonElement) {
                        listItemsRef.current[index] = node;
                      },
                      onClick() {
                        tree?.events.emit("click");
                      },
                      // By default `focusItemOnHover` uses `mousemove` to sync focus,
                      // but when a menu closes we want this to sync it on `enter`
                      // even if the cursor didn't move. NB: Safari does not sync in
                      // this case.
                      onPointerEnter() {
                        if (allowHover) {
                          setActiveIndex(index);
                        }
                      },
                    })
                  )
              )}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
});

export const Menu: React.FC<Props> = forwardRef((props, ref) => {
  const parentId = useFloatingParentNodeId();

  if (parentId == null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} ref={ref} />;
});
