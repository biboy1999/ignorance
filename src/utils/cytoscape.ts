import { nanoid } from "nanoid";
import { fcoseLayoutCofig } from "../config/fcose-layout-config";
import { Node } from "../types/types";

export const getCenterPosition = (
  cytoscape: cytoscape.Core
): { x: number; y: number } => {
  const { x1, y1, h, w } = cytoscape.extent();
  return { x: x1 + w / 2, y: y1 + h / 2 };
};

export const doLayout = (
  elementsToLayout: cytoscape.CollectionReturnValue
): void => {
  const layout = elementsToLayout.layout(fcoseLayoutCofig);
  layout.run();
};

export type AddCyNodeReturnValue = {
  nodeId: string;
  node: cytoscape.NodeSingular;
};

export const addNode = (
  node: Node,
  cy: cytoscape.Core
): AddCyNodeReturnValue => {
  const { data, position } = node;
  const { id, ...remainData } = data;
  const nodeId = id ?? nanoid();

  const { x, y } = position;

  if (cy.hasElementWithId(nodeId)) {
    const exist_node = cy.$id(nodeId);

    Object.entries(remainData).forEach(([k, v]) => {
      if (v) exist_node.data(k, v);
    });

    exist_node.position({ x, y });

    return { nodeId, node: exist_node };
  }

  const cynode = cy.add({
    data: { id: nodeId, label: "New Node", type: "*", ...remainData },
    group: "nodes",
    position,
  });
  return { nodeId, node: cynode };
};
