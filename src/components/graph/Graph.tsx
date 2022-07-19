import Layers, { ICanvasStaticLayer, LayersPlugin } from "cytoscape-layers";
import edgehandles from "cytoscape-edgehandles";
import cytoscape, {
  EdgeSingular,
  ElementDefinition,
  NodeSingular,
  SingularElementReturnValue,
} from "cytoscape";
import fcose from "cytoscape-fcose";
import layoutUtilities from "cytoscape-layout-utilities";
import { useEffect, useRef, useState } from "react";
import { Map as YMap } from "yjs";
import { init_options } from "../../temp/init-data";
import { useOnlineUsers } from "../../store/onlineUsers";
import { YNode, YNodeData, YNodePosition } from "../../types/types";
import { generateCursor, modelToRenderedPosition } from "../../utils/canvas";
import { useThrottledCallback } from "../../utils/hooks/useThrottledCallback";
import { NodeContextMenu } from "../NodeContextMenu";
import { NodeAttributes } from "../windows/NodeAttributes";
import { useAtomValue } from "jotai";
import { isOnlineModeAtom } from "../../atom/provider";
import { useStore } from "../../store/store";

const Graph = (): JSX.Element => {
  const ydoc = useStore((state) => state.ydoc);
  const ynodes = useStore((state) => state.ynodes());
  const yedges = useStore((state) => state.yedges());
  const awareness = useStore((state) => state.getAwareness());
  const isOnlineMode = useAtomValue(isOnlineModeAtom);

  const setCytoscape = useStore((state) => state.setCytoscape);

  const cy = useRef<cytoscape.Core>();

  const [selectedNode, setSelectedNode] = useState<NodeSingular>();

  const layers = useRef<LayersPlugin>();
  const cursorLayer = useRef<ICanvasStaticLayer>();

  const loadedImages = useRef<Map<number, HTMLImageElement>>();

  const setUsernames = useOnlineUsers((states) => states.setUsernames);

  // update cursor move
  const handleMouseMove = useThrottledCallback(
    (e: cytoscape.EventObject) => {
      if (isOnlineMode) awareness.setLocalStateField("position", e.position);
    },
    10,
    []
  );

  useEffect(() => {
    Layers(cytoscape);
    cytoscape.use(edgehandles);
    cytoscape.use(layoutUtilities);
    cytoscape.use(fcose);
    cy.current = cytoscape({
      container: document.getElementById("cy"),
      ...init_options,
    });
    setCytoscape(cy.current);

    // init edge options
    const defaults = {
      canConnect: (
        sourceNode: NodeSingular,
        targetNode: NodeSingular
      ): boolean => {
        // whether an edge can be created between source and target
        return (
          // disallow loops
          !sourceNode.same(targetNode) &&
          // disallow multiple edge
          !sourceNode.edgesWith(targetNode).length
        );
      },
      // edgeParams: function (
      //   sourceNode: NodeSingular,
      //   targetNode: NodeSingular
      // ) {
      //   // for edges between the specified source and target
      //   // return element object to be passed to cy.add() for edge
      //   return {};
      // },
      // hoverDelay: 150, // time spent hovering over a target node before it is considered selected
      snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
      // snapThreshold: 10, // the target node must be less than or equal to this many pixels away from the cursor/finger
      // snapFrequency: 5, // the number of times per second (Hz) that snap checks done (lower is less expensive)
      // noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
      // disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
    };

    const eh = cy.current.edgehandles(defaults);

    // @ts-expect-error cytoscpae ext.
    layers.current = cy.current.layers() as LayersPlugin;
    cursorLayer.current = layers.current.append("canvas-static");

    loadedImages.current = new Map<number, HTMLImageElement>();

    // event register
    // sync node (add, delete)
    ynodes.observe((e, _tx) => {
      e.changes.keys.forEach((change, key) => {
        if (!(e.target instanceof YMap)) return;
        if (!cy.current) return;

        if (change.action === "add") {
          const node = e.target.get(key);
          if (node) cy.current.add(node.toJSON() as ElementDefinition);
        } else if (change.action === "delete") {
          cy.current.getElementById(key).remove();
        }
      });
    });

    // sync edge (add, delete)
    yedges.observe((e, _tx) => {
      e.changes.keys.forEach((change, key) => {
        if (!cy.current) return;

        if (change.action === "add") {
          const data = yedges.get(key);
          if (data && "source" in data && "target" in data && "id" in data) {
            // local edge handled by edgehadle plugin
            // if (tx.local) return;
            cy.current?.add({ data });
          }
        } else if (change.action === "delete") {
          cy.current.getElementById(key).remove();
        }
      });
    });

    // nodes sync (data change)
    ynodes.observeDeep((evt) => {
      evt.forEach((e) =>
        e.changes.keys.forEach(
          (change: { action: string; [x: string]: unknown }, key: string) => {
            if (!(e.target instanceof YMap)) return;
            if (!cy.current) return;

            const path = e.path.pop();
            if (change.action === "add") {
              switch (path) {
                case "data": {
                  const [nodeId] = e.path;
                  if (!(typeof nodeId === "string")) return;
                  // write only necessary key
                  cy.current
                    .getElementById(nodeId)
                    .data(key, e.target.get(key));
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
                  const node = cy.current.getElementById(id.toString());
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
                  const node = cy.current.getElementById(id.toString());
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
                  cy.current.getElementById(nodeId).removeData(key);
                  break;
                }
              }
            }
          }
        )
      );
    });

    // cursor update
    cy.current.on("vmousemove", (e) => {
      if (e.cy.$(":grabbed").length || e.originalEvent.buttons !== 1)
        handleMouseMove(e);
    });

    cy.current.on("viewport", () => {
      cursorLayer.current?.update();
    });

    // node move update
    cy.current.on("drag", (e) => {
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

    // @ts-expect-error edgehandles event
    cy.current.on(
      "ehcomplete",
      (
        _event: unknown,
        _sourceNode: unknown,
        _targetNode: unknown,
        addedEdge: EdgeSingular
      ) => {
        cy.current?.getElementById(addedEdge.id()).remove();
        yedges.set(addedEdge.id(), addedEdge.data());
      }
    );

    // when layout complete, sync node position
    cy.current.on("layoutstop", (e) => {
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

    cy.current.on("cxttapstart", "node", (e) => {
      const node = e.target as NodeSingular;
      eh.enable();
      // @ts-expect-error wrong typed
      eh.start(node);
    });

    cy.current.on("cxttapend", "node", () => {
      eh.stop();
      eh.disable();
    });

    cy.current.on("cxttap", "*", (e) => {
      const ele = e.target as SingularElementReturnValue;
      if (!ele.selected()) cy.current?.$(":selected").unselect();
      ele.select();
    });

    // node slected
    cy.current.on("select", (e) => {
      if (e.target.isNode()) setSelectedNode(e.target);
    });

    return (): void => {
      cy.current?.destroy();
    };
  }, []);

  useEffect(() => {
    // username update
    // TODO: sperate cursor layer?
    awareness.on(
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
          awareness.getStates(),
          ([key, value]) => ({ id: key, username: value.username })
        );
        setUsernames(onlineUsers);
        cursorLayer.current?.update();
      }
    );

    // cursor render
    cursorLayer.current?.callback((ctx) => {
      awareness.getStates().forEach((value, key) => {
        if (awareness.clientID === key) return;

        const pos = value.position ?? { x: 0, y: 0 };
        const username = value.username ?? "";
        const color = value.color ?? "#000000";
        const img = generateCursor(color);
        const pan = cy.current?.pan() ?? { x: 0, y: 0 };
        const zoom = cy.current?.zoom() ?? 1;
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
  }, [awareness]);

  return (
    <>
      <div id="cy" className="flex-1" />
      <NodeContextMenu />
      <NodeAttributes nodes={selectedNode} />
    </>
  );
};

export { Graph };
