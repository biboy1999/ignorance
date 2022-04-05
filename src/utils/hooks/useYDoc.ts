import { MutableRefObject, useEffect, useRef } from "react";
import { Doc as YDoc } from "yjs";
import { Edge, YEdges, YNode, YNodes } from "../../types/types";

export const useYDoc = (): {
  ydoc: MutableRefObject<YDoc>;
  ynodes: MutableRefObject<YNodes>;
  yedges: MutableRefObject<YEdges>;
} => {
  const ydoc = useRef<YDoc>(new YDoc());
  const ynodes = useRef<YNodes>(ydoc.current.getMap<YNode>("nodes"));
  const yedges = useRef<YEdges>(ydoc.current.getArray<Edge>("edges"));

  useEffect(() => {
    return (): void => ydoc.current.destroy();
  }, []);

  return { ydoc, ynodes, yedges };
};
