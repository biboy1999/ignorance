import { EdgeSingular, NodeSingular } from "cytoscape";
import { nanoid } from "nanoid";
import { edgehandlesConfig } from "../config/edgehandler-config";

export const initEdgeHandles = (cy: cytoscape.Core): (() => void) => {
  const eh = cy.edgehandles(edgehandlesConfig);

  const handleStartLink: cytoscape.EventHandler = (e) => {
    const node = e.target as NodeSingular;
    eh.enable();
    // @ts-expect-error wrong typed?
    eh.start(node);
  };

  const handleStopLink: cytoscape.EventHandler = () => {
    eh.stop();
    eh.disable();
  };

  const handleEdgeAdd = (
    _event: unknown,
    _sourceNode: NodeSingular,
    _targetNode: NodeSingular,
    addedEdge: EdgeSingular
  ): void => {
    // remove edge add by edgehandles, re-add to yedges
    const data = addedEdge.data();

    addedEdge.remove();
    cy.add({
      data: { ...data, id: nanoid() },
      group: "edges",
    });
  };

  cy.on("cxttapstart", "node", handleStartLink);
  cy.on("cxttapend", "node", handleStopLink);
  // @ts-expect-error edgehandles event
  cy.on("ehcomplete", handleEdgeAdd);

  return () => {
    cy.off("cxttapstart", "node", handleStartLink);
    cy.off("cxttapend", "node", handleStopLink);
    // @ts-expect-error edgehandles event
    cy.off("ehcomplete", handleEdgeAdd);
  };
};
