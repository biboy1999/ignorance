import { forwardRef } from "react";

type ButtonProp = JSX.IntrinsicElements["button"] & {
  label: string | JSX.Element;
};

export const MenuButton = forwardRef<HTMLButtonElement, ButtonProp>(
  ({ label, ...props }, ref) => {
    return (
      <button {...props} ref={ref} role="menuitem">
        {label}
      </button>
    );
  }
);
