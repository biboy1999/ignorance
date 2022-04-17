import { MutableRefObject, useEffect, useRef } from "react";
import { Doc as YDoc } from "yjs";
import { YArray } from "yjs/dist/src/internals";
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
  ytransformOffers: MutableRefObject<YArray<TransformProvider>>;
  ytransformJobs: MutableRefObject<YArray<TransformsJob>>;
} => {
  const ydoc = useRef<YDoc>(new YDoc());
  const ynodes = useRef<YNodes>(ydoc.current.getMap<YNode>("nodes"));
  const yedges = useRef<YEdges>(ydoc.current.getArray<Edge>("edges"));
  // transforms listing
  const ytransformOffers = useRef(
    ydoc.current.getArray<TransformProvider>("transform-provider")
  );
  // pending transforms requests
  const ytransformJobs = useRef(
    ydoc.current.getArray<TransformsJob>("transform-requests")
  );

  useEffect(() => {
    return (): void => ydoc.current.destroy();
  }, []);

  return { ydoc, ynodes, yedges, ytransformOffers, ytransformJobs };
};
