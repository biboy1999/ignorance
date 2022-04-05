import { CollapsibleDragResizeBox } from "../CollapsibleDragResizeBox";
import { ChevronUpIcon, PlusSmIcon } from "@heroicons/react/solid";
import { ProviderDocContext } from "../../App";
import { useContext } from "react";

export type TransformsProp = null;

export const Transforms = (): JSX.Element => {
  const context = useContext(ProviderDocContext);
  // context.awareness.on(
  //   "change",
  //   (
  //     e: {
  //       added: Array<number>;
  //       updated: Array<number>;
  //       removed: Array<number>;
  //     },
  //     tx: object
  //   ) => {
  //     const transform = Array.from(context.awareness.getStates()).flatMap(
  //       ([k, v]) => {
  //         if (!v.transform && !(v.transform instanceof Array)) return [];
  //         return v.transform.map((x: any) => {
  //           return {
  //             clientId: k,
  //             ...x,
  //           };
  //         });
  //       }
  //     );
  //     setTransforms(transform);
  //     // console.log(transform);
  //   }
  // );
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
            <h1 className="flex flex-1 p-3 font-mono text-white bg-purple-400">
              <span className="flex-1">Transform</span>
              <PlusSmIcon className="text-white w-6 h-6 cursor-pointer" />
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
