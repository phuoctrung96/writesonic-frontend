/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setToastify, ToastStatus } from "../../../store/main/actions";
import { saveCopy, unSaveCopy } from "../../../store/template/actions";
import SmPinkButton from "../../buttons/smPinkButton";
import SmRedButton from "../../buttons/smRedButton";
import XsCloseButton from "../../buttons/xsCloseButton";
import TextInput from "../../textInput";

export default function SaveCopyModal({
  openModal,
  setOpenModal,
  copy_id: copyId,
  isSaved,
  copyTitle,
  copyDescription,
  onDelete,
  onChange,
}: {
  openModal: boolean;
  setOpenModal: any;
  copy_id: string;
  isSaved: boolean;
  copyTitle: string;
  copyDescription?: string;
  onDelete?: Function;
  onChange?: Function;
}) {
  const router = useRouter();
  const { teamId, historyId, customerId } = router.query;
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [title, setTitle] = useState(copyTitle);
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleSave = async () => {
    if (!title) {
      setTitleError("Title is required");
      return;
    }
    try {
      setLoading(true);
      await dispatch(saveCopy({ copyId, teamId, historyId, customerId }));
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been saved successfully!",
        })
      );
      if (onChange) {
        onChange();
      }
      setOpenModal(false);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Sorry, we weren't able to save the copy.",
        })
      );
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await dispatch(unSaveCopy({ copyId, teamId, historyId, customerId }));
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
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="flex justify-between">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      {`Bookmark This Copy`}
                    </Dialog.Title>
                  </div>
                  <XsCloseButton onClick={() => setOpenModal(false)} />
                </div>
                <div className="block mt-5">
                  <div>
                    <TextInput
                      label="Title"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setTitleError("");
                      }}
                      error={titleError}
                    />
                  </div>
                  {/* <div className="mt-3">
                    <TextArea
                      label="Description"
                      rows={5}
                      value={description}
                      onChange={(value) => {
                        setDescription(value);
                      }}
                    />
                  </div> */}
                </div>
                <div className="w-full sm:w-1/2 grid gap-2 grid-cols-2 sm:flex-row-reverse sm:ml-auto mt-5">
                  {isSaved ? (
                    <SmRedButton onClick={handleDelete} disabled={isLoading}>
                      {t("common:Delete")}
                    </SmRedButton>
                  ) : (
                    <SmPinkButton onClick={handleSave} disabled={isLoading}>
                      {t("common:Save")}
                    </SmPinkButton>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
