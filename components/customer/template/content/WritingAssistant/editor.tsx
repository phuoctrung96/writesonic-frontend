import { Transition } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  getAllHistoryById,
  getWritingAssistant,
  saveWritingAssistant,
} from "../../../../../api/history";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { setTitle } from "../../../../../store/template/actions";
import {
  clearVariation,
  SelectVariationHistory,
  setActiveRange,
  setCountWords,
  setCurrentRange,
  setGeneratedData,
  setIsShowPopupMenu,
  setQuill,
  setSelectVariationHistory,
} from "../../../../../store/writingAssistant/actions";
import { default as countWordsUtil } from "../../../../../utils/countWords";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import { getQuillContent } from "../../../../../utils/getQuillContent";
import rootCustomerLinks from "../../../../../utils/rootCutomerLink";
import ControllerMenu from "./controllerMenu";
import EditOverLay from "./editorOverlay";
import ProgressBar from "./formpanel/progressBar";

export const SOURCE_WRITING_ASSISTANT_DEFAULT: string = "writing-assistant";
export const SOURCE_WRITING_ASSISTANT_VARIATION: string =
  "writing-assistant-variation";
export const SOURCE_WRITING_ASSISTANT_FORMAT: string =
  "writing-assistant-format";

export const SOURCE_WRITING_ASSISTANT_SELECTION: string =
  "writing-assistant-selection";

export const SOURCE_WRITING_ASSISTANT_DELETE_TEXT: string =
  "writing-assistant-delete-text";

const UNDO: string = "UNDO";
const REDO: string = "REDO";
const EDIT: string = "EDIT";

const MAX_WORDS: number = 100;
const MIN_WORDS: number = 3;

export interface RangeInterface {
  index: number;
  length: number;
}

interface EditorProps {
  quill: any;
  activeRange: RangeInterface;
  isGeneratingVariation: boolean;
  isShowPopupMenu: boolean;
  selectVariationHistory: SelectVariationHistory[];
  title: string;
  generatingCopies: boolean;
  className?: string;
  handleHotkey: (range, context) => void;
  countWords: number;
}

const Editor: React.FC<EditorProps> = ({
  quill,
  activeRange,
  isGeneratingVariation,
  isShowPopupMenu,
  selectVariationHistory,
  title,
  generatingCopies,
  className,
  handleHotkey,
  countWords,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    historyId,
    projectId,
    teamId,
    contentType,
    customerId,
    generateCopy,
    articleWriterHistoryId,
  } = router.query;
  const QuillRef = useRef(null);
  const BlockRef = useRef(null);
  const editorRef = useRef<HTMLDivElement>();
  const [controllerStyle, setControllerStyle] =
    useState<{ [key: string]: string | number }>(null);
  const [containerCSS, setContainerCSS] = useState<string>("justify-center");
  const mounted = useRef(false);
  const [quillTrack, setQuillTrack] = useState<{
    redoLength: number;
    undoLength: number;
  }>({ redoLength: 0, undoLength: 0 });
  const [deletedSelectVariationHistory, setDeletedSelectVariation] = useState<
    SelectVariationHistory[]
  >([]);
  const [delta, setDelta] = useState(null);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);
  // initialize quill editor
  useEffect(() => {
    async function initialize() {
      // we make a dynamic import for the QuillJS, as this component is not made to work on SSR
      QuillRef.current = (await import("quill/dist/quill.min.js")).default;
      BlockRef.current = (await import("quill/blots/block.js")).default;
      const quillEditorElement = document.querySelector<HTMLElement>(
        '[data-toggle="writing-assistant-quill"]'
      );
      if (!quillEditorElement) {
        return;
      }
      // var bindings = {
      //   custom1: {
      //     key: "enter",
      //     ctrlKey: true,
      //     handler: handleHotkey,
      //   },
      //   custom2: {
      //     key: "enter",
      //     ctrlKey: true,
      //     handler: handleHotkey,
      //   },
      // };
      const quill = new QuillRef.current(quillEditorElement, {
        // modules: {
        //   keyboard: {
        //     bindings: bindings,
        //   },
        // },
        theme: "snow",
      });
      dispatch(setQuill(quill));
      const domElement = document.querySelector(
        "#writing-assistant-quill .ql-editor"
      );
    }
    initialize();

    // return () => {
    //   const elToolbars = document.querySelectorAll(".ql-toolbar");
    //   elToolbars.forEach((elToolbar) => {
    //     elToolbar.remove();
    //   });
    //   const elEditors = document.querySelectorAll(".ql-editor");
    //   elEditors.forEach((elEditor) => {
    //     elEditor.remove();
    //   });
    // };
  }, [dispatch]);

  const popupMenu = useCallback(
    (range) => {
      if (!quill || !range) {
        return;
      }
      const rangeBounds = quill.getBounds(range);
      const { left, right } = rangeBounds;
      const editorWidth = editorRef?.current?.clientWidth ?? 0;
      const OFFSET = 16;
      setContainerCSS("justify-center");
      dispatch(setIsShowPopupMenu(true));
      dispatch(setActiveRange(range));
      const windowWidth = window?.innerWidth ?? 0;
      if (windowWidth < 640) {
        setControllerStyle({
          top: 0,
        });
      } else {
        const editorHeight = quill?.editor?.scroll?.domNode?.clientHeight ?? 0;
        setControllerStyle({
          top:
            editorHeight / 2 > rangeBounds.bottom
              ? rangeBounds.bottom + 10
              : rangeBounds.bottom - rangeBounds.height - 80,
        });
      }
    },
    [dispatch, quill]
  );

  const onEditorChange = useCallback(
    (eventType, range) => {
      const updateToolTipStyle = () => {
        // reset tooltip style
        let element = document.querySelector<HTMLElement>(
          "#writing-assistant-quill .ql-tooltip"
        );
        element.style.opacity = "0";
        setTimeout(() => {
          if (!element) {
            return;
          }
          const { left, width } = window.getComputedStyle(element);
          const toolTipLeft = parseInt(left) ?? 0;
          const toolTipWidth = parseInt(width) ?? 0;
          const clientWidth = quill?.root?.clientWidth ?? 0;
          if (toolTipLeft < 0) {
            element.style.left = "1px";
          } else if (toolTipLeft + toolTipWidth > clientWidth) {
            element.style.left = `${clientWidth - toolTipWidth - 1}px`;
          }
          element.style.opacity = "1";
        }, 100);
      };

      // determine visible of popup menu
      updateToolTipStyle();

      if (eventType !== QuillRef.current.events.SELECTION_CHANGE) return;
      if (range == null) return;
      dispatch(setCurrentRange(range));
      if (range.length === 0) {
        dispatch(setIsShowPopupMenu(false));
        dispatch(setActiveRange(null));
        const [block, offset] = quill.scroll.descendant(
          BlockRef.current,
          range.index
        );
        if (
          block != null &&
          block.domNode.firstChild instanceof HTMLBRElement
        ) {
          const lineBounds = quill.getBounds(range);
          dispatch(setIsShowPopupMenu(true));
          dispatch(setActiveRange(range));
          setControllerStyle({
            top: lineBounds.top - 2,
          });
        } else {
          dispatch(setIsShowPopupMenu(false));
          dispatch(setActiveRange(null));
        }
      } else {
        const selectedText = quill.getText(range.index, range.length);
        const count = countWordsUtil(selectedText);
        if (count <= MAX_WORDS && count >= MIN_WORDS) {
          popupMenu(range);
        } else {
          dispatch(setIsShowPopupMenu(false));
          dispatch(setActiveRange(null));
        }
      }
    },
    [dispatch, popupMenu, quill]
  );

  useEffect(() => {
    if (
      !quill ||
      !QuillRef ||
      !QuillRef.current ||
      !QuillRef.current.events ||
      !BlockRef ||
      !BlockRef.current
    ) {
      return;
    }

    quill.on(QuillRef.current.events.EDITOR_CHANGE, onEditorChange);

    return () => {
      quill.off(QuillRef.current.events.EDITOR_CHANGE, onEditorChange);
    };
  }, [onEditorChange, quill]);

  useEffect(() => {
    function onScrollEditor() {
      if (!isShowPopupMenu || !quill) {
        return;
      }
      const range = quill.getSelection();
      popupMenu(range);
    }

    const editorEl = document.querySelector<HTMLDivElement>(
      "#writing-assistant-quill .ql-editor"
    );
    if (editorEl) {
      editorEl.addEventListener("scroll", onScrollEditor);
    }

    return () => {
      if (editorEl) {
        editorEl.removeEventListener("scroll", onScrollEditor);
      }
    };
  }, [isShowPopupMenu, popupMenu, quill]);

  const checkUndoOrRedo = useCallback(
    (quill) => {
      if (!quill) {
        return null;
      }
      const { undo, redo } = quill.history.stack;
      const undoLength = undo.length;
      const redoLength = redo.length;
      setQuillTrack({ undoLength, redoLength });

      const { undoLength: oldUndoLength, redoLength: oldRedLength } =
        quillTrack;
      if (
        undoLength + redoLength === oldUndoLength + oldRedLength &&
        undoLength > oldUndoLength
      ) {
        return REDO;
      } else if (
        undoLength + redoLength === oldUndoLength + oldRedLength &&
        undoLength < oldUndoLength
      ) {
        return UNDO;
      }
      return EDIT;
    },
    [quillTrack]
  );

  useEffect(() => {
    if (!quill || !QuillRef || !QuillRef.current || !QuillRef.current.events) {
      return;
    }

    function onTextChange(delta, oldDelta, source) {
      if (quill) {
        setDelta(quill.getContents());
      }
      // get count of words
      dispatch(setCountWords(countWordsUtil(quill.getText(0))));
      // check if undo or redo
      const currentWorking = checkUndoOrRedo(quill);

      let newSelectVariation = null;
      let newDeletedSelectVariation = null;
      switch (currentWorking) {
        case UNDO:
          // handle variations
          newSelectVariation = [...selectVariationHistory];
          newDeletedSelectVariation = [
            ...deletedSelectVariationHistory,
            newSelectVariation.pop(),
          ];
          setDeletedSelectVariation(newDeletedSelectVariation);
          dispatch(setSelectVariationHistory(newSelectVariation));
          break;
        case REDO:
          // handle variations
          newSelectVariation = [...selectVariationHistory];
          newDeletedSelectVariation = [...deletedSelectVariationHistory];
          newSelectVariation.push(newDeletedSelectVariation.pop());
          dispatch(setSelectVariationHistory(newSelectVariation));
          setDeletedSelectVariation(newDeletedSelectVariation);
          break;
      }

      if (
        newSelectVariation?.length === 0 ||
        (currentWorking === EDIT && source === "user")
      ) {
        dispatch(clearVariation());
        setDeletedSelectVariation([]);
        dispatch(setGeneratedData(null));
      }
    }
    quill.on(QuillRef.current.events.TEXT_CHANGE, onTextChange);

    return () => {
      if (quill) {
        quill.off(QuillRef.current.events.TEXT_CHANGE, onTextChange);
      }
    };
  }, [
    checkUndoOrRedo,
    deletedSelectVariationHistory,
    dispatch,
    quill,
    quillTrack,
    selectVariationHistory,
  ]);

  const goBackToHomeOfProject = useCallback(() => {
    router.push(
      customerId
        ? `\/${rootCustomerLinks(
            customerId
          )}\/project\/${projectId}\/new-copy\/all`
        : teamId
        ? `\/${teamId}\/project\/${projectId}\/new-copy\/all`
        : `\/project\/${projectId}\/new-copy\/all`,
      undefined,
      { shallow: true }
    );
  }, [customerId, projectId, router, teamId]);

  // initialize
  useEffect(() => {
    async function initialize() {
      try {
        const { content, title } = await getWritingAssistant({
          teamId,
          projectId,
          historyId,
          customerId,
        });
        // get last selection
        const range = quill.getSelection();
        dispatch(setTitle(title));
        // set contents
        quill.setContents(content?.data);
        // clear history
        quill.history.clear();
        // select last position
        quill.setSelection(range);
      } catch (err) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
        goBackToHomeOfProject();
      }
    }
    if (quill && historyId && !generateCopy) {
      initialize();
    }
  }, [
    customerId,
    dispatch,
    generateCopy,
    goBackToHomeOfProject,
    historyId,
    projectId,
    quill,
    teamId,
  ]);
  // get article writer content
  useEffect(() => {
    async function initialize() {
      try {
        const { copies, inputs_data } = await getAllHistoryById({
          historyId: articleWriterHistoryId,
          projectId,
          contentName: "ai-article-writer-v2",
          customerId,
          teamId,
        });
        quill.setContents(
          getQuillContent({
            copyData: copies?.items[0].data,
            articleTitle: inputs_data?.article_title,
            articleIntro: inputs_data?.article_intro,
          }).data
        );
      } catch (err) {
        console.log(err);
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
        goBackToHomeOfProject();
      }
    }
    if (quill && articleWriterHistoryId) {
      initialize();
    }
  }, [
    articleWriterHistoryId,
    customerId,
    dispatch,
    goBackToHomeOfProject,
    projectId,
    quill,
    teamId,
  ]);

  // auto save
  useEffect(() => {
    const timeId = setTimeout(async () => {
      if (!delta || !countWords) {
        return;
      }
      try {
        const { history_id } = await saveWritingAssistant({
          teamId,
          customerId,
          data: {
            project_id: projectId,
            history_id: historyId,
            title,
            content: { num_words: countWords, data: delta },
            content_name: contentType,
          },
        });
        if (historyId !== history_id || generateCopy) {
          router.replace(
            customerId
              ? `${rootCustomerLinks(
                  customerId
                )}\/template\/${projectId}\/${contentType}\/${history_id}`
              : teamId
              ? `\/${teamId}\/template\/${projectId}\/${contentType}\/${history_id}`
              : `\/template\/${projectId}\/${contentType}\/${history_id}`
          );
        }
      } catch (err) {}
    }, 1000);
    return () => {
      clearTimeout(timeId);
    };
  }, [
    customerId,
    delta,
    historyId,
    projectId,
    quill,
    router,
    teamId,
    contentType,
    title,
    generateCopy,
    countWords,
  ]);

  return (
    <div
      className={classNames("flex relative", containerCSS, className ?? "")}
      id="writing-assistant-quill"
    >
      <Transition
        show={isShowPopupMenu && !!activeRange}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="w-full sm:w-auto absolute z-20"
        style={controllerStyle}
      >
        <ControllerMenu />
      </Transition>
      <div className="block lg:hidden absolute bottom-2 z-10 w-full">
        <ProgressBar len={75} value={countWords} />
      </div>
      <div className="w-full block">
        <div data-toggle="writing-assistant-quill" ref={editorRef} />
      </div>
      {(generatingCopies || isGeneratingVariation) && <EditOverLay />}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    quill: state.writingAssistant?.quill,
    activeRange: state.writingAssistant?.activeRange,
    isGeneratingVariation: state.writingAssistant?.isGeneratingVariation,
    isShowPopupMenu: state.writingAssistant?.isShowPopupMenu,
    selectVariationHistory: state.writingAssistant?.selectVariationHistory,
    title: state.template?.title,
    generatingCopies: state.template?.generatingCopy,
    countWords: state.writingAssistant?.countWords,
  };
};

export default connect(mapStateToPros)(Editor);
