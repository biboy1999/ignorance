import { Disclosure } from "@headlessui/react";
import { UseFormRegister } from "react-hook-form";
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

export const Connections = ({
  register,
}: {
  register: UseFormRegister<ProvidersParameters>;
}): JSX.Element => {
  return (
    <>
      <Disclosure>
        <Disclosure.Button className="flex w-full bg-gray-300">
          {({ open }): JSX.Element => (
            <div className="flex flex-1 justify-between items-center w-full px-5 py-2 font-medium font-mono text-left text-base">
              <span>WebRTC</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-purple-500`}
              />
            </div>
          )}
        </Disclosure.Button>
        <Disclosure.Panel className="bg-slate-100 px-4 py-2">
          <div className="mt-2">
            <label className="block leading-6" htmlFor="useWebrtc">
              Use WebRTC
            </label>
            <input type="checkbox" {...register("useWebrtc")} />
          </div>
          <div className="mt-2">
            <label className="block leading-6" htmlFor="webrtcRoom">
              Room Name
            </label>
            <input
              type="text"
              className="w-full h-8 border text-gray-900"
              placeholder="room1337"
              {...register("webrtcRoom")}
            />
          </div>
          <div className="mt-2">
            <label className="block leading-6" htmlFor="webrtcPassword">
              Room Password
            </label>
            <input
              type="text"
              className="w-full h-8 border text-gray-900"
              placeholder="1337p@ssW0rD"
              {...register("webrtcPassword")}
            />
          </div>
          <div className="mt-2">
            <label className="block leading-6" htmlFor="webrtcSignaling">
              Signaling Server
            </label>
            <input
              type="text"
              placeholder="ws://localhost:1234"
              className="w-full h-8 border text-gray-900"
              {...register("webrtcSignaling")}
            />
          </div>
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure>
        <Disclosure.Button className="flex w-full bg-gray-300">
          {({ open }): JSX.Element => (
            <div className="flex flex-1 justify-between items-center w-full px-5 py-2 font-medium font-mono text-left text-base">
              <span>WebSocket</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-purple-500`}
              />
            </div>
          )}
        </Disclosure.Button>
        <Disclosure.Panel className="bg-slate-100 px-4 py-2">
          <div className="mt-2">
            <label className="block leading-6" htmlFor="useWebSocket">
              Use WebSocket
            </label>
            <input type="checkbox" {...register("useWebSocket")} />
          </div>
          <div className="mt-2">
            <label className="block leading-6" htmlFor="webSocketRoom">
              Room Name
            </label>
            <input
              type="text"
              className="w-full h-8 border text-gray-900"
              placeholder="room1337"
              {...register("webSocketRoom")}
            />
          </div>
          <div className="mt-2">
            <label className="block leading-6" htmlFor="webSocketServer">
              Signaling Server
            </label>
            <input
              type="text"
              placeholder="ws://localhost:1234"
              className="w-full h-8 border text-gray-900"
              {...register("webSocketServer")}
            />
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </>
  );
};
