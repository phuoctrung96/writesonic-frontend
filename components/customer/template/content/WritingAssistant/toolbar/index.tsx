import { Transition } from "@headlessui/react";
import { DotsHorizontalIcon, DownloadIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { useRouter } from "next/router";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { OutputGenerate } from "../../../../../../api/content";
import { postContentToWordpress } from "../../../../../../api/thirdparty";
import useContentType from "../../../../../../hooks/useContentType";
import { setToastify, ToastStatus } from "../../../../../../store/main/actions";
import { setIsShowFormPanel } from "../../../../../../store/writingAssistant/actions";
import exportQuillToDocx from "../../../../../../utils/exportQuillToDocx";
import { segmentTrack } from "../../../../../../utils/segment";
import SmWhiteButton from "../../../../../buttons/smWhiteButton";
import XsWhiteButton from "../../../../../buttons/xsWhiteButton";
import {
  SOURCE_WRITING_ASSISTANT_FORMAT,
  SOURCE_WRITING_ASSISTANT_SELECTION,
} from "../editor";
import MainContainer from "../mainContainer";
import BoldTool from "../toolItems/boldTool";
import BulletListTool from "../toolItems/bulletListTool";
import ClearFormatTool from "../toolItems/clearFormatTool";
import Head1SizeTool from "../toolItems/head1SizeTool";
import Head2SizeTool from "../toolItems/head2SizeTool";
import ItalicTool from "../toolItems/italicTool";
import LinkTool from "../toolItems/linkTool";
import NumberedListTool from "../toolItems/numberedListTool";
import UnderlineTool from "../toolItems/underlineTool";
import HamburgerButton from "./hamburgerButton";
import PopupToolbar, { BULLET, ORDERED } from "./popupToolbar";

interface ToolBarProps {
  quill: any;
  range: any;
  isShowFormPanel: boolean;
  isGeneratingVariation: boolean;
  isShowVariationPanel: boolean;
  generatingCopies: boolean;
  countWords: number;
  userId: string;
  onShowVariationPanel: MouseEventHandler<HTMLDivElement>;
  variation: { data: OutputGenerate; range; endpoint };
  title: string;
  isAuthenticatedByWordpress?: string;
}

const ToolBar: React.FC<ToolBarProps> = ({
  quill,
  range,
  isShowFormPanel,
  isGeneratingVariation,
  isShowVariationPanel,
  generatingCopies,
  countWords,
  userId,
  onShowVariationPanel,
  variation,
  title,
  isAuthenticatedByWordpress,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, projectId, historyId, contentType } = query;
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [headerFormat, setHeaderFormat] = useState<number>(null);
  const [listFormat, setListFormat] = useState<string>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isShowPopupToolbar, setIsShowPopupToolbar] = useState<boolean>(false);
  const [isPublishing, setPublishing] = useState<boolean>(false);
  const [currentContentType, currentTemplate] = useContentType();

  const updateToolBar = useCallback((format) => {
    const { bold, italic, underline, header, list } = format;
    setIsBold(!!bold);
    setIsItalic(!!italic);
    setIsUnderline(!!underline);
    setHeaderFormat(header);
    setListFormat(list);
  }, []);

  useEffect(() => {
    if (!quill || !range) {
      return;
    }
    updateToolBar(quill.getFormat(range));
  }, [quill, range, updateToolBar]);

  useEffect(() => {
    if (!quill) {
      return;
    }
    function onTextChange(delta, oldDelta, source) {
      const range = quill.getSelection();
      if (!range) {
        return;
      }
      updateToolBar(quill.getFormat(range));
    }
    quill.on("text-change", onTextChange);
    return () => {
      quill.off("text-change", onTextChange);
    };
  }, [quill, updateToolBar]);

  const handleBorder = () => {
    if (!quill || !range) {
      return;
    }
    const { bold } = quill.getFormat(range);
    quill.format("bold", !bold, SOURCE_WRITING_ASSISTANT_FORMAT);
  };

  const handleItalic = () => {
    if (!quill || !range) {
      return;
    }
    const { italic } = quill.getFormat(range);
    quill.format("italic", !italic, SOURCE_WRITING_ASSISTANT_FORMAT);
  };

  const handleUnderline = () => {
    if (!quill || !range) {
      return;
    }
    const { underline } = quill.getFormat(range);
    quill.format("underline", !underline, SOURCE_WRITING_ASSISTANT_FORMAT);
  };

  const handleHeaderFormat = (value) => {
    if (!quill || !range) {
      return;
    }
    const { header } = quill.getFormat(range);
    quill.format(
      "header",
      header === value ? undefined : value,
      SOURCE_WRITING_ASSISTANT_FORMAT
    );
  };

  const handleLink = () => {
    const qlLink = document.querySelector<HTMLElement>(".ql-link");
    if (qlLink) {
      qlLink.click();
    }
  };

  const handleNumberedList = () => {
    if (!range) {
      return;
    }
    const { index, length } = range;
    const { list } = quill.getFormat(range);
    if (list === ORDERED) {
      quill.removeFormat(
        index,
        length,
        "list",
        SOURCE_WRITING_ASSISTANT_FORMAT
      );
    } else {
      quill.formatLine(index, length, "list", ORDERED);
    }
    quill.setSelection(range, SOURCE_WRITING_ASSISTANT_SELECTION);
  };

  const handleBullet = () => {
    if (!range) {
      return;
    }
    const { index, length } = range;
    const { list } = quill.getFormat(range);
    if (list === BULLET) {
      quill.removeFormat(
        index,
        length,
        "list",
        SOURCE_WRITING_ASSISTANT_FORMAT
      );
    } else {
      quill.formatLine(index, length, "list", BULLET);
    }
    quill.setSelection(range, SOURCE_WRITING_ASSISTANT_SELECTION);
  };

  const handleRemoveFormat = () => {
    if (!range) {
      return;
    }
    const { index, length } = range;
    quill.removeFormat(index, length, SOURCE_WRITING_ASSISTANT_FORMAT);
    quill.setSelection(index, length, SOURCE_WRITING_ASSISTANT_SELECTION);
  };

  const handleVisibleFormPanel = () => {
    dispatch(setIsShowFormPanel(!isShowFormPanel));
  };

  const handleDownload = async () => {
    if (!quill) {
      return;
    }
    try {
      const fileName = `${title ? title : "undefined"}_${Math.floor(
        Date.now() / 1000
      )}`;
      exportQuillToDocx(quill, fileName);

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

  const handleWordpressPost = async () => {
    let quillHTML = quill.root.innerHTML;
    setPublishing(false);
    await postContentToWordpress({
      title: title,
      content: quillHTML,
      status: "pending",
    })
      .then((data) => {
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Your Article is published on Wordpress successfully!",
          })
        );
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
  };

  return (
    <MainContainer
      mainClassName="flex justify-between h-12 w-full"
      leftContentClassName="flex items-center px-4 h-full"
      rightContentClassName="flex justify-end items-center"
      leftContent={
        <>
          <div className="col-span-2 flex items-center px-4 h-full">
            <HamburgerButton
              active={isShowFormPanel}
              onClick={handleVisibleFormPanel}
            />
          </div>
          <Transition
            show={(variation?.data?.count ?? 0) > 0}
            enter="transform transition ease-in-out duration-500 sm:duration-800"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in-out duration-500 sm:duration-800"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
            className="flex lg:hidden items-center border-r border-gray-200 cursor-pointer h-full"
          >
            <div
              className="flex justify-center items-center lg:hidden px-4 h-full lg:border-none"
              onClick={onShowVariationPanel}
            >
              <p className="text-gray-2 text-sm whitespace-nowrap">
                Variation
                <span className="ml-3 bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {variation?.data?.count ?? 0}
                </span>
              </p>
            </div>
          </Transition>
        </>
      }
      rightContent={
        <>
          <div className="ml-auto col-start-9 col-span-2 flex justify-end">
            {/* {isAuthenticatedByWordpress ? (
              <SmWhiteButton
                className="mr-2 whitespace-nowrap"
                onClick={handleWordpressPost}
                disabled={isPublishing}
              >
                Post on Wordpress
              </SmWhiteButton>
            ) : null} */}
            <Transition
              show={countWords > 0}
              enter="transition-opacity duration-75"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="mr-3"
            >
              <SmWhiteButton disabled={isDownloading} onClick={handleDownload}>
                <DownloadIcon
                  width={16}
                  height={16}
                  className="text-gray-800"
                />
              </SmWhiteButton>
            </Transition>
            <p
              className={classNames(
                (variation?.data?.count ?? 0) > 0
                  ? "hidden md:block "
                  : "hidden sm:block ",
                "mr-3 w-max text-sm text-gray-5 font-normal px-3 py-2 ml-auto rounded-md bg-gray-5 bg-opacity-4 border border-gray-5 border-opacity-40 select-none whitespace-nowrap"
              )}
            >
              {countWords ?? 0} words
            </p>
          </div>
        </>
      }
    >
      <>
        <Transition
          show={
            !isGeneratingVariation && !isShowVariationPanel && !generatingCopies
          }
          enter="transform transition ease-in-out duration-500 sm:duration-800"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-500 sm:duration-800"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
          className="flex items-center flex-1"
        >
          <div
            className={classNames(
              (variation?.data?.count ?? 0) > 0 ? "hidden 690:flex" : "flex",
              "justify-center items-center"
            )}
          >
            <BoldTool onClick={handleBorder} selected={isBold} />
            <ItalicTool onClick={handleItalic} selected={isItalic} />
            <UnderlineTool onClick={handleUnderline} selected={isUnderline} />
          </div>
          <div className="hidden 690:flex justify-center items-center border-l border-gray-200">
            <Head1SizeTool
              onClick={() => handleHeaderFormat(1)}
              selected={headerFormat === 1}
            />
            <Head2SizeTool
              onClick={() => handleHeaderFormat(2)}
              selected={headerFormat === 2}
            />
          </div>
          <div className="hidden 690:flex justify-center items-center border-l border-gray-200">
            <LinkTool onClick={handleLink} />
          </div>
          <div className="hidden 690:flex justify-center items-center border-l border-gray-200">
            <NumberedListTool
              onClick={handleNumberedList}
              selected={listFormat === ORDERED}
            />
            <BulletListTool
              onClick={handleBullet}
              selected={listFormat === BULLET}
            />
          </div>
          <div className="hidden 690:flex justify-center items-center border-l border-gray-200">
            <ClearFormatTool onClick={handleRemoveFormat} />
          </div>
          <div className="flex 690:hidden justify-end items-center ml-2">
            <XsWhiteButton
              onClick={() => {
                setIsShowPopupToolbar(!isShowPopupToolbar);
              }}
              className={classNames(isShowPopupToolbar ? "bg-gray-200" : "")}
            >
              <DotsHorizontalIcon
                width={20}
                height={20}
                className="text-gray-400"
              />
            </XsWhiteButton>
          </div>
        </Transition>
        <Transition
          show={
            isShowPopupToolbar &&
            !isGeneratingVariation &&
            !isShowVariationPanel &&
            !generatingCopies
          }
          enter="transform transition ease-in-out duration-500 sm:duration-800"
          enterFrom="opacity-0 scale-50 translate-y-full"
          enterTo="opacity-100 opacity-0 translate-y-0"
          leave="transform transition ease-in-out duration-500 sm:duration-800"
          leaveFrom="opacity-100 opacity-0 translate-y-0"
          leaveTo="opacity-0 scale-50 translate-y-full"
          className={classNames(
            "absolute bottom-16 block 690:hidden",
            (variation?.data?.count ?? 0) > 0 ? "left-1" : "left-10"
          )}
        >
          <PopupToolbar
            variation={variation}
            handleBorder={handleBorder}
            handleItalic={handleItalic}
            handleUnderline={handleUnderline}
            handleHeaderFormat={handleHeaderFormat}
            handleLink={handleLink}
            handleNumberedList={handleNumberedList}
            handleBullet={handleBullet}
            isBold={isBold}
            isItalic={isItalic}
            isUnderline={isUnderline}
            listFormat={listFormat}
            headerFormat={headerFormat}
            handleRemoveFormat={handleRemoveFormat}
          />
        </Transition>
      </>
    </MainContainer>
  );
};

interface PopupToolbarProps {
  variation: { data: OutputGenerate; range; endpoint };
  handleBorder: MouseEventHandler<HTMLDivElement>;
  handleItalic: MouseEventHandler<HTMLDivElement>;
  handleUnderline: MouseEventHandler<HTMLDivElement>;
  handleHeaderFormat: Function;
  handleLink: MouseEventHandler<HTMLDivElement>;
  handleNumberedList: MouseEventHandler<HTMLDivElement>;
  handleBullet: MouseEventHandler<HTMLDivElement>;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  listFormat: string;
  headerFormat: number;
  handleRemoveFormat: MouseEventHandler<HTMLDivElement>;
}

const mapStateToPros = (state) => {
  return {
    quill: state.writingAssistant?.quill,
    range: state.writingAssistant?.currentRange,
    isShowFormPanel: state.writingAssistant?.isShowFormPanel,
    isGeneratingVariation: state.writingAssistant?.isGeneratingVariation,
    isShowVariationPanel: state.writingAssistant?.isShowVariationPanel,
    generatingCopies: state.template?.generatingCopy,
    countWords: state.writingAssistant?.countWords ?? 0,
    userId: state.user?.id,
    variation: state.writingAssistant?.variation,
    title: state.template?.title,
    isAuthenticatedByWordpress: state?.user?.is_authorized_by_wordpress,
  };
};

export default connect(mapStateToPros)(ToolBar);
