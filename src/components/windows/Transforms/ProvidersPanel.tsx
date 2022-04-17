import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { nanoid } from "nanoid";
import { useContext, useEffect, useState } from "react";
import { ProviderDocContext } from "../../../App";
import { TransformProvider } from "../../../types/types";

export const ProviderPanel = (): JSX.Element => {
  const context = useContext(ProviderDocContext);

  const yproviders =
    context.ydoc.current.getArray<TransformProvider>("transform-provider");
  const [providers, setProviders] = useState<TransformProvider[]>(
    yproviders.toJSON()
  );

  useEffect(() => {
    const handleProvidersChange = (): void => {
      setProviders(yproviders.toJSON());
    };
    yproviders.observe(handleProvidersChange);
    return () => yproviders.unobserve(handleProvidersChange);
  }, []);

  useEffect(() => {
    const provider = {
      clientId: context.awareness.clientID,
      elementType: ["*"],
      transformId: nanoid(),
      name: "people all",
      description: "a testing transform",
      parameter: {},
    };
    yproviders.push([provider]);

    const provider2 = {
      clientId: context.awareness.clientID,
      elementType: ["people", "pp"],
      transformId: nanoid(),
      name: "test type",
      description: "a type filtered transform",
      parameter: {},
    };
    yproviders.push([provider2]);
  }, []);

  return (
    <>
      {providers.map((provider) => {
        const username =
          context.awareness.getStates().get(provider.clientId)?.username ??
          "unknown";
        return (
          <Disclosure key={provider.transformId}>
            <Disclosure.Button className="flex odd:bg-slate-200 even:bg-purple-200 hover:bg-white">
              {({ open }): JSX.Element => (
                <div className="flex flex-1 gap-2 justify-between items-center w-full px-5 py-2 font-medium font-mono text-left text-base">
                  <div className="flex flex-1 justify-between item-center min-w-0">
                    <span className="truncate">{provider.name}</span>
                    <span className="text-gray-500 truncate">{username}</span>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-purple-500`}
                  />
                </div>
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="bg-slate-100 space-y-2 px-4 py-2 font-mono leading-tight">
              <p className="break-words">
                <span className="text-gray-500 text-sm">Transform</span>
                <br />
                {provider.name}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Provided By</span>
                <br />
                {username}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Type</span>
                <br />
                {provider.elementType.join(", ")}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Description</span>
                <br />
                {provider.description}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Parameter</span>
                <br />
                {JSON.stringify(provider.parameter)}
              </p>
            </Disclosure.Panel>
          </Disclosure>
        );
      })}
    </>
  );
};
