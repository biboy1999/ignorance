import { Map as YMap } from "yjs";
import { TransformJob, TransformRequest } from "../types/transform";

export const handleError = (
  yjobs: YMap<TransformJob>,
  job: TransformJob
): void => {
  yjobs.set(job.jobId, { ...job, status: "failed" });
};

export const handleComplete = (
  yjobs: YMap<TransformJob>,
  job: TransformJob
): void => {
  yjobs.set(job.jobId, { ...job, status: "completed" });
};

export const handleRunning = (
  yjobs: YMap<TransformJob>,
  job: TransformJob
): void => {
  yjobs.set(job.jobId, { ...job, status: "running" });
};

export const handleReject = (
  yjobs: YMap<TransformJob>,
  job: TransformJob
): void => {
  yjobs.set(job.jobId, { ...job, status: "rejected" });
};

export const createRequest = (
  job: TransformJob,
  cytoscape: cytoscape.Core
): TransformRequest => {
  return {
    nodes: job.request.nodesId?.map((nodeId) => ({
      data: cytoscape?.$id(nodeId).data(),
      position: cytoscape?.$id(nodeId).position(),
    })),
    edges: job.request.edgesId?.map((edgeId) => cytoscape?.$id(edgeId).data()),
    parameter: job.request.parameter,
  };
};
