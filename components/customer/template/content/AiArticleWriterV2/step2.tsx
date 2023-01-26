import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { ARTICLE_INTRO_CONTENT_TYPE_NAME, BaseStepProps } from ".";
import { generateCopies } from "../../../../../api/content";
import { ContentType } from "../../../../../api/contentType";
import { Copy } from "../../../../../api/copy";
import { selectCopy } from "../../../../../api/history";
import useContentType from "../../../../../hooks/useContentType";
import rect_man from "../../../../../public/images/modal/rect_man.png";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { getLeftCredits } from "../../../../../store/user/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import { segmentTrack } from "../../../../../utils/segment";
import ContentInputs, { ContentFormData, InputType } from "../contentInputs";
import Pagination from "./pagination";
import RadioBoxes from "./radioBoxes";
import Variant from "./variant";

const tips = `
  <strong>Title Input:</strong>
  1. The title can still be modified before generating an intro.
  2. Make sure that your title gives a general overview of what your article will be about.
  3. If you have directly reached step-2, please review the tips provided in step-1.

  <strong>Generated Intros:</strong>
  1. AI will automatically generate 5 different intro variations.
  2. Select the intro that best conveys your story to your audience.
  3. In case you are not satisfied with the generated intros, you can generate five more variants of them and select the best one.
  `;

const formData = (t: Translate): ContentFormData => {
  return {
    endPoint: "blog-intros",
    inputs: [
      {
        name: "blog_title",
        label: "Title",
        inputType: InputType.TextInput,
        placeholder:
          "How Artificial Intelligence Will Change The World Of Copywriting",
        tooltip: "The title of your blog or article.",
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
      name: "Generate Intros",
      reName: "Regenerate Intros",
    },
  };
};

interface Step2Props extends BaseStepProps {
  setArticleIntro: React.Dispatch<React.SetStateAction<Copy>>;
}

const Step2: React.FC<Step2Props> = ({
  setArticleIntro,
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
  setArticleTitleHistory,
  articleIntroHistory,
  setArticleIntroHistory,
  articleOutlineHistory,
  updateArticleOutlineHistory,
  getHistory,
  currentPage,
  setCurrentPage,
  articleIntro,
  contentTypeName,
  setIsSavingCopyId,
}) => {
  const mounted = useRef(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, query } = router;
  const { teamId, projectId, historyId, customerId } = router.query;
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
      id: articleIntroHistory?.id,
      contentName: contentType?.content_name,
      page,
      setHistoryState: setArticleIntroHistory,
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
        reject(new Error("Data is empty"));
      }
      try {
        setArticleIntroHistory(
          await generateCopies({
            type: ARTICLE_INTRO_CONTENT_TYPE_NAME,
            data,
            params: {
              project_id: projectId,
              history_id: articleIntroHistory?.id ?? uuidv4(),
              parent_history_id: historyId,
              parent_content_type_id: currentContentType.id,
              team_id: teamId,
              language,
            },
          })
        );
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
        historyId: articleIntroHistory?.id,
        customerId,
        selectedOutputDataId: copy?.id,
      });
      setArticleIntro(copy);
      onChangeStep(2);
      // get blog intro
      const blogIntro = copy?.data?.text ?? "";
      // initialize article outline (Step3)
      if (articleOutlineHistory) {
        updateArticleOutlineHistory({
          ...articleOutlineHistory,
          inputs_data: {
            ...articleOutlineHistory.inputs_data,
            blog_intro: blogIntro,
          },
        });
      } else {
        updateArticleOutlineHistory({
          inputs_data: { blog_intro: blogIntro },
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
      <section className="flex flex-col col-span-1 border-r border-solid overflow-y-auto">
        <ContentInputs
          formData={formData(t)}
          onSubmit={onSubmit}
          tips={tips}
          initInputsFromParent={articleIntroHistory?.inputs_data}
          initLanguage={language}
          onChangeLanguage={setLanguage}
          isAdblockCheckComplete={isAdblockCheckComplete}
          isAdblockerDetected={isAdblockerDetected}
        />
      </section>
      <section
        className="col-span-2 flex-1 relative bg-root flex flex-col rounded-b-lg md:round-r-lg  overflow-x-hidden overflow-y-auto relative"
        ref={refCopy}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Variant
            isEmpty={!articleIntroHistory?.copies?.items?.length}
            emptyImage={
              <Image src={rect_man} width={160} height={160} alt="rect_man" />
            }
            content={
              <div className="p-8">
                <RadioBoxes
                  userId={userId}
                  currentContentType={currentContentType}
                  history={articleIntroHistory}
                  setHistory={setArticleIntroHistory}
                  onNext={handleNext}
                  selectedCopy={articleIntro}
                  contentTypeName={contentTypeName}
                  isLoading={generatingCopies}
                />
              </div>
            }
          />
        </div>
        <Pagination
          total={articleIntroHistory?.copies?.total}
          size={articleIntroHistory?.copies?.size}
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
    generatingCopies: state?.template?.generatingCopy,
    userId: state?.user?.id,
    categories: state.main?.categories,
    leftCredits:
      (state.user?.credits?.one_time_credits ?? 0) +
      (state.user?.credits?.recurring_credits ?? 0) +
      (state.user?.credits?.lifetime_deal_credits ?? 0) +
      (state.user?.credits?.reward_credits ?? 0),
  };
};

export default connect(mapStateToPros)(Step2);
