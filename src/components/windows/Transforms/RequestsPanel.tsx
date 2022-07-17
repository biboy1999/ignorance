import { Disclosure } from "@headlessui/react";
import { ClockIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import {
  BanIcon,
  CheckIcon,
  ChevronUpIcon,
  CogIcon,
} from "@heroicons/react/solid";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { cyAtom } from "../../../atom/cy";
import { awarenessAtom } from "../../../atom/provider";
import {
  ydocAtom,
  yedgesAtom,
  ynodesAtom,
  ytransformJobsAtom,
  ytransformProvidersAtom,
} from "../../../atom/yjs";
import { useTransforms } from "../../../store/transforms";
import {
  isTransformsResponse,
  TransformsJob,
  TransformsRequest,
} from "../../../types/types";
import { addEdge, AddNode } from "../../../utils/graph";
import {
  handleComplete,
  handleError,
  handleReject,
  handleRunning,
} from "../../../utils/providers";

export const RequestsPanel = (): JSX.Element => {
  const interanlTransforms = useTransforms((state) => state.transformProviders);

  const ydoc = useAtomValue(ydocAtom);
  const ynodes = useAtomValue(ynodesAtom);
  const yedges = useAtomValue(yedgesAtom);
  const yjobs = useAtomValue(ytransformJobsAtom);
  const yproviders = useAtomValue(ytransformProvidersAtom);
  const cy = useAtomValue(cyAtom);
  const awareness = useAtomValue(awarenessAtom);

  const [requests, setRequests] = useState<TransformsJob[]>(
    Array.from(yjobs.entries()).map(([_k, v]) => v)
  );

  useEffect(() => {
    const handleRequestChange = (): void => {
      setRequests(Array.from(yjobs.entries()).map(([_k, v]) => v));
    };
    yjobs.observe(handleRequestChange);
    return (): void => {
      yjobs.unobserve(handleRequestChange);
    };
  }, []);

  const handleRejectJob: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const jobId = e.currentTarget.getAttribute("data-jobid");
    if (!jobId) return;
    const job = yjobs.get(jobId);
    if (!job) return;
    handleReject(yjobs, job);
  };

  const handleAcceptJob: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const transformId = e.currentTarget.getAttribute("data-transformid");
    const jobId = e.currentTarget.getAttribute("data-jobid");
    if (!(transformId && jobId)) return;

    const transform = interanlTransforms.find(
      (x) => x.transformId === transformId
    );

    const job = yjobs.get(jobId);
    if (!(transform && job)) return;

    const request: TransformsRequest = {
      nodes: job.request.nodesId?.map((nodeId) => cy?.$id(nodeId).data()),
      edges: job.request.edgesId?.map((edgeId) => cy?.$id(edgeId).data()),
      parameter: job.request.parameter,
    };
    handleRunning(yjobs, job);
    fetch(transform.apiUrl, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(
        (resp) => resp.json(),
        () => handleError(yjobs, job)
      )
      .then(
        (data) => {
          if (!isTransformsResponse(data)) return;
          if (!cy) return;

          ydoc.transact(() => {
            data.add?.nodes?.forEach((ele, _index) => {
              const nodePosition = cy.$id(ele.linkToNodeId ?? "")?.position();
              const { nodeId, node } = AddNode(
                nodePosition?.x ?? 0,
                nodePosition?.y ?? 0,
                ele.data,
                {
                  pan: cy.pan(),
                  zoom: cy.zoom(),
                }
              );
              ynodes.set(nodeId, node);
              if (ele.linkToNodeId) {
                const { edgeId, edge } = addEdge(ele.linkToNodeId, nodeId);
                yedges.set(edgeId, edge);
              }
            });
          });
          handleComplete(yjobs, job);
        },
        () => handleError(yjobs, job)
      );
  };

  return (
    <>
      {requests.map((request) => {
        const username =
          awareness?.getStates().get(request.fromClientId)?.username ??
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
                      completed: (
                        <CheckIcon className="w-6 h-6 text-green-500" />
                      ),
                      running: (
                        <CogIcon className="w-6 h-6 text-gray-500 animate-spin" />
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
