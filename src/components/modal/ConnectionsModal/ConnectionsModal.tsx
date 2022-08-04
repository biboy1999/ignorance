import { useRef } from "react";
import { Dialog } from "@headlessui/react";
import { Connections, ProvidersParameters } from "./Connections";
import { FormProvider, useForm } from "react-hook-form";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { useStore } from "../../../store/store";
import { StyledModal } from "../../common/Modal";

export type ConnectionsMadelProp = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ConnectionsModal = ({
  open,
  setOpen,
}: ConnectionsMadelProp): JSX.Element => {
  const addProvider = useStore((state) => state.addProvider);

  const ydoc = useStore((state) => state.ydoc);
  const providers = useStore((state) => state.providersStore);
  const awareness = useStore((state) => state.getAwareness());

  const buttonRef = useRef(null);

  const formMethod = useForm<ProvidersParameters>();
  const { handleSubmit } = formMethod;

  const onSubmit = handleSubmit((data) => {
    const isUsingRtc =
      data.useWebrtc === true &&
      typeof data.webrtcRoom === "string" &&
      typeof data.webrtcPassword === "string" &&
      typeof data.webrtcSignaling === "string";

    const isUsingWebSocket =
      data.useWebSocket === true &&
      typeof data.webSocketRoom === "string" &&
      typeof data.webSocketServer === "string";

    if (isUsingRtc && !providers.webrtc.provider && awareness) {
      addProvider(
        // @ts-expect-error most property are optional
        new WebrtcProvider(data.webrtcRoom, ydoc, {
          signaling: [data.webrtcSignaling],
          password: data.webrtcPassword,
          awareness: awareness,
          filterBcConns: false,
        })
      );
      setOpen(false);
    } else if (isUsingWebSocket && !providers.websocket.provider && awareness) {
      addProvider(
        new WebsocketProvider(data.webSocketServer, data.webSocketRoom, ydoc, {
          awareness: awareness,
        })
      );
      setOpen(false);
    }
  });

  return (
    <StyledModal isOpen={open} onClose={setOpen}>
      <div className="modal-topbar">
        <Dialog.Title as="h1" className="font-mono text-lg p-3 text-white">
          Create Connection
        </Dialog.Title>
      </div>
      <div className="styled-panel overflow-y-auto">
        <FormProvider {...formMethod}>
          <form
            onSubmit={onSubmit}
            id="connectionForm"
            className="divide-y dark:divide-neutral-700"
          >
            <Connections />
          </form>
        </FormProvider>
      </div>
      <div className="styled-panel  border-t flex-row-reverse flex px-3 py-2">
        <button
          type="submit"
          form="connectionForm"
          ref={buttonRef}
          className="styled-button w-auto inline-flex justify-center shadow-sm px-4 py-2 my-0 bg-green-300 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-500 text-sm font-medium font-mono focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        >
          Connect
        </button>
      </div>
    </StyledModal>
  );
};
