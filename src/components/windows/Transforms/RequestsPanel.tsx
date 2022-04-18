import { Disclosure } from "@headlessui/react";
import { ClockIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { BanIcon, CheckIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { ProviderDocContext } from "../../../App";
import { useTransforms } from "../../../store/transforms";
import {
  isTransformsResponse,
  TransformProvider,
  TransformsJob,
  TransformsRequest,
} from "../../../types/types";
import { AddNode } from "../../../utils/node";

export const RequestsPanel = (): JSX.Element => {
  const context = useContext(ProviderDocContext);
  const interanlTransforms = useTransforms((state) => state.transformProviders);

  const cy = context.cy.current;
  const ydoc = context.ydoc.current;
  const ynodes = context.ynodes.current;

  const yrequests =
    context.ydoc.current.getMap<TransformsJob>("transform-requests");
  const yproviders = context.ydoc.current.getMap<TransformProvider>(
    "transform-providers"
  );

  const [requests, setRequests] = useState<TransformsJob[]>(
    Array.from(yrequests.entries()).map(([_k, v]) => v)
  );

  useEffect(() => {
    const handleRequestChange = (): void => {
      setRequests(Array.from(yrequests.entries()).map(([_k, v]) => v));
    };
    yrequests.observe(handleRequestChange);
    return (): void => {
      yrequests.unobserve(handleRequestChange);
    };
  }, []);

  const handleError = (jobId: string, job: TransformsJob): void => {
    yrequests.set(jobId, { ...job, status: "failed" });
  };

  const handleRejectJob: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const jobId = e.currentTarget.getAttribute("data-jobid");
    if (!jobId) return;
    const job = yrequests.get(jobId);
    if (!job) return;
    yrequests.set(jobId, { ...job, status: "rejected" });
  };

  const handleAcceptJob: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const transformId = e.currentTarget.getAttribute("data-transformid");
    const jobId = e.currentTarget.getAttribute("data-jobid");
    if (!(transformId && jobId)) return;

    const transform = interanlTransforms.find(
      (x) => x.transformId === transformId
    );

    const job = yrequests.get(jobId);
    if (!(transform && job)) return;

    const request: TransformsRequest = {
      nodes: job.request.nodesId?.map((nodeId) => cy?.$id(nodeId).data()),
      edges: job.request.edgesId?.map((edgeId) => cy?.$id(edgeId).data()),
      parameter: job.request.parameter,
    };

    fetch(transform.apiUrl, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(
        (resp) => {
          return resp.json();
        },
        () => handleError(jobId, job)
      )
      .then(
        (data) => {
          if (!isTransformsResponse(data)) return;
          ydoc.transact(() => {
            data.add?.nodes?.forEach((ele) => {
              const { nodeId, node } = AddNode(
                0,
                0,
                ele.data,
                cy?.pan(),
                cy?.zoom()
              );
              ynodes.set(nodeId, node);
            });
          });
        },
        () => handleError(jobId, job)
      );
  };

  return (
    <>
      {requests.map((request) => {
        const username =
          context.awareness.getStates().get(request.fromClientId)?.username ??
          "unknown";
        const transformName =
          yproviders.get(request.transformId)?.name ?? "unknown";

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
                      ) ? (
                        <div className="flex space-x-2">
                          <CheckIcon
                            className="w-6 h-6 text-white bg-green-500"
                            data-jobid={request.jobId}
                            data-transformid={request.transformId}
                            onClick={handleAcceptJob}
                          />
                          <BanIcon
                            className="w-6 h-6 text-white bg-red-500"
                            data-jobid={request.jobId}
                            onClick={handleRejectJob}
                          />
                        </div>
                      ) : (
                        <ClockIcon className="w-6 h-6 text-gray-500" />
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
