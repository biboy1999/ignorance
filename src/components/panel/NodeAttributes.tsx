import { NodeSingular } from "cytoscape";
import {
  ChangeEvent,
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { Transaction, YMapEvent } from "yjs";
import { nanoid } from "nanoid";
import { YNodeData, YNodes } from "../../types/types";
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

  const addKeyInput = useRef<HTMLInputElement>(null);
  const addValueInput = useRef<HTMLInputElement>(null);

  const updateAttributes = useCallback(() => {
    setAttributes(Array.from(ydata?.entries() ?? []));
  }, [ydata]);

  useEffect(() => {
    if (!ydata) return;
    updateAttributes();
  }, [nodes]);

  useEffect(() => {
    if (!ydata) return;

    const handleChange = (e: YMapEvent<string>, tx: Transaction): void => {
      // add delete happen on key change
      // update happen on value change
      if (tx.local) return;
      const [newKey, oldKey] = Array.from(e.keysChanged);
      // key renamed
      if (oldKey && newKey) {
        const keyInput = document.getElementById(`${nodeId}-${oldKey}-key`);
        const valueInput = document.getElementById(`${nodeId}-${oldKey}-value`);
        if (
          !(
            keyInput instanceof HTMLInputElement &&
            valueInput instanceof HTMLInputElement
          )
        )
          return;

        keyInput.value = newKey;
        keyInput.setAttribute("data-key", newKey);
        keyInput.id = `${nodeId}-${newKey}-key`;

        valueInput.setAttribute("data-key", newKey);
        valueInput.id = `${nodeId}-${newKey}-value`;
      }

      e.changes.keys.forEach((change, key) => {
        if (change.action === "update") {
          const target = e.target as YNodeData;
          const valueInput = document.getElementById(`${nodeId}-${key}-value`);
          const pair = target.get(key);
          if (!(valueInput instanceof HTMLInputElement)) return;
          if (!(typeof pair === "string")) return;
          valueInput.value = pair;
        } else if (change.action === "add") {
          updateAttributes();
        } else if (change.action === "delete") {
          // updateAttributes();
        }
      });
    };

    ydata.observe(handleChange);
    return (): void => {
      ydata.unobserve(handleChange);
    };
  }, [nodes]);

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const oldKey = e.target.getAttribute("data-key") ?? "";
    const newKey = e.target.value;
    const value = ydata?.get(oldKey);

    if (!(ydata?.has(oldKey) && value)) return;

    ydata.doc?.transact(() => {
      ydata.set(newKey, value);
      ydata.delete(oldKey);
    });

    const keyInput = e.target;
    const valueInput = document.getElementById(`${nodeId}-${oldKey}-value`);

    if (
      !(
        keyInput instanceof HTMLInputElement &&
        valueInput instanceof HTMLInputElement
      )
    )
      return;

    keyInput.value = newKey;
    keyInput.setAttribute("data-key", newKey);
    keyInput.id = `${nodeId}-${newKey}-key`;

    valueInput.setAttribute("data-key", newKey);
    valueInput.id = `${nodeId}-${newKey}-value`;
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const key = e.target.getAttribute("data-key");

    if (key && ydata?.has(key)) ydata.set(key, value);
  };

  const handleAddKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (!(e.key === "Enter" && addKeyInput.current && addValueInput.current))
      return;
    const key = addKeyInput.current.value || `key-${nanoid(10)}`;
    const value = addValueInput.current.value || "new attribute";
    if (ydata?.has(key)) return;
    ydata?.set(key, value);
    addKeyInput.current.value = "";
    addKeyInput.current.blur();
    addValueInput.current.value = "";
    addValueInput.current.blur();
    updateAttributes();
    document.getElementById(`${nodeId}-${key}-key`)?.focus();
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
                } w-6 h-6 text-white cursor-pointer hover:bg-purple-300`}
                onClick={toggle}
              />
            </h1>
          </div>
          <div className="flex flex-col flex-1 overflow-auto">
            {nodes.length !== 0 &&
              attributes.map(([key, value], _index) => {
                return (
                  <div key={nanoid()} className="flex">
                    <input
                      id={`${nodeId}-${key}-key`}
                      data-key={key}
                      className="flex-1 min-w-0 border-t border-r focus:z-10 text-ellipsis"
                      defaultValue={key}
                      onChange={handleKeyChange}
                    />
                    <input
                      id={`${nodeId}-${key}-value`}
                      data-key={key}
                      className="flex-1 min-w-0 border-t focus:z-10 text-ellipsis"
                      defaultValue={value}
                      onChange={handleValueChange}
                    />
                  </div>
                );
              })}
            {attributes.length > 0 && (
              <div className="flex">
                <input
                  ref={addKeyInput}
                  placeholder="Add Attribute"
                  className="flex-1 min-w-0 border-t border-r text-ellipsis"
                  onKeyDown={handleAddKey}
                />
                <input
                  ref={addValueInput}
                  placeholder="Add value"
                  className="flex-1 min-w-0 border-t focus:z-10 text-ellipsis"
                  onKeyDown={handleAddKey}
                />
              </div>
            )}
          </div>
        </>
      )}
    </CollapsibleDragResizeBox>
  );
};
