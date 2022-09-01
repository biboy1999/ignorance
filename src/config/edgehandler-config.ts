import { ElementDefinition, NodeSingular } from "cytoscape";

export const edgehandlesConfig = {
  canConnect: (sourceNode: NodeSingular, targetNode: NodeSingular): boolean => {
    // whether an edge can be created between source and target
    return (
      // disallow loops
      !sourceNode.same(targetNode) &&
      // disallow multiple edge
      !sourceNode.edgesWith(targetNode).length
    );
  },
  edgeParams: function (
    _sourceNode: NodeSingular,
    _targetNode: NodeSingular
  ): ElementDefinition {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    return {
      data: { label: "" },
    };
  },
  // hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  // snapThreshold: 10, // the target node must be less than or equal to this many pixels away from the cursor/finger
  // snapFrequency: 5, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  // noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: false, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
};
