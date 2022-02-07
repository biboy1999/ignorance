import * as Y from "yjs";

type yNodePosition = Y.Map<number>;

type yNodeProp = string;

type yNodeData = Y.Map<yNodeProp>;

type yNodeGroup = string;

type yNode = Y.Map<yNodeGroup | yNodeData | yNodePosition>;

type yNodes = Y.Map<yNode>;

export type { yNodes, yNode, yNodeGroup, yNodeData, yNodePosition };
