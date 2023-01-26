import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Category, getCategories } from "../../api/category";
import {
  getLanguages,
  getSlayerEnabled,
  getSlayerModels,
  getTonOfVoices,
  Language,
  SlayerEnabled,
  SlayerModel,
  TonOfVoice,
} from "../../api/list";
import { WRITING_ASSISTANT_KEY } from "../../data/exceptData";
import { Template } from "../../data/templates";
import useContentType from "../../hooks/useContentType";
import {
  setCategories,
  setToastify,
  ToastStatus,
} from "../../store/main/actions";
import {
  setLanguages,
  setSlayerEnabled,
  setSlayerModels,
  setTonOfVoices,
} from "../../store/options/actions";
import {
  getCopies,
  getCopy,
  initTemplates,
  setIsLoadingHistory,
} from "../../store/template/actions";
import getErrorMessage from "../../utils/getErrorMessage";
import rootCustomerLinks from "../../utils/rootCutomerLink";
import Content from "../customer/template";
import SideBar from "../customer/template/sideNavbar";

interface TemplatePageProps {
  languages: Language[];
  slayerModels?: SlayerModel[];
  tonOfVoices: TonOfVoice[];
  categories: Category[];
  slayerEnabled: SlayerEnabled;
  isAdblockCheckComplete: boolean;
  isAdblockerDetected: boolean;
}

const TemplatePage: React.FC<TemplatePageProps> = ({
  languages,
  slayerModels,
  slayerEnabled,
  tonOfVoices,
  categories,
  isAdblockCheckComplete,
  isAdblockerDetected,
}) => {
  const router = useRouter();
  const { locale, query } = router;
  const {
    projectId,
    contentType,
    filter,
    page,
    historyId,
    copyId,
    teamId,
    customerId,
    generateCopy,
    p,
  } = query;
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentContentType, currentTemplate] = useContentType();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function initLanguages() {
      try {
        dispatch(setLanguages(await getLanguages()));
      } catch (err) {
        console.error(err);
      }
    }

    if (!languages) {
      initLanguages();
    }
  }, [dispatch, languages]);
  useEffect(() => {
    async function initSlayerModels() {
      try {
        dispatch(setSlayerModels(await getSlayerModels()));
      } catch (err) {
        console.error(err);
      }
    }

    if (!slayerModels) {
      initSlayerModels();
    }
  }, [dispatch, slayerModels]);

  useEffect(() => {
    async function initSlayerEnabled() {
      try {
        dispatch(setSlayerEnabled(await getSlayerEnabled()));
      } catch (err) {
        console.error(err);
      }
    }

    if (!slayerEnabled) {
      initSlayerEnabled();
    }
  }, [dispatch, slayerEnabled]);

  useEffect(() => {
    async function initTonOfVoices() {
      try {
        dispatch(setTonOfVoices(await getTonOfVoices()));
      } catch (err) {
        console.error(err);
      }
    }

    if (!tonOfVoices) {
      initTonOfVoices();
    }
  }, [dispatch, tonOfVoices]);

  useEffect(() => {
    async function initCategories() {
      //   get categoreis
      try {
        const data = await getCategories();
        dispatch(setCategories(data));
      } catch (err) {
        console.error(err);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: getErrorMessage(err),
          })
        );
      }
    }
    if (categories === null) {
      initCategories();
    }
  }, [dispatch, categories]);

  const initialize = useCallback(async () => {
    if (generateCopy || p) {
      return;
    }
    try {
      if (historyId && !copyId) {
        await dispatch(
          getCopies({
            filter,
            currentPage: page,
            historyId,
            contentType,
            projectId,
            customerId,
            teamId,
          })
        );
      } else if (copyId) {
        await dispatch(getCopy({ projectId, copyId, customerId, teamId }));
      } else {
        dispatch(initTemplates());
      }
    } catch (err) {
      router.push(
        customerId
          ? rootCustomerLinks(customerId)
          : teamId
          ? `\/${teamId}`
          : "/",
        undefined,
        { shallow: true }
      );
    } finally {
      dispatch(setIsLoadingHistory(false));
    }
  }, [
    generateCopy,
    p,
    historyId,
    copyId,
    dispatch,
    filter,
    page,
    contentType,
    projectId,
    customerId,
    teamId,
    router,
  ]);

  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <>
      <Head>
        <title>{currentContentType?.title[locale]}</title>
      </Head>
      <div
        className={classNames("flex-1 flex overflow-hidden bg-root relative")}
      >
        {currentContentType?.content_name !== WRITING_ASSISTANT_KEY && (
          <SideBar className="hidden xl:flex lg:flex-shrink-0" />
        )}
        <div className="flex flex-col w-0 flex-1 h-full">
          <Content
            isAdblockCheckComplete={isAdblockCheckComplete}
            isAdblockerDetected={isAdblockerDetected}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    languages: state?.options?.languages,
    tonOfVoices: state?.options?.tonOfVoices,
    categories: state.main?.categories,
    slayerEnabled: state?.options?.slayerEnabled,
    slayerModels: state?.options?.slayerModels,
  };
};

export default connect(mapStateToPros)(TemplatePage);
