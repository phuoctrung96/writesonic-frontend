import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { ARTICLE_TITLE_CONTENT_TYPE_NAME, BaseStepProps } from ".";
import { generateCopies } from "../../../../../api/content";
import { ContentType } from "../../../../../api/contentType";
import { Copy } from "../../../../../api/copy";
import { selectCopy } from "../../../../../api/history";
import useContentType from "../../../../../hooks/useContentType";
import hand_pen from "../../../../../public/images/modal/hand_pen.svg";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { getLeftCredits } from "../../../../../store/user/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import { segmentTrack } from "../../../../../utils/segment";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Pagination from "./pagination";
import RadioBoxes from "./radioBoxes";
import Variant from "./variant";

const tips = `
  <strong>Topic Input:</strong>
  1. Your <strong>Topic</strong> should give a clear indication of what your article will be about.
  2. Incorporate your primary keywords in order to make your article more appealing from an SEO perspective.
  3. Use numbers if needed. For example: "5 Ways to Rock a Matte Lipstick".

  <strong>Generated Ideas (Titles):</strong>
  1. The AI will generate the 5 best possible titles for your topic.
  2. Choose the title that best describes your topic and covers all relevant aspects of it.
  3. If you&#39;re not satisfied with the generated titles, you can click the &quot;Generate&quot; button again to generate five more variants and pick the best one.

  <strong>Note</strong>: The quality of the article generated will depend heavily on the completeness of your topic.
  `;

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "blog-ideas",
    inputs: [
      {
        name: "topic",
        label: "Topic",
        inputType: InputType.TextInput,
        placeholder: "Artificial Intelligence in Copywriting",
        tooltip: "The topic that would like to write a blog about.",
        maxLength: 300,
        minLength: 2,
        required: true,
      },
      {
        name: "language",
        inputType: InputType.Language,
        required: true,
      },
    ],
    button: {
      name: "Generate Ideas",
      reName: "Regenerate Ideas",
    },
  };
};

interface Step1Props extends BaseStepProps {
  setArticleTitle: React.Dispatch<React.SetStateAction<Copy>>;
}

const Step1: React.FC<Step1Props> = ({
  setArticleTitle,
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
  articleTitleHistory,
  setArticleTitleHistory,
  articleIntroHistory,
  setArticleIntroHistory,
  articleOutlineHistory,
  updateArticleOutlineHistory,
  getHistory,
  currentPage,
  setCurrentPage,
  articleTitle,
  contentTypeName,
  setIsSavingCopyId,
}) => {
  const mounted = useRef(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { locale, query } = router;
  const { teamId, projectId, historyId, customerId } = query;
  const dispatch = useDispatch();
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
        ({ content_name }) => content_name === formData(t)?.endPoint
      );
      if (cntType) {
        setContentType(cntType);
        return;
      }
    });
  }, [categories, t]);

  const onChangePage = (page) => {
    setCurrentPage(page);
    getHistory({
      id: articleTitleHistory?.id,
      contentName: contentType?.content_name,
      page,
      setHistoryState: setArticleTitleHistory,
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
      if (!data) {
        reject(new Error("data is empty"));
      }
      try {
        // generate copy
        setArticleTitleHistory(
          await generateCopies({
            type: ARTICLE_TITLE_CONTENT_TYPE_NAME,
            data,
            params: {
              project_id: projectId,
              history_id: articleTitleHistory?.id ?? uuidv4(),
              parent_history_id: historyId,
              parent_content_type_id: currentContentType.id,
              team_id: teamId,
              language,
            },
          })
        );
        // reset page
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

  const handleNext = async (copy: Copy) => {
    try {
      setIsSavingCopyId(true);
      await selectCopy({
        teamId,
        projectId,
        historyId: articleTitleHistory?.id,
        customerId,
        selectedOutputDataId: copy?.id,
      });
      setArticleTitle(copy);
      onChangeStep(1);
      // get blog Title
      const blogTitle = copy?.data?.text ?? "";
      // initialize article intro (Step2)
      if (articleIntroHistory) {
        setArticleIntroHistory({
          ...articleIntroHistory,
          inputs_data: {
            ...articleIntroHistory.inputs_data,
            blog_title: blogTitle,
          },
        });
      } else {
        setArticleIntroHistory({
          inputs_data: { blog_title: blogTitle },
        });
      }
      // initialize article outline (Step2)
      if (articleOutlineHistory) {
        updateArticleOutlineHistory({
          ...articleOutlineHistory,
          inputs_data: {
            ...articleOutlineHistory.inputs_data,
            blog_title: blogTitle,
          },
        });
      } else {
        updateArticleOutlineHistory({
          inputs_data: { blog_title: blogTitle },
        });
      }
    } catch (err) {
    } finally {
      if (mounted.current) {
        setIsSavingCopyId(false);
      }
    }
  };

  return (
    <>
      <section className="md:flex flex-col col-span-1 border-r border-solid overflow-y-auto">
        <ContentInputs
          formData={formData(t)}
          onSubmit={onSubmit}
          tips={tips}
          initLanguage={language}
          initInputsFromParent={articleTitleHistory?.inputs_data}
          onChangeLanguage={setLanguage}
          isAdblockCheckComplete={isAdblockCheckComplete}
          isAdblockerDetected={isAdblockerDetected}
        />
      </section>
      <section
        className="col-span-2 flex-1 relative bg-root flex flex-col rounded-b-lg md:round-r-lg relative overflow-x-hidden overflow-y-auto"
        ref={refCopy}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Variant
            isEmpty={!articleTitleHistory?.copies?.items?.length}
            emptyImage={
              <Image src={hand_pen} width={160} height={86} alt="hand_pen" />
            }
            content={
              <div className="p-8 overflow-y-auto">
                <RadioBoxes
                  userId={userId}
                  currentContentType={currentContentType}
                  history={articleTitleHistory}
                  setHistory={setArticleTitleHistory}
                  onNext={handleNext}
                  selectedCopy={articleTitle}
                  contentTypeName={contentTypeName}
                  isLoading={generatingCopies}
                />
              </div>
            }
          />
        </div>
        <Pagination
          total={articleTitleHistory?.copies?.total}
          size={articleTitleHistory?.copies?.size}
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
    userId: state?.user?.id,
    categories: state.main?.categories,
    generatingCopies: state?.template?.generatingCopy,
    leftCredits:
      (state.user?.credits?.one_time_credits ?? 0) +
      (state.user?.credits?.recurring_credits ?? 0) +
      (state.user?.credits?.lifetime_deal_credits ?? 0) +
      (state.user?.credits?.reward_credits ?? 0),
  };
};

export default connect(mapStateToPros)(Step1);
