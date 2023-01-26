import axios from "axios";
import authRequest from "../../utils/authRequest";
import {
  BusinessBallance,
  BusinessSummaryPerType,
  XCreditHistorySummaryFilterOptions,
} from "../business/business";
import { SubscriptionV2, XSubscription } from "../credit_v2";
import { TeamMemberRole } from "../team";
import { UserRole } from "../user";
import { XEngine } from "./engine";

const baseUrl = "/admin/user";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo_url: string;
  email_verified: boolean;
  phone_number: string;
  phone_verified: boolean;
  providers: [];
  credits_used_today: number;
  recurring_credits_used_this_month: { period: string; credits: number };
  unknown_recurring_credits_used_this_month: number;
  lifetime_credits_used_this_month: number;
  one_time_credits_used_this_month: number;
  reward_credits_used_this_month: number;
  one_time_credits: number;
  recurring_credits: number;
  reward_credits: number;
  lifetime_deal_credits: number;
  // used_credits?: number;
  subscription?: SubscriptionV2;
  x_subscription?: XSubscription;
  last_signed_date: string;
  last_used_date?: string;
  created_date: string;
  role: UserRole;
  last_payment_on: string;
  upcoming_invoice_on: string;
  upcoming_invoice_amount: number;
  x_last_payment_on: string;
  x_upcoming_invoice_on: string;
  x_upcoming_invoice_amount: number;
  lifetime_deal_codes: {
    appsumo: LifeTimeCode[];
    dealify: LifeTimeCode[];
    stack_social: LifeTimeCode[];
  };
  team_info: {
    name: string;
    members: {
      user_id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: TeamMemberRole;
    }[];
    pending_users: {
      id: string;
      email: string;
      role: TeamMemberRole;
      created_date: string;
    }[];
  };
  business?: {
    id: string;
    api_key: string;
    business_rate: number;
    is_active: boolean;
    x_engine: XEngine;
  };
  is_in_fb: boolean;
  is_grey_user: boolean;
  is_banned_user: boolean;
}

export interface AdminDashboardOutputUser {
  id: string;
  full_name: string;
  email: string;
  grey_id: string;
  plan_name: string;
  plan_interval: string;
  plan_price: number;
  last_payment_on: string;
  is_subscription_canceled: boolean;
  recurring_credit_usage_last_3_renewal_months: any;
  unknown_recurring_credit_usage_last_3_renewal_months: any;
  lifetime_credit_usage_last_3_months: any;
  one_time_credit_usage_last_3_months: any;
  reward_credit_usage_last_3_months: any;
  recurring_credit_usage_last_7_days: any;
  lifetime_credit_usage_last_7_days: any;
  one_time_credit_usage_last_7_days: any;
  reward_credit_usage_last_7_days: any;
}

export interface AdminCreatedUsersOutput {
  user_id: string;
  full_name: string;
  email: string;
  password: string;
  one_time_credits: number;
}

export interface AdminCreatedUsersDashboardOutput {
  user_id: string;
  full_name: string;
  email: string;
  one_time_credits: number;
}

export interface LifeTimeCode {
  id: string;
  code: string;
  is_redeemed: boolean;
}

export interface DeletedUserInfo {
  appsumo: number;
  dealify: number;
  stack_social: number;
  default_card: number;
  subscription: number;
  input_data: number;
  output_data: number;
  history: number;
  project: number;
  credit_history: number;
  invite: number;
  pending_user: number;
  team_member: number;
  team: number;
}

export interface CountBusinessUser {
  all: number;
  active: number;
  inactive: number;
}

export const getAllUsers = (
  page: number,
  search_key: string
): Promise<{
  items: AdminDashboardOutputUser[];
  total: number;
  page: number;
  size: number;
}> => {
  return new Promise((resolve, reject) => {
    const params = {
      page: page ?? 1,
      size: 20,
    };
    const data = {
      search_key,
    };
    authRequest({ url: `${baseUrl}/get-all`, method: "post", params, data })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getAllBusinessUsers = (
  page: number,
  search_key: string
): Promise<{
  items: Customer[];
  total: number;
  page: number;
  size: number;
}> => {
  return new Promise((resolve, reject) => {
    const params = {
      page: page ?? 1,
      size: 20,
      search_key,
    };
    authRequest({ url: `${baseUrl}/get-all-business`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getUser = (id): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/get-user/${id}`, method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const deleteUser = (id): Promise<DeletedUserInfo> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/delete-user/${id}`, method: "post" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateName = ({
  id,
  first_name,
  last_name,
}: {
  id: string;
  first_name: string;
  last_name: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    const params = { first_name, last_name };
    authRequest({
      url: `${baseUrl}/update-name/${id}`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateEmail = ({
  id,
  email,
}: {
  id: string;
  email: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    const params = { email };
    authRequest({
      url: `${baseUrl}/update-email/${id}`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updatePassword = ({
  id,
  password,
}: {
  id: string;
  password: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    const params = { password };
    authRequest({
      url: `${baseUrl}/update-password/${id}`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateRole = ({
  id,
  role,
}: {
  id: string;
  role: UserRole;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-role`,
      method: "post",
      data: {
        id,
        role,
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateCredits = ({
  id,
  recurring_credits,
  one_time_credits,
  lifetime_deal_credits,
  reward_credits,
}: {
  id: string;
  recurring_credits: number;
  one_time_credits: number;
  lifetime_deal_credits: number;
  reward_credits: number;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-credits`,
      method: "post",
      data: {
        id,
        recurring_credits,
        one_time_credits,
        lifetime_deal_credits,
        reward_credits,
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updatePlanOfUser = (data: {
  id: string;
  stripe_subscription_id: string;
  price_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-plan-of-user`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updatePaypalPlanOfUser = (data: {
  id: string;
  paypal_subscription_id: string;
  paypal_plan_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-paypal-plan-of-user`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateXPlanOfUser = ({
  id,
  stripe_subscription_id,
  price_id,
  business_id,
}: {
  id: string;
  stripe_subscription_id: string;
  price_id: string;
  business_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-x-plan-of-user`,
      method: "post",
      data: {
        id,
        stripe_subscription_id,
        price_id,
        business_id,
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const cancelPlanOfUser = (data: {
  id: string;
  stripe_subscription_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/cancel-plan-of-user`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const reactiveSubscription = (data: {
  id: string;
  stripe_subscription_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/reactive-subscription`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelPaypalPlanOfUser = (data: {
  id: string;
  paypal_subscription_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/cancel-paypal-plan-of-user`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const cancelXPlanOfUser = ({
  id,
  stripe_subscription_id,
}: {
  id: string;
  stripe_subscription_id: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/cancel-x-plan-of-user`,
      method: "post",
      data: {
        id,
        stripe_subscription_id,
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateStackSocial = (data: {
  email: string;
  code: string;
}): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-stack-social`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const createUser = (data: {
  full_name: string;
  email: string;
  one_time_credits: number;
}): Promise<AdminCreatedUsersOutput> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/create-user`,
      method: "post",
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getAllAdminCreatedUsers = (
  page: number,
  search_key: string
): Promise<{
  items: AdminCreatedUsersDashboardOutput[];
  total: number;
  page: number;
  size: number;
}> => {
  return new Promise((resolve, reject) => {
    const params = {
      page: page ?? 1,
      size: 20,
    };
    const data = {
      search_key,
    };
    authRequest({
      url: `${baseUrl}/get-all-admin-created-users`,
      method: "post",
      params,
      data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const setBusiness = ({ id }: { id: string }): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/set-business`,
      method: "post",
      params: {
        id,
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const unsetBusiness = ({ id }: { id: string }): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/unset-business`,
      method: "post",
      params: {
        id,
      },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const updateApiKey = (id: string): Promise<Customer> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/update-api-key/${id}`, method: "post" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const countUsers = (): Promise<CountBusinessUser> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/count-users`, method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getBusinessSummaryPerTypeOnAdmin = (
  data: {
    business_id: string;
    month: string;
    x_engine_id: string | number;
  },
  owner_id: string
): Promise<BusinessSummaryPerType> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/get-summary-per-type`,
      method: "post",
      data,
      params: { owner_id },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getSummaryFilterOptionsOnAdmin = (
  business_id: string,
  owner_id: string
): Promise<XCreditHistorySummaryFilterOptions[]> => {
  return new Promise((resolve, reject) => {
    const params = { business_id, owner_id };
    authRequest({
      url: `${baseUrl}/get-summary-filter-options`,
      method: "get",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getCurrentBallanceOnAdmin = (
  business_id: string,
  owner_id: string
): Promise<BusinessBallance> => {
  return new Promise((resolve, reject) => {
    const params = { business_id, owner_id };
    authRequest({
      url: `${baseUrl}/get-current-ballance`,
      method: "get",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const setPhoneVerified = (
  customerId: string,
  verified: boolean
): Promise<BusinessBallance> => {
  return new Promise((resolve, reject) => {
    const params = { verified };
    authRequest({
      url: `${baseUrl}/set-phone-verified/${customerId}`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const setEmailVerified = (
  customerId: string,
  verified: boolean
): Promise<BusinessBallance> => {
  return new Promise((resolve, reject) => {
    const params = { verified };
    authRequest({
      url: `${baseUrl}/set-email-verified/${customerId}`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const setGreyUser = (
  customerId: string,
  set: boolean
): Promise<BusinessBallance> => {
  return new Promise((resolve, reject) => {
    const params = { set };
    authRequest({
      url: `${baseUrl}/set-grey-user/${customerId}`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const setBannedUser = (
  customerId: string,
  set: boolean
): Promise<BusinessBallance> => {
  return new Promise((resolve, reject) => {
    const params = { set };
    authRequest({
      url: `${baseUrl}/set-banned-user/${customerId}`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const checkEmail = (email: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const headers = {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_KEY,
      "x-rapidapi-host": "mailcheck.p.rapidapi.com",
    };
    const params = { domain: email };
    axios
      .get("https://mailcheck.p.rapidapi.com/", {
        headers,
        params,
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
