import { useFormContext, useFieldArray } from "react-hook-form";
import { PlusSmIcon, XIcon } from "@heroicons/react/solid";
import { TransformInternal } from "../../../types/types";

export type TransformProviderParamters = TransformInternal;

export const TransformProviderForm = (): JSX.Element => {
  const { register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: "elementType" });

  return (
    <>
      <div className="bg-slate-100 px-4 py-2">
        {/* <input type="hidden" {...register("transformId")} /> */}
        <div className="mt-2">
          <label className="block leading-6" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="w-full h-8 border text-gray-900"
            placeholder="Name"
            {...register("name")}
          />
        </div>
        <div className="mt-2">
          <label className="block leading-6" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full h-20 border text-gray-900"
            placeholder="description"
            {...register("description")}
          />
        </div>
        <div className="mt-2">
          <label className="block leading-6" htmlFor="apiUrl">
            API Url
          </label>
          <input
            type="text"
            className="w-full h-8 border text-gray-900"
            placeholder="Name"
            {...register("apiUrl")}
          />
        </div>
        <div className="mt-2">
          <label className="inline leading-6 mr-2" htmlFor="elementType">
            Element Type
          </label>
          <PlusSmIcon
            className="inline align-top text-white w-6 h-6 cursor-pointer bg-purple-400 hover:bg-purple-300"
            onClick={(): void => append("")}
          />
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-1">
              <input
                type="text"
                className="w-full h-8 flex-1 border text-gray-900"
                placeholder="'node.people' or '*'"
                {...register(`elementType.${index}` as const)}
              />
              <XIcon
                className="w-6 h-6 text-black  hover:bg-purple-300"
                onClick={(): void => remove(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
