import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
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
  FloatingOverlay,
  FloatingTree,
  useFloatingNodeId,
} from "@floating-ui/react-dom-interactions";
import { ProviderDocContext } from "../../App";

type buttonProp = JSX.IntrinsicElements["button"];

export const MenuNested = forwardRef<HTMLButtonElement, buttonProp>(
  ({ children, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
    const listContentRef = useRef(
      Children.map(children, (child) =>
        isValidElement(child) ? child.props.label : null
      ) as Array<string | null>
    );

    const nodeId = useFloatingNodeId();

    const blockMouseEventsRef = useRef(false);

    const { x, y, reference, floating, strategy, context, refs, update } =
      useFloating({
        open,
        onOpenChange: setOpen,
        placement: "right",
        middleware: [
          offset({ mainAxis: 5, alignmentAxis: 4 }),
          flip(),
          shift(),
        ],
        nodeId,
      });

    const { getFloatingProps } = useInteractions([
      useHover(context, { handleClose: safePolygon() }),
      useRole(context, { role: "menu" }),
      useDismiss(context),
      useFocusTrap(context, {
        inert: true,
        order: ["floating"],
      }),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        onNavigate: setActiveIndex,
        focusItemOnOpen: false,
      }),
      useTypeahead(context, {
        listRef: listContentRef,
        onMatch: open ? setActiveIndex : undefined,
        activeIndex,
      }),
    ]);

    function setActiveIndexOnHover({ currentTarget }: React.PointerEvent) {
      if (blockMouseEventsRef.current) {
        return;
      }

      const target = currentTarget as HTMLButtonElement | null;
      if (target) {
        const index = listItemsRef.current.indexOf(target);

        if (index !== -1) {
          setActiveIndex(index);
        }
      }
    }

    const pointerFocusListeners: React.HTMLProps<HTMLButtonElement> = {
      // Safari
      onClick({ currentTarget }) {
        currentTarget.focus();
      },
      onPointerMove: setActiveIndexOnHover,

      // All browsers
      onPointerEnter: setActiveIndexOnHover,
      onPointerLeave() {
        if (blockMouseEventsRef.current) {
          return;
        }

        refs.floating.current?.focus({ preventScroll: true });
      },
    };

    useEffect(() => {
      if (open && refs.reference.current && refs.floating.current) {
        return autoUpdate(
          refs.reference.current,
          refs.floating.current,
          update
        );
      }
    }, [open, update, refs.reference, refs.floating]);

    const mergedReferenceRef = useMemo(
      () => mergeRefs([ref, reference]),
      [reference, ref]
    );

    return (
      <>
        <button {...props} ref={mergedReferenceRef} className="MenuItem">
          test
        </button>

        {open && (
          <div
            {...getFloatingProps({
              className: "ContextMenu",
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
              (child, index) =>
                isValidElement(child) &&
                cloneElement(child, {
                  ref(node: HTMLButtonElement) {
                    listItemsRef.current[index] = node;
                  },
                  ...pointerFocusListeners,
                })
            )}
          </div>
        )}
      </>
    );
  }
);
