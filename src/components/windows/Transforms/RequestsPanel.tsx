import { Disclosure } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import {
  BanIcon,
  CheckIcon,
  ChevronUpIcon,
  XIcon,
} from "@heroicons/react/solid";
import { cond } from "ramda";
import { useContext, useEffect, useState } from "react";
import { ProviderDocContext } from "../../../App";
import { useTransforms } from "../../../store/transforms";
import { TransformProvider, TransformsJob } from "../../../types/types";

export const RequestsPanel = (): JSX.Element => {
  const context = useContext(ProviderDocContext);
  const interanlTransforms = useTransforms((state) => state.transformProviders);

  const yrequests =
    context.ydoc.current.getArray<TransformsJob>("transform-requests");
  const yproviders =
    context.ydoc.current.getArray<TransformProvider>("transform-provider");
  const [requests, setRequests] = useState<TransformsJob[]>(yrequests.toJSON());

  useEffect(() => {
    const handleRequestChange = (): void => {
      setRequests(yrequests.toJSON());
    };
    yrequests.observe(handleRequestChange);
    return (): void => {
      yrequests.unobserve(handleRequestChange);
    };
  }, []);

  // useEffect(() => {
  //   const test: TransformsJob[] = [
  //     {
  //       jobId: "a",
  //       status: "failed",
  //       fromClientId: 1,
  //       transformId: "a",
  //       request: {
  //         nodesId: ["b"],
  //         parameter: {},
  //       },
  //     },
  //     {
  //       jobId: "b",
  //       status: "rejected",
  //       fromClientId: 1,
  //       transformId: "a",
  //       request: {
  //         nodesId: ["b"],
  //         parameter: {},
  //       },
  //     },
  //     {
  //       jobId: "c",
  //       status: "accepted",
  //       fromClientId: 1,
  //       transformId: "a",
  //       request: {
  //         nodesId: ["b"],
  //         parameter: {},
  //       },
  //     },
  //     {
  //       jobId: "d",
  //       status: "pending",
  //       fromClientId: 1,
  //       transformId: "a",
  //       request: {
  //         nodesId: ["b"],
  //         parameter: {},
  //       },
  //     },
  //   ];
  //   yrequests.push(test);
  // }, []);

  const handleRejectJob: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const handleAcceptJob: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {requests.map((request) => {
        const username =
          context.awareness.getStates().get(request.fromClientId)?.username ??
          "unknown";
        const transformName =
          yproviders
            .toArray()
            .find((x) => x.transformId === request.transformId)?.name ??
          "unknown";
        return (
          <Disclosure key={request.jobId}>
            <Disclosure.Button className="flex odd:bg-slate-200 even:bg-purple-200 hover:bg-white">
              {({ open }): JSX.Element => (
                <div className="flex flex-1 gap-2 justify-between items-center w-full px-5 py-2 font-medium font-mono text-left text-base">
                  <div className="flex flex-1 justify-between items-center min-w-0">
                    <span title={transformName} className="truncate">
                      {transformName}
                    </span>
                    <span title={username} className="text-gray-500 truncate">
                      {username}
                    </span>
                  </div>
                  {
                    {
                      failed: (
                        <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
                      ),
                      rejected: <BanIcon className="w-6 h-6 text-red-500" />,
                      accepted: (
                        <CheckIcon className="w-6 h-6 text-green-500" />
                      ),
                      pending: interanlTransforms.some(
                        (x) => x.transformId === request.transformId
                      ) && (
                        <div className="flex space-x-2">
                          <CheckIcon
                            className="w-6 h-6 text-white bg-green-500"
                            data-jobid={request.jobId}
                            onClick={handleAcceptJob}
                          />
                          <BanIcon
                            className="w-6 h-6 text-white bg-red-500"
                            data-jobid={request.jobId}
                            onClick={handleRejectJob}
                          />
                        </div>
                      ),
                    }[request.status]
                  }
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
                {transformName}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Requested By</span>
                <br />
                {username}
              </p>
              <p className="break-words capitalize">
                <span className="text-gray-500 text-sm">Status</span>
                <br />
                {request.status}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Elements</span>
                <br />
                {request.request.nodesId}
              </p>
              <p className="break-words">
                <span className="text-gray-500 text-sm">Parameter</span>
                <br />
                {JSON.stringify(request.request.parameter)}
              </p>
            </Disclosure.Panel>
          </Disclosure>
        );
      })}
    </>
  );
};
