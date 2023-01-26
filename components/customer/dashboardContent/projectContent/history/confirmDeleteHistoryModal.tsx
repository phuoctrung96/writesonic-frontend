import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { deleteHistory } from "../../../../../api/history";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { openDeleteHistoryModal } from "../../../../../store/modals/actions";
import SmRedButton from "../../../../buttons/smRedButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";

interface ConfirmDeleteHistoryModalProps {
  isOpenModal: boolean;
  deleted: Function;
  historyId: number | string | string[];
}

const ConfirmDeleteHistoryModal: React.FC<ConfirmDeleteHistoryModalProps> = ({
  isOpenModal,
  deleted,
  historyId,
}) => {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { projectId, customerId, teamId } = router.query;

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const openModal = (open) => {
    dispatch(openDeleteHistoryModal(open));
  };

  const handleDelete = useCallback(() => {
    setLoading(true);
    deleteHistory({ id: historyId, projectId, customerId, teamId })
      .then((res) => {
        deleted(res);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Success",
          })
        );
        dispatch(openDeleteHistoryModal(false));
      })
      .catch((err) => {
        const errorDetail = err.response?.data?.detail;
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: errorDetail ?? "Failed",
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
      });
  }, [customerId, deleted, dispatch, historyId, projectId, teamId]);

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
                    {t("common:Delete_history")}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {`Are you sure you want to delete?`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full sm:ml-auto sm:w-1/2 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <SmRedButton
                  className="w-full sm:ml-3"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {t("common:Delete")}
                </SmRedButton>
                <SmWhiteButton
                  className="w-full mt-3 sm:mt-0"
                  onClick={() => openModal(false)}
                >
                  {t("common:Cancel")}
                </SmWhiteButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const mapStateToPros = (state) => {
  return {
    isOpenModal: state.modals?.isOpenDeleteHistoryModal,
  };
};

export default connect(mapStateToPros)(ConfirmDeleteHistoryModal);
