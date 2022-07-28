import { ElementDefinition } from "cytoscape";
import { Map as YMap } from "yjs";
import { Edge, YNode, YNodeData, YNodePosition } from "../../../../types/types";

export const registerElementsSync = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>,
  yedges: YMap<Edge>
) => {
  registerNodesSync(cytoscape, ynodes);
  registerEdgesSync(cytoscape, yedges);
};

export const registerEdgesSync = (
  cytoscape: cytoscape.Core,
  yedges: YMap<Edge>
) => {
  // sync edge (add, delete)
  yedges.observe((e, _tx) => {
    e.changes.keys.forEach((change, key) => {
      if (change.action === "add") {
        const data = yedges.get(key);
        if (data && "source" in data && "target" in data && "id" in data) {
          // local edge handled by edgehadle plugin
          // if (tx.local) return;
          cytoscape.add({ data });
        }
      } else if (change.action === "delete") {
        cytoscape.getElementById(key).remove();
      }
    });
  });
};

export const registerNodesSync = (
  cytoscape: cytoscape.Core,
  ynodes: YMap<YNode>
) => {
  // sync node (add, delete)
  ynodes.observe((e, _tx) => {
    e.changes.keys.forEach((change, key) => {
      if (change.action === "add") {
        const node = e.target.get(key);
        if (node) cytoscape.add(node.toJSON() as ElementDefinition);
      } else if (change.action === "delete") {
        cytoscape.getElementById(key).remove();
      }
    });
  });

  // sync node (data change)
  ynodes.observeDeep((evt) => {
    evt.forEach((e) =>
      e.changes.keys.forEach(
        (change: { action: string; [x: string]: unknown }, key: string) => {
          const path = e.path.pop();
          if (change.action === "add") {
            switch (path) {
              case "data": {
                const [nodeId] = e.path;
                if (!(typeof nodeId === "string")) return;
                // write only necessary key
                cytoscape.getElementById(nodeId).data(key, e.target.get(key));
                break;
              }
            }
          } else if (change.action === "update") {
            switch (path) {
              case "position": {
                const target = e.target as YNodePosition;
                const yNode = e.target.parent as YNode;

                const yNodeData = yNode.get("data") as YNodeData;
                const id = yNodeData.get("id");
                if (!id) break;
                const node = cytoscape.getElementById(id.toString());
                if (!node) break;
                const x = target.get("x");
                const y = target.get("y");
                if (x && y) node.position({ x, y });
                break;
              }
              case "data": {
                // const target = e.target as YNodeData;
                const target = e.target;
                const id = target.get("id");
                if (!id) break;
                const node = cytoscape.getElementById(id.toString());
                if (!node) break;
                node.data(key, target.get(key));
                break;
              }
            }
          } else if (change.action === "delete") {
            switch (path) {
              case "data": {
                const [nodeId] = e.path;
                if (!(typeof nodeId === "string")) return;
                cytoscape.getElementById(nodeId).removeData(key);
                break;
              }
            }
          }
        }
      )
    );
  });
};
