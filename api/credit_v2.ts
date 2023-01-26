import { SettingNavItems } from "../data/settingNavItems";
import authRequest from "../utils/authRequest";

const baseUrl = "/credit-v2";

export const PREMIUM_PLAN_NAME = "Premium 🌟";

export enum Interval {
  monthly = "monthly",
  annual = "annual",
}

export interface Credits {
  one_time_credits: number;
  recurring_credits: number;
  lifetime_deal_credits: number;
  is_unlimited?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  stripe_price_id: string;
  paypal_plan_id: string;
  price: number;
  interval: string;
  credits: number;
  description: string;
  user_seats: number;
  is_new: true;
  subscription_product_id: string;
}

export interface SubscriptionProduct {
  id: string;
  name: { [key: string]: string };
  description: { [key: string]: string[] };
  color: string;
  plans: SubscriptionPlan[];
}

export interface SubscriptionV2 {
  id: string;
  stripe_subscription_id: string;
  paypal_subscription_id: string;
  is_active: boolean;
  coupon: string;
  subscription_plan?: SubscriptionPlan;
  default_card?: {
    brand: string;
    last4: string;
  };
  subscription_product?: SubscriptionProduct;
  discount_percent_off: number;
  auth_hash?: string;
  cancel_date: string;
  cancel_at_period_end: boolean;
  pause_collection?: {
    behavior?: string;
    resumes_at?: string;
  };
}

export interface Plan {
  id: string;
  price_id: string;
  paypal_plan_id: string;
  coupon: string;
  name: any;
  price: number;
  description: any;
  interval: Interval;
  credits: number;
  is_new?: boolean;
  user_seats?: number;
}

export interface XSubscription {
  id: number;
  stripe_subscription_id: string;
  is_active: boolean;
  coupon: string;
  x_plan?: {
    price_id: string;
    price?: number;
    name: string;
    interval: Interval;
    color: string;
    credits: number;
  };
  x_default_card?: {
    brand: string;
    last4: string;
  };
  discount_percent_off: number;
}
export interface LifeTimeCredit {
  name: string;
  codes: number | null;
  credits_per_month: number | null;
}

export const getAllPlans = (params: {
  interval: Interval;
}): Promise<SubscriptionProduct[]> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/plans`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getSubscription = ({
  teamId,
  customerId,
}: {
  teamId: string | string[];
  customerId?: string | string[];
}): Promise<SubscriptionV2> => {
  return new Promise((resolve, reject) => {
    const params = { team_id: teamId, customer_id: customerId };
    authRequest({ url: `${baseUrl}/subscription`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createCheckoutSubscription = (
  plan_id: string,
  coupon: string,
  referral: string,
  team_id: string | string[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/create-checkout-subscription/${plan_id}`,
      method: "get",
      params: {
        coupon,
        referral,
        team_id,
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

export const cancelStripePlan = (
  stripe_subscription_id: string,
  team_id: string | string[]
): Promise<null> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({
      url: `${baseUrl}/cancel-plan/${stripe_subscription_id}`,
      method: "delete",
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

export const updateSubscription = ({
  stripePriceId,
  stripeSubscriptionId,
  teamId,
  removeMembers,
}: {
  stripePriceId: string;
  stripeSubscriptionId: string;
  teamId: string | string[];
  removeMembers: string[];
}): Promise<{
  subscription: SubscriptionV2;
  three_ds_redirect_url: string;
  payment_intent_id: string;
  credits: Credits;
}> => {
  return new Promise((resolve, reject) => {
    const params = { team_id: teamId };
    authRequest({
      url: `${baseUrl}/update-subscription`,
      method: "post",
      data: {
        stripe_subscription_id: stripeSubscriptionId,
        stripe_price_id: stripePriceId,
        remove_members: removeMembers,
      },
      params,
    })
      .then(({ data }) => {
        if (
          data.hasOwnProperty("three_ds_redirect_url") &&
          data["three_ds_redirect_url"] !== null
        ) {
          window.location.href = data["three_ds_redirect_url"];

          /** *
          let windowAuth = window.open(data['three_ds_redirect_url'], '_blank', 'menubar=yes,location=yes,resizable=no,scrollbars=yes,status=no,height=600,width=400');

          if(windowAuth.closed) {
            reject("Popups are disabled please enable your popups to use 3D secure validation.");
          }
          
          var popupTick = setInterval(async function() {
            if (windowAuth.closed) {
              clearInterval(popupTick);
              console.log('window closed!');
              var responseData = await paymentIntentStatus(data['payment_intent_id']);
              console.log(responseData);
              switch(responseData["status"]){
                case "succeeded":
                  resolve(data);
                default:
                  reject(responseData["status"]);
              }
            }
          }, 1000);
          /** */
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const createPaypalSubscription = (plan_id): Promise<SubscriptionV2> => {
  return new Promise((resolve, reject) => {
    const params = {
      plan_id: plan_id,
      success_url: `${location.origin}/settings/billing?paypalredirect=true`,
      cancel_url: `${location.origin}/settings/billing`,
    };
    authRequest({
      url: `${baseUrl}/create-paypal-subscription`,
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

export const approvedPaypalSubscription = ({
  teamId,
  subscriptionID,
}: {
  teamId: string | string[];
  subscriptionID: string;
}): Promise<SubscriptionV2> => {
  return new Promise((resolve, reject) => {
    const params = { teamId };
    authRequest({
      url: `${baseUrl}/approved-paypal-subscription/${subscriptionID}`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {})
      .finally(() => {});
  });
};

export const cancelPaypalSubscription = (
  subscriptionID: string,
  teamId: string | string[]
): Promise<SubscriptionV2> => {
  return new Promise((resolve, reject) => {
    const params = { teamId };
    authRequest({
      url: `${baseUrl}/cancel-paypal-subscription/${subscriptionID}`,
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

export const updatePaypalSubscription = ({
  paypalSubscriptionId,
  paypalPlanId,
  removeMembers,
  teamId,
}: {
  paypalSubscriptionId: string;
  paypalPlanId: string;
  removeMembers: string[];
  teamId: string | string[];
}): Promise<{
  subscription: SubscriptionV2;
  credits: Credits;
  user_seats: number;
}> => {
  return new Promise((resolve, reject) => {
    const params = { team_id: teamId };
    authRequest({
      url: `${baseUrl}/update-paypal-subscription`,
      method: "post",
      data: {
        paypal_subscription_id: paypalSubscriptionId,
        paypal_plan_id: paypalPlanId,
        remove_members: removeMembers,
        success_url: `${location.origin}/settings/billing?paypalsubscriptionrevise=true`,
        cancel_url: `${location.origin}/settings/billing`,
      },
      params,
    })
      .then(({ data }) => {
        redirect_if_success(data, resolve);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const cancellationEmail = (survey_response): Promise<null> => {
  return new Promise((resolve, reject) => {
    const params = { survey_response };
    authRequest({
      url: `${baseUrl}/send-cancellation-reason-email`,
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

const redirect_if_success = (data, resolve) => {
  if (data.status == "success") {
    window.location.href = data.url;
  } else {
    resolve(data);
  }
  return null;
};

export const updatePaypalSubscriptionRevise = ({
  subscriptionID,
}: {
  subscriptionID: string;
}): Promise<SubscriptionV2> => {
  return new Promise((resolve, reject) => {
    const params = { subscription_id: subscriptionID };
    authRequest({
      url: `${baseUrl}/update-paypal-subscription-approved`,
      method: "post",
      params,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {})
      .finally(() => {});
  });
};

export const getBusinessPlans = (): Promise<Plan[]> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/x-plans`, method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const validateCoupon = (coupon: string): Promise<String[]> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/validate-coupon/${coupon}/`, method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const getBusinessSubscription = ({
  customerId,
}: {
  customerId?: string | string[];
}): Promise<XSubscription> => {
  return new Promise((resolve, reject) => {
    const params = { customer_id: customerId };
    authRequest({ url: `${baseUrl}/x-subscription`, method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createCheckoutBusinessSubscription = (
  price_id: string,
  coupon: string,
  referral: string,
  business_id: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/create-checkout-business-subscription/${price_id}/${coupon}`,
      method: "get",
      params: {
        referral,
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

export const createCheckout = (
  price_id: string,
  team_id: string | string[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({
      url: `${baseUrl}/create-checkout/${price_id}`,
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

export const createBusinessCheckout = (params: {
  business_id: string;
  amount: number;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/create-checkout-business`,
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

export const createCustomPortalSession = ({
  session_type,
  team_id,
  return_path,
}: {
  session_type: string;
  team_id: string | string[];
  return_path: SettingNavItems;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const params = { team_id, return_path };
    authRequest({
      url: `${baseUrl}/create-customer-portal-session/${session_type}`,
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

export const createBusinessCustomPortalSession = ({
  session_type,
  team_id,
  return_path,
}: {
  session_type: string;
  team_id: string | string[];
  return_path: SettingNavItems;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const params = { team_id, return_path };
    authRequest({
      url: `${baseUrl}/create-x-customer-portal-session/${session_type}`,
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

export const paymentIntentStatus = (
  stripe_payment_intent_id: string | string[]
): Promise<{ status: string }> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/payment_intent_status/${stripe_payment_intent_id}`,
      method: "get",
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

export const updateXPlan = ({
  priceId,
  stripeSubscriptionId,
  coupon,
  businessId,
}: {
  priceId: string;
  stripeSubscriptionId: string;
  coupon: string;
  businessId: string;
}): Promise<{
  subscription: XSubscription;
}> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/update-business-plan`,
      method: "post",
      data: {
        stripe_subscription_id: stripeSubscriptionId,
        price_id: priceId,
        coupon,
      },
      params: { business_id: businessId },
    })
      .then(({ data }) => {
        if (
          data.hasOwnProperty("three_ds_redirect_url") &&
          data["three_ds_redirect_url"] !== null
        ) {
          window.location.href = data["three_ds_redirect_url"];

          /** *
          let windowAuth = window.open(data['three_ds_redirect_url'], '_blank', 'menubar=yes,location=yes,resizable=no,scrollbars=yes,status=no,height=600,width=400');

          if(windowAuth.closed) {
            reject("Popups are disabled please enable your popups to use 3D secure validation.");
          }
          
          var popupTick = setInterval(async function() {
            if (windowAuth.closed) {
              clearInterval(popupTick);
              console.log('window closed!');
              var responseData = await paymentIntentStatus(data['payment_intent_id']);
              console.log(responseData);
              switch(responseData["status"]){
                case "succeeded":
                  resolve(data);
                default:
                  reject(responseData["status"]);
              }
            }
          }, 1000);
          /** */
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {});
  });
};

export const cancelXPlan = (
  stripe_subscription_id: string,
  team_id: string | string[]
): Promise<null> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({
      url: `${baseUrl}/cancel-x-plan/${stripe_subscription_id}`,
      method: "delete",
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

export const getLeftCredits = (params: {
  team_id: string | string[];
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `${baseUrl}/left-credits`,
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

export const getLifeTimePlan = (
  team_id: string | string[]
): Promise<LifeTimeCredit[]> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    authRequest({
      url: `${baseUrl}/lifetime-plan`,
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

export const reactiveSubscription = (): Promise<SubscriptionV2> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: `${baseUrl}/reactive-subscription`, method: "post" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
