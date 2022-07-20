import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusSmIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useStore } from "../../../store/store";
import { SharedTransform } from "../../../types/types";
import { TransformProviderModal } from "../../modal/TransformProviderModal/TransformProviderModal";

export const SharedTransformsTabTitle = (): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  return (
    <span>
      SharedTransforms
      <PlusSmIcon
        className="w-5 h-5 ml-1 align-text-top cursor-pointer inline hover:bg-blue-300"
        onClick={(): void => setOpen(true)}
      />
      <TransformProviderModal open={isOpen} setOpen={setOpen} />
    </span>
  );
};

type DisclosureButtonProp = {
  transformName: string;
  username: string;
};

const DisclosureButton = ({
  transformName,
  username,
}: DisclosureButtonProp): JSX.Element => {
  return (
    <Disclosure.Button className="w-full odd:bg-slate-200 even:bg-purple-200 hover:bg-white">
      {({ open }): JSX.Element => (
        <div className="flex gap-2 justify-between items-center px-5 py-2 font-medium font-mono text-left text-base">
          <div className="flex flex-1 justify-between item-center min-w-0">
            <span className="">{transformName}</span>
            <span className=" text-gray-500 truncate">{username}</span>
          </div>
          <ChevronUpIcon
            className={`${
              open ? "transform rotate-180" : ""
            } w-5 h-5 text-purple-500`}
          />
        </div>
      )}
    </Disclosure.Button>
  );
};

export const SharedTransforms = (): JSX.Element => {
  const awareness = useStore((state) => state.getAwareness());
  const sharedTransforms = useStore((state) => state.sharedTransforms());

  const [providers, setProviders] = useState<SharedTransform[]>(
    Array.from(sharedTransforms.entries()).map(([_k, v]) => v)
  );

  useEffect(() => {
    const handleProvidersChange = (): void => {
      setProviders(Array.from(sharedTransforms.entries()).map(([_k, v]) => v));
    };
    sharedTransforms.observe(handleProvidersChange);
    return () => sharedTransforms.unobserve(handleProvidersChange);
  }, []);

  return (
    <div className="w-full h-full overflow-auto">
      {providers.map((provider) => {
        const username =
          awareness.getStates().get(provider.clientId)?.username ?? "unknown";
        return (
          <Disclosure key={provider.transformId}>
            <DisclosureButton
              transformName={provider.name}
              username={username}
            />
            <Disclosure.Panel className="bg-slate-100 space-y-2 px-4 py-2 font-mono leading-tight">
              <p className="break-words">
                <span className="text-gray-500 text-sm">Name</span>
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
    </div>
  );
};
