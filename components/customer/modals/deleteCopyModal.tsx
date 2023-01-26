import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Copy } from "../../../api/copy";
import { setToastify, ToastStatus } from "../../../store/main/actions";
import { deleteCopy } from "../../../store/template/actions";
import SmRedButton from "../../buttons/smRedButton";
import SmWhiteButton from "../../buttons/smWhiteButton";

export default function DeleteCopyModal({
  copy_id,
  openModal,
  setOpenModal,
  handleDelete,
}: {
  copy_id: string;
  openModal: boolean;
  setOpenModal: any;
  handleDelete?: ({
    id,
    customerId,
    teamId,
  }: {
    id: string;
    customerId: string | string[];
    teamId: string | string[];
  }) => Promise<Copy>;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { customerId, teamId } = router.query;
  const cancelButtonRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const onDelete = async () => {
    try {
      setLoading(true);
      if (handleDelete) {
        await handleDelete({ id: copy_id, customerId, teamId });
      } else {
        await dispatch(deleteCopy({ id: copy_id, router, customerId, teamId }));
      }
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been deleted successfully.",
        })
      );
      setOpenModal(false);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Sorry, we weren't able to delete the copy.",
        })
      );
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
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
                      {t("common:Delete_Copy")}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t("common:Are_you_sure_you_want_to_delete_this_copy")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="my-6"></div>
                <div className="w-full sm:w-1/2 grid gap-2 grid-cols-2 sm:flex-row-reverse sm:ml-auto mt-5">
                  <SmWhiteButton
                    className="w-full"
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    {t("common:Cancel")}
                  </SmWhiteButton>
                  <SmRedButton
                    className="w-full"
                    onClick={onDelete}
                    disabled={isLoading}
                  >
                    {t("common:Delete")}
                  </SmRedButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
