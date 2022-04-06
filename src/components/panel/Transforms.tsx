import { useContext, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import {
  ChevronUpIcon,
  PlusSmIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import { CollapsibleDragResizeBox } from "../CollapsibleDragResizeBox";
import { ProviderDocContext } from "../../App";
import { TransformProvider } from "../../types/types";
import { TransformProviderModal } from "../modal/TransformProviderModal/TransformProviderModal";

export type TransformsProp = null;

export const Transforms = (): JSX.Element => {
  const context = useContext(ProviderDocContext);
  const yproviders =
    context.ydoc.current.getArray<TransformProvider>("transform-provider");
  // const yrequests =
  //   context.ydoc.current.getArray<TransformsJob>("transform-request");

  const [providers, setProviders] = useState<TransformProvider[]>([]);
  // const [requests, setRequests] = useState<TransformsJob[]>([]);

  const [isAddModelOpen, setIsAddModelOpen] = useState(false);

  useEffect(() => {
    const handleChange = (): void => {
      setProviders(yproviders.toJSON());
    };
    yproviders.observe(handleChange);
    return (): void => yproviders.unobserve(handleChange);
  }, []);

  // test providers
  // useEffect(() => {
  //   const provider = {
  //     clientId: context.awareness.clientID,
  //     elementType: ["*"],
  //     transformId: nanoid(),
  //     name: "testing",
  //     description: "a testing transform",
  //     parameter: {},
  //   };
  //   yproviders.push([provider]);
  // }, []);

  return (
    <CollapsibleDragResizeBox
      sizeOffset={[180, 200]}
      constraintOffset={[0, 40]}
      top={150}
      right={20}
      handle=".drag-handle"
    >
      {({ isOpen, toggle }): JSX.Element => (
        <>
          <TransformProviderModal
            open={isAddModelOpen}
            setOpen={setIsAddModelOpen}
          />
          <div className="flex drag-handle">
            <h1 className="flex flex-1 p-3 font-mono text-white bg-purple-400">
              <span className="flex-1">Transform</span>
              <PlusSmIcon
                className="text-white w-6 h-6 cursor-pointer hover:bg-purple-300"
                onClick={(): void => setIsAddModelOpen(true)}
              />
              <ChevronUpIcon
                className={`${
                  isOpen ? "transform rotate-180" : ""
                } w-6 h-6 text-white cursor-pointer hover:bg-purple-300`}
                onClick={toggle}
              />
            </h1>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <Tab.Group>
              <Tab.List className="flex ">
                <Tab
                  className={({ selected }): string =>
                    `flex-1 py-2 font-mono hover:bg-purple-300 ${
                      selected ? "bg-slate-100" : "bg-slate-300"
                    }`
                  }
                >
                  Provider
                </Tab>
                <Tab
                  className={({ selected }): string =>
                    `flex-1 py-2 font-mono hover:bg-purple-300 ${
                      selected ? "bg-slate-100" : "bg-slate-300"
                    }`
                  }
                >
                  Pending
                </Tab>
              </Tab.List>
              <Tab.Panel className="flex flex-col overflow-auto">
                {providers.map((provider) => {
                  return (
                    <div className="flex flex-1 gap-2 items-center font-mono py-1 odd:bg-slate-100 even:bg-slate-200 hover:bg-white">
                      <span>{provider.name}</span>
                      <span className="text-gray-500 flex-1 truncate min-w-0">
                        {context.awareness.getStates().get(provider.clientId)
                          ?.username ?? "unknown"}
                      </span>
                      <InformationCircleIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  );
                })}
              </Tab.Panel>
              <Tab.Panel>transform pending</Tab.Panel>
            </Tab.Group>
          </div>
        </>
      )}
    </CollapsibleDragResizeBox>
  );
};
