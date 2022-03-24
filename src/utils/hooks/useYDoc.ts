import { MutableRefObject, useEffect, useRef } from "react";
import { Doc as YDoc } from "yjs";
import { YNode, YNodes } from "../../types";

export const useYDoc = (): {
  ydoc: MutableRefObject<YDoc>;
  ynodes: MutableRefObject<YNodes>;
} => {
  const ydoc = useRef<YDoc>(new YDoc());
  const ynodes = useRef<YNodes>(ydoc.current.getMap<YNode>("nodes"));

  useEffect(() => {
    return (): void => ydoc.current.destroy();
  }, []);

  return { ydoc, ynodes };
};
