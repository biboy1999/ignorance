import { DragResizeBox } from "../DragResizeBox";
import { NodeSingular } from "cytoscape";
import { ChangeEvent, MutableRefObject, useEffect, useState } from "react";
import { yNodeData, yNodes } from "../../types";
import { Transaction, YMapEvent } from "yjs";

const NodeAttributes = ({
  nodes,
  ynodesRef,
}: {
  nodes: NodeSingular[];
  ynodesRef: MutableRefObject<yNodes | undefined>;
}): JSX.Element => {
  const nodeId = nodes[0]?.id();
  const ynode = ynodesRef.current?.get(nodeId);
  const ydata = ynode?.get("data") as yNodeData;
  const [attributes, setAttributes] = useState<string[]>([]);

  useEffect(() => {
    if (!ydata) return;
    setAttributes(Array.from(ydata.keys() ?? []));
  }, [nodes]);

  useEffect(() => {
    if (!ydata) return;

    const handleChange = (e: YMapEvent<string>, _tx: Transaction): void => {
      // add delete happen on name change
      // update happen on value change
      e.changes.keys.forEach((change, key) => {
        if (change.action === "add") {
          setAttributes((prev) => [...prev, key]);
        } else if (change.action === "update") {
          const target = e.target as yNodeData;
          const valueInput = document.getElementById(`${nodeId}-${key}-value`);
          if (!(valueInput instanceof HTMLInputElement)) return;
          valueInput.value = target.get(key) ?? "";
        } else if (change.action === "delete") {
          setAttributes((prev) => prev.filter((name) => name !== key));
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
    const value = ydata.get(oldName);

    if (!(ydata.has(oldName) && value)) return;
    e.target.name = e.target.value;
    ydata.doc?.transact(() => {
      ydata.delete(oldName);
      ydata.set(newName, value);
    });
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!(e.target.previousElementSibling instanceof HTMLInputElement)) return;
    const value = e.target.value;
    const name = e.target.previousElementSibling.defaultValue;
    if (ydata.has(name)) ydata.set(name, value);
  };

  return (
    <DragResizeBox
      sizeOffset={[180, 250]}
      constraintOffset={[100, 50]}
      handle=".drag-handle"
    >
      <>
        <div className="flex drag-handle">
          <h1 className="flex-1 p-3 font-mono text-white bg-purple-400">
            Attributes
          </h1>
        </div>
        <div className="flex flex-col flex-1 overflow-auto">
          {attributes.map((attributeName) => {
            return (
              <div key={`${nodeId}-${attributeName}`} className="flex">
                <input
                  id={`${nodeId}-${attributeName}-name`}
                  className="flex-1 min-w-0 bg-blue-300 text-ellipsis"
                  defaultValue={attributeName}
                  onChange={handleNameChange}
                  disabled={attributeName == "id"}
                  // idk why
                  autoFocus
                />
                <input
                  id={`${nodeId}-${attributeName}-value`}
                  className="flex-1 min-w-0 bg-red-300 text-ellipsis"
                  defaultValue={ydata?.get(attributeName)}
                  onChange={handleValueChange}
                />
              </div>
            );
          })}
        </div>
      </>
    </DragResizeBox>
  );
};

export { NodeAttributes };
