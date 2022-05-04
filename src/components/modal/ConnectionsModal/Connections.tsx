import { Disclosure } from "@headlessui/react";
import { useFormContext } from "react-hook-form";
import { ChevronUpIcon } from "@heroicons/react/solid";

export type WebrtcProviderParameters = {
  useWebrtc: boolean;
  webrtcRoom: string;
  webrtcPassword: string;
  webrtcSignaling: string;
};

export type WebSocketProviderParameters = {
  useWebSocket: boolean;
  webSocketRoom: string;
  webSocketServer: string;
};

export type ProvidersParameters = WebrtcProviderParameters &
  WebSocketProviderParameters;

export const Connections = (): JSX.Element => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const watchWebrtc = watch("useWebrtc", false);
  const watchWebsocket = watch("useWebSocket", false);

  return (
    <>
      <Disclosure>
        <Disclosure.Button
          className={`flex w-full ${
            watchWebrtc ? "bg-green-300" : "bg-gray-300"
          }`}
        >
          {({ open }): JSX.Element => (
            <div className="flex flex-1 gap-3 justify-between items-center w-full px-3 py-2 font-medium font-mono text-left text-base">
              <input
                type="checkbox"
                className="w-6 h-6"
                aria-label="use Webrtc"
                onClick={(e): void => e.stopPropagation()}
                {...register("useWebrtc", { value: false })}
              />
              <span className="flex-1">WebRTC</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-purple-500`}
              />
            </div>
          )}
        </Disclosure.Button>
        <Disclosure.Panel
          className="bg-slate-100 px-4 py-2 space-y-2"
          unmount={false}
        >
          <div>
            <label className="block leading-6" htmlFor="webrtcRoom">
              Room Name
            </label>
            <input
              type="text"
              className={`w-full h-8 border text-gray-900 ${
                errors.webrtcRoom && "border-red-500"
              }`}
              placeholder="room1337"
              {...register("webrtcRoom", {
                required: true,
                value: "",
                disabled: !watchWebrtc,
              })}
            />
          </div>
          <div>
            <label className="block leading-6" htmlFor="webrtcPassword">
              Room Password
            </label>
            <input
              type="text"
              className={`w-full h-8 border text-gray-900 ${
                errors.webrtcPassword && "border-red-500"
              }`}
              placeholder="1337p@ssW0rD"
              {...register("webrtcPassword", {
                required: true,
                value: "",
                disabled: !watchWebrtc,
              })}
            />
          </div>
          <div>
            <label className="block leading-6" htmlFor="webrtcSignaling">
              Signaling Server
            </label>
            <input
              type="text"
              placeholder="ws://localhost:1234"
              className={`w-full h-8 border text-gray-900 ${
                errors.webrtcSignaling && "border-red-500"
              }`}
              {...register("webrtcSignaling", {
                required: true,
                value: "",
                disabled: !watchWebrtc,
              })}
            />
          </div>
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure>
        <Disclosure.Button
          className={`flex w-full ${
            watchWebsocket ? "bg-green-300" : "bg-gray-300"
          }`}
        >
          {({ open }): JSX.Element => (
            <div className="flex flex-1 gap-3 justify-between items-center w-full px-3 py-2 font-medium font-mono text-left text-base">
              <input
                type="checkbox"
                className="w-6 h-6"
                aria-label="use Websocket"
                onClick={(e): void => e.stopPropagation()}
                {...register("useWebSocket", { value: false })}
              />
              <span className="flex-1">WebSocket</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-purple-500`}
              />
            </div>
          )}
        </Disclosure.Button>
        <Disclosure.Panel
          className="bg-slate-100 px-4 py-2 space-y-2"
          unmount={false}
        >
          <div>
            <label className="block leading-6" htmlFor="webSocketRoom">
              Room Name
            </label>
            <input
              type="text"
              className={`w-full h-8 border text-gray-900 ${
                errors.webrtcSignaling && "border-red-500"
              }`}
              placeholder="room1337"
              {...register("webSocketRoom", {
                required: true,
                value: "",
                disabled: !watchWebsocket,
              })}
            />
          </div>
          <div>
            <label className="block leading-6" htmlFor="webSocketServer">
              Signaling Server
            </label>
            <input
              type="text"
              placeholder="ws://localhost:1234"
              className={`w-full h-8 border text-gray-900 ${
                errors.webrtcSignaling && "border-red-500"
              }`}
              {...register("webSocketServer", {
                required: true,
                value: "",
                disabled: !watchWebsocket,
              })}
            />
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </>
  );
};
