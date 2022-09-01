import { TabData } from "rc-dock";
import { useStore } from "../../../store/store";
import { useDeferredValue, useEffect, useState } from "react";
import { TreeView } from "./TreeView";
import { Search } from "./Search";

export const NodeList = (): JSX.Element => {
  const cytoscape = useStore((state) => state.cytoscape);

  const [filter, setFilter] = useState("");
  const deferredFilter = useDeferredValue(filter);

  const [elements, setElements] = useState<cytoscape.CollectionArgument>();

  const updateNodeList = (): void => {
    const filtered = cytoscape?.$(deferredFilter);
    setElements(filtered);
  };

  useEffect(() => {
    updateNodeList();
    cytoscape?.on("add remove", updateNodeList);

    return () => {
      cytoscape?.off("add remove", updateNodeList);
    };
  }, [cytoscape, deferredFilter]);

  useEffect(() => {
    updateNodeList();
  }, [deferredFilter]);

  return (
    <div className="styled-panel force-transistion flex flex-col h-full">
      <Search onFilterChange={setFilter} />
      <TreeView elements={elements} nested={true} />
    </div>
  );
};

export const NodeListTab: TabData = {
  id: "nodelist",
  title: "NodeList",
  content: <NodeList />,
  cached: true,
  closable: false,
};
