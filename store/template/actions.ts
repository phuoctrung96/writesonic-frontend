import { NextRouter } from "next/router";
import { generateCopies } from "../../api/content";
import {
  changeCopy as changeCopyAxios,
  Copy,
  deleteCopy as deleteCopyAxios,
  getSavedCopy,
  saveCopy as saveCopyAxios,
  unSaveCopy as unSaveCopyAxios,
} from "../../api/copy";
import { getLeftCredits as getLeftCreditsAxios } from "../../api/credit_v2";
import {
  getAllHistoryById,
  getAllHistoryPerPageById,
  getSavedHistoryPerPageById,
  History,
} from "../../api/history";
import { isCanceled } from "../../utils/authRequest";
import capitalize from "../../utils/capitalize";
import { compareCopy } from "../../utils/compareCopy";
import getErrorMessage from "../../utils/getErrorMessage";
import rootCustomerLinks from "../../utils/rootCutomerLink";
import { segmentTrack } from "../../utils/segment";
import { setToastify, ToastStatus } from "../main/actions";

export const LOADING_COPY: string = "LOADING_COPY";
export const GENERATING_COPY: string = "GENERATING_COPY";
export const SET_TEMPLATE: string = "SET_TEMPLATE";
export const SET_TITLE: string = "SET_TITLE";
export const LIKE: string = "LIKE";
export const SET_COPIES: string = "SET_COPIES";
export const INIT_TEMPLATE: string = "INIT_TEMPLATE";
export const LOADING_HISTORY: string = "LOADING_HISTORY";
export const SET_INPUTS: string = "SET_INPUTS";

const DELAY_COMPLETED: number = 600;

export const setTitle = (title: string) => {
  return { type: SET_TITLE, payload: title };
};

export const setLike = (like: boolean) => {
  return { type: LIKE, payload: like };
};

export const setIsGeneratingCopy = (value: boolean) => {
  return { type: GENERATING_COPY, payload: value };
};

export const setIsLoadingHistory = (value: boolean) => {
  return { type: LOADING_HISTORY, payload: value };
};

export const setIsLoadingCopy = (value: boolean) => {
  return { type: LOADING_COPY, payload: value };
};

export const setInputData = (inputs: any) => {
  return { type: SET_INPUTS, payload: inputs };
};

export const createCopies =
  ({
    type,
    data,
    teamId,
    userId,
    projectId,
    historyId,
    creditCount = 0,
    templateName,
    wantToRemoveOldCopies = false,
    customerId,
    paginate,
    language,
    slayer_model,
    subscription,
    router,
  }: {
    type: string;
    data: { [key: string]: any };
    teamId: string | string[];
    userId: string;
    projectId: string | string[];
    historyId: string | string[];
    creditCount?: number;
    templateName: string;
    wantToRemoveOldCopies?: boolean;
    customerId: string | string[];
    paginate: boolean;
    language: string;
    slayer_model?: string;
    subscription?: any;
    router: NextRouter;
  }) =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const { title: inputTitle, isLiked } = state.template;
      dispatch(setIsGeneratingCopy(true));
      dispatch(setIsLoadingCopy(true));
      const { copies, inputs_data, title, is_liked } = await generateCopies({
        type,
        data,
        params: {
          title: inputTitle,
          is_liked: isLiked,
          project_id: projectId,
          history_id: historyId,
          team_id: teamId,
          language,
          want_to_remove_old_copies: wantToRemoveOldCopies,
          customer_id: customerId,
          slayer_model: slayer_model,
        },
        paginate,
      });
      const { items, total, page, size } = copies
        ? copies
        : { items: [], total: null, page: null, size: null };
      if (type === "content-rephrase") {
        items?.forEach((item: Copy) => {
          let obj = {};
          obj["text"] = compareCopy(data.content_to_rephrase, item.data.text);
          item["highlighted_data"] = obj;
        });
      }
      dispatch({
        type: SET_TEMPLATE,
        payload: {
          title: title ? title : "",
          isLiked: is_liked,
          inputs: inputs_data,
          copies: items,
          page,
          size,
          total,
        },
      });
      // track by segment
      const credits = await getLeftCreditsAxios({ team_id: teamId });
      const allCredits =
        credits["recurring_credits"] +
        credits["one_time_credits"] +
        credits["lifetime_deal_credits"] +
        credits["reward_credits"];

      window["analytics"]?.identify(userId, {
        remainingCredits: allCredits,
      });

      segmentTrack("Copy Generated", {
        userId,
        teamId,
        projectId,
        templateName: templateName ?? capitalize(type?.replaceAll(/-/g, " ")),
        creditCount,
        remainingCredits: allCredits,
      });
      // track end
    } catch (err) {
      if (isCanceled(err)) {
        return;
      }

      getErrorMessage(err) === "Please purchase credits."
        ? (dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: subscription
                ? "You have consumed all your subscription credits. Please upgrade your plan to keep writing."
                : "You have consumed all your free trial credits. Please upgrade to a paid plan to keep writing.",
            })
          ),
          router.push(
            teamId ? `/${teamId}/settings/billing` : "/settings/billing"
          ))
        : dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: getErrorMessage(err) ?? "Request Error",
            })
          );
    } finally {
      dispatch(setIsGeneratingCopy(false));
      dispatch(setIsLoadingCopy(false));
    }
  };

export const setHistory =
  ({ copies, inputs_data, title, is_liked, sub_histories }: History) =>
  (dispatch) => {
    const { items, total, page, size } = copies
      ? copies
      : { items: [], total: null, page: null, size: null };
    dispatch({
      type: SET_TEMPLATE,
      payload: {
        title: title ? title : "",
        isLiked: is_liked,
        inputs: inputs_data,
        copies: items,
        page,
        size,
        total,
        subHistories: sub_histories,
      },
    });
  };

export const getCopies =
  ({
    filter,
    currentPage,
    historyId,
    contentType,
    projectId,
    customerId,
    teamId,
  }: {
    filter: string | string[];
    currentPage: number | string | string[];
    historyId: string | string[];
    contentType: string | string[];
    projectId: string | string[];
    customerId: string | string[];
    teamId: string | string[];
  }) =>
  async (dispatch) => {
    try {
      dispatch(setIsLoadingCopy(true));
      const fetchFunction =
        filter === "saved"
          ? getSavedHistoryPerPageById
          : contentType === "landing-pages" ||
            contentType.includes("ai-article-writer")
          ? getAllHistoryById
          : getAllHistoryPerPageById;
      const res = await fetchFunction({
        historyId,
        projectId,
        contentName: contentType,
        page: currentPage,
        customerId,
        teamId,
      });
      if (res) {
        if (contentType === "content-rephrase") {
          const input = res?.inputs_data?.content_to_rephrase ?? "";
          res.copies?.items?.forEach((item: Copy) => {
            let obj = {};
            obj["text"] = compareCopy(input, item.data.text);
            item["highlighted_data"] = obj;
          });
        }
        dispatch(setHistory(res));
      }
    } catch (err) {
      throw err;
    } finally {
      setTimeout(() => {
        dispatch(setIsLoadingCopy(false));
      }, DELAY_COMPLETED);
    }
  };

export const initTemplates = () => {
  return { type: INIT_TEMPLATE };
};
export const editCopy =
  ({
    id,
    data,
    rating,
    customerId,
    teamId,
    isUpdateDate = true,
  }: {
    id: string;
    data?: { [key: string]: string };
    rating?: number;
    customerId: string | string[];
    teamId: string | string[];
    isUpdateDate?: boolean;
  }) =>
  async (dispatch, getState) => {
    let newCopy = await changeCopyAxios({
      copyId: id,
      copyData: data,
      rating,
      customerId,
      teamId,
      isUpdateDate,
    });
    const { template } = getState();
    if (template?.inputs?.content_to_rephrase) {
      let obj = {};
      const input = template?.inputs?.content_to_rephrase ?? "";
      obj["text"] = compareCopy(input, newCopy.data.text);
      newCopy["highlighted_data"] = obj;
    }
    dispatch({
      type: SET_COPIES,
      payload: template?.copies?.map((copy) =>
        copy.id === newCopy.id ? newCopy : copy
      ),
    });
  };

export const saveCopy =
  ({
    copyId,
    teamId,
    historyId,
    customerId,
  }: {
    copyId: string | string[];
    teamId: string | string[];
    historyId: string | string[];
    customerId: string | string[];
  }) =>
  async (dispatch, getState) => {
    const newCopy = await saveCopyAxios({ copyId, customerId, teamId });
    const { template, user, main } = getState();
    const { id: userId } = user;
    const { currentProject, currentTemplate } = main;
    // track by segment
    segmentTrack("Copy Saved", {
      projectId: currentProject?.id,
      userId,
      teamId,
      templateName: currentTemplate?.title,
      historyId,
    });
    // track end
    if (template?.inputs?.content_to_rephrase) {
      let obj = {};
      const input = template?.inputs?.content_to_rephrase ?? "";
      obj["text"] = compareCopy(input, newCopy.data.text);
      newCopy["highlighted_data"] = obj;
    }
    dispatch({
      type: SET_COPIES,
      payload: template?.copies?.map((copy) =>
        copy.id === newCopy.id ? newCopy : copy
      ),
    });
  };

export const unSaveCopy =
  ({
    copyId,
    teamId,
    historyId,
    customerId,
  }: {
    copyId: string;
    teamId: string | string[];
    historyId: string | string[];
    customerId: string | string[];
  }) =>
  async (dispatch, getState) => {
    const newCopy = await unSaveCopyAxios({ copyId, customerId, teamId });
    const { template, user, main } = getState();
    const { id: userId } = user;
    const { currentProject, currentTemplate } = main;
    // track by segment
    segmentTrack("Copy UnSaved", {
      projectId: currentProject?.id,
      userId,
      teamId,
      templateName: currentTemplate?.title,
      historyId,
    });
    // track end
    if (template?.inputs?.content_to_rephrase) {
      let obj = {};
      const input = template?.inputs?.content_to_rephrase ?? "";
      obj["text"] = compareCopy(input, newCopy.data.text);
      newCopy["highlighted_data"] = obj;
    }
    dispatch({
      type: SET_COPIES,
      payload: template?.copies?.map((copy) =>
        copy.id === newCopy.id ? newCopy : copy
      ),
    });
  };

export const deleteCopy =
  ({
    id,
    router,
    customerId,
    teamId,
  }: {
    id: string;
    router: NextRouter;
    customerId: string | string[];
    teamId: string | string[];
  }) =>
  async (dispatch, getState) => {
    const newCopy = await deleteCopyAxios({ id, customerId, teamId });
    const { template, user, main } = getState();
    const { id: userId } = user;
    const { currentProject, currentTemplate } = main;
    const {
      projectId,
      contentType,
      historyId,
      teamId: queryTeamId,
    } = router.query;
    // track by segment
    segmentTrack("Copy Deleted", {
      projectId: currentProject?.id,
      userId,
      queryTeamId,
      templateName: currentTemplate?.title,
      historyId,
    });
    // track end
    dispatch({
      type: SET_COPIES,
      payload: template.copies.filter((copy) => copy.id !== newCopy.id),
    });

    const query = { filter: "All" };
    router.push(
      {
        pathname: customerId
          ? `\/${rootCustomerLinks(
              customerId
            )}\/template\/${projectId}\/${contentType}/${historyId}`
          : teamId
          ? `\/${teamId}\/template\/${projectId}\/${contentType}/${historyId}`
          : `\/template\/${projectId}\/${contentType}/${historyId}`,
        query,
      },
      undefined,
      { shallow: true }
    );
  };

export const getCopy =
  ({
    copyId,
    customerId,
    projectId,
    teamId,
  }: {
    copyId: string | string[];
    customerId: string | string[];
    projectId: string | string[];
    teamId: string | string[];
  }) =>
  async (dispatch) => {
    try {
      dispatch(setIsLoadingCopy(true));

      const { id, title, is_liked, inputs_data, copy_data, time } =
        await getSavedCopy({ projectId, copyId, customerId, teamId });
      dispatch({
        type: SET_TEMPLATE,
        payload: {
          title: title ? title : "",
          isLiked: is_liked,
          inputs: inputs_data,
          copies: [copy_data],
        },
      });
    } catch (err) {
      throw err;
    } finally {
      dispatch(setIsLoadingCopy(false));
    }
  };
