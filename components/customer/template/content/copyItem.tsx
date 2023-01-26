import {
  BookmarkIcon,
  DuplicateIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Copy } from "../../../../api/copy";
import useContentType from "../../../../hooks/useContentType";
import { setToastify, ToastStatus } from "../../../../store/main/actions";
import {
  editCopy,
  saveCopy as saveCopyAction,
  unSaveCopy as unSaveCopyAction,
} from "../../../../store/template/actions";
import copyText from "../../../../utils/clipboard";
import countCharsUtil from "../../../../utils/countChars";
import countWordsUtil from "../../../../utils/countWords";
import { segmentTrack } from "../../../../utils/segment";
import WidgetButton from "../../../buttons/widgetButton";
import Rating from "../../../rating";
import ToolTip from "../../../tooltip/muiToolTip";
import DeleteCopyModal from "../../modals/deleteCopyModal";
import EditCopyModal from "../../modals/editCopyModal";
import SkeletonLoader from "./skeletonLoader";

interface CopyItemProps {
  copy: Copy;
  className?: string;
  userId: string;
  isLoading?: boolean;
}

const CopyItem: React.FC<CopyItemProps> = ({
  copy,
  className,
  userId,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, projectId, contentType, historyId, filter, customerId } =
    query;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { id, is_saved, time, data, highlighted_data } = copy;
  const [isSaving, setSaving] = useState(false);
  const [countWords, setCountWords] = useState<number>(0);
  const [countChars, setCountChars] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [currentContentType, currentTemplate] = useContentType();

  useEffect(() => {
    let sumTexts = "";
    Object.entries(data)?.map(([key, value], index) => {
      sumTexts += (index > 0 ? " " : "") + value;
    });
    setCountChars(countCharsUtil(sumTexts));
    setCountWords(countWordsUtil(sumTexts));
  }, [data]);

  useEffect(() => {
    setRating(copy?.rating ?? 0);
  }, [copy?.rating]);

  const clipboard = () => {
    let text = "";

    Object.values(data).forEach((item, index) => {
      if (item && item !== "undefined") {
        text += index ? `'\n'${item}` : item;
      }
    });
    copyText(text);
    dispatch(
      setToastify({
        status: ToastStatus.success,
        message: "Text has been copied to clipboard.",
      })
    );
    // track by segment
    segmentTrack("Copy Copied to Clipboard", {
      projectId: projectId,
      userId,
      teamId,
      templateName: currentContentType?.title[locale],
      historyId,
    });
    // track end
  };

  const handleSave = async () => {
    setSaving(true);
    if (is_saved) {
      await unSaveCopy();
    } else {
      await saveCopy();
    }
    setSaving(false);
  };

  const saveCopy = async () => {
    try {
      await dispatch(
        saveCopyAction({ copyId: id, teamId, historyId, customerId })
      );
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been saved successfully!",
        })
      );
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Sorry, we weren't able to save the copy.",
        })
      );
    } finally {
    }
  };

  const unSaveCopy = async () => {
    try {
      await dispatch(
        unSaveCopyAction({ copyId: id, teamId, historyId, customerId })
      );
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been unsaved successfully.",
        })
      );
      if (filter !== "saved") {
        return;
      }
      router.push(
        {
          pathname: teamId
            ? `\/${teamId}\/template\/${projectId}\/${contentType}\/${historyId}`
            : `\/template\/${projectId}\/${contentType}\/${historyId}`,
          query: {
            filter: "saved",
          },
        },
        undefined,
        { shallow: true }
      );
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Sorry, we weren't able to unsave the copy.",
        })
      );
    } finally {
    }
  };

  const updateRating = async (value) => {
    setRating(value);
    try {
      await dispatch(
        editCopy({
          id: copy.id,
          rating: value,
          customerId,
          teamId,
          isUpdateDate: false,
        })
      );
      // track by segment
      segmentTrack("Copy Rated", {
        projectId: projectId,
        userId,
        teamId,
        templateName: currentContentType?.title[locale],
        historyId,
      });
      // track end
    } catch (err) {}
  };

  return (
    <>
      <div
        className={`${
          className ?? ""
        } block rounded-md bg-white p-3 sm:p-6 mb-4 w-full px-3 py-6`}
      >
        <div className="block sm:flex justify-between items-center">
          {isLoading ? (
            <>
              <SkeletonLoader loaderType={"short-line-x"} />
              <SkeletonLoader loaderType={"short-line-y"} />
            </>
          ) : (
            <>
              <p className="font-normal text-xs w-20 text-gray-500 text-left whitespace-nowrap">
                {time && time[router.locale]
                  ? `${time[router.locale]} ago`
                  : t("common:now")}
              </p>
              <div className="flex justify-end sm:justify-center gap-2">
                <ToolTip
                  // toolTipClassName="px-2 py-0.5"
                  message={t("common:Edit")}
                  position="top"
                >
                  <WidgetButton onClick={() => setOpenEditModal(true)}>
                    <PencilIcon
                      className="text-gray-3 h-5 w-5 focus:text-gray-700"
                      aria-hidden="true"
                    />
                  </WidgetButton>
                </ToolTip>

                <ToolTip
                  // toolTipClassName="px-2 py-0.5"
                  message={is_saved ? t("common:Unsave") : t("common:Save")}
                  // position={Position.top}
                  position="top"
                >
                  <WidgetButton onClick={handleSave} disabled={isSaving}>
                    <BookmarkIcon
                      className={`${
                        is_saved ? "text-yellow-400" : "text-gray-3"
                      } h-5 w-5 focus:text-gray-700`}
                      aria-hidden="true"
                    />
                  </WidgetButton>
                </ToolTip>
                <ToolTip
                  // toolTipClassName="px-2 py-0.5"
                  message={t("common:Copy_to_clipboard")}
                  position="top"
                >
                  <WidgetButton onClick={clipboard}>
                    <DuplicateIcon
                      className="text-gray-3 h-5 w-5 focus:text-gray-700"
                      aria-hidden="true"
                    />
                  </WidgetButton>
                </ToolTip>
                <ToolTip
                  // toolTipClassName="px-2 py-0.5"
                  message={t("common:Delete")}
                  position="top"
                >
                  <WidgetButton
                    onClick={() => {
                      setOpenDeleteModal(true);
                    }}
                  >
                    <TrashIcon
                      className="text-gray-3 h-5 w-5 focus:text-gray-700"
                      aria-hidden="true"
                    />
                  </WidgetButton>
                </ToolTip>
              </div>
            </>
          )}
        </div>
        <div className="mt-2 w-full">
          {Object.entries(highlighted_data ? highlighted_data : data)?.map(
            ([key, value], index, array) => (
              <div key={key}>
                {isLoading ? (
                  <SkeletonLoader loaderType="bullet-list" height={100} />
                ) : (
                  <p
                    className={`font-normal text-base break-normal text-black whitespace-pre-wrap opacity-${
                      100 - index * 5
                    }`}
                    dangerouslySetInnerHTML={{ __html: value }}
                  ></p>
                )}
              </div>
            )
          )}
          <div className="flex justify-between items-center w-full mt-4">
            {isLoading ? (
              <>
                <SkeletonLoader loaderType={"short-line-x"} />
                <SkeletonLoader loaderType={"short-line-y"} />
              </>
            ) : (
              <>
                <p className="font-normal text-xs text-gray-500 break-normal whitespace-pre-wrap">
                  {countWords} {t("common:words")} / {countChars}{" "}
                  {t("common:characters")}
                </p>
                <ToolTip
                  message="Rate this copy"
                  // position={Position.top}
                  position="top"
                  // toolTipClassName="px-2.5 py-1"
                >
                  <span>
                    <Rating value={rating} onChange={updateRating} />
                  </span>
                </ToolTip>
              </>
            )}
          </div>
        </div>

        {copy?.slayer_score != 0 &&
          (isLoading ? (
            <SkeletonLoader loaderType={"short-line-x"} />
          ) : (
            <>
              <div
                className={classNames(
                  copy.slayer_score >= 80
                    ? "bg-green-100 text-green-800"
                    : copy.slayer_score < 80 && copy.slayer_score >= 60
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800",
                  "inline-flex items-baseline px-5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
                )}
              >
                <span className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500">
                  {copy.slayer_score >= 80
                    ? "🤩"
                    : copy.slayer_score < 80 && copy.slayer_score >= 60
                    ? "🙂"
                    : copy.slayer_score < 60
                    ? "😐"
                    : "😑"}
                </span>
                {copy.slayer_score}%
              </div>
            </>
          ))}
      </div>
      <EditCopyModal
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
        copy_id={id}
        content={data}
      />
      <DeleteCopyModal
        copy_id={id}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    userId: state.user?.id,
  };
};

export default connect(mapStateToPros)(CopyItem);
