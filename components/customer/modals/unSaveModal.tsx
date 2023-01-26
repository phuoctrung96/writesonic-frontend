/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setToastify, ToastStatus } from "../../../store/main/actions";
import { unSaveCopy } from "../../../store/template/actions";
import SmPinkButton from "../../buttons/smPinkButton";
import SmWhiteButton from "../../buttons/smWhiteButton";

export default function UnSaveCopyModal({
  openModal,
  setOpenModal,
  copy_id,
  onDelete,
}: {
  openModal: boolean;
  setOpenModal: any;
  copy_id: string;
  onDelete?: Function;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { teamId, historyId, customerId } = router.query;
  const { t } = useTranslation();
  const cancelButtonRef = useRef(null);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await dispatch(
        unSaveCopy({ copyId: copy_id, teamId, historyId, customerId })
      );
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been unsaved successfully.",
        })
      );
      setOpenModal(false);

      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Sorry, we weren't able to unsave the copy.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Transition.Root show={openModal} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-20 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={openModal}
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
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      {t("common:UnBookmark")}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t("common:Do_you_want_to_unbookmark")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 sm:ml-auto mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <SmPinkButton
                    className="w-full sm:ml-3"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {t("common:Confirm")}
                  </SmPinkButton>
                  <SmWhiteButton
                    className="w-full mt-3 sm:mt-0"
                    onClick={() => setOpenModal(false)}
                  >
                    {t("common:Cancel")}
                  </SmWhiteButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
