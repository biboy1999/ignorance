import {
  offset,
  flip,
  shift,
  useFloating,
  useInteractions,
  useHover,
  useRole,
  useDismiss,
  useFocus,
  useListNavigation,
  useFloatingTree,
} from "@floating-ui/react-dom-interactions";
import { useState } from "react";

export const MenuComponent = () => {
  const [open, setOpen] = useState(false);

  const tree = useFloatingTree();

  const { x, y, reference, floating, strategy, refs, update, context } =
    useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset({ mainAxis: 1, alignmentAxis: 0 }), flip(), shift()],
      placement: "bottom-start",
    });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
    useRole(context, { role: "menu" }),
    useDismiss(context),
    useFocus(context),
    // useListNavigation(context, {
    //   listRef: listItemsRef,
    //   activeIndex,
    //   onNavigate: setActiveIndex,
    //   nested,
    //   focusItemOnOpen: false,
    //   loop: true,
    // }),
    // useTypeahead(context, {
    //   listRef: listContentRef,
    //   onMatch: open ? setActiveIndex : undefined,
    //   activeIndex,
    // }),
  ]);

  

  return <></>;
};
