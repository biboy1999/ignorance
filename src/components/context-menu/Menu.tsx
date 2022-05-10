import { forwardRef } from "react";
import {
  FloatingTree,
  useFloatingParentNodeId,
} from "@floating-ui/react-dom-interactions";
import { MenuComponent } from "./MenuComponent";

type Props = {
  label?: string;
  buttonClassName?: string;
  nested?: boolean;
  onEventListener: (handle: (event: MouseEvent) => void) => unknown;
  // offEventListener?: Function;
};

export const Menu = forwardRef<
  unknown,
  Props & React.HTMLProps<HTMLButtonElement>
>((props, ref) => {
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
