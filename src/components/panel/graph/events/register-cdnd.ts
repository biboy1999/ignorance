import { NodeSingular } from "cytoscape";
import { Map as YMap } from "yjs";
import { YNode } from "../../../../types/types";
import { addYjsNode, moveYjsNodes } from "../../../../utils/yjs";

export const registerCDnD = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>
): (() => void) => {
  const unregisterCDnDAddCompound = registerCDnDAddCompound(cytoscape, ynodes);
  const unregisterCDnDRemoveCompound = registerCDnDRemoveCompound(
    cytoscape,
    ynodes
  );
  return (): void => {
    unregisterCDnDAddCompound();
    unregisterCDnDRemoveCompound();
  };
};

const registerCDnDAddCompound = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>
): (() => void) => {
  const handleAddCompound = (
    _event: unknown,
    dropTarget: NodeSingular,
    _dropSibling: unknown
  ): void => {
    if (dropTarget.length === 0) return;
    // save added node info by CDnD
    const { x, y } = dropTarget.position();
    const data = dropTarget.data();

    // undo added node and node move
    const children = dropTarget.children();
    children.move({ parent: null });
    dropTarget.remove();

    // re-add ynodes and rebuild info in ynode
    const { nodeId } = addYjsNode(data, x, y, { ynodes });
    children.move({ parent: nodeId });
    // XXX: this will update all node in compound :/
    moveYjsNodes(
      ynodes,
      children.map((c) => c.id()),
      nodeId
    );
  };

  // @ts-expect-error drag and drop event
  cytoscape.on("cdnddrop", handleAddCompound);
  // @ts-expect-error drag and drop event
  return () => cytoscape.off("cdnddrop", handleAddCompound);
};

const registerCDnDRemoveCompound = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>
): (() => void) => {
  const handleRemoveCompound = (
    event: cytoscape.EventObject,
    _dropTarget: NodeSingular,
    _dropSibling: NodeSingular
  ): void => {
    moveYjsNodes(ynodes, [event.target.id()], null);
  };

  // @ts-expect-error drag and drop event
  cytoscape.on("cdndout", handleRemoveCompound);
  // @ts-expect-error drag and drop event
  return () => cytoscape.off("cdndout", handleRemoveCompound);
};
