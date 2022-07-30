export type NodeData = {
  id?: string;
  [key: string]: string | undefined;
};

export type EdgeData = {
  id?: string;
  [key: string]: string | undefined;
};

export type Edge = { source: string; target: string; id: string };

export type Node = {
  data: {
    id: string;
    [key: string]: string;
  };
  position: { x: number; y: number };
};
