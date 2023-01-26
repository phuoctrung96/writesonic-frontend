import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/outline";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createEngine,
  getAllEngineOptions,
  XEngine,
} from "../../../../../api/admin/engine";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import SmRedButton from "../../../../buttons/smRedButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import SelectBox from "../../../../customer/dashboardContent/selectBox";
import Overlay from "../../../../customer/overlay";
import TextInput from "../../../../textInput";

const CreateEngineModal: React.FC<{
  onCreated: (rate: XEngine) => void;
  isOpenModal: boolean;
  openModal: any;
}> = ({ onCreated, isOpenModal, openModal }) => {
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const [openAiEngineName, setOpenAiEngineName] = useState<string>("");
  const [engineName, setEngineName] = useState<string>("");
  const [engineNameError, setEngineNameError] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const engines = await getAllEngineOptions();
        if (mounted.current) {
          setOptions(engines);
        }
        if (engines.length && mounted.current) {
          setOpenAiEngineName(engines[0]);
        }
      } catch (err) {}
    }
    initialize();
  }, []);

  const handleSubmit = async () => {
    if (!engineName) {
      setEngineNameError("Please insert the engine name");
      return;
    }
    try {
      setIsCreating(true);
      const data = await createEngine({
        name: engineName,
        open_ai_engine_name: openAiEngineName,
      });
      if (mounted.current) {
        onCreated(data);
      }
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Successfully, created an engine",
        })
      );
      if (mounted.current) {
        openModal(false);
      }
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsCreating(false);
      }
    }
  };

  const handleCancel = () => {
    if (mounted.current) {
      openModal(false);
    }
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
                  <PlusIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <Dialog.Title
                  as="h3"
                  className="ml-5 text-lg leading-6 font-medium text-gray-900"
                >
                  Create Engine
                </Dialog.Title>
              </div>
              <div className="mt-6">
                <div>
                  <TextInput
                    label="Engine Name"
                    value={engineName}
                    onChange={(e) => setEngineName(e.target.value)}
                    type="text"
                  />
                  <div className="mt-5">
                    <label
                      htmlFor="engine_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      OpenAi Engine Name
                    </label>
                    <SelectBox
                      id="engine_name"
                      name="engine_name"
                      value={openAiEngineName}
                      onChange={(e) => setOpenAiEngineName(e.target.value)}
                    >
                      {options?.map((name) => (
                        <option key={name}>{name}</option>
                      ))}
                    </SelectBox>
                  </div>

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
              <Overlay isShowing={options.length === 0} />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateEngineModal;
