import { Map as YMap } from "yjs";
import { Elements } from "./types";
import { YElement } from "./yjs";

export type ElementsChangeEvent = {
  elements: Elements[];
  local: boolean;
} & (GraphEvent | YjsEvent);

type GraphEvent = {
  from: "graph";
  target: cytoscape.Core;
};

type YjsEvent = {
  from: "yjs";
  target: YMap<YElement>;
};

export type ElementDataChangeEvent = {
  elements: Change[];
  local: boolean;
} & (GraphEvent | YjsEvent);

type Change = {
  path: string[];
  action: "add" | "update" | "delete";
  newValue: unknown;
  oldValue: unknown;
};
