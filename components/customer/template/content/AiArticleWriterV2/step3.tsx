import { Switch } from "@headlessui/react";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  ArticleOutlineText,
  ARTICLE_OUTLINE_CONTENT_TYPE_NAME,
  BaseStepProps,
} from ".";
import { generateCopies } from "../../../../../api/content";
import { ContentType } from "../../../../../api/contentType";
import { Copy } from "../../../../../api/copy";
import { selectCopy } from "../../../../../api/history";
import useContentType from "../../../../../hooks/useContentType";
import rect_man from "../../../../../public/images/modal/rect_man.png";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { getLeftCredits } from "../../../../../store/user/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import { segmentTrack } from "../../../../../utils/segment";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import CheckBoxes from "./checkBoxes";
import Pagination from "./pagination";
import RadioBoxes from "./radioBoxes";
import Variant from "./variant";

const tips = `
  <strong>Intro Input:</strong>
  1. You can still modify your intro before generating outlines.
  2. It's important that your intro conveys a clear message of what your article is about to your audience and to Google.
  3. Include focus keywords in your intro to make it SEO-friendly.
  <strong>How to select a suitable outline for your article:</strong>
  1. The AI will generate 5 variations of the best possible outlines.
  2. Choose an outline that clearly explains what your story is all about to your audience.
  3. If you are not satisfied with the generated outlines, you can generate 5 more variants and choose the best one.
  `;

const initFormData = (): ContentFormData => {
  return {
    endPoint: "blog-outlines",
    inputs: [
      {
        name: "blog_title",
        label: "Title",
        inputType: InputType.TextInput,
        placeholder:
          "How Artificial Intelligence Will Change The World Of Copywriting",
        tooltip: "The title of your blog or article.",
        maxLength: 300,
        minLength: 2,
        required: true,
      },
      {
        name: "blog_intro",
        label: "Intro",
        inputType: InputType.TextArea,
        placeholder:
          "The possibilities of artificial intelligence (AI) seem endless. It’s predicted that AI will soon have the ability to write articles, screen movies, and even drive cars on our behalf. But what about copywriting? Can AI be the next copywriter? I’ve spent the past few weeks doing some research and experimenting, and I’ve come up with a few ideas for how AI will change the world of copywriting.",
        tooltip: "Your article or blog intro.",
        maxLength: 1500,
        minLength: 2,
        minWords: 5,
        rows: 10,
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: "Generate Outlines",
      reName: "Regenerate Outlines",
    },
  };
};

interface Step3Props extends BaseStepProps {
  setArticleOutline: React.Dispatch<React.SetStateAction<Copy>>;
  outlinesToggle: boolean;
  setOutlinesToggle: React.Dispatch<React.SetStateAction<boolean>>;
  articleOutlineTexts: ArticleOutlineText[];
  setArticleOutlineTexts: React.Dispatch<
    React.SetStateAction<ArticleOutlineText[]>
  >;
}

const Step3: React.FC<Step3Props> = ({
  setArticleOutline,
  outlinesToggle,
  setOutlinesToggle,
  articleOutlineTexts,
  setArticleOutlineTexts,
  // common
  userId,
  onChangeStep,
  language,
  setLanguage,
  generatingCopies,
  isAdblockCheckComplete,
  isAdblockerDetected,
  categories,
  leftCredits,
  articleOutlineHistory,
  updateArticleOutlineHistory,
  getHistory,
  currentPage,
  setCurrentPage,
  articleOutline,
  contentTypeName,
  setIsSavingCopyId,
}) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, projectId, historyId, customerId } = query;
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<ContentFormData>(initFormData());
  const refCopy = useRef(null);
  const [currentContentType, currentTemplate] = useContentType();
  const [contentType, setContentType] = useState<ContentType>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    categories?.forEach(({ content_types }) => {
      const cntType = content_types.find(
        ({ content_name }) => content_name === formData?.endPoint
      );
      if (cntType) {
        setContentType(cntType);
        return;
      }
    });
  }, [categories, formData?.endPoint]);

  const onChangePage = (page) => {
    setCurrentPage(page);
    getHistory({
      id: articleOutlineHistory?.id,
      contentName: contentType?.content_name,
      page,
      setHistoryState: updateArticleOutlineHistory,
    }).catch((err) => {
      setCurrentPage(1);
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    });
  };

  const onSubmit = ({ data, language }): Promise<{ success: boolean }> => {
    return new Promise(async (resolve, reject) => {
      try {
        updateArticleOutlineHistory(
          await generateCopies({
            type: ARTICLE_OUTLINE_CONTENT_TYPE_NAME,
            data,
            params: {
              project_id: projectId,
              history_id: articleOutlineHistory?.id ?? uuidv4(),
              parent_history_id: historyId,
              parent_content_type_id: currentContentType.id,
              team_id: teamId,
              language,
            },
          })
        );
        setCurrentPage(1);
        // track by segment
        window["analytics"]?.identify(userId, {
          remainingCredits: leftCredits - (contentType?.charge_credits ?? 0),
        });
        segmentTrack("Copy Generated", {
          userId,
          teamId,
          projectId,
          templateName: currentContentType?.title[locale] ?? "",
          creditCount: contentType?.charge_credits ?? 0,
          remainingCredits: leftCredits - (contentType?.charge_credits ?? 0),
        });
        // track end
        await dispatch(getLeftCredits(teamId));
        if (mounted.current && window.innerWidth < 768) {
          refCopy.current.scrollIntoView();
        }
        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  };

  const setToggle = () => {
    setOutlinesToggle(!outlinesToggle);
  };

  useEffect(() => {
    setOutlinesToggle(
      (!articleOutlineHistory?.copies?.items?.length &&
        articleOutlineTexts?.some(({ section }) => section)) ||
        (!!articleOutlineHistory?.copies?.items?.length &&
          !articleOutline &&
          articleOutlineTexts?.some(({ section }) => section))
    );
  }, [
    articleOutline,
    articleOutlineHistory?.copies?.items?.length,
    articleOutlineTexts,
    setOutlinesToggle,
  ]);

  const isSwitchDisable = !articleOutlineHistory?.copies?.items?.length;
  !articleOutlineTexts?.some(({ section }) => !section);

  const handleNext = async (copy?: Copy) => {
    try {
      setIsSavingCopyId(true);
      await selectCopy({
        teamId,
        projectId,
        historyId: articleOutlineHistory?.id,
        customerId,
        selectedOutputDataId: copy?.id,
      });
      if (copy) {
        setArticleOutline(copy);
        setArticleOutlineTexts(copy?.data?.text);
      } else {
        setArticleOutline(null);
      }
      onChangeStep(3);
    } catch (err) {
    } finally {
      if (mounted.current) {
        setIsSavingCopyId(false);
      }
    }
  };

  return (
    <>
      <section className="flex flex-col col-span-1 border-r border-solid overflow-y-auto">
        <ContentInputs
          formData={formData}
          onSubmit={onSubmit}
          tips={tips}
          initInputsFromParent={articleOutlineHistory?.inputs_data}
          initLanguage={language}
          onChangeLanguage={setLanguage}
          isAdblockCheckComplete={isAdblockCheckComplete}
          isAdblockerDetected={isAdblockerDetected}
        />
      </section>

      <section
        className="col-span-2 flex-1 relative bg-root flex flex-col rounded-b-lg md:round-r-lg overflow-x-hidden overflow-y-hidden relative"
        ref={refCopy}
      >
        {(!!articleOutlineHistory?.copies?.items?.length ||
          articleOutlineTexts?.some(({ section }) => section)) && (
          <Switch.Group
            as="div"
            className="sticky top-0 bg-white z-10 px-8 py-4 flex items-center"
          >
            <Switch
              checked={outlinesToggle}
              onChange={setToggle}
              className={classNames(
                isSwitchDisable
                  ? "bg-indigo-300"
                  : outlinesToggle
                  ? "bg-indigo-600"
                  : "bg-gray-200",
                "relative inline-flex flex-shrink-0 h-5.5 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              )}
              disabled={isSwitchDisable}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  outlinesToggle ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              />
            </Switch>
            <Switch.Label as="span" className="ml-3">
              <span className="text-sm font-medium text-gray-900">
                Select Individual Outlines{" "}
              </span>
            </Switch.Label>
          </Switch.Group>
        )}
        <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
          <Variant
            isEmpty={
              !articleOutlineHistory?.copies?.items?.length &&
              !articleOutlineTexts?.some(({ section }) => section)
            }
            emptyImage={
              <Image src={rect_man} width={160} height={160} alt="rect_man" />
            }
            content={
              <div className={outlinesToggle ? "" : "p-8"}>
                {outlinesToggle ? (
                  <>
                    <CheckBoxes
                      lists={articleOutlineHistory?.copies?.items ?? []}
                      articleOutlineTexts={articleOutlineTexts}
                      setArticleOutlineTexts={setArticleOutlineTexts}
                      onNext={handleNext}
                      isLoading={generatingCopies}
                    />
                  </>
                ) : (
                  <RadioBoxes
                    userId={userId}
                    currentContentType={currentContentType}
                    history={articleOutlineHistory}
                    setHistory={updateArticleOutlineHistory}
                    onNext={handleNext}
                    selectedCopy={articleOutline}
                    contentTypeName={contentTypeName}
                    isLoading={generatingCopies}
                  />
                )}
              </div>
            }
          />
        </div>
        <Pagination
          total={articleOutlineHistory?.copies?.total}
          size={articleOutlineHistory?.copies?.size}
          currentPage={currentPage}
          onChange={onChangePage}
        />
        {/* <Overlay isShowing={generatingCopies} hideLoader /> */}
      </section>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    generatingCopies: state?.template?.generatingCopy,
    userId: state?.user?.id,
    categories: state.main?.categories,
    leftCredits:
      (state.user?.credits?.one_time_credits ?? 0) +
      (state.user?.credits?.recurring_credits ?? 0) +
      (state.user?.credits?.lifetime_deal_credits ?? 0) +
      (state.user?.credits?.reward_credits ?? 0),
  };
};

export default connect(mapStateToPros)(Step3);
