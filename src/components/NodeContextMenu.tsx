import { Menu } from "./context-menu/Menu";
import { MenuButton } from "./context-menu/MenuButton";
import { TrashIcon, PlusIcon } from "@heroicons/react/outline";
import { forwardRef, useContext } from "react";
import { ProviderDocContext } from "../App";
import { isTrnasformProvider, TransformsJob } from "../types/types";
import { AddNode, deleteEdges, deleteNodes } from "../utils/node";
import { nanoid } from "nanoid";
import { useGlobals } from "../store/globals";

const Divider = forwardRef<HTMLParagraphElement>(() => (
  <p className="flex-1 bg-white font-mono leading-5 text-base border-b" />
));

const GroupHeader = forwardRef<
  HTMLParagraphElement,
  JSX.IntrinsicElements["p"]
>(({ children }, _ref) => (
  <p className="flex-1 bg-white font-mono pl-1 pt-1 leading-5 text-sm">
    {children}
  </p>
));

export const NodeContextMenu = (): JSX.Element => {
  const context = useContext(ProviderDocContext);

  const ynodes = useGlobals((state) => state.ynodes());
  const yedges = useGlobals((state) => state.yedges());
  const yproviders = useGlobals((state) => state.ytransformProviders());
  const yjobs = useGlobals((state) => state.ytransformJobs());
  const cy = useGlobals((state) => state.cy);

  const providers = Array.from(yproviders.entries());

  const handleDelete: React.MouseEventHandler = (_e) => {
    const eles = cy?.$(":selected");
    if (!eles?.length) return;

    // selected edge and node connected edge
    const edges = eles
      .connectedEdges()
      .add(eles.edges())
      .map((e) => e.id());

    deleteEdges(edges, yedges);

    // last delete node
    deleteNodes(
      eles.nodes().map((e) => e.id()),
      ynodes
    );
  };

  const handleAddRequest = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const clientId = context.awareness.clientID;
    const transformId = e.currentTarget.getAttribute("data-transformid");
    const collection = cy?.$(":selected");
    if (!(yjobs && clientId && transformId && collection)) return;
    const job: TransformsJob = {
      jobId: nanoid(),
      fromClientId: clientId,
      transformId,
      status: "pending",
      request: {
        nodesId: collection.nodes().map((node) => node.id()),
        edgesId: collection.edges().map((edge) => edge.id()),
        parameter: {},
      },
    };
    yjobs.set(job.jobId, job);
  };

  return (
    <Menu
      cy={cy}
      className="shadow-lg flex flex-col border border-gray-300 w-48 focus-visible:outline-none"
    >
      <MenuButton
        className="flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-purple-200 focus:bg-purple-100 hover:z-10"
        label="Add"
        icon={<PlusIcon className="h-5 w-5 mr-2" />}
        onClick={(e): void => {
          const currentTarget = e.currentTarget as HTMLElement;
          const parent = currentTarget.parentElement as HTMLElement;

          const { nodeId, node } = AddNode(
            parent.offsetLeft,
            parent.offsetTop,
            {},
            cy?.pan(),
            cy?.zoom()
          );
          if (nodeId) ynodes.set(nodeId, node);
        }}
      />
      <MenuButton
        className="flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-purple-200 focus:bg-red-100  hover:z-10 ring-inset hover:text-red-800"
        label="Delete"
        icon={<TrashIcon className="h-5 w-5 mr-2" />}
        onClick={handleDelete}
      />
      <Divider />
      <GroupHeader>Transform</GroupHeader>
      {providers.map(([_key, value]) => {
        const type = cy?.$(":selected");
        if (
          !(
            isTrnasformProvider(value) &&
            type?.isNode() &&
            (value.elementType.includes(type?.data("type")) ||
              value.elementType.includes("*"))
          )
        ) {
          return;
        }
        return (
          <MenuButton
            key={value.transformId}
            data-transformid={value.transformId}
            className="flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-purple-200 focus:bg-purple-100 hover:z-10 ring-inset"
            label={value.name}
            title={value.name}
            onClick={handleAddRequest}
          />
        );
      })}
      <Divider />
    </Menu>
  );
};
