import { forwardRef, HTMLProps, Dispatch } from "react";
import {
  FloatingTree,
  useFloatingParentNodeId,
} from "@floating-ui/react-dom-interactions";
import { MenuComponent } from "./MenuComponent";

type Props = {
  clientX: number;
  clientY: number;
  isOpen: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
} & HTMLProps<HTMLElement>;

export const Menu = forwardRef<unknown, Props>((props, ref) => {
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
