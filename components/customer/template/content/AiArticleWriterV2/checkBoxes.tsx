import useTranslation from "next-translate/useTranslation";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ArticleOutlineText } from ".";
import { Copy } from "../../../../../api/copy";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import countCharsUtil from "../../../../../utils/countChars";
import countWordsUtil from "../../../../../utils/countWords";
import SmPinkButton from "../../../../buttons/smPinkButton";
import SkeletonLoader from "../skeletonLoader";

const MAX_ROWS = 12;

interface CheckBoxesProps {
  lists: Copy[];
  onNext: () => void;
  articleOutlineTexts: ArticleOutlineText[];
  setArticleOutlineTexts: React.Dispatch<
    React.SetStateAction<ArticleOutlineText[]>
  >;
  isLoading: boolean;
}

const CheckBoxes: React.FC<CheckBoxesProps> = ({
  lists,
  onNext,
  articleOutlineTexts,
  setArticleOutlineTexts,
  isLoading,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<ArticleOutlineText[]>([]);
  const [userOutlineTexts, setUserOutlineTexts] =
    useState<ArticleOutlineText[]>();

  const [customWords, setCustomWords] = useState(0);
  const [customChars, setCustomChars] = useState(0);

  useEffect(() => {
    setSelected(articleOutlineTexts);
    setUserOutlineTexts(
      articleOutlineTexts?.filter(({ id: userSectionId, section }) => {
        if (!section) {
          return false;
        } else {
          let isNotHistory = true;
          lists.forEach(({ id, data }) => {
            if (
              data?.text?.find(
                ({ id: sectionId }) => sectionId === userSectionId
              )
            ) {
              isNotHistory = false;
            }
          });
          return isNotHistory;
        }
      }) ?? []
    );
  }, [articleOutlineTexts, lists]);

  useEffect(() => {
    let sumTexts = "";
    userOutlineTexts?.forEach(({ id, section }, index) => {
      sumTexts += (index > 0 ? " " : "") + section;
    });
    setCustomWords(countWordsUtil(sumTexts));
    setCustomChars(countCharsUtil(sumTexts));
  }, [userOutlineTexts]);

  const handleNext = () => {
    if (selected.length === 0) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Please select at least one",
        })
      );
    } else {
      setArticleOutlineTexts(selected);
      onNext();
    }
  };

  const handleOutlines = (e: ChangeEvent<HTMLInputElement>, outlineText) => {
    if (selected.some((item) => item.id === outlineText?.id)) {
      setSelected(selected.filter((item) => item.id !== outlineText?.id));
    } else {
      if (selected.length >= MAX_ROWS) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: `You can select upto ${MAX_ROWS} outlines`,
          })
        );
        return;
      }
      setSelected([...selected, outlineText]);
    }
  };

  const getCounts = (lines, flag) => {
    let sumTexts = "";
    lines?.forEach((element, index) => {
      sumTexts += (index > 0 ? " " : "") + element;
    });
    return flag === "words"
      ? countWordsUtil(sumTexts)
      : countCharsUtil(sumTexts);
  };

  return (
    <>
      <div className="sticky top-0 flex justify-between items-center py-4 px-8 bg-white z-10 ">
        <div>
          <span className="font-bold">Selected</span> : {selected?.length}/
          {MAX_ROWS}
        </div>
        <SmPinkButton className="w-20" onClick={handleNext}>
          Next
        </SmPinkButton>
      </div>
      <div className="rounded-md p-8">
        {userOutlineTexts?.length > 0 && (
          <>
            <p className="text-gray-700">Custom Outlines</p>
            <div className="my-3 p-6 pt-0 bg-white rounded-md">
              <fieldset className="space-y-5">
                <legend className="sr-only">Notifications</legend>
                {userOutlineTexts?.map((outlineText) => {
                  if (isLoading) {
                    return (
                      <SkeletonLoader
                        loaderType="line-x"
                        key={outlineText.id}
                      />
                    );
                  }
                  return (
                    <div
                      key={outlineText?.id}
                      className="text-base text-gray-700"
                    >
                      <div className="relative flex items-center">
                        <div className="flex items-center h-5">
                          <input
                            id={outlineText?.id}
                            aria-describedby="comments-description"
                            name="comments"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            checked={selected.some(
                              (item) => item.id === outlineText?.id
                            )}
                            onChange={(e) => handleOutlines(e, outlineText)}
                          />
                        </div>
                        <div className="ml-3 text-base text-gray-700 font-medium">
                          <label
                            htmlFor={outlineText?.id}
                            className="text-base text-gray-700 font-medium"
                          >
                            {outlineText?.section ?? ""}
                          </label>
                          <span
                            id="comments-description"
                            className="text-base text-gray-700 font-medium"
                          >
                            <span className="sr-only text-base text-gray-700 font-medium">
                              {outlineText?.section ?? ""}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </fieldset>
              <div className="flex justify-between items-center w-full mt-4">
                {isLoading ? (
                  <SkeletonLoader loaderType="line-x" />
                ) : (
                  <p className="font-normal text-xs text-gray-500 break-normal whitespace-pre-wrap">
                    {customWords} {t("common:words")} / {customChars}{" "}
                    {t("common:characters")}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
        <p className="text-gray-700">Generated Outlines</p>
        {lists?.map(({ id, data }) => {
          if (isLoading) {
            return <SkeletonLoader loaderType="line-x" key={id} />;
          }
          return (
            <div className="my-3 p-6 bg-white rounded-md" key={id}>
              {typeof data?.text === "object" && (
                <>
                  <fieldset className="space-y-5">
                    <legend className="sr-only">Notifications</legend>
                    {data?.text?.map((outlineText, index) => {
                      return (
                        <div
                          key={outlineText?.id}
                          className="text-base text-gray-700"
                        >
                          <div className="relative flex items-center">
                            <div className="flex items-center h-5">
                              <input
                                id={id}
                                aria-describedby={`${outlineText?.id}-description`}
                                name={outlineText?.id}
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={selected?.some(
                                  (item) => item.id === outlineText?.id
                                )}
                                onChange={(e) => handleOutlines(e, outlineText)}
                              />
                            </div>
                            <div className="ml-3 text-base text-gray-700 font-medium">
                              <label
                                htmlFor={id + index}
                                className="text-base text-gray-700 font-medium"
                              >
                                {outlineText?.section ?? ""}
                              </label>
                              <span
                                id="comments-description"
                                className="text-base text-gray-700 font-medium"
                              >
                                <span className="sr-only text-base text-gray-700 font-medium">
                                  {outlineText?.section ?? ""}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </fieldset>
                </>
              )}

              <div className="flex justify-between items-center w-full mt-4">
                <p className="font-normal text-xs text-gray-500 break-normal whitespace-pre-wrap">
                  {getCounts(data?.text, "words")} {t("common:words")} /{" "}
                  {getCounts(data?.text, "chars")} {t("common:characters")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-8 mb-8">
        <SmPinkButton className="w-full mt-5" onClick={handleNext}>
          Next
        </SmPinkButton>
      </div>
    </>
  );
};

export default CheckBoxes;
