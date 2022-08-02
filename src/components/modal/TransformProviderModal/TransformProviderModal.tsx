import { Dispatch, SetStateAction } from "react";
import { Dialog } from "@headlessui/react";
import { useForm, FormProvider } from "react-hook-form";
import {
  TransformProviderForm,
  TransformProviderParamters,
} from "./TransformProviderForm";
import { nanoid } from "nanoid";
import { useStore } from "../../../store/store";
import { StyledModal } from "../../common/Modal";

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
    <StyledModal isOpen={open} onClose={setOpen}>
      <div className="modal-topbar">
        <Dialog.Title as="h1" className="font-mono text-lg p-3 text-white">
          Add Transform
        </Dialog.Title>
      </div>
      <div className="styled-panel overflow-y-auto">
        <FormProvider {...method}>
          <form onSubmit={onSubmit} id="connectionForm">
            <TransformProviderForm />
          </form>
        </FormProvider>
      </div>
      <div className="styled-panel border-t flex-row-reverse flex px-3 py-2">
        <button
          type="submit"
          form="connectionForm"
          className="styled-button w-auto inline-flex justify-center shadow-sm px-4 py-2 my-0 text-sm font-medium font-mono bg-green-300  hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        >
          Add
        </button>
      </div>
    </StyledModal>
  );
};
