import {
  getBusinessSubscription as getBusinessSubscriptionAxios,
  getLeftCredits as getLeftCreditsAxios,
  getLifeTimePlan as getLifeTimePlanAxios,
  getSubscription as getSubscriptionAxios,
  reactiveSubscription as reactiveSubscriptionAxios,
  SubscriptionV2,
  updateSubscription as updateSubscriptionAxios,
  updateXPlan as updateXPlanAxios,
  XSubscription,
} from "../../api/credit_v2";
import { TeamInfo } from "../../api/team";
import { UserInfo } from "../../api/user";

export const INIT_USER: string = "INIT_USER";
export const SET_USER: string = "SET_USER";
export const SET_FIRST_NAME: string = "SET_NAME";
export const SET_LAST_NAME: string = "SET_LAST_NAME";
export const SET_SUBSCRIPTION: string = "SET_SUBSCRIPTION";
export const SET_LANGUAGE: string = "SET_LANGUAGE";
export const SET_CREDITS: string = "SET_CREDITS";
export const SET_LIFE_TIME_PLAN: string = "SET_LIFE_TIME_PLAN";
export const SET_TEAMS: string = "SET_TEAMS";
export const SET_USER_SEATS: string = "SET_USER_SEATS";
export const SET_BUSINESS_SUBSCRIPTION: string = "SET_BUSINESS_SUBSCRIPTION";
export const SET_HAS_DONE_TOUR1: string = "SET_HAS_DONE_TOUR1";
export const SET_HAS_DONE_TOUR2: string = "SET_HAS_DONE_TOUR2";
export const SET_IS_AUTHORIZED_BY_SEMRUSH = "SET_IS_AUTHORIZED_BY_SEMRUSH";
export const SET_IS_AUTHORIZED_BY_WORDPRESS = "SET_IS_AUTHORIZED_BY_WORDPRESS";
export const SET_USER_PREFERENCES: string = "SET_SLAYER_PREFERENCES";

export const initUser = () => {
  return { type: INIT_USER };
};

export const setUser = (res: UserInfo) => (dispatch) => {
  dispatch({
    type: SET_USER,
    payload: res,
  });
};

export const setName = (firstName, lastName) => (dispatch) => {
  dispatch({ type: SET_FIRST_NAME, payload: firstName });
  dispatch({ type: SET_LAST_NAME, payload: lastName });
};

export const getSubscription =
  ({
    teamId,
    customerId,
  }: {
    teamId: string | string[];
    customerId?: string | string[];
  }) =>
  async (dispatch) => {
    try {
      const subscription = await getSubscriptionAxios({ teamId, customerId });
      dispatch({ type: SET_SUBSCRIPTION, payload: subscription });
    } catch (err) {
      dispatch({ type: SET_SUBSCRIPTION, payload: null });
      throw err;
    }
  };

export const setSubscription = (subscription: SubscriptionV2) => {
  return { type: SET_SUBSCRIPTION, payload: subscription };
};

export const getBusinessSubscription =
  ({ customerId }: { customerId?: string | string[] }) =>
  async (dispatch) => {
    try {
      const subscription = await getBusinessSubscriptionAxios({
        customerId,
      });
      dispatch({ type: SET_BUSINESS_SUBSCRIPTION, payload: subscription });
    } catch (err) {
      dispatch({ type: SET_BUSINESS_SUBSCRIPTION, payload: null });
      throw err;
    }
  };

export const setBusinessSubscription = (subscription: XSubscription) => {
  return { type: SET_BUSINESS_SUBSCRIPTION, payload: subscription };
};

export const getLifeTimePlan =
  (teamId: string | string[]) => async (dispatch) => {
    try {
      const lifeTimePlan = await getLifeTimePlanAxios(teamId);
      dispatch({ type: SET_LIFE_TIME_PLAN, payload: lifeTimePlan });
    } catch (err) {
      dispatch({ type: SET_LIFE_TIME_PLAN, payload: null });
    }
  };

export const updateLanguage = (language: string) => {
  return { type: SET_LANGUAGE, payload: language };
};

export const updateUserPreferences = (payload) => {
  return { type: SET_USER_PREFERENCES, payload: payload };
};

export const getLeftCredits =
  (teamId: string | string[]) => async (dispatch) => {
    const credits = await getLeftCreditsAxios({ team_id: teamId });
    dispatch({ type: SET_CREDITS, payload: credits });
  };

export const updateSubscription =
  ({
    stripePriceId,
    stripeSubscriptionId,
    teamId,
    removeMembers,
  }: {
    stripePriceId: string;
    stripeSubscriptionId: string;
    teamId: string | string[];
    removeMembers: string[];
  }) =>
  async (dispatch, getState) => {
    try {
      const { subscription: newSubscription, credits } =
        await updateSubscriptionAxios({
          stripePriceId,
          stripeSubscriptionId,
          teamId,
          removeMembers,
        });

      dispatch({ type: SET_SUBSCRIPTION, payload: newSubscription });
      dispatch({ type: SET_CREDITS, payload: credits });
    } catch (err) {
      throw err;
    }
  };

// export const updatePaypalPlan =
//   ({
//     paypalSubscriptionId,
//     paypalPlanId,
//     removeMembers,
//     teamId,
//   }: {
//     paypalSubscriptionId: string;
//     paypalPlanId: string;
//     removeMembers: string[];
//     teamId: string | string[];
//   }) =>
//   async (dispatch, getState) => {
//     try {
//       const {
//         subscription: newSubscription,
//         credits,
//         user_seats,
//       } = await updatePaypalPlanAxios({
//         paypalSubscriptionId,
//         paypalPlanId,
//         removeMembers,
//         teamId,
//       });

//       dispatch({ type: SET_SUBSCRIPTION, payload: newSubscription });
//       dispatch({ type: SET_CREDITS, payload: credits });
//       dispatch({ type: SET_USER_SEATS, payload: user_seats });
//     } catch (err) {
//       throw err;
//     }
//   };

export const updateXPlan =
  ({
    priceId,
    stripeSubscriptionId,
    coupon,
    businessId,
  }: {
    priceId: string;
    stripeSubscriptionId: string;
    coupon: string;
    businessId: string;
  }) =>
  async (dispatch, getState) => {
    try {
      const { subscription: newSubscription } = await updateXPlanAxios({
        priceId,
        stripeSubscriptionId,
        coupon,
        businessId,
      });

      dispatch({ type: SET_BUSINESS_SUBSCRIPTION, payload: newSubscription });
    } catch (err) {
      throw err;
    }
  };

export const setTeams = (teams: TeamInfo[]) => {
  return { type: SET_TEAMS, payload: teams };
};

export const setHasDoneTour1 = (value: boolean) => {
  return { type: SET_HAS_DONE_TOUR1, payload: value };
};

export const setHasDoneTour2 = (value: boolean) => {
  return { type: SET_HAS_DONE_TOUR2, payload: value };
};

export const setIsAuthorizedBySemrush = (value: boolean) => {
  return { type: SET_IS_AUTHORIZED_BY_SEMRUSH, payload: value };
};

export const setIsAuthorizedByWordpress = (value: boolean) => {
  return { type: SET_IS_AUTHORIZED_BY_WORDPRESS, payload: value };
};

export const reactSubscription = () => async (dispatch) => {
  try {
    const subscription = await reactiveSubscriptionAxios();
    dispatch({ type: SET_SUBSCRIPTION, payload: subscription });
  } catch (err) {
    dispatch({ type: SET_SUBSCRIPTION, payload: null });
    throw err;
  }
};
