import { RadioGroup } from "@headlessui/react";
import { DuplicateIcon, PencilIcon, TrashIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ContentTypeGrouped } from "../../../../../api/contentType";
import { changeCopy, Copy, deleteCopy } from "../../../../../api/copy";
import { getAllHistoryPerPageById, History } from "../../../../../api/history";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import copyText from "../../../../../utils/clipboard";
import countCharsUtil from "../../../../../utils/countChars";
import countWordsUtil from "../../../../../utils/countWords";
import { segmentTrack } from "../../../../../utils/segment";
import WidgetButton from "../../../../buttons/widgetButton";
import Rating from "../../../../rating";
import ToolTip from "../../../../tooltip/muiToolTip";
import DeleteCopyModal from "../../../modals/deleteCopyModal";
import EditCopyModal from "../../../modals/editCopyModal";
import SkeletonLoader from "../skeletonLoader";

interface RadioBoxesProps {
  history: History;
  setHistory: (value: SetStateAction<History>) => void;
  onNext: (copy: Copy) => void;
  selectedCopy: Copy;
  userId: string;
  currentContentType: ContentTypeGrouped;
  contentTypeName: string;
  isLoading: boolean;
}

const RadioBoxes: React.FC<RadioBoxesProps> = ({
  history,
  setHistory,
  onNext,
  isLoading,
  selectedCopy,
  userId,
  currentContentType,
  contentTypeName,
}) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(selectedCopy?.id);
  }, [selectedCopy]);

  const handleClickRadio = (selectedId) => {
    const outLineCopy = history?.copies?.items?.find(
      ({ id }) => id == selectedId
    );

    onNext(outLineCopy);
  };

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
      <div className="rounded-md">
        {history?.copies?.items?.map((copy, index) => (
          <div key={index} onClick={() => handleClickRadio(copy?.id)}>
            <RadioItem
              history={history}
              setHistory={setHistory}
              userId={userId}
              currentContentType={currentContentType}
              copy={copy}
              contentTypeName={contentTypeName}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

const RadioItem: React.FC<{
  userId: string;
  currentContentType: ContentTypeGrouped;
  copy: Copy;
  history: History;
  setHistory: (value: SetStateAction<History>) => void;
  contentTypeName: string;
  isLoading: boolean;
}> = ({
  copy,
  userId,
  currentContentType,
  history,
  setHistory,
  contentTypeName,
  isLoading,
}) => {
  const { id, data, rating, time } = copy;

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { customerId, teamId, projectId, historyId } = router.query;
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const getCounts = (lines, flag) => {
    let sumTexts = "";
    lines?.forEach((element, index) => {
      sumTexts += (index > 0 ? " " : "") + element?.section ?? "";
    });
    return flag === "words"
      ? countWordsUtil(sumTexts)
      : countCharsUtil(sumTexts);
  };

  const updateRating = async (value) => {
    setCurrentRating(value);
    try {
      const newCopy = await changeCopy({
        copyId: id,
        copyData: null,
        rating: value,
        customerId,
        teamId,
        isUpdateDate: false,
      });
      const items = history.copies?.items.map((copy) =>
        copy.id === newCopy.id ? newCopy : copy
      );
      setHistory({ ...history, copies: { ...history.copies, items } });
      // track by segment
      segmentTrack("Copy Rated", {
        projectId: projectId,
        userId,
        teamId,
        templateName: currentContentType?.title[router.locale] ?? "",
        historyId,
      });
      // track end
    } catch (err) {}
  };

  const handleEdit = ({
    id,
    data,
    rating,
    customerId,
    teamId,
  }: {
    id: string;
    data?: { [key: string]: string };
    rating?: number;
    customerId: string | string[];
    teamId: string | string[];
  }): Promise<Copy> => {
    return new Promise(async (resolve, reject) => {
      try {
        const newCopy = await changeCopy({
          copyId: id,
          copyData: data,
          rating,
          customerId,
          teamId,
          isUpdateDate: false,
        });
        const items = history.copies?.items.map((copy) =>
          copy.id === newCopy.id ? newCopy : copy
        );
        setHistory({ ...history, copies: { ...history.copies, items } });

        resolve(newCopy);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleDelete = ({
    id,
    customerId,
    teamId,
  }: {
    id: string;
    customerId: string | string[];
    teamId: string | string[];
  }): Promise<Copy> => {
    return new Promise(async (resolve, reject) => {
      try {
        const newCopy = await deleteCopy({ id, customerId, teamId });
        try {
          const newHistory = await getAllHistoryPerPageById({
            historyId: history.id,
            projectId,
            contentName: contentTypeName,
            customerId,
            teamId,
            page: 1,
            isSubHistory: true,
          });
          setHistory(newHistory);
        } catch (err) {
          reject(err);
        }
        resolve(newCopy);
      } catch (err) {
        reject(err);
      }
    });
  };

  const clipboard = (e) => {
    e.stopPropagation();
    let text = "";

    Object.values(data).forEach((item, index) => {
      // for step 3 in article writer
      if (item && item !== "undefined" && typeof item === "object") {
        item.forEach((outline, index) => {
          text += index ? `\n${outline?.section}` : outline?.section;
        });
      }
      // for step 3 in article writer
      else if (item && item !== "undefined") {
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
      templateName: currentContentType?.title[router.locale],
      historyId,
    });
    // track end
  };

  return (
    <RadioGroup.Option
      value={id}
      className={({ checked }) =>
        classNames(
          checked ? "border-indigo-600" : "border-gray-100",
          "relative p-5 flex cursor-pointer focus:outline-none my-3 bg-white rounded-lg border-2"
        )
      }
    >
      {({ active, checked }) => (
        <div className="flex justify-start items-center w-full">
          <div>
            <span
              className={classNames(
                checked
                  ? "bg-indigo-600 border-transparent"
                  : "bg-white border-gray-300",
                active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center"
              )}
              aria-hidden="true"
            >
              <span className="rounded-full bg-white w-1.5 h-1.5" />
            </span>
          </div>
          <div className="ml-2 block flex-1">
            <div className="flex justify-between items-center">
              <p className="font-normal text-xs w-20 text-gray-500 text-left whitespace-nowrap">
                {time && time[router.locale]
                  ? `${time[router.locale]} ago`
                  : t("common:now")}
              </p>
              <div className="flex flex-col">
                <div className="flex flex-1 justify-end sm:justify-center gap-2 w-fit">
                  <ToolTip
                    // toolTipClassName="px-2 py-0.5"
                    message={t("common:Edit")}
                    position="top"
                  >
                    <WidgetButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenEditModal(true);
                      }}
                    >
                      <PencilIcon
                        className="text-gray-3 h-5 w-5 focus:text-gray-700"
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
                      onClick={(e) => {
                        e.stopPropagation();
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
              </div>
            </div>
            <RadioGroup.Label
              as="span"
              className={classNames(
                checked ? "text-indigo-900" : "text-gray-900",
                "block text-sm font-medium py-2"
              )}
            >
              {typeof data?.text === "object" ? (
                <>
                  {data?.text?.map((text, index) => {
                    if (isLoading) {
                      return <SkeletonLoader loaderType="line-x" key={index} />;
                    }
                    return (
                      <p key={index} className="text-base text-gray-700">
                        <span className="text-base text-gray-600 mr-2">
                          Section {index + 1}:
                        </span>
                        {text?.section ?? ""}
                      </p>
                    );
                  })}
                </>
              ) : (
                <div>
                  {isLoading ? (
                    <SkeletonLoader loaderType="line-x" />
                  ) : (
                    data?.text ?? ""
                  )}
                </div>
              )}
            </RadioGroup.Label>
            <div className="flex justify-center items-center">
              <div className="flex justify-between items-center w-full">
                {isLoading ? (
                  <SkeletonLoader loaderType="short-line-x" />
                ) : typeof data?.text === "object" ? (
                  <p className="font-normal text-xs text-gray-500 break-normal whitespace-pre-wrap">
                    {getCounts(data?.text, "words")} {t("common:words")} /{" "}
                    {getCounts(data?.text, "chars")} {t("common:characters")}
                  </p>
                ) : (
                  <>
                    <p className="font-normal text-xs text-gray-500 break-normal whitespace-pre-wrap">
                      {countWordsUtil(data?.text ?? "")} {t("common:words")} /{" "}
                      {countCharsUtil(data?.text ?? "")}{" "}
                      {t("common:characters")}
                    </p>
                  </>
                )}
              </div>
              <ToolTip
                message="Rate this copy"
                position="top"
                // toolTipClassName="px-2.5 py-1"
              >
                <span>
                  <Rating value={currentRating} onChange={updateRating} />
                </span>
              </ToolTip>
            </div>
          </div>

          <EditCopyModal
            openModal={openEditModal}
            setOpenModal={setOpenEditModal}
            copy_id={id}
            content={data}
            handleEdit={handleEdit}
          />
          <DeleteCopyModal
            copy_id={id}
            openModal={openDeleteModal}
            setOpenModal={setOpenDeleteModal}
            handleDelete={handleDelete}
          />
        </div>
      )}
    </RadioGroup.Option>
  );
};

export default RadioBoxes;
