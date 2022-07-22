import memoizee from "memoizee";
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

const _generateCursor = (color: string): HTMLImageElement => {
  const img = new Image();
  img.src = `data:image/svg+xml;utf8,${encodeURIComponent(cursor(color))}`;
  return img;
};

export const generateCursor = memoizee(_generateCursor, { max: 250 });
