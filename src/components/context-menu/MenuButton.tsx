import { forwardRef } from "react";

type ButtonProp = JSX.IntrinsicElements["button"] & {
  label: string | JSX.Element;
  icon?: JSX.Element;
};

export const MenuButton = forwardRef<HTMLButtonElement, ButtonProp>(
  ({ label, icon, ...props }, ref) => {
    return (
      <button {...props} ref={ref} role="menuitem">
        {icon}
        <p className="truncate">{label}</p>
      </button>
    );
  }
);
