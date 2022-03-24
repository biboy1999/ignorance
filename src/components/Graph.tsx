import Layers, { ICanvasStaticLayer, LayersPlugin } from "cytoscape-layers";
import cytoscape from "cytoscape";
import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { Doc, Map as YMap } from "yjs";
import { Awareness } from "y-protocols/awareness";
import { init_options } from "../temp/init-data";
import { useOnlineUsers } from "../store/onlineUsers";
import { useSelectedNodes } from "../store/selectedNodes";
import { YNode, YNodeData, YNodePosition, YNodes } from "../types";
import { generateCursor, modelToRenderedPosition } from "../utils/canvas";
import { useThrottledCallback } from "../utils/hooks/useThrottledCallback";
import { ProviderDocContext } from "../App";
const Graph = ({
  awareness,
  ydoc,
  ynodes,
}: {
  awareness: Awareness;
  ydoc: MutableRefObject<Doc>;
  ynodes: MutableRefObject<YNodes>;
}): JSX.Element => {
  const context = useContext(ProviderDocContext);

  const cy = useRef<cytoscape.Core>();
  const layers = useRef<LayersPlugin>();
  const cursorLayer = useRef<ICanvasStaticLayer>();

  const loadedImages = useRef<Map<number, HTMLImageElement>>();

  const setUsernames = useOnlineUsers((states) => states.setUsernames);
  // const nodes = useSelectedNodes((states) => states.nodes);
  const addNode = useSelectedNodes((states) => states.addNode);

  // update cursor move
  const handleMouseMove = useThrottledCallback(
    (e: cytoscape.EventObject) => {
      if (context.isOnlineMode)
        awareness.setLocalStateField("position", e.position);
    },
    10,
    []
  );
  useEffect(() => {
    Layers(cytoscape);
    cy.current = cytoscape({
      container: document.getElementById("cy"),
      ...init_options,
    });

    // @ts-expect-error cytoscpae ext.
    layers.current = cy.current.layers() as LayersPlugin;
    cursorLayer.current = layers.current.append("canvas-static");
    loadedImages.current = new Map<number, HTMLImageElement>();

    // event register
    // cursor render
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

    // nodes sync
    ynodes.current.observeDeep((evt) => {
      evt.forEach((e) =>
        e.changes.keys.forEach((change, key) => {
          if (!(e.target instanceof YMap)) return;
          if (!cy.current) return;

          const path = e.path.pop();
          if (change.action === "add") {
            switch (path) {
              case "data": {
                const [nodeId] = e.path;
                if (!(typeof nodeId === "string")) return;
                // write only necessary key
                cy.current.getElementById(nodeId).data(key, e.target.get(key));
                break;
              }

              default: {
                cy.current.add(e.target.get(key).toJSON());
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
                node.position(target.toJSON());
                break;
              }
              case "data": {
                const target = e.target as YNodeData;
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
              default: {
                cy.current.getElementById(key).remove();
                break;
              }
            }
          }
        })
      );
    });

    // cursor render
    cursorLayer.current.callback((ctx) => {
      awareness.getStates().forEach((value, key) => {
        if (awareness.clientID === key) return;

        const pos = value.position ?? { x: 0, y: 0 };
        const username = value.username ?? "";
        const color = value.color ?? "#000000";
        // XXX: why? act as cache not to create cursor every movement.
        const img =
          loadedImages.current?.get(key)?.alt == color
            ? loadedImages.current?.get(key)
            : loadedImages.current?.set(key, generateCursor(color)).get(key);
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

    // cursor update
    cy.current?.on("mousemove", (e) => {
      handleMouseMove(e);
    });

    cy.current?.on("viewport", () => {
      cursorLayer.current?.update();
    });

    // node move update
    cy.current.on("drag", (e) => {
      e.target.forEach((element: cytoscape.NodeSingular) => {
        const ynode = ynodes.current?.get(element.data("id"));
        const ynodePosition = ynode?.get("position") as
          | YNodePosition
          | undefined;
        if (ynodePosition) {
          const nodePos = element.position();
          ydoc.current?.transact(() => {
            ynodePosition.set("x", nodePos.x);
            ynodePosition.set("y", nodePos.y);
          });
        }
      });
    });

    // node slected
    cy.current.on("select", (e) => {
      if (e.target.isNode()) addNode(e.target);
    });

    return (): void => {
      cy.current?.destroy();
    };
  }, []);

  return <div id="cy" className="flex-1" />;
};

export { Graph };
