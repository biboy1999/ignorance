import { forwardRef } from "react";

type FormInputProps = {
  [x: string]: unknown;
} & React.HTMLAttributes<HTMLInputElement>;

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (props: FormInputProps, ref) => {
    return (
      <input
        ref={ref}
        className="w-full h-8 border"
        {...props}
        onKeyDown={(e): void => {
          e.stopPropagation();
        }}
      />
    );
  }
);
