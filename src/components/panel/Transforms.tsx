import { CollapsibleDragResizeBox } from "../CollapsibleDragResizeBox";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { ProviderDocContext } from "../../App";
import { useContext } from "react";

export type TransformsProp = null;

// TODO: need better attribute edit system
export const Transforms = (): JSX.Element => {
  const context = useContext(ProviderDocContext);
  context.awareness.on(
    "change",
    (
      e: {
        added: Array<number>;
        updated: Array<number>;
        removed: Array<number>;
      },
      tx: object
    ) => {
      console.log();
    }
  );
  return (
    <CollapsibleDragResizeBox
      sizeOffset={[180, 250]}
      constraintOffset={[0, 0]}
      top={150}
      right={20}
      handle=".drag-handle"
    >
      {({ isOpen, toggle }): JSX.Element => (
        <>
          <div className="flex drag-handle">
            <h1 className="flex justify-between flex-1 p-3 font-mono text-white bg-purple-400">
              <span>Transform</span>
              <ChevronUpIcon
                className={`${
                  isOpen ? "transform rotate-180" : ""
                } w-6 h-6 text-white cursor-pointer`}
                onClick={toggle}
              />
            </h1>
          </div>
          <div className="flex flex-col flex-1 overflow-auto"></div>
        </>
      )}
    </CollapsibleDragResizeBox>
  );
};
