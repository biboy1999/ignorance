import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusSmIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Transaction, YMapEvent } from "yjs";
import { useStore } from "../../../store/store";
import { isTrnasformProvider, SharedTransform } from "../../../types/types";
import { ShareTransformsModal } from "../../modal/TransformProviderModal/TransformProviderModal";

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
            <span>{transformName}</span>
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
  const getAwareness = useStore((state) => state.getAwareness);
  const yjsSharedTransforms = useStore((state) => state.yjsSharedTransforms());
  const sharedTransforms = useStore((state) => state.sharedTransforms);
  const setSharedTransforms = useStore((state) => state.setSharedTransforms);

  const handleSharedTransformsChange = (
    e: YMapEvent<SharedTransform>,
    _transact: Transaction
  ): void => {
    setSharedTransforms(e.target.toJSON());
  };

  useEffect(() => {
    yjsSharedTransforms.observe(handleSharedTransformsChange);
    return () => yjsSharedTransforms.unobserve(handleSharedTransformsChange);
  }, [yjsSharedTransforms]);

  return (
    <div className="w-full h-full overflow-auto">
      {Object.entries(sharedTransforms).map(([_key, transform]) => {
        if (!isTrnasformProvider(transform)) return;
        const username =
          getAwareness().getStates().get(transform.clientId)?.username ??
          "unknown";
        return (
          <Disclosure key={transform.transformId}>
            <DisclosureButton
              transformName={transform.name}
              username={username}
            />
            <Disclosure.Panel className="bg-slate-100 space-y-2 px-4 py-2 font-mono leading-tight">
              <p className="break-words">
                <span className="text-gray-500 text-sm">Name</span>
                <br />
                {transform.name}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Provided By</span>
                <br />
                {username}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Type</span>
                <br />
                {transform.elementType.join(", ")}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Description</span>
                <br />
                {transform.description}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Parameter</span>
                <br />
                {JSON.stringify(transform.parameter)}
              </p>
            </Disclosure.Panel>
          </Disclosure>
        );
      })}
    </div>
  );
};

export const SharedTransformsTabTitle = (): JSX.Element => {
  const [isOpen, setOpen] = useState(false);
  return (
    <span>
      SharedTransforms
      <PlusSmIcon
        className="w-5 h-5 ml-1 align-text-top cursor-pointer inline hover:bg-blue-300"
        onClick={(): void => setOpen(true)}
      />
      <ShareTransformsModal open={isOpen} setOpen={setOpen} />
    </span>
  );
};
