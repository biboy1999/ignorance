import { ElementDefinition } from "cytoscape";
import { Map as YMap, YEvent, YMapEvent } from "yjs";
import {
  Edge,
  isYNodeData,
  isYNodePosition,
  YNode,
} from "../../../../types/types";

export const registerElementsSync = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>,
  yedges: YMap<Edge>
): (() => void) => {
  const unregisterEdgesSync = registerEdgesSync(cytoscape, yedges);
  const unregisterNodesSync = registerNodesSync(cytoscape, ynodes);
  return () => {
    unregisterEdgesSync();
    unregisterNodesSync();
  };
};

const registerEdgesSync = (
  cytoscape: cytoscape.Core,
  yedges: YMap<Edge>
): (() => void) => {
  // sync edge (add, delete)
  const handleEdgeChange = (e: YMapEvent<Edge>): void => {
    e.changes.keys.forEach((change, key) => {
      if (change.action === "add") {
        const data = yedges.get(key);
        if (data == null) return;
        cytoscape.add({ data });
      } else if (change.action === "delete") {
        cytoscape.getElementById(key).remove();
      }
    });
  };
  yedges.observe(handleEdgeChange);

  return () => yedges.unobserve(handleEdgeChange);
};

const registerNodesSync = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>
): (() => void) => {
  // sync node (add, delete)
  const handleNodesAddDelete = (e: YMapEvent<YNode>): void => {
    e.changes.keys.forEach((change, key) => {
      if (change.action === "add") {
        const node = e.target.get(key);
        if (node == null) return;
        cytoscape.add(node.toJSON() as ElementDefinition);
      } else if (change.action === "delete") {
        // special case parent, move out child first
        // cytoscape.$id(key).children().move({ parent: null });
        cytoscape.$id(key).remove();
      }
    });
  };

  ynodes.observe(handleNodesAddDelete);

  // sync node (data change)
  // eslint-disable-next-line
  const handleNodesDataChange = (evts: YEvent<any>[]): void => {
    evts.forEach((e) => {
      const nodeId = e.path.at(0);
      const path = e.path.at(-1);

      if (nodeId == null || path == null) return;
      if (!(typeof nodeId === "string")) return;

      e.changes.keys.forEach((change, key) => {
        if (change.action === "add") {
          if (path === "data" && isYNodeData(e.target)) {
            // write only necessary key
            cytoscape.$id(nodeId).data(key, e.target.get(key));
            // special case parent, not working with data
            // if (key === "parent") {
            //   cytoscape.$id(nodeId).move({ parent: e.target.get(key) ?? null });
            // }
          }
        } else if (change.action === "update") {
          if (path === "position" && isYNodePosition(e.target)) {
            const node = cytoscape.getElementById(nodeId);
            const x = e.target.get("x");
            const y = e.target.get("y");
            if (typeof x === "number" && typeof y === "number")
              node.position({ x, y });
          } else if (path === "data" && isYNodeData(e.target)) {
            const node = cytoscape.getElementById(nodeId);
            node.data(key, e.target.get(key));
            // special case parent, not working with data
            // if (key === "parent") {
            //   cytoscape.$id(nodeId).move({ parent: e.target.get(key) ?? null });
            // }
          }
        } else if (change.action === "delete") {
          if (path === "data") {
            cytoscape.getElementById(nodeId).removeData(key);
            // special case parent, not working with data
            // if (key === "parent") {
            //   cytoscape.$id(nodeId).move({ parent: e.target.get(key) ?? null });
            // }
          }
        }
      });
    });
  };

  ynodes.observeDeep(handleNodesDataChange);

  return () => {
    ynodes.unobserve(handleNodesAddDelete);
    ynodes.unobserveDeep(handleNodesDataChange);
  };
};
