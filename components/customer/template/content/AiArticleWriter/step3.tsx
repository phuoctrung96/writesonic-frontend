import { InformationCircleIcon, TrashIcon } from "@heroicons/react/outline";
import { BookmarkIcon, PlusIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Copy } from "../../../../../api/copy";
import { changeTitle } from "../../../../../api/history";
import templates from "../../../../../data/templates";
import useContentType from "../../../../../hooks/useContentType";
import plane_man from "../../../../../public/images/modal/plane_man.png";
import {
  setArticleOutline,
  setArticleTitle,
} from "../../../../../store/articleWriter/actions";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import {
  createCopies,
  saveCopy as saveCopyAction,
  setIsGeneratingCopy,
  unSaveCopy as unSaveCopyAction,
} from "../../../../../store/template/actions";
import { getLeftCredits } from "../../../../../store/user/actions";
import exportQuillToDocx from "../../../../../utils/exportQuillToDocx";
import { getQuillContent } from "../../../../../utils/getQuillContent";
import { segmentTrack } from "../../../../../utils/segment";
import ActionButton from "../../../../buttons/actionButton";
import GenerateButton from "../../../../buttons/generateButton";
import CountTextArea from "../../../../countTextArea";
import CountTextInput from "../../../../countTextInput";
import ToolTip from "../../../../tooltip/muiToolTip";
import Overlay from "../../../overlay";
import AlertRegenerateModal from "./alertReGenerateModal";
import Editor, { QuillContentInput } from "./editor";
import Empty from "./empty";

interface Step3Props {
  articleTitle: string;
  intro: string;
  articleOutline: string[];
  inputs: { [key: string]: any };
  copies: Copy[];
  generatingCopies: boolean;
  userId: string;
  quill: any;
  subscription?: any;
}

const Step3: React.FC<Step3Props> = ({
  articleTitle,
  intro,
  articleOutline,
  inputs,
  copies,
  generatingCopies,
  userId,
  quill,
  subscription,
}) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, historyId, projectId, customerId, contentType } = query;
  const dispatch = useDispatch();
  const [articleIntro, setArticleIntro] = useState<string>(intro);
  const [titleError, setTitleError] = useState<string>("");
  const [introError, setIntroError] = useState<string>("");
  const [isSaving, setSaving] = useState(false);
  const [content, setContent] =
    useState<{ isDelta: boolean; data: QuillContentInput[] | any }>(null);
  const [numCredits, setNumCredits] = useState<number>(0);
  const [isOpenAlertModal, setIsOpenAlertModal] = useState<boolean>(false);
  const [currentContentType, currentTemplate] = useContentType();
  const [isRenderedQuill, setIsRenderedQuill] = useState<boolean>(false);

  const myRef = useRef(null);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const changeOutlineSection = (value: string, index: number) => {
    let updated = [...articleOutline];
    updated[index] = value;
    dispatch(setArticleOutline(updated));
  };

  const removeOutlineSection = (index: number) => {
    dispatch(
      setArticleOutline(articleOutline.filter((outline, idx) => idx != index))
    );
  };

  const videoLinkID = templates?.find(({ key, videoUrlID }) => {
    if (key === contentType) {
      return videoUrlID;
    } else {
      return null;
    }
  });

  // useHotkeys(
  //   hotKeyMaps,
  //   () => {
  //     if (generatingCopies) {
  //       return;
  //     }
  //     handleGenerate();
  //   },
  //   hotKeyOption,
  //   [generatingCopies, articleTitle, articleIntro]
  // );

  const addOutlineSection = () => {
    dispatch(setArticleOutline([...articleOutline, ""]));
  };

  const callGenerateCopies = useCallback(async () => {
    try {
      dispatch(setIsGeneratingCopy(true));
      await dispatch(
        createCopies({
          type: "ai-article-writer",
          data: {
            title: articleTitle,
            article_title: articleTitle,
            article_intro: articleIntro,
            article_sections: articleOutline,
          },
          teamId,
          userId,
          projectId,
          historyId,
          creditCount: numCredits,
          templateName: currentContentType?.title[locale],
          wantToRemoveOldCopies: true,
          customerId,
          paginate: false,
          language: "en",
          subscription,
          router,
        })
      );
      await dispatch(getLeftCredits(teamId));
      if (mounted.current) {
        if (window.innerWidth < 768) {
          myRef.current.scrollIntoView();
        }
        setIsRenderedQuill(false);
      }
    } catch (err) {
    } finally {
      if (mounted.current) {
        dispatch(setIsGeneratingCopy(false));
      }
    }
  }, [
    articleIntro,
    articleOutline,
    articleTitle,
    currentContentType?.title,
    customerId,
    dispatch,
    historyId,
    locale,
    numCredits,
    projectId,
    teamId,
    userId,
    subscription,
    router,
  ]);

  const handleGenerate = useCallback(async () => {
    setTitleError("");
    setIntroError("");
    let validate = true;
    if (!articleTitle) {
      setTitleError("Please insert a title");
      validate = false;
    }
    if (!articleIntro) {
      setIntroError("Please insert an intro");
      validate = false;
    }
    articleOutline.forEach((outline) => {
      if (!outline) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: "Please remove empty inputs or insert sections",
          })
        );
        validate = false;
      }
    });
    if (!validate) {
      return;
    }

    if (copies?.length > 0) {
      setIsOpenAlertModal(true);
      return;
    }

    callGenerateCopies();
  }, [
    articleIntro,
    articleOutline,
    articleTitle,
    callGenerateCopies,
    copies?.length,
    dispatch,
  ]);

  const handleHotkey = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  useEffect(() => {
    setNumCredits(Math.round(articleOutline?.length * 0.5));
  }, [articleOutline]);

  useEffect(() => {
    if (inputs && !articleTitle && !articleIntro) {
      const article_title = inputs["article_title"];
      const article_intro = inputs["article_intro"];
      const article_sections = inputs["article_sections"];
      dispatch(setArticleTitle(article_title));
      setArticleIntro(article_intro);
      dispatch(setArticleOutline(article_sections));
    }
  }, [articleIntro, articleTitle, dispatch, inputs]);

  useEffect(() => {
    if (historyId && articleTitle) {
      try {
        changeTitle({
          historyId: historyId,
          title: articleTitle,
          projectId,
          customerId,
          teamId,
        });
      } catch (err) {}
    }
  }, [articleTitle, historyId, customerId, projectId, teamId]);

  useEffect(() => {
    if (!copies?.length || !copies[0].data || isRenderedQuill) {
      return;
    }
    setContent(
      getQuillContent({ copyData: copies[0]?.data, articleTitle, articleIntro })
    );
    setIsRenderedQuill(true);
  }, [copies, articleTitle, articleIntro, isRenderedQuill]);

  const handleDownload = async () => {
    if (!quill) {
      return;
    }

    try {
      const fileName = articleTitle
        ? articleTitle?.toLowerCase()?.replaceAll(" ", "_")
        : Math.floor(Date.now() / 1000).toString();

      await exportQuillToDocx(quill, fileName);
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
    if (copies[0].is_saved) {
      await unSaveCopy();
    } else {
      await saveCopy();
    }
    setSaving(false);
  };

  const saveCopy = async () => {
    try {
      await dispatch(
        saveCopyAction({ copyId: copies[0].id, teamId, historyId, customerId })
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
          copyId: copies[0].id,
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
                value={articleTitle}
                onChange={(value) => {
                  dispatch(setArticleTitle(value));
                }}
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
                value={articleIntro}
                onChange={(value) => setArticleIntro(value)}
                error={introError}
                label="Article Intro"
                tooltip="Your article or blog intro."
                placeholder="The possibilities of artificial intelligence (AI) seem endless. It’s predicted that AI will soon have the ability to write articles, screen movies, and even drive cars on our behalf. But what about copywriting? Can AI be the next copywriter? I’ve spent the past few weeks doing some research and experimenting, and I’ve come up with a few ideas for how AI will change the world of copywriting."
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
              {articleOutline?.map((outline, index) => (
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
              ))}
              {articleOutline?.length < 10 && (
                <PlusIcon
                  className={classNames(
                    "w-5 h-5 ml-auto my-4 text-gray-500 hover:text-gray-700 cursor-pointer",
                    generatingCopies ? "invisible" : ""
                  )}
                  onClick={addOutlineSection}
                />
              )}
            </div>
          </div>
          <div className="sm:col-span-3 mt-auto">
            {/* <ToolTip
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
              position={Position.top}
            > */}
            <GenerateButton
              onClick={handleGenerate}
              name="Write an Article"
              reName="Write an Article Again"
              onceGenerated={copies?.length > 0}
              disabled={generatingCopies}
              numCredits={numCredits}
            />
            {/* </ToolTip> */}
          </div>
        </div>
      </section>
      <section
        className="col-span-2 flex-1 relative bg-root flex flex-col rounded-b-lg md:round-r-lg overflow-x-hidden overflow-y-auto"
        ref={myRef}
      >
        <div className="flex justify-between items-center border-b">
          {/* <div className="hidden md:block ml-3 py-4">
            <Banner />
          </div> */}
          {copies && copies?.length > 0 && (
            <div className="mt-1 sm:mt-0 p-2 flex justify-end items-center relative min-w-max ml-auto">
              <ActionButton
                onClick={handleSave}
                isLoading={isSaving}
                disabled={generatingCopies}
              >
                <BookmarkIcon
                  className={`${
                    copies !== null && copies[0].is_saved
                      ? "text-yellow-400"
                      : "text-gray-700"
                  } w-5 h-5`}
                />
              </ActionButton>
              <ActionButton
                className="ml-1"
                onClick={handleDownload}
                disabled={generatingCopies}
              >
                Download
              </ActionButton>
            </div>
          )}
        </div>
        {copies && copies?.length > 0 ? (
          <>
            <div className="m-3">
              <Editor
                copyId={copies[0]?.id}
                content={content}
                isLoading={generatingCopies}
                handleHotkey={handleHotkey}
              />
            </div>
          </>
        ) : (
          <Empty
            image={
              <Image src={plane_man} width={160} height={160} alt="rect_man" />
            }
            className="transition-all duration-400 transform opacity-100"
            videoId={videoLinkID ? videoLinkID.videoUrlID : null}
          />
        )}
        <Overlay isShowing={generatingCopies} hideLoader />
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
    languages: state?.options?.languages,
    title: state?.template?.title ?? "",
    isLiked: state?.template?.isLiked ? state?.template?.isLiked : false,
    inputs: state?.template?.inputs,
    articleTitle: state?.articleWriter?.articleTitle ?? "",
    articleOutline: state?.articleWriter?.articleOutline ?? [],
    copies: state?.template?.copies,
    category: state.main?.categories,
    generatingCopies: state.template?.generatingCopy,
    userId: state.user?.id,
    quill: state.articleWriter?.quill,
    subscription: state?.user?.subscription,
  };
};

export default connect(mapStateToPros)(Step3);
