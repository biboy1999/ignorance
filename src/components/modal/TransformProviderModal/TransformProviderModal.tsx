import { Fragment, Dispatch, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, FormProvider } from "react-hook-form";
import {
  TransformProviderForm,
  TransformProviderParamters,
} from "./TransformProviderForm";
import { nanoid } from "nanoid";
import { useStore } from "../../../store/store";

export type ShareTransformsModalProp = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ShareTransformsModal = ({
  open,
  setOpen,
}: ShareTransformsModalProp): JSX.Element => {
  const awareness = useStore((state) => state.getAwareness());
  const sharedTransforms = useStore((state) => state.yjsSharedTransforms());

  const addInternalTransforms = useStore(
    (state) => state.addInternalTransforms
  );

  const method = useForm<TransformProviderParamters>({
    defaultValues: { elementType: ["*"] },
  });

  const onSubmit = method.handleSubmit((data) => {
    const internal = { ...data, transformId: nanoid(), parameter: {} };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiUrl, ...publicTransform } = {
      ...internal,
      clientId: awareness.clientID,
    };

    addInternalTransforms([internal]);
    sharedTransforms.set(publicTransform.transformId, publicTransform);
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
            <div className="backdrop fixed inset-0" />
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
              <div className="topbar">
                <Dialog.Title
                  as="h1"
                  className="font-mono text-lg p-3 text-white"
                >
                  Add Transform
                </Dialog.Title>
              </div>
              <div className="panel max-h-[76vh] overflow-y-auto">
                <FormProvider {...method}>
                  <form onSubmit={onSubmit} id="connectionForm">
                    <TransformProviderForm />
                  </form>
                </FormProvider>
              </div>
              <div className="panel border-t flex-row-reverse flex px-3 py-2">
                <button
                  type="submit"
                  form="connectionForm"
                  className="w-auto inline-flex justify-center shadow-sm px-4 py-2 my-0 text-sm font-medium font-mono bg-green-300  hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
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
