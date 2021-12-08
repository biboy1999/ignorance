import { ChangeEvent, useEffect, useMemo, useRef } from "react";
import { WebrtcProvider } from 'y-webrtc'
import cytoscape from "cytoscape";
import Layers, { ISVGStaticLayer, LayersPlugin } from "cytoscape-layers";
import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness.js'
import './App.css';
import { init_options } from "./temp/init-data";
import { cursor } from "./svg";

// @ts-ignore
cytoscape.use(Layers);


function App() {
  const ydoc = useMemo(() => new Y.Doc(), []);
  // @ts-ignore
  const provider = useRef<WebrtcProvider>();
  const awareness = useRef<Awareness>();

  const yNodesMap = ydoc.getMap("nodes");
  const cy = useRef<cytoscape.Core>();
  const layers = useRef<LayersPlugin>();
  const cursorLayer = useRef<ISVGStaticLayer>();

  useEffect(() => {
    // @ts-ignore
    provider.current = new WebrtcProvider('test', ydoc, {
      password: 'asdqwe',
      signaling: ['ws://localhost:14444']
    });
    awareness.current = provider.current.awareness;

    awareness.current.on("change", (actions: { added: Array<number>, updated: Array<number>, removed: Array<number> }, tx: any) => {
      // added updated removed
      if (tx === "local") return;

      console.log(tx);

      actions.added.forEach(clientId => {
        // if (!("position" in tx.awareness.getStates().get(clientId))) return;
        const pos = tx.awareness.getStates().get(clientId)?.position ?? { x: 0, y: 0 };
        const username = tx.awareness.getStates().get(clientId)?.username ?? " ";
        cursorLayer.current?.node.insertAdjacentHTML(
          "beforeend",
          `<g id="cursor-${clientId}" fill="green" transform="translate(${pos.x}, ${pos.y})scale(0.025)">${cursor}
           <foreignObject x=25 y=30 width="1" height="1" class="foreign-object"><span id="nametag-${clientId}" class="nametag-text" style="background-color:#CFC">${username}</span></foreignObject></g>`
        );
      });

      actions.updated.forEach(clientId => {
        // cursor position
        const pos = tx.awareness.getStates().get(clientId)?.position ?? null;
        const username = tx.awareness.getStates().get(clientId)?.username ?? " ";
        const userCursorSvg = document.getElementById(`cursor-${clientId}`);
        const nametag = document.getElementById(`nametag-${clientId}`) as HTMLSpanElement
        if (nametag && username) {
          // nametag.textContent = username;
          nametag.textContent = username;
          nametag.parentElement?.setAttribute("x", "2");
          nametag.parentElement?.setAttribute("x", "1");
        }

        if (userCursorSvg && pos)
          userCursorSvg.setAttribute("transform", `translate(${pos.x}, ${pos.y})scale(0.025)`);
        // else
        //   cursorLayer.current?.node.insertAdjacentHTML(
        //     "beforeend",
        //     `<g id="cursor-${clientId}" fill="green" transform="translate(${pos.x}, ${pos.y})scale(0.025)">${cursor}
        //     <foreignObject x=25 y=30 width="1" height="1" class="foreign-object"><span id="nametag-${clientId}" class="nametag-text" style="background-color:#CFC">${username}asd</span></foreignObject></g>`
        //   );
      })

      // cursorLayer.current?.node.insertAdjacentHTML(
      //   "beforeend",
      //   `<g fill="green" transform="translate(-14,-10)scale(0.025)">${cursor}
      //   <foreignObject x=25 y=30 width="100%" height="100%" class="foreign-object"><span class="nametag-text" style="background-color:#CFC">asdf</span></foreignObject>
      //   </g>`
      // );
    });

    provider.current?.on('synced', (synced: any) => {
      console.log('synced!', synced)
    });

    yNodesMap.observeDeep(evt => {
      evt.forEach(e => e.changes.keys.forEach((change, key) => {
        if (change.action === "add") {
          // console.log(`Property "${key}" was added. Initial value: "${yNodesMap.get(key)}".`)          
          // @ts-ignore
          cy.current?.add(e.target.get(key).toJSON());
        } else if (change.action === "update") {
          // console.log(`Property "${key}" was updated. New value: "${yNodesMap.get(key)}". Previous value: "${change.oldValue}".`)
          // @ts-ignore
          const node = cy.current?.getElementById(e.target.get("data")?.get("id"));
          // @ts-ignore
          node?.position(e.target.get("position"))
        } else if (change.action === "delete") {
          // console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`)
          // @ts-ignore
          const node = cy.current?.getElementById(key)
          node?.remove()

        }
      }));

    });

    return () => {
      provider.current?.destroy();
    };
  }, [provider, awareness, ydoc, yNodesMap])

  // node creation
  useEffect(() => {
    cy.current = cytoscape({ container: document.getElementById("cy"), ...init_options });
    // @ts-ignore
    layers.current = cy.current.layers();
    cursorLayer.current = layers.current?.append("svg-static", {
      stopClicks: true
    });

    // node sync
    cy.current.on("drag", e => {
      e.target.forEach((element: cytoscape.NodeSingular) => {
        const ynode: any = yNodesMap.get(element.data("id"));
        ynode?.set("position", element.position());
      });
    });

    cy.current.on("mousemove", e => {
      // cursor position
      awareness.current?.setLocalStateField("position", e.position)
    });

    cy.current.on("dragpan", e => {
      const pos = e.target.pan();
      cursorLayer.current?.node.setAttribute("transform", `translate(${pos.x}, ${pos.y})`)
    });

  }, [yNodesMap]);

  const handleAddNode = () => {
    const id = (document.getElementById("addnodeid") as HTMLInputElement).value;

    const data = new Y.Map();
    data.set("id", id);

    const position = new Y.Map();
    position.set("x", 300);
    position.set("y", 200);

    const node = new Y.Map();
    node.set("group", "nodes");
    node.set("data", data);
    node.set("position", position);

    yNodesMap.set(id, node);
  }

  const handleDeleteNode = () => {
    const node = document.getElementById("delnodeid");
    if (node instanceof HTMLInputElement)
      yNodesMap.delete(node.value);
  }

  const handleUpdateUsername = (e: ChangeEvent) => {
    if (e.target instanceof HTMLInputElement)
      awareness.current?.setLocalStateField("username", e.target.value)
  }

  return (
    <div>
      <input type="text" id="addnodeid" />
      <button
        onClick={() => handleAddNode()}
      >
        addNode
      </button>

      <input type="text" id="delnodeid" />
      <button
        onClick={() => handleDeleteNode()}
      >
        DeleteNode
      </button>

      <input type="text" id="username" placeholder="username" onChange={handleUpdateUsername} />

      <div id="cy" style={{ height: "90vh", width: "100vw" }} />
    </div>

  );
}

export default App;
