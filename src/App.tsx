import { useEffect, useRef } from "react";
import { WebrtcProvider } from "y-webrtc";
import cytoscape from "cytoscape";
import Layers, { ICanvasStaticLayer, LayersPlugin } from "cytoscape-layers";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness.js";
import { init_options } from "./temp/init-data";
import { yNode } from "./types";
import "./App.css";
import { generateCursor, modelToRenderedPosition } from "./utils/canvas";
import { UserInfo } from "./components/panel/UserInfo";
import { useOnlineUsers } from "./states/onlineUsers";

function App(): JSX.Element {
  const ydoc = useRef<Y.Doc>();
  const ynodes = useRef<Y.Map<Y.Map<yNode>>>();
  const provider = useRef<WebrtcProvider>();
  const awareness = useRef<Awareness>();

  const cy = useRef<cytoscape.Core>();
  const layers = useRef<LayersPlugin>();
  const cursorLayer = useRef<ICanvasStaticLayer>();

  const loadedImages = useRef<Map<number, HTMLImageElement>>();

  const setUsernames = useOnlineUsers((states) => states.setUsernames);

  useEffect(() => {
    // yjs init
    ydoc.current = new Y.Doc();
    ynodes.current = ydoc.current.getMap<Y.Map<yNode>>("nodes");

    awareness.current = new Awareness(ydoc.current);

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

    // provider.current.on("synced", (synced: unknown) => {
    //   console.log("synced!", synced);
    // });

    loadedImages.current = new Map<number, HTMLImageElement>();
    // event register
    // cursor render
    provider.current.awareness.on(
      "change",
      (
        actions: {
          added: Array<number>;
          updated: Array<number>;
          removed: Array<number>;
        },
        tx: Record<string, unknown> | string
      ): void => {
        if (typeof tx === "string") return;
        if (!("awareness" in tx && tx.awareness instanceof Awareness)) return;
        const onlineUsers = Array.from(
          tx.awareness.getStates(),
          ([, v]) => v.username ?? "Candice"
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

          if (change.action === "add") {
            // console.log(`Property "${key}" was added. Initial value: "${yNodesMap.get(key)}".`)
            cy.current?.add(e.target.get(key).toJSON());
          } else if (change.action === "update") {
            // console.log(`Property "${key}" was updated. New value: "${yNodesMap.get(key)}". Previous value: "${change.oldValue}".`)
            const node = cy.current?.getElementById(
              // @ts-expect-error idk
              e.target.parent?.get("data")?.get("id")
            );
            // @ts-expect-error idk
            node?.position(e.target.parent?.get("position").toJSON());
          } else if (change.action === "delete") {
            // console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
            const node = cy.current?.getElementById(key);
            node?.remove();
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
          const username = value.username ?? "Candice";
          const color = value.color ?? "#000000";
          // XXX: why?
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
            ctx.fillRect(x + 10, y + 24, width + 4, 16);
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
        const ynodePosition = ynode?.get("position");
        if (ynodePosition instanceof Y.Map) {
          const nodePos = element.position();
          ydoc.current?.transact(() => {
            ynodePosition.set("x", nodePos.x);
            ynodePosition.set("y", nodePos.y);
          });
        }
      });
    });

    return (): void => {
      provider.current?.destroy();
    };
  }, []);

  // const handleAddNode = (): void => {
  //   const id = (document.getElementById("addnodeid") as HTMLInputElement).value;

  //   const data = new Y.Map<string>();
  //   data.set("id", id);

  //   const position = new Y.Map<number>();
  //   position.set("x", 300);
  //   position.set("y", 200);

  //   const node = new Y.Map<yNode>();
  //   node.set("group", "nodes");
  //   node.set("data", data);
  //   node.set("position", position);

  //   ynodes.current?.set(id, node);
  // };

  // const handleDeleteNode = (): void => {
  //   const node = document.getElementById("delnodeid");
  //   if (node instanceof HTMLInputElement) yNodesMap.delete(node.value);
  // };

  // const handleUpdateUsername = (e: ChangeEvent): void => {
  //   if (e.target instanceof HTMLInputElement)
  //     awareness.current?.setLocalStateField("username", e.target.value);
  // };

  // const handleColorOnChange = (e: ChangeEvent): void => {
  //   if (e.target instanceof HTMLInputElement)
  //     provider.current?.awareness.setLocalStateField("color", e.target.value);
  // };

  return (
    <div>
      {/* <input type="text" id="addnodeid" />
      <button onClick={(): void => handleAddNode()}>addNode</button> */}

      {/* <input type="text" id="delnodeid" />
      <button onClick={(): void => handleDeleteNode()}>DeleteNode</button> */}

      {/* <input
        type="text"
        id="username"
        placeholder="username"
        onChange={handleUpdateUsername}
      /> */}

      {/* <input type="color" id="user-color" onChange={handleColorOnChange} /> */}
      <UserInfo awarenessRef={awareness} />
      <div id="cy" style={{ height: "100vh", width: "100vw" }} />
    </div>
  );
}

export default App;
