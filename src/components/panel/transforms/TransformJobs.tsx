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
  TransformJob,
  TransformRequest,
} from "../../../types/types";
import { addEdge, AddNode, getCenterPosition } from "../../../utils/graph";
import {
  createRequest,
  handleComplete,
  handleError,
  handleReject,
  handleRunning,
} from "../../../utils/transform-job";

type JobStatusProps = {
  job: TransformJob;
  ownTransform: boolean;
  onAcceptJob: React.MouseEventHandler<Element>;
  onRejectJob: React.MouseEventHandler<Element>;
};

export const JobStatus = ({
  job,
  ownTransform,
  onAcceptJob,
  onRejectJob,
}: JobStatusProps): JSX.Element => {
  const statusMapping = {
    failed: <ExclamationCircleIcon className="w-6 h-6 text-red-500" />,
    rejected: <BanIcon className="w-6 h-6 text-red-500" />,
    completed: <CheckIcon className="w-6 h-6 text-green-500" />,
    running: <CogIcon className="w-6 h-6 text-gray-500 animate-spin" />,
    pending: ownTransform ? (
      <div className="flex space-x-2">
        <CheckIcon
          className="w-6 h-6 text-white bg-green-500"
          data-jobid={job.jobId}
          data-transformid={job.transformId}
          onClick={onAcceptJob}
        />
        <BanIcon
          className="w-6 h-6 text-white bg-red-500"
          data-jobid={job.jobId}
          onClick={onRejectJob}
        />
      </div>
    ) : (
      <ClockIcon className="w-6 h-6 text-gray-500" />
    ),
  };

  return statusMapping[job.status];
};

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
      e: YMapEvent<TransformJob>,
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
    const job = transformJobs.find((x) => x.jobId === jobId);
    if (!job) return;
    handleReject(yjsTransformJobs, job);
  };

  const handleAcceptJob: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    const transformId = e.currentTarget.getAttribute("data-transformid");
    const jobId = e.currentTarget.getAttribute("data-jobid");

    const transform = interanlTransforms.find(
      (x) => x.transformId === transformId
    );
    const job = transformJobs.find((x) => x.jobId === jobId);

    if (!(transform && job && cytoscape)) return;
    handleRunning(yjsTransformJobs, job);

    const request: TransformRequest = createRequest(job, cytoscape);

    const worker = new Worker(
      new URL("../../../worker/fetch.ts", import.meta.url)
    );

    worker.addEventListener("error", (e) => {
      e.preventDefault();
      handleError(yjsTransformJobs, job);
    });

    worker.addEventListener("message", (e): void => {
      const { data } = e;
      if (!isTransformsResponse(data))
        return handleError(yjsTransformJobs, job);

      ydoc.transact(() => {
        data.add?.nodes?.forEach((node) => {
          const { x, y } =
            cytoscape.$id(node.linkToNodeId ?? "").position() ??
            getCenterPosition(cytoscape);
          const { nodeId } = AddNode(node.data, x, y, { ynodes });
          if (node.linkToNodeId) addEdge(node.linkToNodeId, nodeId, { yedges });
        });
      });
      handleComplete(yjsTransformJobs, job);
      worker.terminate();
    });

    worker.postMessage({ request, url: transform.apiUrl });
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
                <div className="flex gap-2 justify-between items-center px-3 py-2 font-medium font-mono text-left text-base">
                  <div className="flex flex-1 justify-between items-center min-w-0">
                    <span>{transformName}</span>
                    <span className="text-gray-500 truncate">{username}</span>
                  </div>
                  <JobStatus
                    job={request}
                    ownTransform={interanlTransforms.some(
                      (x) => x.transformId === request.transformId
                    )}
                    onAcceptJob={handleAcceptJob}
                    onRejectJob={handleRejectJob}
                  />

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
