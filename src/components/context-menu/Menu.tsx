import { forwardRef } from "react";
import {
  FloatingTree,
  useFloatingParentNodeId,
} from "@floating-ui/react-dom-interactions";
import { MenuComponent } from "./MenuComponent";

type Props = {
  cy?: cytoscape.Core;
  label?: string;
  buttonClassName?: string;
  nested?: boolean;
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
