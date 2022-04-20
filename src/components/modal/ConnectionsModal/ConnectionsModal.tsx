import React, { Fragment, useContext, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Connections, ProvidersParameters } from "./Connections";
import { FormProvider, useForm } from "react-hook-form";
import { where, is, equals } from "ramda";
import { ProviderDocContext } from "../../../App";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { useGlobals } from "../../../store/globals";

export type ConnectionsMadelProp = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ConnectionsModal = ({
  open,
  setOpen,
}: ConnectionsMadelProp): JSX.Element => {
  const context = useContext(ProviderDocContext);

  const ydoc = useGlobals((state) => state.ydoc);

  const buttonRef = useRef(null);

  const formMethod = useForm<ProvidersParameters>();
  const { handleSubmit } = formMethod;

  const onSubmit = handleSubmit((data) => {
    const usingRtc = where({
      useWebrtc: equals(true),
      webrtcRoom: is(String),
      webrtcPassword: is(String),
      webrtcSignaling: is(String),
    });

    const usingWebSocket = where({
      useWebSocket: equals(true),
      webSocketRoom: is(String),
      webSocketServer: is(String),
    });

    if (usingRtc(data) && !context.providers.webrtc.provider) {
      context.addProvider(
        // @ts-expect-error most property are optional
        new WebrtcProvider(data.webrtcRoom, context.ydoc.current, {
          signaling: [data.webrtcSignaling],
          password: data.webrtcPassword,
          awareness: context.awareness,
          filterBcConns: false,
        })
      );
      setOpen(false);
    } else if (usingWebSocket(data) && !context.providers.websocket.provider) {
      context.addProvider(
        new WebsocketProvider(data.webSocketServer, data.webSocketRoom, ydoc, {
          awareness: context.awareness,
        })
      );
      setOpen(false);
    }
  });

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        onClose={setOpen}
        initialFocus={buttonRef}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="flex flex-col z-50 self-center align-bottom text-left overflow-hidden shadow-xl transition-all max-w-lg w-full">
              <div className="bg-purple-400">
                <Dialog.Title
                  as="h1"
                  className="font-mono text-lg p-3 text-white"
                >
                  Create Connection
                </Dialog.Title>
              </div>
              <div className="bg-slate-100 max-h-[76vh] overflow-y-auto">
                <FormProvider {...formMethod}>
                  <form onSubmit={onSubmit} id="connectionForm">
                    <Connections />
                  </form>
                </FormProvider>
              </div>
              <div className="flex-row-reverse flex bg-slate-100 px-3 py-2 border-t-2">
                <button
                  type="submit"
                  form="connectionForm"
                  ref={buttonRef}
                  className="w-auto inline-flex justify-center border border-gray-300 shadow-sm px-4 py-2 my-0 bg-green-300 text-sm font-medium font-mono text-gray-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Connect
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
