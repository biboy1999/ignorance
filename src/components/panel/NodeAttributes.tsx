import { DragResizeBox } from "../DragResizeBox";
import { NodeSingular } from "cytoscape";
import { useForm, useFieldArray } from "react-hook-form";
import { MutableRefObject, useEffect } from "react";
import { yNodeData, yNodes } from "../../types";

const NodeAttributes = ({
  nodes,
  ynodesRef,
}: {
  nodes: NodeSingular[];
  ynodesRef: MutableRefObject<yNodes | undefined>;
}): JSX.Element => {
  const { control, watch, register, reset } = useForm();
  const { fields, append } = useFieldArray({
    control,
    name: "attribute",
  });

  useEffect(() => {
    reset();
    const ynode = ynodesRef.current?.get(nodes[0]?.id())?.toJSON();
    const data = ynode?.data;
    if (!data) return;
    append(Object.entries(data).map(([k, v]) => ({ key: k, value: v })));
  }, [nodes]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (!name) return;
      if (type !== "change") return;

      const yNodeData = ynodesRef.current
        ?.get(nodes[0]?.id())
        ?.get("data") as yNodeData;

      const [_, index, key] = name.split(".");
      const attr = value["attribute"][index];

      const yNodeProp = yNodeData.get(attr["key"]);
      console.log(yNodeProp?.toString());
      if (!(yNodeProp && attr && key)) return;
      yNodeProp?.insert(0, attr["value"]);

      // // TODO key changed ignore for now
      // if (key === "key") return;
      // // value only
      // yNodeData.set(attr["key"], attr["value"]);
    });
    return (): void => subscription.unsubscribe();
  }, [watch, nodes]);

  return (
    <DragResizeBox
      sizeOffset={[100, 100]}
      constraintOffset={[0, 50]}
      handle=".drag-handle"
    >
      <>
        <div className="flex drag-handle">
          <h1 className="flex-1 p-3 font-mono text-white bg-purple-400">
            Attributes
          </h1>
        </div>
        <div className="flex flex-col flex-1">
          <form>
            {fields.map((field, index) => {
              console.log(field, index);
              return (
                <div className="flex" key={field.id}>
                  <input
                    className="flex-1 min-w-0 bg-blue-300"
                    {...register(`attribute.${index}.key` as const)}
                  />
                  <input
                    className="flex-1 min-w-0 bg-red-300"
                    {...register(`attribute.${index}.value` as const)}
                  />
                </div>
              );
            })}
          </form>
        </div>
      </>
    </DragResizeBox>
  );
};

export { NodeAttributes };
