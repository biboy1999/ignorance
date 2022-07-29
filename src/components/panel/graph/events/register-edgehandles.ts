import { EdgeSingular, NodeSingular } from "cytoscape";
import { Map as YMap } from "yjs";
import { edgehandlesConfig } from "../../../../config/edgehandler-config";
import { Edge } from "../../../../types/types";

export const registerEdgeHandlers = (
  cytoscape: cytoscape.Core,
  yedges: YMap<Edge>
): (() => void) => {
  const eh = cytoscape.edgehandles(edgehandlesConfig);
  const unregisterEdgeHandlersAddEdge = registerEdgeHandlersAddEdge(
    cytoscape,
    yedges
  );
  const unregisterEdgeHandlersStartLink = registerEdgeHandlersStartLink(
    cytoscape,
    eh
  );

  return () => {
    unregisterEdgeHandlersAddEdge();
    unregisterEdgeHandlersStartLink();
  };
};

const registerEdgeHandlersAddEdge = (
  cytoscape: cytoscape.Core,
  yedges: YMap<Edge>
): (() => void) => {
  const handleEdgeAdd = (
    _event: unknown,
    _sourceNode: unknown,
    _targetNode: unknown,
    addedEdge: EdgeSingular
  ): void => {
    // remove edge add by edgehandles, re-add to yedges
    cytoscape.$id(addedEdge.id()).remove();
    yedges.set(addedEdge.id(), addedEdge.data());
  };
  // @ts-expect-error edgehandles event
  cytoscape.on("ehcomplete", handleEdgeAdd);

  // @ts-expect-error edgehandles event
  return () => cytoscape.off("ehcomplete", handleEdgeAdd);
};

const registerEdgeHandlersStartLink = (
  cytoscape: cytoscape.Core,
  eh: cytoscapeEdgehandles.EdgeHandlesInstance
): (() => void) => {
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

  cytoscape.on("cxttapstart", "node", handleStartLink);
  cytoscape.on("cxttapend", "node", handleStopLink);
  return () => {
    cytoscape.off("cxttapstart", "node", handleStartLink);
    cytoscape.off("cxttapend", "node", handleStopLink);
  };
};
