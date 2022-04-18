import { MutableRefObject, useEffect, useRef } from "react";
import { Doc as YDoc, Map as YMap } from "yjs";
import {
  Edge,
  TransformProvider,
  TransformsJob,
  YEdges,
  YNode,
  YNodes,
} from "../../types/types";

export const useYDoc = (): {
  ydoc: MutableRefObject<YDoc>;
  ynodes: MutableRefObject<YNodes>;
  yedges: MutableRefObject<YEdges>;
  ytransformProviders: MutableRefObject<YMap<TransformProvider>>;
  ytransformJobs: MutableRefObject<YMap<TransformsJob>>;
} => {
  const ydoc = useRef<YDoc>(new YDoc());
  const ynodes = useRef<YNodes>(ydoc.current.getMap<YNode>("nodes"));
  const yedges = useRef<YEdges>(ydoc.current.getArray<Edge>("edges"));
  // transforms listing
  const ytransformProviders = useRef(
    ydoc.current.getMap<TransformProvider>("transform-providers")
  );
  // pending transforms requests
  const ytransformJobs = useRef(
    ydoc.current.getMap<TransformsJob>("transform-requests")
  );

  useEffect(() => {
    return (): void => ydoc.current.destroy();
  }, []);

  return { ydoc, ynodes, yedges, ytransformProviders, ytransformJobs };
};
