import { Menu } from "./context-menu/Menu";
import { MenuButton } from "./context-menu/MenuButton";
import { TrashIcon } from "@heroicons/react/outline";
import { forwardRef, useContext } from "react";
import { ProviderDocContext } from "../App";
type NodeContextMenuProp = {
  cy: cytoscape.Core | undefined;
};

const Divider = forwardRef<HTMLParagraphElement>(() => (
  <p className="flex-1 bg-white font-mono leading-5 text-base border-b" />
));

export const NodeContextMenu = ({ cy }: NodeContextMenuProp): JSX.Element => {
  const context = useContext(ProviderDocContext);
  return (
    <Menu
      cy={cy}
      className="shadow-lg flex flex-col border border-gray-100 w-40"
    >
      <p className="flex-1 bg-white font-mono pl-2 py-1 leading-5 text-base">
        Transform
      </p>
      <Divider />
      {context.ydoc.current.getArray("transform-provider").map((value, key) => {
        console.log(value);
        // <MenuButton
        //   className="flex items-center flex-1 bg-white text-left font-mono p-2 leading-7 hover:bg-purple-200 focus:bg-red-100 ring-inset hover:text-red-800"
        //   label={value}
        //   onClick={(): void => {
        //     cy?.$(":selected").remove();
        //   }}
        // />;
      })}
      <Divider />
      <MenuButton
        className="flex items-center flex-1 bg-white text-left font-mono p-2 leading-7 hover:bg-purple-200 focus:bg-red-100 ring-inset hover:text-red-800"
        label={
          <>
            <TrashIcon className="h-5 w-5 mr-1" /> <p>Delete</p>
          </>
        }
        onClick={(): void => {
          cy?.$(":selected").remove();
        }}
      />
    </Menu>
  );
};
