import { useEffect, useRef } from "react";
import { WebrtcProvider } from "y-webrtc";
import cytoscape from "cytoscape";
import Layers, { ICanvasStaticLayer, LayersPlugin } from "cytoscape-layers";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness.js";
import { v4 as uuidv4 } from "uuid";
import { init_options } from "./temp/init-data";
import { yNode, yNodes, yNodeGroup, yNodeData, yNodePosition } from "./types";
import "./App.css";
import { generateCursor, modelToRenderedPosition } from "./utils/canvas";
import { UserInfo } from "./components/panel/UserInfo";
import { useOnlineUsers } from "./store/onlineUsers";
import { generateUsername } from "./utils/username/randomUsername";
import { useSelectedNodes } from "./store/selectedNodes";
import { NodeAttributes } from "./components/panel/NodeAttributes";
import { Controlbar } from "./components/Controlbar";

function App(): JSX.Element {
  const ydoc = useRef<Y.Doc>();
  const ynodes = useRef<yNodes>();
  const provider = useRef<WebrtcProvider>();
  const awareness = useRef<Awareness>();

  const cy = useRef<cytoscape.Core>();
  const layers = useRef<LayersPlugin>();
  const cursorLayer = useRef<ICanvasStaticLayer>();

  const loadedImages = useRef<Map<number, HTMLImageElement>>();

  const setUsernames = useOnlineUsers((states) => states.setUsernames);
  const nodes = useSelectedNodes((states) => states.nodes);
  const addNode = useSelectedNodes((states) => states.addNode);
  useEffect(() => {
    // yjs init
    ydoc.current = new Y.Doc();
    ynodes.current = ydoc.current.getMap<yNode>("nodes");

    awareness.current = new Awareness(ydoc.current);

    awareness.current.setLocalStateField("username", generateUsername());

    // @ts-expect-error most property are optional
    provider.current = new WebrtcProvider("test", ydoc.current, {
      signaling: ["ws://localhost:13777"],
      password: "asdqweqwe",
      awareness: awareness.current,
      filterBcConns: false,
    });

    // graph init
    Layers(cytoscape);
    cy.current = cytoscape({
      container: document.getElementById("cy"),
      ...init_options,
    });

    // @ts-expect-error cytoscpae ext.
    layers.current = cy.current.layers() as LayersPlugin;
    cursorLayer.current = layers.current.append("canvas-static");

    provider.current.on("synced", (synced: unknown) => {
      console.log("synced!", synced);
    });

    loadedImages.current = new Map<number, HTMLImageElement>();
    // event register
    // cursor render
    provider.current.awareness.on(
      "change",
      (
        _actions: {
          added: Array<number>;
          updated: Array<number>;
          removed: Array<number>;
        },
        _tx: Record<string, unknown> | string
      ): void => {
        if (!awareness.current) return;
        const onlineUsers = Array.from(
          awareness.current.getStates(),
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
          if (!(e.target instanceof Y.Map)) return;
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
                const target = e.target as yNodePosition;
                const yNode = e.target.parent as yNode;

                const yNodeData = yNode.get("data") as yNodeData;
                const id = yNodeData.get("id");
                if (!id) break;
                const node = cy.current.getElementById(id.toString());
                if (!node) break;
                node.position(target.toJSON());
                break;
              }
              case "data": {
                const target = e.target as yNodeData;
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
      if (provider.current?.awareness instanceof Awareness) {
        provider.current.awareness.getStates().forEach((value, key) => {
          if (provider.current?.awareness.clientID === key) return;

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
      }
    });

    // cursor update
    cy.current?.on("mousemove", (e) => {
      provider.current?.awareness.setLocalStateField("position", e.position);
    });

    cy.current?.on("viewport", () => {
      cursorLayer.current?.update();
    });

    // node move update
    cy.current.on("drag", (e) => {
      e.target.forEach((element: cytoscape.NodeSingular) => {
        const ynode = ynodes.current?.get(element.data("id"));
        const ynodePosition = ynode?.get("position") as
          | yNodePosition
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
      provider.current?.destroy();
    };
  }, []);

  const handleAddNode = (): void => {
    const id = uuidv4();

    const data = new Y.Map<string>();
    data.set("id", id);
    data.set("name", "New Node");
    data.set("testattr", "test");

    const position = new Y.Map<number>();
    position.set("x", 300);
    position.set("y", 200);

    const node = new Y.Map<yNodeGroup | yNodeData | yNodePosition>();
    node.set("group", "nodes");
    node.set("data", data);
    node.set("position", position);

    ynodes.current?.set(id, node);
  };

  const handleDeleteNode = (): void => {
    const nodes = useSelectedNodes.getState().nodes;
    nodes.forEach((node) => ynodes.current?.delete(node.id()));
  };

  return (
    <div>
      <UserInfo awarenessRef={awareness} />
      <NodeAttributes nodes={nodes} ynodesRef={ynodes} />
      <Controlbar onAdd={handleAddNode} onDelete={handleDeleteNode} />
      <div id="cy" style={{ height: "100vh", width: "100vw" }} />
    </div>
  );
}

export default App;
