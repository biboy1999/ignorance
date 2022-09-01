import "cytoscape";

export declare module "cytoscape" {
  export interface CollectionData extends cytoscape.CollectionData {
    setData(key: string, value: string);
    changeDataKey(oldKey: string, newKey: string);
  }
}
