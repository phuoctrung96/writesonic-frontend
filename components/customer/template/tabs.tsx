import { Transition } from "@headlessui/react";
import { DownloadIcon } from "@heroicons/react/outline";
import { Packer } from "docx";
import { saveAs } from "file-saver";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getAllHistoryById, getSavedHistoryById } from "../../../api/history";
import useContentType from "../../../hooks/useContentType";
import { setToastify, ToastStatus } from "../../../store/main/actions";
import { DocumentCreator } from "../../../utils/documentCreator";
import rootCustomerLinks from "../../../utils/rootCutomerLink";
import { segmentTrack } from "../../../utils/segment";
import SmWhiteButton from "../../buttons/smWhiteButton";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface TabsPros {
  loadingCopies: boolean;
  userId: string;
}

const Tabs: React.FC<TabsPros> = ({ loadingCopies, userId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;
  const {
    historyId,
    teamId,
    projectId,
    contentType,
    filter,
    customerId,
    copyId,
  } = router.query;
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const mounted = useRef(false);
  const [currentContentType, currentTemplate] = useContentType();
  const tabs = useMemo(() => {
    return [
      { key: "all", name: t("common:all") },
      { key: "saved", name: t("common:saved") },
    ];
  }, [t]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const [filterKey, setFilterKey] = useState(tabs[0]);

  useEffect(() => {
    if (!tabs) {
      return;
    }
    setFilterKey(
      tabs.find(
        ({ key }) =>
          typeof filter === "string" &&
          key.toLowerCase() === filter.toLowerCase()
      ) ?? tabs[0]
    );
  }, [filter, tabs]);

  const handleChange = (tab: { key: string; name: string }) => {
    if (loadingCopies) {
      dispatch(
        setToastify({
          status: ToastStatus.warning,
          message: "Loading now...",
        })
      );
      return;
    }

    setFilterKey(tab);

    router.replace({
      pathname: customerId
        ? `${rootCustomerLinks(customerId)}\/template\/${projectId}\/${
            currentContentType.content_name
          }\/${historyId}`
        : teamId
        ? `\/${teamId}\/template\/${projectId}\/${currentContentType.content_name}\/${historyId}`
        : `\/template\/${projectId}\/${currentContentType.content_name}\/${historyId}`,
      query: { filter: tab.key },
    });
  };

  const handleDownload = async () => {
    if (loadingCopies) {
      dispatch(
        setToastify({
          status: ToastStatus.warning,
          message: "Loading now...",
        })
      );
      return;
    }
    try {
      setIsDownloading(true);
      const { title, copies } =
        filter === "all"
          ? await getAllHistoryById({
              historyId,
              projectId,
              contentName: contentType,
              customerId,
              teamId,
            })
          : await getSavedHistoryById({
              historyId,
              projectId,
              contentName: contentType,
              customerId,
              teamId,
            });
      const documentCreator = new DocumentCreator();
      const doc = documentCreator.createCopyDoc(
        title ? title : "Untitled",
        copies.items,
        locale
      );
      Packer.toBlob(doc).then((blob) => {
        saveAs(
          blob,
          `${currentTemplate?.key?.replaceAll(/-/g, "_")}_${Date.now()}.docx`
        );
      });

      // track by segment
      segmentTrack("Copy Downloaded", {
        projectId: projectId,
        userId,
        teamId,
        templateName: currentContentType?.title[locale],
        historyId,
      });
      // track end
    } catch (err) {
      console.error(err);
    } finally {
      if (mounted.current) {
        setIsDownloading(false);
      }
    }
  };

  if (copyId) {
    return null;
  } else if (!!historyId) {
    return (
      <div className="w-full flex justify-between items-center mx-4">
        <nav
          className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
          aria-label="Tabs"
        >
          {tabs?.map((tab, tabIdx) => {
            return (
              <p
                key={tab.key}
                className={classNames(
                  tab.key === filterKey?.key
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700",
                  tabIdx === 0 ? "rounded-l-lg" : "",
                  tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                  "group relative w-16 min-w-0 flex-1 overflow-hidden bg-white py-2 px-2 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 cursor-pointer select-none border border-gray-300"
                )}
                aria-current={tab.key === filterKey?.key ? "page" : undefined}
                onClick={() => handleChange(tab)}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    tab.key === filterKey?.key
                      ? "bg-indigo-500"
                      : "bg-transparent",
                    "absolute inset-x-0 bottom-0 h-0.5"
                  )}
                />
              </p>
            );
          })}
        </nav>
        <Transition
          show={!loadingCopies}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <SmWhiteButton disabled={isDownloading} onClick={handleDownload}>
            <DownloadIcon width={16} height={16} className="text-gray-800" />
          </SmWhiteButton>
        </Transition>
      </div>
    );
  } else {
    return null;
  }
};

const mapStateToPros = (state) => {
  return {
    loadingCopies: state.template?.loadingCopy,
    userId: state.user?.id,
  };
};

export default connect(mapStateToPros)(Tabs);
