import { generateCopies } from "../../api/content";
import { isCanceled } from "../../utils/authRequest";

export const FETCH_ARTICLE_TITLES: string = "FETCH_ARTICLE_TITLES";
export const SET_ARTICLE_TITLE: string = "SET_ARTICLE_TITLE";
export const FETCH_ARTICLE_INTROS: string = "FETCH_ARTICLE_INTROS";
export const SET_ARTICLE_INTRO: string = "SET_ARTICLE_INTRO";
export const FETCH_ARTICLE_OUTLINES: string = "FETCH_ARTICLE_OUTLINES";
export const SET_ARTICLE_OUTLINE: string = "SET_ARTICLE_OUTLINE";
export const SET_USER_ADDED_OUTLINES: string = "SET_USER_ADDED_OUTLINES";
export const INIT_ARTICLE_WRITER: string = "INIT_ARTICLE_WRITER";
export const SET_AI_ARTICLE_QUILL: string = "SET_AI_ARTICLE_QUILL";
export const SET_OUTLINES_TOGGLE: string = "SET_OUTLINES_TOGGLE";

export const initArticleWriter = () => {
  return { type: INIT_ARTICLE_WRITER };
};

export const setAiArticleQuill = (quill: any) => {
  return { type: SET_AI_ARTICLE_QUILL, payload: quill };
};

export const fetchArticleTitles =
  ({
    data,
    teamId,
    projectId,
    historyId,
    language = "en",
  }: {
    data: any;
    teamId: string | string[];
    projectId: string | string[];
    historyId: string | string[];
    language?: string | string[];
  }) =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const { title, isLiked } = state.template;
      const { new_copies } = await generateCopies({
        type: "blog-ideas",
        data,
        params: {
          title,
          is_liked: isLiked,
          project_id: projectId,
          history_id: historyId,
          want_recording: false,
          team_id: teamId,
          language,
        },
        paginate: false,
      });
      dispatch({ type: FETCH_ARTICLE_TITLES, payload: new_copies });
    } catch (err) {
      if (!isCanceled(err)) {
        throw err;
      }
    }
  };

export const setArticleTitle = (title: string) => {
  return { type: SET_ARTICLE_TITLE, payload: title };
};

export const fetchArticleIntros =
  ({
    data,
    teamId,
    projectId,
    historyId,
    language = "en",
  }: {
    data: any;
    teamId: string | string[];
    projectId: string | string[];
    historyId: string | string[];
    language?: string | string[];
  }) =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const { title, isLiked } = state.template;
      const { new_copies } = await generateCopies({
        type: "blog-intros",
        data,
        params: {
          title,
          is_liked: isLiked,
          project_id: projectId,
          history_id: historyId,
          language,
          want_recording: false,
          team_id: teamId,
        },
        paginate: false,
      });
      dispatch({ type: FETCH_ARTICLE_INTROS, payload: new_copies });
    } catch (err) {
      if (!isCanceled(err)) {
        throw err;
      }
    }
  };

export const setArticleIntro = (title: string) => {
  return { type: SET_ARTICLE_INTRO, payload: title };
};

export const fetchArticleOutlines =
  ({
    data,
    teamId,
    projectId,
    historyId,
    language = "en",
  }: {
    data: any;
    teamId: string | string[];
    projectId: string | string[];
    historyId: string | string[];
    language?: string | string[];
  }) =>
  async (dispatch, getState) => {
    try {
      const state = getState();
      const { title, isLiked } = state.template;
      const { new_copies } = await generateCopies({
        type: "blog-outlines",
        data,
        params: {
          title,
          is_liked: isLiked,
          project_id: projectId,
          history_id: historyId,
          language,
          want_recording: false,
          team_id: teamId,
        },
        paginate: false,
      });
      new_copies.forEach(({ data }) => {
        let sections = [];
        data["text"].split("\n").forEach((section) => {
          if (section.includes("Section ") || section.includes("Subsection ")) {
            section = section.substring(section.indexOf(": ") + 2);
          }
          if (section) {
            sections.push(section);
          }
        });
        data["text"] = sections;
      });
      dispatch({ type: FETCH_ARTICLE_OUTLINES, payload: new_copies });
    } catch (err) {
      if (!isCanceled(err)) {
        throw err;
      }
    }
  };

export const setArticleOutline = (outline: Object[]) => {
  return { type: SET_ARTICLE_OUTLINE, payload: outline };
};

export const setUserAddedOutlines = (outline: Object[]) => {
  return { type: SET_USER_ADDED_OUTLINES, payload: outline };
};

export const setOutlinesToggle = (toggle: boolean) => {
  return { type: SET_OUTLINES_TOGGLE, payload: toggle };
};
