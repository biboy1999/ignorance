import { Fragment, Dispatch, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, FormProvider } from "react-hook-form";
import {
  TransformProviderForm,
  TransformProviderParamters,
} from "./TransformProviderForm";
import { useTransforms } from "../../../store/transforms";
import { nanoid } from "nanoid";
import { useAtomValue } from "jotai";
import { ytransformProvidersAtom } from "../../../atom/yjs";
import { awarenessAtom } from "../../../atom/provider";

export type ConnectionsMadelProp = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const TransformProviderModal = ({
  open,
  setOpen,
}: ConnectionsMadelProp): JSX.Element => {
  const awareness = useAtomValue(awarenessAtom);
  const yproviders = useAtomValue(ytransformProvidersAtom);

  const addProviders = useTransforms((state) => state.addProviders);

  const method = useForm<TransformProviderParamters>({
    defaultValues: { elementType: ["*"] },
  });

  const onSubmit = method.handleSubmit((data) => {
    const internal = { ...data, transformId: nanoid(), parameter: {} };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiUrl, ...publicTransform } = {
      ...internal,
      clientId: awareness?.clientID ?? 0,
    };

    addProviders([internal]);
    yproviders.set(publicTransform.transformId, publicTransform);
    setOpen(false);
  });

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-max"
        onClose={setOpen}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
            <Dialog.Panel className="flex flex-col self-center align-bottom text-left overflow-hidden shadow-xl transition-all max-w-lg w-full">
              <div className="bg-purple-400">
                <Dialog.Title
                  as="h1"
                  className="font-mono text-lg p-3 text-white"
                >
                  Add Transform
                </Dialog.Title>
              </div>
              <div className="bg-slate-100 max-h-[76vh] overflow-y-auto">
                <FormProvider {...method}>
                  <form onSubmit={onSubmit} id="connectionForm">
                    <TransformProviderForm />
                  </form>
                </FormProvider>
              </div>
              <div className="flex-row-reverse flex bg-slate-100 px-3 py-2">
                <button
                  type="submit"
                  form="connectionForm"
                  className="w-auto inline-flex justify-center border border-gray-300 shadow-sm px-4 py-2 my-0 bg-green-300 text-sm font-medium font-mono text-gray-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
