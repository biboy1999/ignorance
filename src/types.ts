import * as Y from "yjs";

type yNodePosition = Y.Map<number>;

type yNodeProp = Y.Text;

type yNodeData = Y.Map<yNodeProp>;

type yNodeGroup = Y.Text;

type yNode = Y.Map<yNodeGroup | yNodeData | yNodePosition>;

type yNodes = Y.Map<yNode>;

export type { yNodes, yNode, yNodeGroup, yNodeData, yNodePosition };
