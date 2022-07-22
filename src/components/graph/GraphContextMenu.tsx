import { forwardRef, useRef } from "react";
import { TrashIcon, PlusIcon } from "@heroicons/react/outline";
import { nanoid } from "nanoid";
import { Menu } from "../context-menu/Menu";
import { MenuButton } from "../context-menu/MenuButton";
import { isTrnasformProvider, TransformsJob } from "../../types/types";
import { AddNode, deleteEdges, deleteNodes } from "../../utils/graph";
import { useStore } from "../../store/store";

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

type GraphContextMenuProp = {
  cytoscape: cytoscape.Core;
};

export const GraphContextMenu = ({
  cytoscape,
}: GraphContextMenuProp): JSX.Element => {
  const ynodes = useStore((state) => state.ynodes());
  const yedges = useStore((state) => state.yedges());

  const { selectedElements, selectedNodes } = useStore((state) => ({
    selectedElements: state.selectedElements,
    selectedNodes: state.selectedNodes,
  }));
  const getAwareness = useStore((state) => state.getAwareness);

  const sharedTransforms = useStore((state) => state.sharedTransforms);

  const addTransformJobs = useStore((state) => state.addTransformJobs);

  const clickedPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleDelete: React.MouseEventHandler = (_e) => {
    const eles = selectedElements;
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

  const handleAdd: React.MouseEventHandler = (): void => {
    const { nodeId, node } = AddNode(
      {},
      clickedPosition.current.x,
      clickedPosition.current.y
    );
    if (nodeId) ynodes.set(nodeId, node);
  };

  const handleAddRequest = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const awareness = getAwareness();
    const clientId = awareness.clientID;
    const transformId = e.currentTarget.getAttribute("data-transformid");
    const collection = selectedElements;
    if (!(clientId && transformId && collection)) return;
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
    addTransformJobs(job);
  };

  // bind handle and return unbind function
  // TODO: better way to do this :/
  const onContextTrigger = (
    onContextMenu: (e: MouseEvent) => void
  ): (() => void) => {
    const handle = (e: cytoscape.EventObject): void => {
      clickedPosition.current = e.position;
      onContextMenu(e.originalEvent);
    };
    cytoscape.on("cxttap", handle);

    return () => cytoscape.off("cxttap", handle);
  };

  return (
    <Menu
      className="shadow-lg flex flex-col border border-gray-300 w-48 focus-visible:outline-none"
      onEventListener={onContextTrigger}
    >
      <MenuButton
        className="flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-purple-200 focus:bg-purple-100 focus:z-10"
        label="Add"
        icon={<PlusIcon className="h-5 w-5 mr-2" />}
        onClick={handleAdd}
      />
      <MenuButton
        className="flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-purple-200 focus:bg-red-100 focus:z-10 hover:text-red-800"
        label="Delete"
        icon={<TrashIcon className="h-5 w-5 mr-2" />}
        onClick={handleDelete}
      />
      <Divider />
      <GroupHeader>Transforms</GroupHeader>
      {Object.entries(sharedTransforms).map(([_key, transform]) => {
        // TODO: multiple nodes support
        const type = selectedNodes()?.[0];
        if (
          !(
            isTrnasformProvider(transform) &&
            (transform.elementType.includes(type?.data("type")) ||
              transform.elementType.includes("*"))
          )
        ) {
          return;
        }
        return (
          <MenuButton
            key={transform.transformId}
            data-transformid={transform.transformId}
            className="flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-purple-200 focus:bg-purple-100 hover:z-10 ring-inset"
            label={transform.name}
            title={transform.name}
            onClick={handleAddRequest}
          />
        );
      })}
      <Divider />
    </Menu>
  );
};
