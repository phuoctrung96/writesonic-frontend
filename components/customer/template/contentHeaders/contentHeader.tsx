import { VideoCameraIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.css";
import { useDispatch } from "react-redux";
import templates from "../../../../data/templates";
import useContentType from "../../../../hooks/useContentType";
import useCurrentProject from "../../../../hooks/useCurrentProject";
import { openTemplateSidebar } from "../../../../store/modals/actions";
import { initTemplates } from "../../../../store/template/actions";
import HamburgButton from "../../../buttons/hamburgButton";
import SmCloseButton from "../../../buttons/smCloseButton";
import goBack from "./goBack";

function ContentHeader() {
  const router = useRouter();
  const { locale, query } = router;
  const { customerId, contentType } = router.query;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const mounted = useRef(false);
  const [currentContentType, currentTemplate] = useContentType();
  const [currentProject] = useCurrentProject();
  const videoLinkID = templates?.find(({ key, videoUrlID }) => {
    if (key === contentType) {
      return videoUrlID;
    } else {
      return null;
    }
  });

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleBack = () => {
    dispatch(initTemplates());
    goBack(router, dispatch);
  };
  const [isOpen, setOpen] = useState<boolean>(false);

  const imageSrc = currentContentType?.image_src ?? currentTemplate?.image;
  return (
    <div className="bg-white w-full flex justify-between items-center px-1 py-2 md:px-3 md:py-5">
      <div className="flex items-center">
        <div
          className={`border-r border-gray-200 ${
            currentTemplate?.key === "ai-article-writer-v3" ||
            currentTemplate?.key === "ai-article-writer-v2"
              ? ""
              : "xl:hidden"
          }`}
        >
          <HamburgButton onClick={() => dispatch(openTemplateSidebar(true))} />
        </div>
        {
          <div className="flex items-center xl:ml-0 ml-4">
            {imageSrc && (
              <Image
                src={imageSrc}
                width={48}
                height={48}
                alt={currentContentType?.title[locale]}
              />
            )}
            {!!currentProject && (
              <div className="ml-4">
                <p className="font-medium text-xl font-bold text-gray-0">
                  {currentContentType?.title[locale]} <br />
                  <span className="font-normal">
                    {t("common:for")} {currentProject?.name}
                  </span>
                </p>
              </div>
            )}
          </div>
        }
      </div>
      <div className="flex justify-end items-center">
        {!!customerId && (
          <p className="text-red-600 text-lg font-bold mr-5 px-3 py-1 bg-red-100 rounded-md select-none relative">
            Note: You are browsing a customer account.
            <span className="flex h-3 w-3 absolute -top-1 -left-1">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              </span>
            </span>
          </p>
        )}
        {videoLinkID ? (
          <>
            <ModalVideo
              channel="youtube"
              youtube={{
                autoplay: 1,
                mute: 1,
              }}
              isOpen={isOpen}
              videoId={videoLinkID.videoUrlID}
              onClose={() => setOpen(false)}
            />
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 invisible md:visible"
              style={{ marginRight: "25px" }}
              onClick={() => setOpen(true)}
            >
              <VideoCameraIcon
                className="-ml-0.5 mr-2 h-4 w-4"
                aria-hidden="true"
              />
              Watch Tutorial
            </button>
          </>
        ) : null}
        <SmCloseButton onClick={handleBack} />
      </div>
    </div>
  );
}

export default ContentHeader;
