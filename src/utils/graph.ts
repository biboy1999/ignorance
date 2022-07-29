import { fcoseLayoutCofig } from "../config/fcose-layout-config";

export const getCenterPosition = (
  cytoscape: cytoscape.Core
): { x: number; y: number } => {
  const { x1, y1, h, w } = cytoscape.extent();
  return { x: x1 + w / 2, y: y1 + h / 2 };
};

export const doLayout = (
  elementsToLayout: cytoscape.CollectionReturnValue
): void => {
  // TODO: better config
  const layout = elementsToLayout.layout(fcoseLayoutCofig);
  layout.run();
};
