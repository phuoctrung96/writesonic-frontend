import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  ViewListIcon,
} from "@heroicons/react/outline";
import {
  BookmarkIcon,
  LightBulbIcon,
  MinusSmIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Options, useHotkeys } from "react-hotkeys-hook";
import { connect, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { ArticleOutlineText, BaseStepProps } from ".";
import { Copy } from "../../../../../api/copy";
import { changeTitle, saveAiArticleWriter } from "../../../../../api/history";
import { postContentToWordpress } from "../../../../../api/thirdparty";
import templates from "../../../../../data/templates";
import useContentType from "../../../../../hooks/useContentType";
import plane_man from "../../../../../public/images/modal/plane_man.png";
import wordpressBlue from "../../../../../public/images/wordpress-blue.svg";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import {
  createCopies,
  editCopy,
  getCopies,
  saveCopy as saveCopyAction,
  setIsGeneratingCopy,
  unSaveCopy as unSaveCopyAction,
} from "../../../../../store/template/actions";
import { getLeftCredits } from "../../../../../store/user/actions";
import { showBeaconMessage } from "../../../../../utils/beaconMessage";
import exportDraftEditorToDocx from "../../../../../utils/exportDraftEditorToDocx";
import { getDraftEditorContent } from "../../../../../utils/getDraftEditorContent";
import { segmentTrack } from "../../../../../utils/segment";
import ActionButton from "../../../../buttons/actionButton";
import GenerateButton from "../../../../buttons/generateButton";
import NavigationButton from "../../../../buttons/navigationButton";
import CountTextArea from "../../../../countTextArea";
import CountTextInput from "../../../../countTextInput";
import Rating from "../../../../rating";
import ToolTip from "../../../../tooltip/muiToolTip";
import AlertModal from "../../../modals/alertModal";
import SuccessModal from "../../../modals/successModal";
import Overlay from "../../../overlay";
import LanguageDropDown from "../languageDropDown";
import TipsModal from "../tipsModal";
import AlertRegenerateModal from "./alertReGenerateModal";
// import Banner from "./banner";
import Editor, { QuillContentInput } from "./editor";
import Empty from "./empty";

// export const hotKeyMaps = "ctrl+enter, command+enter";
export const hotKeyMaps = "ctrl+enter, command+enter";
export const hotKeyOption: Options = {
  enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
};

const tips = `
<strong>Outline Input:</strong>
1. You can still modify your title, intro, and outline before generating the article.
2. Your chosen outlines should clearly reflect the content in the body and include high-intent keywords keeping your target audience in mind.
3. You should have outlines that are at least 5-6 words in length and self-explanatory.
4. Create new sections to address all aspects of your topic.
5. You might include Conclusion as the last section if AI didn't suggest it.
6. Your article can have up to 10 sections.
<strong>Generated draft article:</strong>
1. After generating your draft article, polish it by making necessary changes such as correcting facts to ensure that it is relevant.
`;

interface Step4Props extends BaseStepProps {
  inputs: { [key: string]: any };
  copies: Copy[];
  subscription: string;
  setArticleOutline: React.Dispatch<React.SetStateAction<Copy>>;
  articleTitleText: string;
  setArticleTitleText: React.Dispatch<React.SetStateAction<string>>;
  articleIntroText: string;
  setArticleIntroText: React.Dispatch<React.SetStateAction<string>>;
  articleOutlineTexts: ArticleOutlineText[];
  setArticleOutlineTexts: React.Dispatch<
    React.SetStateAction<ArticleOutlineText[]>
  >;
  currentCopyIndex: number;
  setCurrentCopyIndex: (value: React.SetStateAction<number>) => void;
  loadingCopies: boolean;
  isAuthenticatedByWordpress?: boolean;
  editorState: EditorState;
  setEditorState: Dispatch<any>;
  setIsDirtyEditor: React.Dispatch<React.SetStateAction<boolean>>;
}

const Step4: React.FC<Step4Props> = ({
  inputs,
  copies,
  subscription,
  setArticleOutline,
  articleTitleText,
  setArticleTitleText,
  articleIntroText,
  setArticleIntroText,
  articleOutlineTexts,
  setArticleOutlineTexts,
  currentCopyIndex,
  setCurrentCopyIndex,
  editorState,
  setEditorState,
  setIsDirtyEditor,
  // common
  userId,
  language,
  setLanguage,
  generatingCopies,
  articleTitle,
  articleIntro,
  loadingCopies,
  isAuthenticatedByWordpress,
}) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, historyId, projectId, customerId, contentType, filter } =
    query;
  const dispatch = useDispatch();
  const [titleError, setTitleError] = useState<string>("");
  const [introError, setIntroError] = useState<string>("");
  const [outlineError, setOutlineError] = useState<string>("");
  const [isSaving, setSaving] = useState(false);
  const [isPublishing, setPublishing] = useState<boolean>(false);
  const [content, setContent] =
    useState<{ isDelta: boolean; data: QuillContentInput[] | any }>(null);
  const [numCredits, setNumCredits] = useState<number>(0);
  const [isOpenAlertModal, setIsOpenAlertModal] = useState<boolean>(false);
  const [currentContentType, currentTemplate] = useContentType();
  const [isShowTipsModal, setIsShowTipsModal] = useState<boolean>(false);
  const [isOpenWordpressLoginModal, setIsOpenWordpressLoginModal] =
    useState<boolean>(false);
  const [isOpenWordpressSuccessModal, setIsOpenWordpressSuccessModal] =
    useState<boolean>(false);
  const [wordpressPostURL, setWordpressPostURL] = useState<string>("");
  const [rating, setRating] = useState<number>(2);
  const myRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // init inputs
  useEffect(() => {
    if (articleTitle) {
      setArticleTitleText(articleTitle?.data?.text ?? "");
    }
  }, [articleTitle, setArticleTitleText]);

  useEffect(() => {
    if (articleIntro) {
      setArticleIntroText(articleIntro?.data?.text ?? "");
    }
  }, [articleIntro, setArticleIntroText]);

  // drag sections
  const changeOutlineSection = (value: string, index: number) => {
    setArticleOutlineTexts(
      articleOutlineTexts.map((outLine, idx) =>
        idx === index ? { ...outLine, section: value } : outLine
      )
    );
    setArticleOutline(null);
  };
  // remove section
  const removeOutlineSection = (index: number) => {
    setArticleOutlineTexts(
      articleOutlineTexts.filter((text, idx) => idx != index)
    );
    setArticleOutline(null);
  };
  // add section
  const addOutlineSection = (index: number) => {
    setArticleOutlineTexts([
      ...articleOutlineTexts.slice(0, index),
      { id: uuidv4(), section: "" },
      ...articleOutlineTexts.slice(index),
    ]);
    setArticleOutline(null);
  };

  // change order of sections
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newItems = [...articleOutlineTexts];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setArticleOutlineTexts(newItems);
    setArticleOutline(null);
  };

  const videoLinkID = templates?.find(({ key, videoUrlID }) => {
    if (key === contentType) {
      return videoUrlID;
    } else {
      return null;
    }
  });

  const callGenerateCopies = useCallback(async () => {
    try {
      dispatch(setIsGeneratingCopy(true));
      await dispatch(
        createCopies({
          type:
            currentContentType?.title["en"] === "AI Article Writer 2.0"
              ? "ai-article-writer-v2"
              : "ai-article-writer-v3",
          data: {
            title: articleTitleText,
            article_title: articleTitleText,
            article_intro: articleIntroText,
            article_sections: articleOutlineTexts?.map(
              ({ id, section }) => section
            ),
          },
          teamId,
          userId,
          creditCount: numCredits,
          projectId,
          historyId,
          language,
          templateName: currentContentType?.title[locale],
          customerId,
          paginate: false,
          subscription,
          router,
        })
      );
      await dispatch(getLeftCredits(teamId));
      if (mounted.current) {
        setCurrentCopyIndex(0);
        if (window.innerWidth < 768) {
          myRef.current.scrollIntoView();
        }

        // Feedback cookie is incremented and checked every generation to open Beacon
        if (
          currentContentType?.title["en"] === "AI Article Writer 3.0 (Beta)"
        ) {
          let feedbackCookie = Cookies.get("feedback");

          if (feedbackCookie != undefined || feedbackCookie != null) {
            let generations = JSON.parse(feedbackCookie).generations;
            Cookies.set("feedback", { generations: generations + 1 });
            if (generations % 7 === 0) {
              showBeaconMessage(
                { subject: "AI Article Writer 3.0 Feedback" },
                "be09887d-4439-45d5-963c-d6fb6c520d3a"
              );
            }
            if (generations === 2) {
              showBeaconMessage(
                {
                  subject: "Need Expert Writing Help ?",
                  text: "Hey team, I need an expert to help polish my generated article.",
                },
                "68ba6139-3473-420a-9829-d6fd9bd55d42"
              );
            }
          } else {
            Cookies.set("feedback", { generations: 1 });
            showBeaconMessage(
              { subject: "AI Article Writer 3.0 Feedback" },
              "be09887d-4439-45d5-963c-d6fb6c520d3a"
            );
          }
        }
      }
    } catch (err) {
    } finally {
      if (mounted.current) {
        dispatch(setIsGeneratingCopy(false));
      }
    }
  }, [
    articleIntroText,
    articleOutlineTexts,
    articleTitleText,
    currentContentType?.title,
    customerId,
    dispatch,
    historyId,
    language,
    locale,
    numCredits,
    projectId,
    router,
    setCurrentCopyIndex,
    subscription,
    teamId,
    userId,
  ]);

  useEffect(() => {
    if (setArticleOutlineTexts?.length) {
      setOutlineError("");
    }
  }, [setArticleOutlineTexts?.length]);

  const handleGenerate = useCallback(async () => {
    setTitleError("");
    setIntroError("");
    setOutlineError("");
    let validate = true;
    if (!articleTitleText) {
      setTitleError("Please insert a title");
      validate = false;
    }
    if (!articleIntroText) {
      setIntroError("Please insert an intro");
      validate = false;
    }
    articleOutlineTexts.forEach(({ section }) => {
      if (!section) {
        setOutlineError("Please remove the empty outlines");
        validate = false;
        return;
      }
    });
    if (articleOutlineTexts?.length < 4) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Please add at least 4 outlines",
        })
      );
      return;
    }
    if (!validate) {
      return;
    }

    callGenerateCopies();
  }, [
    articleIntroText,
    articleOutlineTexts,
    articleTitleText,
    callGenerateCopies,
    dispatch,
  ]);

  useEffect(() => {
    setNumCredits(Math.round(articleOutlineTexts?.length));
  }, [articleOutlineTexts]);

  useHotkeys(
    // enable hotkey
    hotKeyMaps,
    () => {
      handleGenerate();
    },
    hotKeyOption,
    [handleGenerate]
  );

  useEffect(() => {
    if (
      inputs &&
      !articleTitleText &&
      !articleIntroText &&
      articleOutlineTexts.some(({ section }) => !section)
    ) {
      const { article_title, article_intro, article_sections, language } =
        inputs;
      if (article_title) {
        setArticleTitleText(article_title);
      }
      if (article_intro) {
        setArticleIntroText(article_intro);
      }
      if (article_sections) {
        setArticleOutlineTexts(
          article_sections?.map((section) => {
            return { id: uuidv4(), section };
          })
        );
      }
      if (language) {
        setLanguage(language);
      }
    }
  }, [
    articleIntroText,
    articleOutlineTexts,
    articleOutlineTexts?.length,
    articleTitleText,
    inputs,
    setArticleIntroText,
    setArticleOutlineTexts,
    setArticleTitleText,
    setLanguage,
  ]);

  useEffect(() => {
    if (historyId && articleTitleText) {
      changeTitle({
        historyId: historyId,
        title: articleTitleText,
        projectId,
        customerId,
        teamId,
      }).catch((err) => {});
    }
  }, [articleTitleText, customerId, historyId, projectId, teamId]);

  useEffect(() => {
    if (!copies?.length || !copies[currentCopyIndex]?.data) {
      return;
    }
    getDraftEditorContent({
      copyData: copies[currentCopyIndex]?.data,
      articleTitle: articleTitleText,
      articleIntro: articleIntroText,
    }).then((data) => setContent(data));
  }, [articleIntroText, articleTitleText, copies, currentCopyIndex]);

  const handleDownload = async () => {
    try {
      const fileName = articleTitleText
        ? articleTitleText?.toLowerCase()?.replaceAll(" ", "_")
        : Math.floor(Date.now() / 1000).toString();

      let options = {
        entityStyleFn: (entity) => {
          const entityType = entity.get("type").toLowerCase();
          if (entityType === "image") {
            const data = entity.getData();
            return {
              element: "img",
              attributes: {
                src: data.src,
                align: data.alignment,
                width: data.width,
              },
            };
          }
        },
      };

      let html = stateToHTML(editorState.getCurrentContent(), options);
      await exportDraftEditorToDocx(html, fileName);
      // track by segment
      segmentTrack("Copy Downloaded", {
        projectId: projectId,
        userId,
        teamId,
        templateName: currentContentType?.title[locale],
        historyId,
      });
      // track end
    } catch (err) {}
  };

  const handleSave = async () => {
    setSaving(true);
    if (copies[currentCopyIndex]?.is_saved) {
      await unSaveCopy();
    } else {
      await saveCopy();
    }
    setSaving(false);
  };

  const handleWordpressPost = async () => {
    if (isAuthenticatedByWordpress) {
      const removeTitle = content.data
        .replaceAll(/\<h1(.*)\>(.*)\<\/h1\>/g, "")
        .replaceAll(/\n|&nbsp;|&#8205;|&#160;|&ensp;|&emsp;/g, "")
        .replaceAll(/[\t ]+\</g, "<")
        .replaceAll(/\<img/g, "<img width=600 object-fit=contain");
      setPublishing(true);
      await postContentToWordpress({
        title: inputs.article_title,
        content: removeTitle,
        status: "publish",
      })
        .then((data) => {
          setIsOpenWordpressSuccessModal(true);
          setWordpressPostURL(data["short_URL"]);
        })
        .catch((err) => {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message:
                "Sorry, we weren't able to publish your copy on Wordpress.",
            })
          );
        });
      setPublishing(false);
    } else {
      setIsOpenWordpressLoginModal(true);
    }
  };

  const saveCopy = async () => {
    try {
      await dispatch(
        saveCopyAction({
          copyId: copies[currentCopyIndex]?.id,
          teamId,
          historyId,
          customerId,
        })
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
        unSaveCopyAction({
          copyId: copies[currentCopyIndex]?.id,
          teamId,
          historyId,
          customerId,
        })
      );
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Copy has been unsaved successfully.",
        })
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

  const confirmRegenerate = () => {
    callGenerateCopies();
  };

  useEffect(() => {
    setRating(copies[currentCopyIndex]?.rating ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copies[currentCopyIndex]?.rating]);

  const updateRating = async (value) => {
    setRating(value);
    try {
      await dispatch(
        editCopy({
          id: copies[currentCopyIndex]?.id,
          rating: value,
          customerId,
          teamId,
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

  const handleNextCopy = async () => {
    if (currentCopyIndex < copies?.length - 1) {
      const oldIndex = currentCopyIndex;
      setCurrentCopyIndex(currentCopyIndex + 1);
      try {
        await dispatch(
          getCopies({
            filter,
            currentPage: 1,
            historyId,
            contentType,
            projectId,
            customerId,
            teamId,
          })
        );
      } catch (err) {
        setCurrentCopyIndex(oldIndex);
      }
    }
  };

  const handlePrevCopy = async () => {
    if (currentCopyIndex > 0) {
      const oldIndex = currentCopyIndex;
      setCurrentCopyIndex(currentCopyIndex - 1);
      try {
        await dispatch(
          getCopies({
            filter,
            currentPage: 1,
            historyId,
            contentType,
            projectId,
            customerId,
            teamId,
          })
        );
      } catch (err) {
        setCurrentCopyIndex(oldIndex);
      }
    }
  };

  useEffect(() => {
    let html = stateToHTML(editorState.getCurrentContent());
    if (!html || html === "<p><br></p>" || !content || html === content?.data) {
      return;
    }
    const timeId = setTimeout(async () => {
      try {
        await saveAiArticleWriter({
          teamId,
          customerId,
          data: {
            project_id: projectId,
            history_id: historyId,
            copy_id: copies[currentCopyIndex]?.id,
            content: html,
          },
        });
        setIsDirtyEditor(true);
      } catch (err) {}
    }, 1000);
    return () => {
      clearTimeout(timeId);
    };
  }, [
    content,
    content?.data,
    copies,
    currentCopyIndex,
    customerId,
    editorState,
    historyId,
    projectId,
    setIsDirtyEditor,
    teamId,
  ]);

  return (
    <>
      <section className="flex flex-col col-span-1 border-r border-solid overflow-y-auto">
        <div className="flex-1 grid grid-cols-1 gap-y-6 gap-x-4 px-8 py-6 bg-white md:rounded-l-lg">
          {/* <div className="block md:hidden sm:col-span-3">
            <Banner />
          </div> */}
          <div className="sm:col-span-3">
            <div>
              <CountTextInput
                maxLength={300}
                value={articleTitleText}
                onChange={setArticleTitleText}
                error={titleError}
                label="Article Title"
                tooltip="The title of your blog or article."
                placeholder="How Artificial Intelligence Will Change The World Of Copywriting"
                required={true}
                disabled={generatingCopies}
              />
            </div>
            <div className="mt-6">
              <CountTextArea
                maxLength={1500}
                rows={10}
                value={articleIntroText}
                onChange={setArticleIntroText}
                error={introError}
                label="Article Intro"
                tooltip="Your article or blog intro."
                placeholder="The possibilities of artificial intelligence (AI) seem endless. It's predicted that AI will soon have the ability to write articles, screen movies, and even drive cars on our behalf. But what about copywriting? Can AI be the next copywriter? I've spent the past few weeks doing some research and experimenting, and I've come up with a few ideas for how AI will change the world of copywriting."
                required={true}
                disabled={generatingCopies}
              ></CountTextArea>
            </div>
            <div className="mt-6">
              <div className="flex items-center mb-2">
                <label className="block text-base font-medium text-gray-700">
                  {"Article Outline"}
                </label>
                <ToolTip
                  message={"The outline of your article."}
                  position="top"
                >
                  <InformationCircleIcon className="ml-1 w-4 h-4 text-gray-500" />
                </ToolTip>
              </div>
              {/* Outline without Droppable*/}
              {/* {articleOutline?.map((outline, index) => (
                <div key={index} className="mb-2 flex items-center w-full">
                  <p className="text-xs text-gray-600 mr-2 whitespace-nowrap">
                    Section {index + 1}:
                  </p>
                  <div className="w-full">
                    <CountTextInput
                      value={outline}
                      onChange={(value) => {
                        changeOutlineSection(value, index);
                      }}
                      disabled={generatingCopies}
                    />
                  </div>
                  {articleOutline?.length > 1 && (
                    <TrashIcon
                      className={classNames(
                        "w-5 h-5 ml-2 text-gray-500 hover:text-gray-700 cursor-pointer",
                        generatingCopies ? "invisible" : ""
                      )}
                      onClick={() => {
                        removeOutlineSection(index);
                      }}
                    />
                  )}
                </div>
              ))} */}
              <p className="text-xs text-gray-600 whitespace-nowrap my-2">
                You can drag and drop to rearrange sections
              </p>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {!!articleOutlineTexts &&
                        articleOutlineTexts?.map((outline, index) => {
                          return (
                            <Draggable
                              key={index}
                              draggableId={`draggable-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  key={index}
                                  className="mb-2 flex items-center w-full"
                                  ref={provided.innerRef}
                                  snapshot={snapshot}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <p className="text-xs text-gray-600 mr-2 whitespace-nowrap">
                                    <ViewListIcon
                                      width={20}
                                      height={20}
                                      className="inline"
                                    />
                                    {/* Section {index + 1}: */}
                                  </p>
                                  <div className="w-full">
                                    <CountTextArea
                                      value={outline.section}
                                      onChange={(value) => {
                                        changeOutlineSection(value, index);
                                      }}
                                      rows={1}
                                      disabled={generatingCopies}
                                      articleOutlineTexts={articleOutlineTexts}
                                    />
                                  </div>
                                  {articleOutlineTexts?.length < 10 && (
                                    <PlusIcon
                                      className={classNames(
                                        "w-6 h-6 ml-auto ml-4 text-gray-500 hover:text-gray-700 cursor-pointer",
                                        generatingCopies ? "invisible" : ""
                                      )}
                                      onClick={() => {
                                        addOutlineSection(index + 1);
                                      }}
                                    />
                                  )}
                                  {articleOutlineTexts?.length > 1 && (
                                    <MinusSmIcon
                                      className={classNames(
                                        "w-6 h-6 ml-2 text-gray-500 hover:text-gray-700 cursor-pointer",
                                        generatingCopies ? "invisible" : ""
                                      )}
                                      onClick={() => {
                                        removeOutlineSection(index);
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {outlineError && (
                <h3 className="text-base font-medium text-red-600 mt-1">
                  {outlineError}
                </h3>
              )}
              {articleOutlineTexts?.length === 0 && (
                <PlusIcon
                  className={classNames(
                    "w-5 h-5 ml-auto my-4 text-gray-500 hover:text-gray-700 cursor-pointer",
                    generatingCopies ? "invisible" : ""
                  )}
                  onClick={() => {
                    addOutlineSection(0);
                  }}
                />
              )}
            </div>
            <LanguageDropDown
              value={language ?? ""}
              onChange={setLanguage}
              disabled={generatingCopies}
            />
            <a
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-300 mt-6 cursor-pointer"
              onClick={() => setIsShowTipsModal(true)}
            >
              <LightBulbIcon
                className="-ml-0.5 mr-2 h-4 w-4"
                aria-hidden="true"
              />
              Tips
            </a>
          </div>
          <div className="sm:col-span-3 mt-auto">
            <ToolTip
              message={
                <div className="flex items-center">
                  Generate
                  <span className="h-8 flex items-center ml-5 bg-gray-700 px-2 rounded-md">
                    <svg
                      x="0px"
                      y="0px"
                      width="17px"
                      height="17px"
                      viewBox="0 0 80 80"
                      className="text-gray-100"
                    >
                      <g>
                        <path
                          fill="currentColor"
                          d="M64,48L64,48h-8V32h8c8.836,0,16-7.164,16-16S72.836,0,64,0c-8.837,0-16,7.164-16,16v8H32v-8c0-8.836-7.164-16-16-16 S0,7.164,0,16s7.164,16,16,16h8v16h-8l0,0l0,0C7.164,48,0,55.164,0,64s7.164,16,16,16c8.837,0,16-7.164,16-16l0,0v-8h16v7.98 c0,0.008-0.001,0.014-0.001,0.02c0,8.836,7.164,16,16,16s16-7.164,16-16S72.836,48.002,64,48z M64,8c4.418,0,8,3.582,8,8 s-3.582,8-8,8h-8v-8C56,11.582,59.582,8,64,8z M8,16c0-4.418,3.582-8,8-8s8,3.582,8,8v8h-8C11.582,24,8,20.417,8,16z M16,72 c-4.418,0-8-3.582-8-8s3.582-8,8-8l0,0h8v8C24,68.418,20.418,72,16,72z M32,48V32h16v16H32z M64,72c-4.418,0-8-3.582-8-8l0,0v-8 h7.999c4.418,0,8,3.582,8,8S68.418,72,64,72z"
                        />
                      </g>
                    </svg>
                  </span>
                  <span className="h-8 flex items-center ml-2 bg-gray-700 px-1.5 rounded-md">
                    Enter
                  </span>
                </div>
              }
              position="top"
            >
              <div>
                <GenerateButton
                  onClick={handleGenerate}
                  name="Write an Article"
                  reName="Write an Article Again"
                  onceGenerated={copies?.length > 0}
                  disabled={generatingCopies}
                  numCredits={numCredits}
                />
              </div>
            </ToolTip>
          </div>
        </div>
        <TipsModal
          openModal={isShowTipsModal}
          setOpenModal={setIsShowTipsModal}
          tips={tips}
        />
      </section>
      <section
        className="col-span-2 flex-1 relative bg-root flex flex-col rounded-b-lg md:round-r-lg overflow-x-hidden overflow-y-auto"
        ref={myRef}
      >
        {copies && copies?.length > 0 && (
          // (subscription === null && lifetimeDealCredits < 1 && (userRole === UserRole.member)) ? (
          //   <div className="ml-3 py-4 w-full">
          //     <Banner />
          //   </div>
          // ) : (
          <>
            <div className="flex justify-between items-center text-center border-b px-3">
              <ToolTip
                message="Rate this copy"
                position="top"
                // toolTipClassName="px-2.5 py-1"
              >
                <span>
                  <Rating value={rating} onChange={updateRating} />
                </span>
              </ToolTip>
              <div className="mt-1 sm:mt-0 py-2 flex gap-x-1 justify-end items-center relative min-w-max ml-auto">
                {/* <ActionButton
                  className="ml-1"
                  onClick={handleGoToWritingAssistant}
                  disabled={generatingCopies}
                >
                  Go To Writing Assistant
                </ActionButton> */}
                <ActionButton
                  className="ml-1 px-2.5 py-2"
                  onClick={handleWordpressPost}
                  isLoading={isPublishing}
                  disabled={generatingCopies}
                  tooltipMessage={"Publish to your Wordpress site"}
                  tooltipPosition={"top"}
                >
                  <Image
                    src={wordpressBlue}
                    alt="wordpress"
                    width={25}
                    height={25}
                  />
                </ActionButton>
                <AlertModal
                  openModal={isOpenWordpressLoginModal}
                  setOpenModal={setIsOpenWordpressLoginModal}
                  title="Integration Needed"
                  message={
                    <p>
                      This feature requires the WordPress integration.
                      <Link href="/settings/integrations">
                        <a className="underline ml-1 mr-1">Click here</a>
                      </Link>
                      to connect with your WordPress.com site.
                    </p>
                  }
                />
                <SuccessModal
                  openModal={isOpenWordpressSuccessModal}
                  setOpenModal={setIsOpenWordpressSuccessModal}
                  title={"Wordpress Publish Successful"}
                  message={
                    <p>
                      <a
                        href={wordpressPostURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <a className="underline ml-1 mr-1">Click here</a>
                      </a>
                      to view your published Wordpress article.
                    </p>
                  }
                />

                <ActionButton
                  onClick={handleSave}
                  isLoading={isSaving}
                  disabled={generatingCopies}
                >
                  <BookmarkIcon
                    className={`${
                      copies !== null && copies[currentCopyIndex]?.is_saved
                        ? "text-yellow-400"
                        : "text-gray-700"
                    } w-5 h-5`}
                  />
                </ActionButton>
                <ActionButton
                  onClick={handleDownload}
                  disabled={generatingCopies}
                >
                  Download
                </ActionButton>
                {copies && copies.length > 1 && (
                  <div className="flex items-center justify-end sm:justify-start ml-auto sm:ml-0 py-1">
                    <div>
                      <NavigationButton
                        disabled={currentCopyIndex <= 0}
                        onClick={handlePrevCopy}
                      >
                        <ChevronLeftIcon className="text-gray-3 h-5 w-5" />
                      </NavigationButton>
                    </div>
                    <div className="ml-2">
                      <NavigationButton
                        disabled={currentCopyIndex >= copies.length - 1}
                        onClick={handleNextCopy}
                      >
                        <ChevronRightIcon className="text-gray-3 h-5 w-5" />
                      </NavigationButton>
                    </div>

                    <p className="ml-3 text-gray-700 text-sm font-bold">
                      {currentCopyIndex + 1}{" "}
                      <span className="text-xs font-normal">of</span>{" "}
                      {copies && copies.length}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="text-center px-3 py-2 w-full">
              <Banner />
            </div> */}
          </>

          // )
        )}
        {copies && copies?.length > 0 ? (
          <Editor
            content={content}
            editorState={editorState}
            setEditorState={setEditorState}
            handleGenerate={handleGenerate}
          />
        ) : (
          <Empty
            image={
              <Image src={plane_man} width={160} height={160} alt="rect_man" />
            }
            className="transition-all duration-400 transform opacity-100"
            videoId={videoLinkID ? videoLinkID.videoUrlID : null}
          />
        )}
        <Overlay isShowing={generatingCopies || loadingCopies} hideLoader />
      </section>
      <AlertRegenerateModal
        isOpenModal={isOpenAlertModal}
        setIsOpenModal={setIsOpenAlertModal}
        confirmRegenerate={confirmRegenerate}
      />
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    title: state?.template?.title ?? "",
    inputs: state?.template?.inputs,
    copies: state?.template?.copies ?? [],
    category: state.main?.categories,
    generatingCopies: state.template?.generatingCopy,
    loadingCopies: state.template?.loadingCopy,
    userId: state.user?.id,
    subscription: state?.user?.subscription,
    isAuthenticatedByWordpress: state?.user?.is_authorized_by_wordpress,
  };
};

export default connect(mapStateToPros)(Step4);
