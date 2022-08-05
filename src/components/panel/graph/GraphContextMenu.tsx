import { forwardRef, useEffect, useRef, useState } from "react";
import { TrashIcon, PlusIcon } from "@heroicons/react/solid";
import { nanoid } from "nanoid";
import { Menu } from "../../common/context-menu/Menu";
import { MenuButton } from "../../common/context-menu/MenuButton";
import { isTrnasformProvider, TransformJob } from "../../../types/transform";
import { deleteYjsEdges, deleteYjsNodes, addYjsNode } from "../../../utils/yjs";
import { useStore } from "../../../store/store";

const Divider = forwardRef<HTMLParagraphElement>(() => (
  <p className="flex-1 font-mono leading-5 text-base border-b dark:border-neutral-700 z-50" />
));

const GroupHeader = forwardRef<
  HTMLParagraphElement,
  JSX.IntrinsicElements["p"]
>(({ children }, _ref) => (
  <p className="styled-panel flex-1 font-mono pl-1 pt-1 leading-5 text-sm bg-white dark:bg-neutral-900 dark:text-white">
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

  const [isOpen, setOpen] = useState(false);
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);

  const handleDelete: React.MouseEventHandler = (_e) => {
    const deletedElements = selectedElements?.remove();

    const deletedEdgeIds =
      deletedElements?.edges().map((edge) => edge.id()) ?? [];
    const deletedNodeIds =
      deletedElements?.nodes().map((node) => node.id()) ?? [];

    deleteYjsNodes(deletedNodeIds, ynodes);
    deleteYjsEdges(deletedEdgeIds, yedges);
  };

  const handleAdd: React.MouseEventHandler = (): void => {
    const { nodeId, node } = addYjsNode(
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
    const job: TransformJob = {
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

  useEffect(() => {
    const onContextMenu = (e: cytoscape.EventObject): void => {
      setClientX(e.originalEvent.clientX);
      setClientY(e.originalEvent.clientY);
      clickedPosition.current = e.position;
      setOpen(true);
    };
    cytoscape.on("cxttap", onContextMenu);
    return () => {
      cytoscape.off("cxttap", onContextMenu);
    };
  }, [cytoscape]);

  return (
    <Menu
      className="shadow-lg flex flex-col border border-neutral-700 w-48 divide-y focus-visible:outline-none z-max"
      isOpen={isOpen}
      setOpen={setOpen}
      clientX={clientX}
      clientY={clientY}
    >
      <MenuButton
        className="styled-button flex items-center flex-1 text-left font-mono p-2 pl-4 leading-7 focus:z-10 hover:bg-blue-200 dark:hover:bg-gray-600"
        label="Add"
        icon={
          <PlusIcon className="h-5 w-5 mr-2 hover:bg-transparent dark:hover:bg-transparent" />
        }
        onClick={handleAdd}
      />
      <MenuButton
        className="styled-button flex items-center flex-1 text-left font-mono p-2 pl-4 leading-7 focus:z-10 hover:bg-red-200 dark:hover:bg-rose-900 hover:text-red-300"
        label="Delete"
        icon={
          <TrashIcon className="h-5 w-5 mr-2 hover:bg-transparent dark:hover:bg-transparent" />
        }
        onClick={handleDelete}
      />
      <GroupHeader>Transforms</GroupHeader>
      {Object.entries(sharedTransforms).map(([_key, transform]) => {
        // TODO: multiple nodes support
        const type = selectedNodes()?.[0];
        if (
          !(
            isTrnasformProvider(transform) &&
            type != null &&
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
            className="styled-button flex items-center flex-1 bg-white text-left font-mono p-2 pl-4 leading-7 hover:bg-blue-200 dark:hover:bg-gray-600 ring-inset"
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
