import {
  FETCH_ARTICLE_INTROS,
  FETCH_ARTICLE_OUTLINES,
  FETCH_ARTICLE_TITLES,
  INIT_ARTICLE_WRITER,
  SET_AI_ARTICLE_QUILL,
  SET_ARTICLE_INTRO,
  SET_ARTICLE_OUTLINE,
  SET_ARTICLE_TITLE,
  SET_OUTLINES_TOGGLE,
  SET_USER_ADDED_OUTLINES,
} from "./actions";

const INITIAL_STATE = {
  articleTitles: [],
  articleTitle: "",
  articleIntros: [],
  articleIntro: "",
  articleOutlines: [],
  articleOutline: [],
  userAddedOutlines: [],
  quill: null,
  outlinesToggle: false,
};

export default function articleWriter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_ARTICLE_WRITER:
      return INITIAL_STATE;
    case FETCH_ARTICLE_TITLES:
      return { ...state, articleTitles: action.payload };
    case SET_ARTICLE_TITLE:
      return { ...state, articleTitle: action.payload };
    case FETCH_ARTICLE_INTROS:
      return { ...state, articleIntros: action.payload };
    case SET_ARTICLE_INTRO:
      return { ...state, articleIntro: action.payload };
    case FETCH_ARTICLE_OUTLINES:
      return { ...state, articleOutlines: action.payload };
    case SET_ARTICLE_OUTLINE:
      return { ...state, articleOutline: action.payload };
    case SET_USER_ADDED_OUTLINES:
      return { ...state, userAddedOutlines: action.payload };
    case SET_AI_ARTICLE_QUILL:
      return { ...state, quill: action.payload };
    case SET_OUTLINES_TOGGLE:
      return { ...state, outlinesToggle: action.payload };

    default:
      return state;
  }
}
