import { NodeSingular } from "cytoscape";
import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { Transaction, YMapEvent } from "yjs";
import { YNodeData, YNodeProp, YNodes } from "../../types";
import { CollapsibleDragResizeBox } from "../CollapsibleDragResizeBox";

export type NodeAttributesProp = {
  nodes: NodeSingular[];
  ynodesRef: MutableRefObject<YNodes | undefined>;
};

// TODO: need better attribute edit system
export const NodeAttributes = ({
  nodes,
  ynodesRef,
}: NodeAttributesProp): JSX.Element => {
  const nodeId = nodes[0]?.id();
  const ynode = ynodesRef.current?.get(nodeId);
  const ydata = ynode?.get("data") as YNodeData | undefined;
  const [attributes, setAttributes] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const updateAttributes = useCallback(() => {
    setAttributes(
      Array.from(ydata?.entries() ?? []).filter(([k, _v]) => k !== "id")
    );
  }, [ydata]);

  useEffect(() => {
    if (!ydata) return;
    updateAttributes();
  }, [nodes]);

  useEffect(() => {
    if (!ydata) return;

    const handleChange = (
      e: YMapEvent<string | YNodeProp>,
      _tx: Transaction
    ): void => {
      // add delete happen on name change
      // update happen on value change
      e.changes.keys.forEach((change, _key) => {
        if (change.action === "add") {
          updateAttributes();
        } else if (change.action === "update") {
          updateAttributes();
          // const target = e.target as YNodeData;
          // const valueInput = document.getElementById(`${nodeId}-${key}-value`);
          // const pair = target.get(key);
          // if (
          //   !(
          //     valueInput instanceof HTMLInputElement && typeof pair !== "string"
          //   )
          // )
          //   return;
          // valueInput.value = pair?.value ?? "";
        } else if (change.action === "delete") {
          updateAttributes();
        }
      });
    };

    ydata.observe(handleChange);
    return (): void => {
      ydata.unobserve(handleChange);
    };
  }, [nodes]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const oldName = e.target.defaultValue;
    const newName = e.target.value;
    const value = ydata?.get(oldName);

    if (!(ydata?.has(oldName) && value)) return;
    e.target.name = e.target.value;

    // TODO: attrid dupe resolve (when multiple client edit key)

    ydata.doc?.transact(() => {
      ydata.delete(oldName);
      ydata.set(newName, value);
    });
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!(e.target.previousElementSibling instanceof HTMLInputElement)) return;
    const value = e.target.value;
    const attrid = e.target.getAttribute("data-attrid");
    const key = e.target.previousElementSibling.defaultValue;
    if (ydata?.has(key) && attrid) ydata.set(key, { attrid, value });
  };

  return (
    <CollapsibleDragResizeBox
      sizeOffset={[180, 250]}
      constraintOffset={[0, 0]}
      top={250}
      right={20}
      handle=".drag-handle"
    >
      {({ isOpen, toggle }): JSX.Element => (
        <>
          <div className="flex drag-handle">
            <h1 className="flex justify-between flex-1 p-3 font-mono text-white bg-purple-400">
              <span>Attributes</span>
              <ChevronUpIcon
                className={`${
                  isOpen ? "transform rotate-180" : ""
                } w-6 h-6 text-white cursor-pointer`}
                onClick={toggle}
              />
            </h1>
          </div>
          {nodes.length !== 0 && (
            <div className="flex flex-col flex-1 overflow-auto">
              <div key={nodeId} className="flex">
                <input
                  id={`${nodeId}-id-name`}
                  data-attrid={nodeId}
                  className="flex-1 min-w-0 bg-gray-300 text-ellipsis"
                  value="id"
                  disabled
                />
                <input
                  id={`${nodeId}-id-value`}
                  data-attrid={nodeId}
                  className="flex-1 min-w-0 border focus:z-10 bg-gray-300 text-ellipsis"
                  value={nodeId}
                  disabled
                />
              </div>
              {attributes.map(([key, attr]) => {
                if (
                  !(
                    typeof key === "string" &&
                    typeof attr === "object" &&
                    "attrid" in attr &&
                    "value" in attr
                  )
                )
                  return;
                return (
                  <div key={`${nodeId}-${attr.attrid}`} className="flex">
                    <input
                      id={`${nodeId}-${key}-name`}
                      data-attrid={attr.attrid}
                      className="flex-1 min-w-0 border-t border-r focus:z-10 text-ellipsis"
                      value={key}
                      onChange={handleNameChange}
                    />
                    <input
                      id={`${nodeId}-${key}-value`}
                      data-attrid={attr.attrid}
                      className="flex-1 min-w-0 border-t focus:z-10 text-ellipsis"
                      value={attr.value}
                      onChange={handleValueChange}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </CollapsibleDragResizeBox>
  );
};
