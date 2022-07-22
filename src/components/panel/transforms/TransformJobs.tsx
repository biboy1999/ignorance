import { Disclosure } from "@headlessui/react";
import { ClockIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import {
  BanIcon,
  CheckIcon,
  ChevronUpIcon,
  CogIcon,
} from "@heroicons/react/solid";
import { useEffect } from "react";
import { Transaction, YMapEvent } from "yjs";
import { useStore } from "../../../store/store";
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

// TODO: refactor this :/
export const TransformJobs = (): JSX.Element => {
  const interanlTransforms = useStore((state) => state.internalTransforms);

  const ydoc = useStore((state) => state.ydoc);
  const ynodes = useStore((state) => state.ynodes());
  const yedges = useStore((state) => state.yedges());
  const awareness = useStore((state) => state.getAwareness());

  const yjsTransformJobs = useStore((state) => state.yjsTransformJobs());
  const transformJobs = useStore((state) => state.transformJobs);
  const setTransformJobs = useStore((state) => state.setTransformJobs);

  const sharedTransforms = useStore((state) => state.sharedTransforms);

  const cytoscape = useStore((state) => state.cytoscape);

  useEffect(() => {
    const handleJobsChange = (
      e: YMapEvent<TransformsJob>,
      _transaction: Transaction
    ): void => {
      setTransformJobs(e.target.toJSON());
    };
    yjsTransformJobs.observe(handleJobsChange);
    return (): void => {
      yjsTransformJobs.unobserve(handleJobsChange);
    };
  }, []);

  const handleRejectJob: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const jobId = e.currentTarget.getAttribute("data-jobid");
    if (!jobId) return;
    const job = yjsTransformJobs.get(jobId);
    if (!job) return;
    handleReject(yjsTransformJobs, job);
  };

  const handleAcceptJob: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    const transformId = e.currentTarget.getAttribute("data-transformid");
    const jobId = e.currentTarget.getAttribute("data-jobid");
    if (!(transformId && jobId)) return;

    const transform = interanlTransforms.find(
      (x) => x.transformId === transformId
    );

    const job = yjsTransformJobs.get(jobId);
    if (!(transform && job)) return;

    const request: TransformsRequest = {
      nodes: job.request.nodesId?.map((nodeId) =>
        cytoscape?.$id(nodeId).data()
      ),
      edges: job.request.edgesId?.map((edgeId) =>
        cytoscape?.$id(edgeId).data()
      ),
      parameter: job.request.parameter,
    };
    handleRunning(yjsTransformJobs, job);
    // process response
    fetch(transform.apiUrl, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(
        (resp) => resp.json(),
        () => handleError(yjsTransformJobs, job)
      )
      .then(
        (data) => {
          if (!isTransformsResponse(data)) return;
          if (!cytoscape) return;

          ydoc.transact(() => {
            data.add?.nodes?.forEach((ele, _index) => {
              const nodePosition = cytoscape
                .$id(ele.linkToNodeId ?? "")
                ?.position();
              const { nodeId, node } = AddNode(
                ele.data,
                nodePosition.x,
                nodePosition.y,
                {
                  pan: cytoscape.pan(),
                  zoom: cytoscape.zoom(),
                }
              );
              ynodes.set(nodeId, node);
              if (ele.linkToNodeId) {
                const { edgeId, edge } = addEdge(ele.linkToNodeId, nodeId);
                yedges.set(edgeId, edge);
              }
            });
          });
          handleComplete(yjsTransformJobs, job);
        },
        () => handleError(yjsTransformJobs, job)
      );
  };

  return (
    <div className="w-full h-full overflow-auto">
      {transformJobs.map((request) => {
        const username =
          awareness.getStates().get(request.fromClientId)?.username ??
          "unknown";
        const transformName =
          sharedTransforms[request.transformId]?.name ?? "unknown";

        return (
          <Disclosure key={request.jobId}>
            <Disclosure.Button className="w-full odd:bg-blue-200 even:bg-blue-100 hover:bg-blue-300 dark:odd:bg-neutral-800 dark:even:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors">
              {({ open }): JSX.Element => (
                <div className="flex flex-1 gap-2 justify-between items-center w-full px-5 py-2 font-medium font-mono text-left text-base">
                  <div className="flex flex-1 justify-between items-center min-w-0">
                    <span>{transformName}</span>
                    <span className="text-gray-500 truncate">{username}</span>
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
                    className={`${open ? "transform rotate-180" : ""} w-5 h-5`}
                  />
                </div>
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="space-y-2 px-4 py-2 font-mono leading-tight">
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
    </div>
  );
};
