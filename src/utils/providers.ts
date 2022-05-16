import { Map as YMap } from "yjs";
import { TransformsJob } from "../types/types";

export const handleError = (
  yjobs: YMap<TransformsJob>,
  job: TransformsJob
): void => {
  yjobs.set(job.jobId, { ...job, status: "failed" });
};

export const handleComplete = (
  yjobs: YMap<TransformsJob>,
  job: TransformsJob
): void => {
  yjobs.set(job.jobId, { ...job, status: "completed" });
};

export const handleRunning = (
  yjobs: YMap<TransformsJob>,
  job: TransformsJob
): void => {
  yjobs.set(job.jobId, { ...job, status: "running" });
};

export const handleReject = (
  yjobs: YMap<TransformsJob>,
  job: TransformsJob
): void => {
  yjobs.set(job.jobId, { ...job, status: "rejected" });
};
