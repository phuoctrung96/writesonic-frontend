import { Dialog, Transition } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { Fragment } from "react";
import AddMemberForm from "./addMemberForm";

export default function AddMemberModal({
  isOpenModal,
  setIsOpenModal,
  onOkay,
}: {
  isOpenModal: boolean;
  setIsOpenModal: any;
  onOkay: Function;
}) {
  const { t } = useTranslation();
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
              <div className="flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <PlusCircleIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Add Member
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please insert the user id
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <AddMemberForm
                  onOkay={onOkay}
                  closeModal={() => {
                    setIsOpenModal(false);
                  }}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
