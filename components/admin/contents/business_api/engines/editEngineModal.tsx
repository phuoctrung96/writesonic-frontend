import { Dialog, Transition } from "@headlessui/react";
import { PencilAltIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useRef, useState } from "react";
import { XEngine } from "../../../../../api/admin/engine";
import SmRedButton from "../../../../buttons/smRedButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import TextInput from "../../../../textInput";

const EditEngineModal: React.FC<{
  selectedEngine: XEngine;
  onUpdated: (rate: XEngine) => void;
  isOpenModal: boolean;
  openModal: any;
}> = ({ selectedEngine, onUpdated, isOpenModal, openModal }) => {
  const mounted = useRef(false);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {};

  const handleCancel = () => {
    openModal(false);
  };

  return (
    <Transition.Root show={isOpenModal} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-20 inset-0 overflow-y-auto"
        open={isOpenModal}
        onClose={() => {}}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <PencilAltIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <Dialog.Title
                  as="h3"
                  className="ml-5 text-lg leading-6 font-medium text-gray-900"
                >
                  Update Rate
                </Dialog.Title>
              </div>
              <div className="mt-6">
                <div>
                  <TextInput
                    type="text"
                    value={name}
                    step={0.001}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    error={nameError}
                    max={1}
                    min={0}
                  />
                  <div className="w-full sm:ml-auto sm:w-1/2 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <SmRedButton
                      className="w-full sm:ml-3"
                      onClick={handleSubmit}
                      disabled={isCreating}
                    >
                      Create
                    </SmRedButton>
                    <SmWhiteButton
                      className="w-full mt-3 sm:mt-0"
                      onClick={handleCancel}
                    >
                      Cancel
                    </SmWhiteButton>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditEngineModal;