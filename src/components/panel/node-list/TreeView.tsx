import Tree from "rc-tree";
import { useState } from "react";
import { ListIcon } from "../../common/svg/ListIcon";
import { ListNestedIcon } from "../../common/svg/ListNestedIcon";
import { GenerateNode } from "./GenerateNode";

type TreeViewProps = {
  elements: cytoscape.CollectionArgument | undefined;
  nested: boolean;
};

export const TreeView = ({ elements }: TreeViewProps): JSX.Element => {
  const [nested, setNested] = useState(false);
  return (
    <div className="styled-panel flex flex-col flex-1 min-h-0 border-t divide-y">
      <div className="flex m-1 gap-1">
        <button
          onClick={(): void => setNested((prev) => !prev)}
          title="Toggle nested node"
        >
          {nested ? (
            <ListNestedIcon className="styled-svg w-5 h-5 p-1.5 ring-2 ring-inset bg-blue-200 ring-blue-400 dark:ring-blue-400 dark:bg-blue-900" />
          ) : (
            <ListIcon className="styled-svg svg-hover w-5 h-5 p-1.5" />
          )}
        </button>
      </div>
      {/* HACK: not using titleRender, it cause re-render every resize */}
      <div className="flex-1 min-h-0">
        <Tree className="border-0 h-full overflow-y-auto" selectable={false}>
          {GenerateNode(elements, nested)}
        </Tree>
      </div>
    </div>
  );
};
