import { Dialog, Transition } from "@headlessui/react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Copy } from "../../../api/copy";
import useContentType from "../../../hooks/useContentType";
import { setToastify, ToastStatus } from "../../../store/main/actions";
import { editCopy } from "../../../store/template/actions";
import capitalize from "../../../utils/capitalize";
import { segmentTrack } from "../../../utils/segment";
import titlize from "../../../utils/titlize";
import SmPinkButton from "../../buttons/smPinkButton";
import SmWhiteButton from "../../buttons/smWhiteButton";
import TextArea from "../dashboardContent/textArea";

const ERROR_PREFIX = "_ERROR_PREFIX";

interface EditCopyModalProps {
  copy_id: string;
  openModal: boolean;
  setOpenModal: any;
  content: { [key: string]: any };
  userId: string;
  handleEdit?: ({
    id,
    data,
    rating,
    customerId,
    teamId,
  }: {
    id: string;
    data?: {
      [key: string]: string;
    };
    rating?: number;
    customerId: string | string[];
    teamId: string | string[];
  }) => Promise<Copy>;
}

const EditCopyModal: React.FC<EditCopyModalProps> = ({
  openModal,
  setOpenModal,
  copy_id,
  content,
  userId,
  handleEdit,
}) => {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [dataError, setDataError] = useState({});
  const router = useRouter();
  const { locale, query } = router;
  const { projectId, historyId, teamId, contentType, customerId } =
    router.query;

  const [currentContentType, currentTemplate] = useContentType();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const newData = {};
    Object.keys(content).forEach((key) => {
      if (Array.isArray(content[key])) {
        newData[key] = content[key]
          ?.map((item) => item?.section ?? "")
          ?.join("\n");
      } else {
        newData[key] = content[key];
      }
    });
    setData(newData);
    setDataError({});
  }, [openModal, content]);

  function handleChange(key, newVal) {
    setData({
      ...data,
      [key]: newVal,
    });
    setDataError({
      ...dataError,
      [key]: "",
    });
  }

  async function onEdit() {
    let invalid = false;
    let error = {};
    for (const [key, value] of Object.entries(data)) {
      if (!value) {
        error[key] = `${titlize(key)} is required`;
        invalid = true;
      } else {
        error[key] = "";
      }
    }
    setDataError(error);
    if (invalid) {
      return;
    }

    try {
      setLoading(true);
      const params = { id: copy_id, data, customerId, teamId };
      if (handleEdit) {
        await handleEdit(params);
      } else {
        await dispatch(editCopy(params));
      }
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been edited successfully!",
        })
      );
      setOpenModal(false);
      // track by segment
      if (typeof contentType === "string") {
        segmentTrack("Copy Edited", {
          userId,
          teamId,
          projectId: projectId,
          historyId: historyId,
          templateName:
            currentContentType?.title[locale] ??
            capitalize(contentType?.replaceAll(/-/g, " ")),
        });
      }
      // track end
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Copy wasn't edited",
        })
      );
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }

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
                      {t("common:Edit_Copy")}
                    </Dialog.Title>
                  </div>
                </div>
                <div
                  className="block"
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onMouseOver={(e) => e.stopPropagation()}
                >
                  {Object.entries(data)?.map(([key, value]) => {
                    if (key.includes(ERROR_PREFIX)) {
                      return null;
                    }
                    const error = dataError[key];
                    if (typeof value !== "string") {
                      return null;
                    }
                    return (
                      <div key={key} className="my-4">
                        <TextArea
                          label={titlize(key.replace("_", " "))}
                          rows={value?.trim().split(/\s+/).length / 8 + 2}
                          value={value}
                          onChange={(newValue) => {
                            handleChange(key, newValue);
                          }}
                          error={error ? error : ""}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="w-full sm:w-1/2 grid gap-2 grid-cols-2 sm:flex-row-reverse sm:ml-auto mt-5">
                  <SmWhiteButton
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    {t("common:Cancel")}
                  </SmWhiteButton>
                  <SmPinkButton onClick={onEdit} disabled={loading}>
                    {t("common:Confirm")}
                  </SmPinkButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    userId: state.user?.id,
  };
};

export default connect(mapStateToPros)(EditCopyModal);
