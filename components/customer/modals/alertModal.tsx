/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { Fragment, ReactNode, useRef } from "react";
import SmPinkButton from "../../buttons/smPinkButton";

export default function AlertModal({
  openModal,
  setOpenModal,
  message,
  title,
}: {
  openModal: boolean;
  setOpenModal: any;
  message: string | ReactNode;
  title?: string;
}) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation();

  return (
    <>
      <Transition.Root show={openModal} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-20 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={openModal}
          onClose={setOpenModal}
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
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 z-50"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-red-600"
                      >
                        {title ? title : t("common:Error")}
                      </Dialog.Title>
                    </div>
                  </div>
                </div>
                <div className="block mt-5">{message}</div>
                <div className="w-full mt-5">
                  <SmPinkButton
                    onClick={() => {
                      setOpenModal(false);
                    }}
                    className="ml-auto"
                  >
                    {t("common:Okay")}
                  </SmPinkButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
