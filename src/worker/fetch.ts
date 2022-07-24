import { TransformRequest } from "../types/types";

// eslint-disable-next-line
declare const self: DedicatedWorkerGlobalScope;

export type FetchMessageType = {
  request: TransformRequest;
  url: string;
};

onmessage = (e: MessageEvent<FetchMessageType>): void => {
  const { request, url } = e.data;
  fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((resp) => {
      if (!resp.ok) throw Error("Not 2xx Response");
      return resp.json();
    })
    .then((data) => postMessage(data))
    .catch((e) => {
      setTimeout(() => {
        throw e;
      });
    });
};

// export default null as any;
export {};
