// import { Menu } from "../../context-menu/Menu";
// import { MenuButton } from "../../context-menu/MenuButton";
// import { TrashIcon, PlusIcon } from "@heroicons/react/outline";
// import { forwardRef, useContext } from "react";

// const Divider = forwardRef<HTMLParagraphElement>(() => (
//   <p className="flex-1 bg-white font-mono leading-5 text-base border-b" />
// ));

// const GroupHeader = forwardRef<
//   HTMLParagraphElement,
//   JSX.IntrinsicElements["p"]
// >(({ children }, _ref) => (
//   <p className="flex-1 bg-white font-mono pl-1 pt-1 leading-5 text-sm">
//     {children}
//   </p>
// ));

// export const TransformContextMenu = (): JSX.Element => {
//   // bind handle and return unbind function
//   // TODO: better way to do this :/
//   const onContextTrigger = (
//     onContextMenu: (e: MouseEvent) => void
//   ): (() => void) => {
//     const handle = (e: cytoscape.EventObject): void => {
//       onContextMenu(e.originalEvent);
//     };
//     cytoscape.on("cxttap", handle);

//     return () => cytoscape.off("cxttap", handle);
//   };

//   return (
//     <Menu
//       className="shadow-lg flex flex-col border border-gray-300 w-48 focus-visible:outline-none"
//       onEventListener={onContextTrigger}
//     >
//       <MenuButton
//         className="flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-purple-200 focus:bg-purple-100 hover:z-10"
//         label="Add"
//         icon={<PlusIcon className="h-5 w-5 mr-2" />}
//       />
//       <MenuButton
//         className="flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-purple-200 focus:bg-red-100  hover:z-10 ring-inset hover:text-red-800"
//         label="Delete"
//         icon={<TrashIcon className="h-5 w-5 mr-2" />}
//       />
//     </Menu>
//   );
// };
export {};
