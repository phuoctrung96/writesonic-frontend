import {
  INIT_USER,
  SET_BUSINESS_SUBSCRIPTION,
  SET_CREDITS,
  SET_FIRST_NAME,
  SET_HAS_DONE_TOUR1,
  SET_HAS_DONE_TOUR2,
  SET_IS_AUTHORIZED_BY_SEMRUSH,
  SET_IS_AUTHORIZED_BY_WORDPRESS,
  SET_LANGUAGE,
  SET_LAST_NAME,
  SET_LIFE_TIME_PLAN,
  SET_SUBSCRIPTION,
  SET_TEAMS,
  SET_USER,
  SET_USER_PREFERENCES,
} from "./actions";

const INITIAL_STATE = {
  email: null,
  firstName: null,
  lastName: null,
  role: null,
  stripe_customer_id: null,
  x_stripe_customer_id: null,
  providers: null,
  subscription: null,
  x_subscription: null,
  lifeTimePlan: null,
  language: "",
  credits: {
    recurring_credits: 0,
    lifetime_deal_credits: 0,
    one_time_credits: 0,
  },
  user_preferences: {
    slayer_model: "beauty",
    slayer_enabled: false,
  },
  teams: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_USER:
      return INITIAL_STATE;
    case SET_USER:
      const {
        id,
        email,
        phone_number,
        firstName,
        lastName,
        role,
        customer_role,
        photo_url,
        role_in_team,
        stripe_customer_id,
        x_stripe_customer_id,
        providers,
        credits,
        language,
        business_id,
        has_done_tour_1,
        has_done_tour_2,
        user_preferences,
        is_authorized_by_semrush,
        is_authorized_by_wordpress,
      } = action.payload;
      return {
        ...state,
        id,
        email,
        phone_number,
        firstName,
        lastName,
        role,
        customer_role,
        photo_url,
        role_in_team,
        stripe_customer_id,
        x_stripe_customer_id,
        providers,
        credits,
        language,
        business_id,
        has_done_tour_1,
        has_done_tour_2,
        is_authorized_by_semrush,
        is_authorized_by_wordpress,
        user_preferences,
      };

    case SET_FIRST_NAME:
      return { ...state, firstName: action.payload };
    case SET_LAST_NAME:
      return { ...state, lastName: action.payload };
    case SET_SUBSCRIPTION:
      return { ...state, subscription: action.payload };
    case SET_BUSINESS_SUBSCRIPTION:
      return { ...state, x_subscription: action.payload };
    case SET_LIFE_TIME_PLAN:
      return { ...state, lifeTimePlan: action.payload };
    case SET_LANGUAGE:
      return { ...state, language: action.payload };
    case SET_CREDITS:
      return { ...state, credits: action.payload };
    case SET_TEAMS:
      return { ...state, teams: action.payload };
    case SET_HAS_DONE_TOUR1:
      return { ...state, has_done_tour_1: action.payload };
    case SET_HAS_DONE_TOUR2:
      return { ...state, has_done_tour_2: action.payload };
    case SET_USER_PREFERENCES:
      return { ...state, user_preferences: action.payload };
    case SET_IS_AUTHORIZED_BY_SEMRUSH:
      return { ...state, is_authorized_by_semrush: action.payload };
    case SET_IS_AUTHORIZED_BY_WORDPRESS:
      return { ...state, is_authorized_by_wordpress: action.payload };
    default:
      return state;
  }
}
