import { MouseEventHandler } from "react";

export type ControlbarProp = {
  onAdd: MouseEventHandler<HTMLElement>;
  onDelete: MouseEventHandler<HTMLElement>;
  onLayout: MouseEventHandler<HTMLElement>;
};

export const Controlbar = ({
  onAdd,
  onDelete,
  onLayout,
}: ControlbarProp): JSX.Element => {
  return (
    <div className="absolute top-2 left-2 flex flex-col border z-50">
      <div
        onClick={onAdd}
        className="aspect-square w-9 h-9 cursor-pointer flex items-center justify-center bg-slate-200 hover:bg-slate-500"
      >
        <span className="font-mono">+</span>
      </div>
      <div
        className="aspect-square w-9 h-9 cursor-pointer flex items-center justify-center bg-slate-200 hover:bg-slate-500"
        onClick={onDelete}
      >
        <span className="font-mono">-</span>
      </div>
      <div
        className="aspect-square w-9 h-9 cursor-pointer flex items-center justify-center bg-slate-200 hover:bg-slate-500"
        onClick={onLayout}
      >
        <span className="font-mono">L</span>
      </div>
    </div>
  );
};