import Layers, { LayersPlugin } from "cytoscape-layers";
import edgehandles from "cytoscape-edgehandles";
import cytoscape, {
  EdgeSingular,
  ElementDefinition,
  NodeSingular,
  SingularElementReturnValue,
} from "cytoscape";
import fcose from "cytoscape-fcose";
import layoutUtilities from "cytoscape-layout-utilities";
import gridGuide from "cytoscape-grid-guide";
import compoundDragAndDrop from "cytoscape-compound-drag-and-drop";
import navigator from "cytoscape-navigator";
import { useEffect } from "react";
import { Map as YMap } from "yjs";
import { useAtomValue } from "jotai";
import { useOnlineUsers } from "../../store/online-users";
import { YNode, YNodeData, YNodePosition } from "../../types/types";
import { generateCursor, modelToRenderedPosition } from "../../utils/canvas";
import { useThrottledCallback } from "../../utils/hooks/useThrottledCallback";
import { GraphContextMenu } from "./GraphContextMenu";
import { isOnlineModeAtom } from "../../atom/provider";
import { useStore } from "../../store/store";
import { Toolbar } from "../Toobar";
import { edgehandlesConfig } from "../../config/edgehandler-config";
import {
  cytoscapeConfig,
  cytoscapeDarkStylesheet,
  cytoscapeLightStylesheet,
} from "../../config/cytoscape-config";
import { gridGuideConfig } from "../../config/gridguide-config";
import { useLocalStorage } from "../../store/misc";
import { TabData } from "rc-dock";
import { compoundDndConfig } from "../../config/compound-dnd-config";

export const Graph = (): JSX.Element => {
  const ydoc = useStore((state) => state.ydoc);
  const ynodes = useStore((state) => state.ynodes());
  const yedges = useStore((state) => state.yedges());
  const getAwareness = useStore((state) => state.getAwareness);
  const isOnlineMode = useAtomValue(isOnlineModeAtom);

  const setCytoscape = useStore((state) => state.setCytoscape);
  const cytoscapeInstance = useStore((state) => state.cytoscape);

  const setSelectedElements = useStore((state) => state.setSelectedElements);

  const darkMode = useLocalStorage((state) => state.darkMode);

  const setUsernames = useOnlineUsers((states) => states.setUsernames);

  // update cursor move
  const handleMouseMove = useThrottledCallback(
    (e: cytoscape.EventObject) => {
      if (isOnlineMode)
        getAwareness().setLocalStateField("position", e.position);
    },
    10,
    []
  );

  // dark mode style
  useEffect(() => {
    if (darkMode) {
      cytoscapeInstance?.style(cytoscapeDarkStylesheet);
    } else {
      cytoscapeInstance?.style(cytoscapeLightStylesheet);
    }
  }, [darkMode, cytoscapeInstance]);

  useEffect(() => {
    cytoscape.use(Layers);
    cytoscape.use(edgehandles);
    cytoscape.use(layoutUtilities);
    cytoscape.use(fcose);
    cytoscape.use(gridGuide);
    cytoscape.use(compoundDragAndDrop);
    cytoscape.use(navigator);

    const cy = cytoscape({
      container: document.getElementById("cy"),
      ...cytoscapeConfig,
      elements: {
        nodes: [
          {
            data: { id: "a", name: "a", parent: "b" },
            position: { x: 215, y: 85 },
          },
          { data: { id: "b", name: "b" } },
          {
            data: { id: "c", name: "c", parent: "b" },
            position: { x: 300, y: 85 },
          },
          { data: { id: "d", name: "d" }, position: { x: 215, y: 175 } },
          { data: { id: "e", name: "e" } },
          {
            data: { id: "f", name: "f", parent: "e" },
            position: { x: 300, y: 175 },
          },
          {
            data: { id: "g", name: "g", parent: "b" },
          },
          {
            data: { id: "h", name: "h", parent: "g" },
          },
        ],
        edges: [
          { data: { id: "ad", source: "a", target: "d" } },
          { data: { id: "eb", source: "e", target: "b" } },
        ],
      },
    });
    setCytoscape(cy);

    // init edge handle
    const eh = cy.edgehandles(edgehandlesConfig);

    // init gridGuide
    // @ts-expect-error gridGuide config
    cy.gridGuide(gridGuideConfig);

    // init compound DragAndDrop
    // @ts-expect-error compound dnd config
    const cdnd = cy.compoundDragAndDrop(compoundDndConfig);

    // @ts-expect-error cytoscpae ext.
    const layers = cy.layers() as LayersPlugin;
    const cursorLayer = layers.append("canvas-static");

    // event register
    // sync node (add, delete)
    ynodes.observe((e, _tx) => {
      e.changes.keys.forEach((change, key) => {
        if (!(e.target instanceof YMap)) return;
        if (!cy) return;

        if (change.action === "add") {
          const node = e.target.get(key);
          if (node) cy.add(node.toJSON() as ElementDefinition);
        } else if (change.action === "delete") {
          cy.getElementById(key).remove();
        }
      });
    });

    // sync edge (add, delete)
    yedges.observe((e, _tx) => {
      e.changes.keys.forEach((change, key) => {
        if (!cy) return;

        if (change.action === "add") {
          const data = yedges.get(key);
          if (data && "source" in data && "target" in data && "id" in data) {
            // local edge handled by edgehadle plugin
            // if (tx.local) return;
            cy.add({ data });
          }
        } else if (change.action === "delete") {
          cy.getElementById(key).remove();
        }
      });
    });

    // sync node (data change)
    ynodes.observeDeep((evt) => {
      evt.forEach((e) =>
        e.changes.keys.forEach(
          (change: { action: string; [x: string]: unknown }, key: string) => {
            if (!(e.target instanceof YMap)) return;
            if (!cy) return;

            const path = e.path.pop();
            if (change.action === "add") {
              switch (path) {
                case "data": {
                  const [nodeId] = e.path;
                  if (!(typeof nodeId === "string")) return;
                  // write only necessary key
                  cy.getElementById(nodeId).data(key, e.target.get(key));
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
                  const node = cy.getElementById(id.toString());
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
                  const node = cy.getElementById(id.toString());
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
                  cy.getElementById(nodeId).removeData(key);
                  break;
                }
              }
            }
          }
        )
      );
    });

    // cursor update
    cy.on("vmousemove", (e) => {
      // update cursor postiton when grabbing node (left click drag)
      // but not panning (also left click drag)
      if (e.originalEvent.buttons !== 1 || e.cy.$(":grabbed").length) {
        handleMouseMove(e);
      }
    });

    // update cursor position
    cy.on("viewport", () => {
      cursorLayer.update();
    });

    // node move update
    cy.on("drag", (e) => {
      e.target.forEach((element: NodeSingular) => {
        const ynode = ynodes.get(element.data("id"));
        const ynodePosition = ynode?.get("position") as
          | YNodePosition
          | undefined;
        if (ynodePosition) {
          const nodePos = element.position();
          ydoc.transact(() => {
            ynodePosition.set("y", nodePos.y);
            ynodePosition.set("x", nodePos.x);
          });
        }
      });
    });

    // when layout complete, sync node position
    cy.on("layoutstop", (e) => {
      ydoc.transact(() => {
        e.target.options.eles.forEach((ele: SingularElementReturnValue) => {
          if (!ele.isNode()) return;
          const ynodePosition = ynodes
            .get(ele.id())
            ?.get("position") as YNodePosition;
          ynodePosition.set("x", ele.position("x"));
          ynodePosition.set("y", ele.position("y"));
        });
      });
    });

    // @ts-expect-error edgehandles event
    cy.on(
      "ehcomplete",
      (
        _event: unknown,
        _sourceNode: unknown,
        _targetNode: unknown,
        addedEdge: EdgeSingular
      ) => {
        // remove edge add by edgehandles, re-add to yedges
        cy.getElementById(addedEdge.id()).remove();
        yedges.set(addedEdge.id(), addedEdge.data());
      }
    );

    cy.on("cxttapstart", "node", (e) => {
      const node = e.target as NodeSingular;
      eh.enable();
      // @ts-expect-error wrong typed?
      eh.start(node);
    });

    cy.on("cxttapend", "node", () => {
      eh.stop();
      eh.disable();
    });

    cy.on("cxttap", "*", (e) => {
      const ele = e.target as SingularElementReturnValue;
      if (!ele.selected()) cy.$(":selected").unselect();
      ele.select();
    });

    // node slected
    cy.on("select", "node, edge", () => {
      setSelectedElements(cy.$(":selected"));
    });

    cy.on("unselect", "node, edge", () => {
      setSelectedElements(cy.$(":selected"));
    });

    // username update
    // TODO: sperate cursor layer?
    getAwareness().on(
      "change",
      (
        _actions: {
          added: Array<number>;
          updated: Array<number>;
          removed: Array<number>;
        },
        _tx: Record<string, unknown> | string
      ): void => {
        const onlineUsers = Array.from(
          getAwareness().getStates(),
          ([key, value]) => ({ id: key, username: value.username })
        );
        setUsernames(onlineUsers);
        cursorLayer.update();
      }
    );

    // cursor render
    cursorLayer.callback((ctx) => {
      getAwareness()
        .getStates()
        .forEach((value, key) => {
          if (getAwareness().clientID === key) return;

          const pos = value.position ?? { x: 0, y: 0 };
          const username = value.username ?? "";
          const color = value.color ?? "#000000";
          const img = generateCursor(color);
          const pan = cy.pan() ?? { x: 0, y: 0 };
          const zoom = cy.zoom() ?? 1;
          // start drawing
          const { x, y } = modelToRenderedPosition(pos, zoom, pan);
          ctx.save();
          if (img) ctx.drawImage(img, x, y);
          if (username !== "") {
            ctx.font = "1em sans-serif";
            ctx.textBaseline = "top";
            ctx.fillStyle = color;
            const width = ctx.measureText(username).width;
            ctx.fillRect(x + 10, y + 24, width + 4, 18);
            ctx.fillStyle = "white";
            ctx.fillText(username, x + 12, y + 25);
          }
          ctx.restore();
        });
    });

    return (): void => {
      cy.destroy();
    };
  }, []);

  return (
    <>
      <Toolbar />
      <div id="cy" className="h-full w-full" />
      {cytoscapeInstance && <GraphContextMenu cytoscape={cytoscapeInstance} />}
    </>
  );
};

export const GraphTab: TabData = {
  id: "graph",
  title: "Graph",
  content: <Graph />,
  cached: true,
  closable: false,
};
