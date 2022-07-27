import {
  ArrowSmRightIcon,
  ChevronRightIcon,
  CubeTransparentIcon,
  KeyIcon,
  LocationMarkerIcon,
} from "@heroicons/react/solid";
import { TreeNode, TreeNodeProps } from "rc-tree";
import { IconType } from "rc-tree/lib/interface";

export type TreeNodeData = {
  key: string;
  title: string;
  children?: TreeNodeData[];
  [x: string]: unknown;
};

const GetNodeIcon = (isNode: boolean, isEdge: boolean): JSX.Element => {
  if (isNode) return <CubeTransparentIcon className="styled-svg w-5 h-5" />;
  else if (isEdge) return <ArrowSmRightIcon className="styled-svg w-5 h-5" />;
  else return <KeyIcon className="styled-svg w-5 h-5" />;
};

type GenerateTitleProps = {
  title: string;
  isAttrib: boolean;
  goto?: () => void;
};

const GenerateTitle = ({
  title,
  isAttrib,
  goto,
}: GenerateTitleProps): JSX.Element => {
  return (
    <div className="flex flex-1 items-center h-full">
      <span className="flex-1 pl-1.5 align-text-bottom">{title}</span>
      {!isAttrib && (
        <LocationMarkerIcon
          className="styled-svg svg-hover w-5 h-5 mr-1 inline-block"
          onClick={goto}
        />
      )}
    </div>
  );
};

const Switcher: IconType = (props: TreeNodeProps): JSX.Element => {
  if (props.isLeaf) return <div className="w-5 h-5"></div>;
  return (
    <ChevronRightIcon
      className={`w-5 h-5 ${props.expanded ? "transform rotate-90" : ""}`}
    />
  );
};

// XXX: tree iterative traversal?
// XXX: should not use nanoid as key
export const GenerateNode = (
  root: cytoscape.CollectionArgument | undefined,
  nested: boolean
): JSX.Element => {
  if (root == null) {
    return <></>;
  }

  const filterRoot = nested ? root.filter(":orphan").add(root.edges()) : root;

  return _GenerateNode(filterRoot, nested);
};

const _GenerateNode = (
  root: cytoscape.CollectionArgument | undefined,
  nested: boolean
): JSX.Element => {
  if (root == null) {
    return <></>;
  }

  return (
    <>
      {root?.map((ele) => {
        const titleProps = {
          title: ele.data("name") ?? "unnamed",
          isAttrib: false,
          goto: () => ele.cy().center(ele),
        };

        return (
          <TreeNode
            className="styled-button flex items-center h-10"
            key={ele.id()}
            title={GenerateTitle(titleProps)}
            icon={GetNodeIcon(ele.isNode(), ele.isEdge())}
            switcherIcon={Switcher}
          >
            {/* TODO: Refactor this mess */}
            {[
              ...Object.entries(ele.data()).map(([k, v]) =>
                GenerateLeaf(ele.id(), k, v)
              ),
              ...[
                nested
                  ? [
                      ...ele
                        .nodes()
                        .map((node) => _GenerateNode(node.children(), nested)),
                    ]
                  : [],
              ],
            ]}
          </TreeNode>
        );
      })}
    </>
  );
};

const GenerateLeaf = (
  nodeId: string,
  key: string,
  value: unknown
): JSX.Element => {
  const titleProps = {
    title: `${key} : ${value}`,
    isAttrib: true,
  };
  return (
    <TreeNode
      key={`${nodeId}-${key}`}
      title={GenerateTitle(titleProps)}
      className="styled-button flex items-center h-10"
      icon={GetNodeIcon(false, false)}
      switcherIcon={Switcher}
    ></TreeNode>
  );
};
