import classNames from "classnames";
import { EditorState } from "draft-js";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Category } from "../../../../../api/category";
import { Copy } from "../../../../../api/copy";
import {
  getAllHistoryById,
  getAllHistoryPerPageById,
  History,
} from "../../../../../api/history";
import { initArticleWriter } from "../../../../../store/articleWriter/actions";
import { setHistory } from "../../../../../store/template/actions";
import { cancelRequest } from "../../../../../utils/authRequest";
import Overlay from "../../../overlay";
import Progress from "./progress/index";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";

export const ARTICLE_TITLE_CONTENT_TYPE_NAME = "blog-ideas";
export const ARTICLE_INTRO_CONTENT_TYPE_NAME = "blog-intros";
export const ARTICLE_OUTLINE_CONTENT_TYPE_NAME = "blog-outlines";

export interface BaseStepProps {
  userId: string;
  // content type
  contentTypeName: string;
  // change step top bar
  onChangeStep: Function;
  // language
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  // check if generating copies
  generatingCopies: boolean;
  // ads
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
  //
  categories?: Category[];
  //
  leftCredits?: number;
  // step1
  articleTitleHistory: History;
  setArticleTitleHistory: React.Dispatch<React.SetStateAction<History>>;
  // step2
  articleIntroHistory: History;
  setArticleIntroHistory: React.Dispatch<React.SetStateAction<History>>;
  // step3
  articleOutlineHistory: History;
  updateArticleOutlineHistory: (history: History) => void;
  //
  getHistory: ({
    id,
    contentName,
    page,
    setHistoryState,
  }: {
    id: string;
    contentName: string;
    page: number;
    setHistoryState: (
      history: History
    ) => void | React.Dispatch<React.SetStateAction<History>>;
  }) => Promise<History>;
  // pagination
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  // selected Copy
  articleTitle: Copy;
  articleIntro: Copy;
  articleOutline: Copy;
  setIsSavingCopyId: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ArticleOutlineText {
  id: string;
  section: string;
}

interface AiArticleWriterV2Props {
  copies: [];
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
  subHistories: History[];
}

const AiArticleWriterV2: React.FC<AiArticleWriterV2Props> = ({
  copies,
  isAdblockCheckComplete,
  isAdblockerDetected,
  subHistories,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const { projectId, teamId, customerId, contentType, filter, historyId } =
    router.query;
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0);
  const [out, fadeOut] = useState(false);

  const [language, setLanguage] = useState<string>("en");
  const [isSavingCopyId, setIsSavingCopyId] = useState<boolean>(false);
  // article title
  const [articleTitleHistory, setArticleTitleHistory] = useState<History>(null);
  const [articleTitle, setArticleTitle] = useState<Copy>(null);
  const [currentPageStep1, setCurrentPageStep1] = useState<number>(1);
  // article intro
  const [articleIntroHistory, setArticleIntroHistory] = useState<History>(null);
  const [articleIntro, setArticleIntro] = useState<Copy>(null);
  const [currentPageStep2, setCurrentPageStep2] = useState<number>(1);
  // article outline
  const [articleOutlineHistory, setArticleOutlineHistory] =
    useState<History>(null);
  const [articleOutline, setArticleOutline] = useState<Copy>(null);
  const [outlinesToggle, setOutlinesToggle] = useState<boolean>(false);
  const [currentPageStep3, setCurrentPageStep3] = useState<number>(1);
  // article writer
  const [articleTitleText, setArticleTitleText] = useState<string>("");
  const [articleIntroText, setArticleIntroText] = useState<string>("");
  const [articleOutlineTexts, setArticleOutlineTexts] = useState<
    ArticleOutlineText[]
  >([{ id: uuidv4(), section: "" }]);
  const [currentPageStep4, setCurrentPageStep4] = useState<number>(1);
  const [currentCopyIndex, setCurrentCopyIndex] = useState<number>(0);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [isDirtyEditor, setIsDirtyEditor] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const getHistory = useCallback(
    ({
      id,
      contentName,
      page,
      setHistoryState,
    }: {
      id: string;
      contentName: string;
      page: number;
      setHistoryState: (
        history: History
      ) => void | React.Dispatch<React.SetStateAction<History>>;
    }): Promise<History> => {
      return new Promise(async (resolve, reject) => {
        try {
          const history = await getAllHistoryPerPageById({
            historyId: id,
            projectId,
            contentName,
            customerId,
            teamId,
            page,
            isSubHistory: true,
          });
          setHistoryState(history);
          resolve(history);
        } catch (err) {
          reject(err);
        }
      });
    },
    [customerId, projectId, teamId]
  );

  const updateArticleOutlineHistory = (history: History) => {
    if (history?.copies?.items?.length) {
      const newItems = history.copies.items.map((item) => {
        let sections = [];
        if (typeof item?.data?.text === "string") {
          item?.data?.text?.split("\n").forEach((section) => {
            if (
              section.includes("Section ") ||
              section.includes("Subsection ")
            ) {
              section = section.substring(section.indexOf(": ") + 2);
            }
            if (section) {
              sections.push({ id: uuidv4(), section });
            }
          });
        }
        if (sections.length) {
          return { ...item, data: { ...item.data, text: sections } };
        } else {
          return item;
        }
      });
      setArticleOutlineHistory({
        ...history,
        copies: { ...history.copies, items: newItems },
      });
    } else {
      setArticleOutlineHistory(history);
    }
  };

  const initialize = useCallback(
    async (histories: History[]) => {
      return new Promise((resolve, reject) => {
        const promises = [];
        histories.forEach(({ id, content_type }) => {
          switch (content_type?.content_name) {
            case ARTICLE_TITLE_CONTENT_TYPE_NAME:
              promises.push(
                getHistory({
                  id,
                  contentName: content_type?.content_name,
                  page: 1,
                  setHistoryState: setArticleTitleHistory,
                })
              );
              break;
            case ARTICLE_INTRO_CONTENT_TYPE_NAME:
              promises.push(
                getHistory({
                  id,
                  contentName: content_type?.content_name,
                  page: 1,
                  setHistoryState: setArticleIntroHistory,
                })
              );
              break;
            case ARTICLE_OUTLINE_CONTENT_TYPE_NAME:
              promises.push(
                getHistory({
                  id,
                  contentName: content_type?.content_name,
                  page: 1,
                  setHistoryState: updateArticleOutlineHistory,
                })
              );
          }
        });
        Promise.all(promises)
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      });
    },
    [getHistory]
  );

  useEffect(() => {
    // initialize
    initialize(subHistories)
      .catch((err) => {})
      .finally(() => {
        if (mounted.current) {
          setIsInitialized(true);
        }
      });
  }, [initialize, subHistories]);

  const onChangeStep = (target: number) => {
    if (target === step) {
      return;
    }
    cancelRequest();
    fadeOut(true);
    const id = setTimeout(() => {
      setStep(target);
      fadeOut(false);
    }, 300);
  };

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      //  reset the template inputs on going back
      dispatch(initArticleWriter());

      return true;
    });
  }, [router, dispatch]);

  useEffect(() => {
    if (copies?.length) {
      setStep(3);
    } else {
      setStep(0);
    }
  }, [copies?.length]);

  // set selected title
  useEffect(() => {
    if (articleTitleHistory) {
      setArticleTitle(
        articleTitleHistory?.copies?.items?.find(
          ({ id }) => id === articleTitleHistory.selected_output_data_id
        )
      );
    }
  }, [articleTitleHistory]);
  // set selected intro
  useEffect(() => {
    if (articleIntroHistory) {
      setArticleIntro(
        articleIntroHistory?.copies?.items?.find(
          ({ id }) => id === articleIntroHistory.selected_output_data_id
        )
      );
    }
  }, [articleIntroHistory]);
  // set selected outline
  useEffect(() => {
    if (articleOutlineHistory) {
      const copy = articleOutlineHistory?.copies?.items?.find(
        ({ id }) => id === articleOutlineHistory.selected_output_data_id
      );
      setArticleOutline(copy);
      if (!copies?.length && copy) {
        setArticleOutlineTexts(copy?.data?.text);
      }
    }
  }, [articleOutlineHistory, copies?.length]);

  useEffect(() => {
    if (step <= 2 || !isDirtyEditor) {
      return;
    }
    getAllHistoryById({
      historyId,
      projectId,
      contentName: contentType,
      page: 1,
      customerId,
      teamId,
    })
      .then((res) => {
        dispatch(setHistory(res));
      })
      .catch((err) => {});
  }, [
    contentType,
    customerId,
    dispatch,
    historyId,
    isDirtyEditor,
    projectId,
    step,
    teamId,
  ]);

  const commonProps = {
    onChangeStep,
    language,
    setLanguage,
    isAdblockCheckComplete,
    isAdblockerDetected,
    articleTitleHistory,
    setArticleTitleHistory,
    articleIntroHistory,
    setArticleIntroHistory,
    articleOutlineHistory,
    updateArticleOutlineHistory,
    getHistory,
    articleTitle,
    articleIntro,
    articleOutline,
    setIsSavingCopyId,
  };

  return (
    <>
      <Progress
        isInitialized={isInitialized}
        isSavingCopyId={isSavingCopyId}
        articleTitleHistory={articleTitleHistory}
        articleIntroHistory={articleIntroHistory}
        articleOutlineHistory={articleOutlineHistory}
        step={step}
        onChangeStep={onChangeStep}
      />
      <main
        className={classNames(
          "md:grid grid-cols-1 md:grid-cols-3 overflow-y-auto auto-cols-min flex-1 relative",
          out
            ? "transition-all duration-300 transform -translate-x-2/3 scale-50 opacity-0"
            : "transition-opacity duration-500 opacity-100"
        )}
      >
        {step === 0 && (
          <Step1
            contentTypeName={ARTICLE_TITLE_CONTENT_TYPE_NAME}
            setArticleTitle={setArticleTitle}
            currentPage={currentPageStep1}
            setCurrentPage={setCurrentPageStep1}
            {...commonProps}
          />
        )}
        {step === 1 && (
          <Step2
            contentTypeName={ARTICLE_INTRO_CONTENT_TYPE_NAME}
            setArticleIntro={setArticleIntro}
            currentPage={currentPageStep2}
            setCurrentPage={setCurrentPageStep2}
            {...commonProps}
          />
        )}
        {step === 2 && (
          <Step3
            contentTypeName={ARTICLE_OUTLINE_CONTENT_TYPE_NAME}
            setArticleOutline={setArticleOutline}
            currentPage={currentPageStep3}
            setCurrentPage={setCurrentPageStep3}
            outlinesToggle={outlinesToggle}
            setOutlinesToggle={setOutlinesToggle}
            articleOutlineTexts={articleOutlineTexts}
            setArticleOutlineTexts={setArticleOutlineTexts}
            {...commonProps}
          />
        )}
        {step > 2 && (
          <Step4
            contentTypeName={
              typeof contentType === "string"
                ? contentType
                : "ai-article-writer-v2"
            }
            setArticleOutline={setArticleOutline}
            articleTitleText={articleTitleText}
            setArticleTitleText={setArticleTitleText}
            articleIntroText={articleIntroText}
            setArticleIntroText={setArticleIntroText}
            articleOutlineTexts={articleOutlineTexts}
            setArticleOutlineTexts={setArticleOutlineTexts}
            currentPage={currentPageStep4}
            setCurrentPage={setCurrentPageStep4}
            currentCopyIndex={currentCopyIndex}
            setCurrentCopyIndex={setCurrentCopyIndex}
            editorState={editorState}
            setEditorState={setEditorState}
            setIsDirtyEditor={setIsDirtyEditor}
            {...commonProps}
          />
        )}
        <Overlay isShowing={!isInitialized || isSavingCopyId} hideLoader />
      </main>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    copies: state?.template?.copies ?? [],
    subHistories: state?.template?.subHistories ?? [],
  };
};

export default connect(mapStateToProps)(AiArticleWriterV2);
