import { BookmarkIcon, DuplicateIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Category } from "../../../../../api/category";
import { ContentType } from "../../../../../api/contentType";
import templates from "../../../../../data/templates";
import useContentCategory from "../../../../../hooks/useContentCategory";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { setIsLoadingHistory } from "../../../../../store/template/actions";
import copyText from "../../../../../utils/clipboard";
import rootCustomerLinks from "../../../../../utils/rootCutomerLink";
import { segmentTrack } from "../../../../../utils/segment";
import ToolTip from "../../../../tooltip/muiToolTip";
import UnSaveCopyModal from "../../../modals/unSaveModal";

const maxLen = 100;

const cutString = (str: string) => {
  if (str.length < maxLen) {
    return str;
  }
  return str.substring(0, 99) + " .....";
};

const Content: React.FC<{
  content_type: ContentType;
  copy: { [key: string]: any };
  inputsData: { [key: string]: any };
}> = ({ content_type, copy, inputsData }) => {
  if (content_type.content_name === "summary") {
    return (
      <p className="font-normal text-sm text-gray-2 mt-2">
        {copy["summary"] ? cutString(copy["summary"]) : ""}
      </p>
    );
  } else if (
    content_type.content_name === "ai-article-writer" ||
    content_type.content_name === "ai-article-writer-v2" ||
    content_type.content_name === "ai-article-writer-v3"
  ) {
    return (
      <p className="font-normal text-sm text-gray-2 mt-2">
        {cutString(inputsData["article_intro"])}
      </p>
    );
  } else if (content_type.content_name === "landing-pages") {
    return (
      <p className="font-normal text-sm text-gray-2 mt-2">
        {cutString(copy["title"])}
      </p>
    );
  }
  return (
    <>
      {Object.keys(copy)?.map((key) => {
        return (
          <p key={key} className="font-normal text-sm text-gray-2 mt-2">
            {copy[key]}
          </p>
        );
      })}
    </>
  );
};

const SavedCopy: React.FC<{
  content_type: ContentType;
  title: string;
  time: string;
  copyData: { [key: string]: any };
  inputsData: { [key: string]: any };
  onChange?: Function;
  userId: string;
  historyId: number;
  categories: Category[];
}> = ({
  content_type,
  title,
  time,
  copyData,
  inputsData,
  onChange,
  userId,
  historyId,
  categories,
}) => {
  const router = useRouter();
  const { locale, query } = router;
  const { customerId, contentCategory } = query;
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [items, setItems] = useState([]);
  const { t } = useTranslation();
  const [currentCategory] = useContentCategory();
  const { teamId, historyId: historyIdFromUrl, projectId } = router.query;

  const clipboard = () => {
    let text = "";

    Object.values(copyData.data).forEach((item, index) => {
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
      projectId,
      userId,
      teamId,
      templateName: currentCategory.package_name,
      historyIdFromUrl,
    });
    // track end
  };

  const trackViewHistory = ({
    historyId,
    templateName,
  }: {
    historyId: number;
    templateName: string;
  }) => {
    // show load on the template plage
    dispatch(setIsLoadingHistory(true));
    // track by segment
    segmentTrack("Copy History Viewed", {
      projectId: projectId,
      userId,
      teamId,
      templateName,
      historyId,
    });
    // track end
  };

  const imageSrc =
    content_type?.image_src ??
    templates?.find(({ key }) => key === content_type?.content_name)?.image ??
    "";

  return (
    <>
      <div className="flex-1 flex flex-col p-6 text-left">
        <div className="flex flex-wrap justify-between">
          <Link
            href={
              customerId
                ? `${rootCustomerLinks(customerId)}\/template\/${projectId}\/${
                    content_type.content_name
                  }\/${historyId}?copyId=${copyData.id}`
                : teamId
                ? `\/${teamId}\/template\/${projectId}\/${content_type.content_name}\/${historyId}?copyId=${copyData.id}`
                : `\/template\/${projectId}\/${content_type.content_name}\/${historyId}?copyId=${copyData.id}`
            }
            shallow
          >
            <a
              className="flex bg-indigo-0 bg-opacity-10 items-center px-2.5 py-0.5 w-max rounded-md cursor-pointer"
              onClick={() => {
                trackViewHistory({
                  historyId,
                  templateName: content_type?.title[locale],
                });
              }}
            >
              {imageSrc && (
                <Image
                  src={imageSrc}
                  width={20}
                  height={20}
                  alt={content_type?.title[locale]}
                />
              )}
              <p className="ml-2 font-normal text-sm text-indigo-0">
                {content_type?.title[locale]}
              </p>
            </a>
          </Link>

          <div className="flex items-center ml-auto">
            <p className="font-normal text-xs text-gray-2 text-opacity-60 pr-2">
              {time && time[router.locale]
                ? time[router.locale] + " ago"
                : t("common:now")}
            </p>
            <div className="px-1">
              <ToolTip message={t("common:UnBookmark")} position="top">
                <button
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-3 bg-opacity-10 bg-yellow-1 focus:outline-none hover:bg-opacity-25 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-200"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  <BookmarkIcon
                    className="text-yellow-400 h-4 w-4"
                    aria-hidden="true"
                  />
                </button>
              </ToolTip>
            </div>
            <div className="px-1">
              <ToolTip message={t("common:Copy_to_clipboard")} position="top">
                <button
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-3 bg-gray-2 bg-opacity-30 focus:outline-none hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                  onClick={clipboard}
                >
                  <DuplicateIcon
                    className="text-gray-3 h-4 w-4"
                    aria-hidden="true"
                  />
                </button>
              </ToolTip>
            </div>
          </div>
        </div>
        <Link
          href={
            customerId
              ? `${rootCustomerLinks(customerId)}\/template\/${projectId}\/${
                  content_type.content_name
                }\/${historyId}?copyId=${copyData.id}`
              : teamId
              ? `\/${teamId}\/template\/${projectId}\/${content_type.content_name}\/${historyId}?copyId=${copyData.id}`
              : `\/template\/${projectId}\/${content_type.content_name}\/${historyId}?copyId=${copyData.id}`
          }
          shallow
        >
          <a
            className="cursor-pointer hover:text-gray-800"
            onClick={() => {
              trackViewHistory({
                historyId,
                templateName: content_type?.title[locale],
              });
            }}
          >
            <p className="font-medium text-md text-gray-1 mt-3.5">
              {cutString(title)}
            </p>
            <Content
              content_type={content_type}
              copy={copyData.data}
              inputsData={inputsData}
            />
          </a>
        </Link>
      </div>
      <UnSaveCopyModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        copy_id={copyData.id}
        onDelete={onChange}
      />
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    userId: state.user?.id,
    categories: state.main?.categories,
  };
};

export default connect(mapStateToPros)(SavedCopy);
