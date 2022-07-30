import { NodeSingular, SingularElementReturnValue } from "cytoscape";
import { Map as YMap } from "yjs";
import { isYNodePosition, YNode } from "../../../../types/yjs";

export const registerNodePositionUpdate = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>
): (() => void) => {
  const handleNodePositionUpdate: cytoscape.EventHandler = (e) => {
    e.target.forEach((element: NodeSingular) => {
      const ynodePosition = ynodes.get(element.id())?.get("position");
      if (!isYNodePosition(ynodePosition)) return;
      const { x, y } = element.position();
      ynodes.doc?.transact(() => {
        ynodePosition.set("x", x);
        ynodePosition.set("y", y);
      });
    });
  };
  cytoscape.on("drag", "node", handleNodePositionUpdate);
  return () => cytoscape.off("drag", "node", handleNodePositionUpdate);
};

export const registerLayoutPositionUpdate = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>
): (() => void) => {
  const handleLayoutPositionUpdate: cytoscape.EventHandler = (e) => {
    ynodes.doc?.transact(() => {
      e.target.options.eles.forEach((ele: SingularElementReturnValue) => {
        const ynodePosition = ynodes.get(ele.id())?.get("position");
        if (!ele.isNode()) return;
        if (!isYNodePosition(ynodePosition)) return;
        ynodePosition.set("x", ele.position("x"));
        ynodePosition.set("y", ele.position("y"));
      });
    });
  };
  cytoscape.on("layoutstop", handleLayoutPositionUpdate);
  return () => {
    cytoscape.off("layoutstop", handleLayoutPositionUpdate);
  };
};

export const registerSetSelectedElements = (
  cytoscape: cytoscape.Core,
  setSelectedElements: (eles: cytoscape.CollectionReturnValue) => void
): (() => void) => {
  const handleSetSelectedElements: cytoscape.EventHandler = () => {
    setSelectedElements(cytoscape.$(":selected"));
  };

  cytoscape.on("select unselect", "node, edge", handleSetSelectedElements);
  return () => {
    cytoscape.off("select unselect", "node, edge", handleSetSelectedElements);
  };
};
