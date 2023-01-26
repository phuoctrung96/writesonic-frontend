import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
} from "@heroicons/react/outline";
import { BookmarkIcon } from "@heroicons/react/solid";
import FileSaver from "file-saver";
import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Category } from "../../../../../api/category";
import { Copy } from "../../../../../api/copy";
import {
  downloadLandingPageHTML,
  getLandingPage,
} from "../../../../../api/template";
import templates from "../../../../../data/templates";
import useContentType from "../../../../../hooks/useContentType";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import {
  createCopies,
  saveCopy as saveCopyAction,
  unSaveCopy as unSaveCopyAction,
} from "../../../../../store/template/actions";
import { getLeftCredits } from "../../../../../store/user/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import rootCustomerLinks from "../../../../../utils/rootCutomerLink";
import { segmentTrack } from "../../../../../utils/segment";
import ActionButton from "../../../../buttons/actionButton";
import NavigationButton from "../../../../buttons/navigationButton";
import Overlay from "../../../overlay";
import LeftSection from "../../leftSection";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import EmptyVariation from "./emptyVariation";

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "landing-pages",
    inputs: [
      {
        name: "product_name",
        label: t("inputs:Product_Service_Name"),
        inputType: InputType.TextInput,
        placeholder: t("inputs:Webflow"),
        maxLength: 100,
        required: true,
      },
      {
        name: "product_description",
        label: t("inputs:Product_Service_Description"),
        inputType: InputType.TextArea,
        placeholder: t(
          "inputs:Webflow_is_an_in_build_and_launch_responsive_websites_visually"
        ),
        maxLength: 600,
        minLength: 20,
        minWords: 5,
        rows: 6,
        required: true,
      },
      {
        name: "feature_1",
        label: t("inputs:Feature_Benefit_1"),
        inputType: InputType.TextArea,
        maxLength: 100,
        minLength: 5,
        minWords: 5,
        rows: 2,
        placeholder: t(
          "inputs:Build_production_ready_experiences_without_coding"
        ),
        required: true,
      },
      {
        name: "feature_2",
        label: t("inputs:Feature_Benefit_2"),
        inputType: InputType.TextArea,
        maxLength: 100,
        minLength: 5,
        minWords: 5,
        rows: 2,
        placeholder: t(
          "inputs:Deploy_on_a_hosting_network_that_scales_with_your_business"
        ),
        required: true,
      },
      {
        name: "feature_3",
        label: t("inputs:Feature_Benefit_3"),
        inputType: InputType.TextArea,
        maxLength: 100,
        minLength: 5,
        minWords: 5,
        rows: 2,
        placeholder: t(
          "inputs:Create_launch_and_iterate_on_new_marketing_campaigns"
        ),
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: t("inputs:Generate_Landing_Pages"),
      reName: t("inputs:Regenerate_Landing_Pages"),
    },
  };
};

interface LandingPageProps {
  title: string;
  inputs: any;
  copies: Copy[];
  loadingCopies: boolean;
  generatingCopies: boolean;
  userId: string;
  categories: Category[];
  subscription?: any;
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
}

const LandingPages: React.FC<LandingPageProps> = ({
  copies,
  loadingCopies,
  generatingCopies,
  userId,
  subscription,
  isAdblockCheckComplete,
  isAdblockerDetected,
}) => {
  const router = useRouter();
  const { locale, query } = router;
  const { projectId, contentType, historyId, p, teamId, customerId, filter } =
    router.query;
  const dispatch = useDispatch();
  const refCopy = useRef(null);
  const [sourceHtml, setHtmlCode] = useState<string>("");
  const [loadingHtml, setLoadingHtml] = useState<boolean>(false);

  const [isSaving, setSaving] = useState<boolean>(false);
  const [currentCopy, setCurrentCopy] = useState<Copy>(null);
  const [currentContentType, currentTemplate] = useContentType();

  const { t } = useTranslation();
  const videoLinkID = templates?.find(({ key, videoUrlID }) => {
    if (key === contentType) {
      return videoUrlID;
    } else {
      return null;
    }
  });

  const rootTemplateLink = useCallback(() => {
    return (
      (customerId
        ? rootCustomerLinks(customerId)
        : teamId
        ? `/${teamId}`
        : "") + `/template/${projectId}/${contentType}/${historyId}?filter=all`
    );
  }, [customerId, historyId, projectId, teamId, contentType]);

  useEffect(() => {
    async function initialize() {
      if (!copies || !copies.length) {
        return;
      }

      let newPage =
        p === null || p === undefined || typeof p !== "string"
          ? 1
          : parseInt(p);

      if (window.innerWidth < 768) {
        refCopy.current.scrollIntoView();
      }

      setCurrentCopy(copies[newPage - 1]);
    }
    initialize();
  }, [
    copies,
    customerId,
    dispatch,
    filter,
    historyId,
    p,
    projectId,
    rootTemplateLink,
    router,
    teamId,
    contentType,
  ]);

  useEffect(() => {
    if (!currentCopy) {
      return;
    }
    const getHTML = async () => {
      try {
        setLoadingHtml(true);
        const htmlCode = await getLandingPage(currentCopy.data);
        setHtmlCode(htmlCode);
        setLoadingHtml(false);
      } catch (err) {
        setLoadingHtml(false);
      }
    };
    getHTML();
  }, [currentCopy, dispatch]);

  const handleNext = () => {
    let { p } = router.query;
    let newPage = p === null || p === undefined ? "1" : p;
    if (typeof newPage === "string") {
      const index = parseInt(newPage);
      if (index < copies.length) {
        router.push(`${rootTemplateLink()}&p=${index + 1}`, undefined, {
          shallow: true,
        });
      }
    }
  };

  const handlePrev = () => {
    let { p } = router.query;
    let newPage = p === null || p === undefined ? "1" : p;
    if (typeof newPage === "string") {
      const index = parseInt(newPage);
      if (index > 1) {
        router.push(`${rootTemplateLink()}&p=${index - 1}`, undefined, {
          shallow: true,
        });
      }
    }
  };

  const handleDownloadText = () => {
    if (!loadingHtml && copies && currentCopy) {
      const {
        title,
        subtitle,
        feature_1_title,
        feature_1_subtitle,
        feature_2_title,
        feature_2_subtitle,
        feature_3_title,
        feature_3_subtitle,
        cta,
        main_feature_title,
        main_feature_subtitle,
        button,
      } = currentCopy.data;
      var file = new File(
        [
          "Landing Page Copy",
          "\nGenerated by Writesonic",
          `\n\nTitle:  ${title}`,
          `\nSubtitle:  ${subtitle}`,
          `\n\nMain Feature Title:  ${main_feature_title}`,
          `\nMain Feature Subtitle:  ${main_feature_subtitle}`,
          `\n\nFeature 1 Title:  ${feature_1_title}`,
          `\nFeature 1 Subtitle:  ${feature_1_subtitle}`,
          `\n\nFeature 2 Title:  ${feature_2_title}`,
          `\nFeature 2 Subtitle:  ${feature_2_subtitle}`,
          `\n\nFeature 3 Title:  ${feature_3_title}`,
          `\nFeature 3 Subtitle:  ${feature_3_subtitle}`,
          `\n\nCTA:  ${cta}`,
          `\nButton:  ${button}`,
        ],
        "writesonic.txt",
        {
          type: "text/plain;charset=utf-8",
        }
      );
      FileSaver.saveAs(file);
      // track by segment
      segmentTrack("Copy Downloaded", {
        projectId: projectId,
        userId,
        teamId,
        templateName: currentContentType?.title[locale],
        historyId,
      });
      // track end
    }
  };

  const handleDownloadHTML = () => {
    if (!loadingHtml && copies && currentCopy) {
      downloadLandingPageHTML(currentCopy.data)
        .then((data) => {
          FileSaver.saveAs(data, "writesonic.zip");
        })
        .catch((err) => {});
    }
    // track by segment
    segmentTrack("Copy Downloaded", {
      projectId: projectId,
      userId,
      teamId,
      templateName: currentContentType?.title[locale],
      historyId,
    });
    // track end
  };

  const handleSave = async () => {
    setSaving(true);
    if (currentCopy?.is_saved) {
      await unSaveCopy();
    } else {
      await saveCopy();
    }
    setSaving(false);
  };

  const saveCopy = async () => {
    try {
      await dispatch(
        saveCopyAction({
          copyId: currentCopy.id,
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
          copyId: currentCopy.id,
          historyId,
          teamId,
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

  const onSubmit = ({ data, language }): Promise<{ success: boolean }> => {
    return new Promise(async (resolve, reject) => {
      if (!data) {
        reject(new Error("Data is empty"));
      }
      try {
        router.push(
          {
            pathname: customerId
              ? `${rootCustomerLinks(
                  customerId
                )}\/template\/${projectId}\/${contentType}\/${historyId}`
              : teamId
              ? `\/${teamId}\/template\/${projectId}\/${contentType}\/${historyId}`
              : `\/template\/${projectId}\/${contentType}\/${historyId}`,
            query: { filter: "all", p: 1 },
          },
          undefined,
          { shallow: true }
        );
        await dispatch(
          createCopies({
            type: "landing-pages",
            data,
            teamId,
            userId,
            projectId,
            historyId,
            language,
            templateName: currentContentType?.title[locale] ?? "",
            customerId,
            paginate: false,
            subscription,
            router,
          })
        );
        await dispatch(getLeftCredits(teamId));
        resolve(null);
      } catch (err) {
        reject(err);
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message:
              getErrorMessage(err) ??
              "Sorry, We couldn't generate your requested copy.",
          })
        );
        reject(err);
      }
    });
  };

  return (
    <main className="block md:grid grid-cols-5 2xl:grid-cols-7 overflow-y-auto auto-cols-min flex-1">
      <LeftSection className="col-span-2" titlePadding="2.5">
        <ContentInputs
          formData={formData(t)}
          onSubmit={onSubmit}
          isAdblockCheckComplete={isAdblockCheckComplete}
          isAdblockerDetected={isAdblockerDetected}
        />
      </LeftSection>
      <section
        className="col-span-3 2xl:col-span-5 flex-1 relative bg-root flex flex-col rounded-b-lg md:round-r-lg overflow-x-hidden overflow-y-auto"
        ref={refCopy}
      >
        {loadingCopies || generatingCopies ? (
          <Overlay />
        ) : copies && copies.length > 0 ? (
          <div className="flex flex-col h-screen">
            <div className="flex flex-wrap items-center justify-between px-1 sm:px-2 md:px-8 py-3">
              <div className="flex items-center justify-end sm:order-last sm:ml-auto py-1">
                <ActionButton onClick={handleSave} isLoading={isSaving}>
                  <BookmarkIcon
                    className={`${
                      currentCopy?.is_saved
                        ? "text-yellow-400"
                        : "text-gray-700"
                    } w-5 h-5`}
                  />
                </ActionButton>
                <ActionButton
                  className="ml-1 md:min-w-max"
                  onClick={handleDownloadText}
                >
                  <DownloadIcon width={18} height={18} />
                  <span className="ml-1 text-xs sm:text-sm">Text</span>
                </ActionButton>
                <ActionButton
                  className="ml-1 md:min-w-max"
                  onClick={handleDownloadHTML}
                >
                  <DownloadIcon width={18} height={18} />
                  <span className="ml-1 text-xs sm:text-sm">Code</span>
                </ActionButton>
              </div>
              {copies && copies.length > 1 && (
                <div className="flex items-center justify-end sm:justify-start ml-auto sm:ml-0 py-1">
                  <div>
                    <NavigationButton
                      disabled={typeof p !== "string" || parseInt(p) <= 1}
                      onClick={handlePrev}
                    >
                      <ChevronLeftIcon className="text-gray-3 h-5 w-5" />
                    </NavigationButton>
                  </div>
                  <div className="ml-2">
                    <NavigationButton
                      disabled={
                        typeof p !== "string" || parseInt(p) >= copies.length
                      }
                      onClick={handleNext}
                    >
                      <ChevronRightIcon className="text-gray-3 h-5 w-5" />
                    </NavigationButton>
                  </div>

                  <p className="ml-3 text-gray-700 text-sm font-bold">
                    {p ?? 1} <span className="text-xs font-normal">of</span>{" "}
                    {copies && copies.length}
                  </p>
                </div>
              )}
            </div>
            <div className="flex-1 shadow-lg p-2">
              {!loadingHtml ? (
                <iframe srcDoc={sourceHtml} className="w-full h-full" />
              ) : (
                <Overlay />
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full m-12">
            <EmptyVariation
              videoId={videoLinkID ? videoLinkID.videoUrlID : null}
            />
          </div>
        )}
      </section>
    </main>
  );
};

const mapStateToPros = (state) => {
  return {
    languages: state?.options?.languages,
    inputs: state?.template?.inputs,
    copies: state?.template?.copies,
    loadingCopies: state?.template?.loadingCopy,
    generatingCopies: state.template?.generatingCopy,
    userId: state?.user?.id,
    subscription: state?.user?.subscription,
  };
};

export default connect(mapStateToPros)(LandingPages);
