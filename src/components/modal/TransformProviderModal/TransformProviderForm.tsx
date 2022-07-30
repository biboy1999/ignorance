import { useFormContext, useFieldArray } from "react-hook-form";
import { PlusSmIcon, XIcon } from "@heroicons/react/solid";
import { InternalTransform } from "../../../types/transform";

export type TransformProviderParamters = InternalTransform;

export const TransformProviderForm = (): JSX.Element => {
  const { register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: "elementType" });

  return (
    <>
      <div className="px-4 py-2 space-y-3">
        <div>
          <label className="block leading-6" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="w-full h-8"
            placeholder="Name"
            {...register("name", {
              required: true,
              value: "",
            })}
          />
        </div>
        <div>
          <label className="block leading-6" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full h-20"
            placeholder="description"
            {...register("description")}
          />
        </div>
        <div>
          <label className="block leading-6" htmlFor="apiUrl">
            API Url
          </label>
          <input
            type="text"
            className="w-full h-8"
            placeholder="Name"
            {...register("apiUrl", {
              required: true,
              value: "",
            })}
          />
        </div>
        <div>
          <label className="inline leading-6" htmlFor="elementType">
            Element Type
          </label>
          <PlusSmIcon
            className="styled-svg svg-hover w-5 h-5 ml-1 align-text-bottom cursor-pointer inline"
            onClick={(): void => append("*")}
          />
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-1">
              <input
                type="text"
                className="w-full h-8 flex-1"
                placeholder="'node.people' or '*'"
                {...register(`elementType.${index}` as const, {
                  required: true,
                })}
              />
              <XIcon
                className="styled-svg w-5 h-5 text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                onClick={(): void => remove(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
