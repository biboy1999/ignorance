import { forwardRef } from "react";
import {
  FloatingTree,
  useFloatingParentNodeId,
} from "@floating-ui/react-dom-interactions";
import { MenuComponent } from "./MenuComponent";

export const Menu = (props: {}) => {
  const parentId = useFloatingParentNodeId();
  if (parentId == null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} />;
};
