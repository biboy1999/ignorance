import { useState } from "react";
import { Tab } from "@headlessui/react";
import { ChevronUpIcon, PlusSmIcon } from "@heroicons/react/solid";
import { CollapsibleDragResizeBox } from "../../CollapsibleDragResizeBox";
import { TransformProviderModal } from "../../modal/TransformProviderModal/TransformProviderModal";
import { ProviderPanel } from "./ProvidersPanel";
import { RequestsPanel } from "./RequestsPanel";

export type TransformsProp = null;

export const Transforms = (): JSX.Element => {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);

  return (
    <CollapsibleDragResizeBox
      sizeOffset={[180, 200]}
      constraintOffset={[0, 40]}
      top={325}
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
                  Requested
                </Tab>
              </Tab.List>
              <Tab.Panel className="flex flex-col overflow-auto">
                <ProviderPanel />
              </Tab.Panel>
              <Tab.Panel className="flex flex-col overflow-auto">
                <RequestsPanel />
              </Tab.Panel>
            </Tab.Group>
          </div>
        </>
      )}
    </CollapsibleDragResizeBox>
  );
};
