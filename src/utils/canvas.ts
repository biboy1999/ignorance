import { cursor } from "./svg";

export const modelToRenderedPosition = (
  pos: { x: number; y: number },
  zoom: number,
  pan: { x: number; y: number }
): { x: number; y: number } => ({
  x: pos.x * zoom + pan.x,
  y: pos.y * zoom + pan.y,
});

export const renderedPositionToModel = (
  pos: { x: number; y: number },
  zoom: number,
  pan: { x: number; y: number }
): { x: number; y: number } => ({
  x: (pos.x - pan.x) / zoom,
  y: (pos.y - pan.y) / zoom,
});

export const generateCursor = (color: string): HTMLImageElement => {
  const img = new Image();
  img.src = "data:image/svg+xml;utf8," + encodeURIComponent(cursor(color));
  img.alt = color;
  return img;
};
