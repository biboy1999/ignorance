import { LayersPlugin } from "cytoscape-layers";
import { Awareness } from "y-protocols/awareness";
import throttle from "lodash.throttle";
import { generateCursor } from "../utils/canvas";

// TODO: perfect cursor with canvas
export const initCursor = (
  cytoscape: cytoscape.Core,
  awareness: Awareness
): (() => void) => {
  // @ts-expect-error cytoscpae ext.
  const layers = cytoscape.layers() as LayersPlugin;
  const cursorLayer = layers.append("canvas");

  const handleMouseMoveUpdate = throttle((e: cytoscape.EventObject) => {
    awareness.setLocalStateField("position", e.position);
  }, 10);

  const animateCursor = (): void => {
    const update: FrameRequestCallback = () => {
      requestAnimationFrame(update);
      cursorLayer.update();
    };

    cursorLayer.callback((ctx) => {
      awareness.getStates().forEach((value, key) => {
        if (awareness.clientID === key) return;
        const pos = value.position ?? { x: 0, y: 0 };
        const username = value.username ?? "";
        const color = value.color ?? "#000000";
        const img = generateCursor(color);
        // start drawing
        // const { x, y } = modelToRenderedPosition(pos, zoom, pan);
        const { x, y } = pos;
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
    requestAnimationFrame(update);
  };

  animateCursor();

  const handleMouseMove: cytoscape.EventHandler = (e) => {
    // update cursor postiton when panning view, dragging node
    // or box select
    const panning = e.originalEvent.buttons !== 1;
    const dragging = e.cy.$(":grabbed").length;
    const boxSelect = e.originalEvent.shiftKey && e.originalEvent.buttons === 1;
    if (panning || dragging || boxSelect) {
      handleMouseMoveUpdate(e);
    }
  };

  cytoscape.on("vmousemove", handleMouseMove);

  return () => {
    cytoscape.off("vmousemove", handleMouseMove);
  };
};
