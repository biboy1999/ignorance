export const compoundDndConfig = {
  // grabbedNode: (node: cytoscape.NodeSingular) => true, // filter function to specify which nodes are valid to grab and drop into other nodes
  // dropTarget: (dropTarget, grabbedNode) => true, // filter function to specify which parent nodes are valid drop targets
  // dropSibling: (dropSibling, grabbedNode) => true, // filter function to specify which orphan nodes are valid drop siblings
  newParentNode: (
    _grabbedNode: unknown,
    _dropSibling: unknown
  ): { data: { name: string } } => ({
    data: { name: "New Compound Node" },
  }), // specifies element json for parent nodes added by dropping an orphan node on another orphan (a drop sibling). You can chose to return the dropSibling in which case it becomes the parent node and will be preserved after all its children are removed.
  // boundingBoxOptions: {
  //   // same as https://js.cytoscape.org/#eles.boundingBox, used when calculating if one node is dragged over another
  //   includeOverlays: false,
  //   includeLabels: true,
  // },
  // overThreshold: 10, // make dragging over a drop target easier by expanding the hit area by this amount on all sides
  // outThreshold: 10, // make dragging out of a drop target a bit harder by expanding the hit area by this amount on all sides
};

export {};
