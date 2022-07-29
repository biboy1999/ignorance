import { LayersPlugin } from "cytoscape-layers";
import { Awareness } from "y-protocols/awareness";
import {
  generateCursor,
  modelToRenderedPosition,
} from "../../../../utils/canvas";

export const registerCursorRender = (
  cytoscape: cytoscape.Core,
  awareness: Awareness,
  handleMouseMove: (e: cytoscape.EventObject) => void,
  setUsernames: (
    userList: {
      id: number;
      username: string;
    }[]
  ) => void
): (() => void) => {
  // @ts-expect-error cytoscpae ext.
  const layers = cytoscape.layers() as LayersPlugin;
  const cursorLayer = layers.append("canvas-static");

  const handleMouseMoveUpdate: cytoscape.EventHandler = (e) => {
    // update cursor postiton when panning view, dragging node
    // or box select
    const panning = e.originalEvent.buttons !== 1;
    const dragging = e.cy.$(":grabbed").length;
    const boxSelect = e.originalEvent.shiftKey && e.originalEvent.buttons === 1;
    if (panning || dragging || boxSelect) {
      handleMouseMove(e);
    }
  };
  cytoscape.on("vmousemove", handleMouseMoveUpdate);

  const handleViewportChange = () => {
    cursorLayer.update();
  };
  cytoscape.on("viewport", handleViewportChange);

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
      const onlineUsers = Array.from(awareness.getStates(), ([key, value]) => ({
        id: key,
        username: value.username,
      }));
      setUsernames(onlineUsers);
      cursorLayer.update();
    }
  );

  cursorLayer.callback((ctx) => {
    awareness.getStates().forEach((value, key) => {
      if (awareness.clientID === key) return;

      const pos = value.position ?? { x: 0, y: 0 };
      const username = value.username ?? "";
      const color = value.color ?? "#000000";
      const img = generateCursor(color);
      const pan = cytoscape.pan() ?? { x: 0, y: 0 };
      const zoom = cytoscape.zoom() ?? 1;
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
  return () => {
    cytoscape.off("viewport", handleViewportChange);
    cytoscape.off("vmousemove", handleMouseMoveUpdate);
  };
};
