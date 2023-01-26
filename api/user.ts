import {
createUserWithEmailAndPassword,
getAuth,
GoogleAuthProvider,
OAuthProvider,
sendEmailVerification,
sendPasswordResetEmail,
signInWithCustomToken,
signInWithEmailAndPassword,
signInWithPopup,
signOut,
updatePassword,
updateProfile
} from "@firebase/auth";
import { signWith } from "../components/authApp";
import { setToken } from "../utils/auth";
import authRequest from "../utils/authRequest";
import request from "../utils/request";
import { TeamMemberRole } from "./team";
const baseUrl = "/user";

export enum UserRole {
  super_admin = "super_admin",
  admin = "admin",
  member = "member",
}

export interface CreditsData {
  one_time_credits: number;
  recurring_credits: number;
  lifetime_deal_credits: number;
  reward_credits: number;
  is_unlimited: boolean;
}
export interface UserPreferences {
  slayer_model: string;
  slayer_enabled: boolean;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  email_verified: boolean;
  phone_number: string;
  phone_verified: boolean;
  stripe_customer_id: string;
  x_stripe_customer_id: string;
  photo_url?: string;
  role: UserRole;
  customer_role: string;
  role_in_team: TeamMemberRole | null | undefined;
  language: string;
  providers: string[];
  credits: CreditsData;
  business_id?: string;
  has_done_tour_1: boolean;
  has_done_tour_2: boolean;
  is_authorized_by_semrush: boolean;
  is_authorized_by_wordpress: boolean;
  user_preferences: UserPreferences;
}

export interface CheckDigitCodeInfo {
  id: string;
  email: string;
  phone_verified: boolean;
  sign_in_provider: string;
}

interface CreditPerDay {
  date: string;
  credits: number;
}

export interface SessionLoginResponse {
  is_new_user: boolean;
  token: string;
  id: string;
  email: string;
}

export const updateName = (first_name, last_name): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    const data = {
      first_name,
      last_name,
    };
    authRequest({
      url: `/user/update-name`,
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

export const updateLanguage = (language, team_id): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    const data = {
      language,
    };
    authRequest({
      url: `/user/update-language`,
      method: "post",
      data,
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

export const updateUserPreferences = (
  payload,
  team_id
): Promise<UserPreferences> => {
  return new Promise((resolve, reject) => {
    const params = { team_id };
    const data = payload;
    authRequest({
      url: `/user_preferences/update-preferences`,
      method: "post",
      data,
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

export const updatePass = (email, oldPassword, password, teamId, locale) => {
  const auth = getAuth();
  auth.languageCode = locale;
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        email,
        oldPassword
      );
      await updatePassword(user, password);
      const res = await loginWithEmailAndPassword(email, password, teamId);
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

export const registerWithEmailAndPassword = ({
  fullName,
  email,
  password,
  invitedId,
  ref,
  locale,
  utmParams,
  captcha,
}: {
  fullName: string;
  email: string;
  password: string;
  invitedId: string | string[];
  ref?: string | string[];
  locale: string;
  utmParams?: string;
  captcha: string;
}): Promise<SessionLoginResponse> => {
  const auth = getAuth();
  auth.languageCode = locale;
  return new Promise(async (resolve, reject) => {
    try {
      if (
        process.env.NEXT_PUBLIC_ENVIRONMENT === "staging" &&
        !JSON.parse(process.env.NEXT_PUBLIC_WHITELISTED_DOMAINS).find(
          (item) => item === email.substring(email.lastIndexOf("@") + 1)
        )
      ) {
        reject({ response: { data: { detail: "Sorry, you are not authorized to use this site." } } });
        return;
      }

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: fullName });
      const idToken = await user.getIdToken();
      const { data } = await sessionLogin(
        idToken,
        invitedId,
        ref,
        utmParams,
        captcha
      );
      setToken(data.token);
      await sendEmailVerification(user, {
        url: getVerifyEmailActionUrl(invitedId),
        handleCodeInApp: true,
      });
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

export const loginWithEmailAndPassword = (
  email,
  password,
  locale
): Promise<SessionLoginResponse> => {
  const auth = getAuth();
  auth.languageCode = locale;
  return new Promise(async (resolve, reject) => {
    try {
      if (
        process.env.NEXT_PUBLIC_ENVIRONMENT === "staging" &&
        !JSON.parse(process.env.NEXT_PUBLIC_WHITELISTED_DOMAINS).find(
          (item) => item === email.substring(email.lastIndexOf("@") + 1)
        )
      ) {
        reject({
          response: {
            data: { detail: "Sorry, you are not authorized to use this site." },
          },
        });
        return;
      }
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await user.getIdToken();
      const { data } = await sessionLogin(idToken);
      setToken(data?.token);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

export const verifyEmail = (customToken, locale, invitedId) => {
  const auth = getAuth();
  auth.languageCode = locale;
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = await signInWithCustomToken(auth, customToken);
      await sendEmailVerification(user, {
        url: getVerifyEmailActionUrl(invitedId),
        handleCodeInApp: true,
      });
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};

function getVerifyEmailActionUrl(invitedId: string | string[]) {
  return invitedId
    ? `${process.env.NEXT_PUBLIC_FIREBASE_ACTION_URL}/join/${invitedId}/verify-phone`
    : `${process.env.NEXT_PUBLIC_FIREBASE_ACTION_URL}/verify-phone`;
}

export const resetPassword = ({
  email,
  locale,
  invitedId,
}: {
  email: string | string[];
  locale: string;
  invitedId?: string | string[];
}) => {
  const auth = getAuth();
  auth.languageCode = locale;
  return new Promise(async (resolve, reject) => {
    try {
      if (typeof email !== "string") {
        reject();
        return;
      }
      await sendPasswordResetEmail(auth, email, {
        url: invitedId
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/join/${invitedId}/login?sign_with=${signWith.SIGN_WITH_PASSWORD}&first_visit=true`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/login?sign_with=${signWith.SIGN_WITH_PASSWORD}&first_visit=true`,
      });
      resolve("success");
    } catch (err) {
      reject(err);
    }
  });
};

// export const registerWithFacebook = (locale): Promise<SessionLoginResponse> => {
//   const provider = new FacebookAuthProvider();
//   provider.setCustomParameters({ display: "popup" });

//   return registerWithSocialAccount(provider, locale);
// };

export const registerWithMicrosoft = (
  locale: string,
  invitedId?: string | string[],
  ref?: string | string[],
  utmParams?: string
): Promise<SessionLoginResponse> => {
  const provider = new OAuthProvider("microsoft.com");
  provider.setCustomParameters({ display: "popup" });
  return registerWithSocialAccount(provider, locale, invitedId, ref, utmParams);
};

export const registerWithGoogle = (
  locale: string,
  invitedId?: string | string[],
  ref?: string | string[],
  utmParams?: string
): Promise<SessionLoginResponse> => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ display: "popup" });

  return registerWithSocialAccount(provider, locale, invitedId, ref, utmParams);
};

const registerWithSocialAccount = (
  provider: any,
  locale: string,
  invitedId?: string | string[],
  ref?: string | string[],
  utmParams?: string
): Promise<SessionLoginResponse> => {
  const auth = getAuth();
  auth.languageCode = locale;
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const idToken = await user.getIdToken();
      if (
        process.env.NEXT_PUBLIC_ENVIRONMENT === "staging" &&
        !JSON.parse(process.env.NEXT_PUBLIC_WHITELISTED_DOMAINS).find(
          (item) => item === user.email.substring(user.email.lastIndexOf("@") + 1)
        )
      ) {
        reject({
          response: {
            data: { detail: "Sorry, you are not authorized to use this site." },
          },
        });
        return;
      }
      const { data } = await sessionLogin(idToken, invitedId, ref, utmParams);
      setToken(data.token);
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};

export const sessionLogin = (
  idToken: string,
  invitedId?: string | string[],
  ref?: string | string[],
  utmParams?: string,
  captcha?: string
): Promise<{ data: SessionLoginResponse }> => {
  const data = {
    id_token: idToken,
    invited_id: invitedId,
    utm_params: utmParams,
    captcha: captcha,
    ref,
  };
  return new Promise((resolve, reject) => {
    request({
      url: `/user/session-login`,
      method: "post",
      data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const sessionLogout = (locale) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    auth.languageCode = locale;
    signOut(auth)
      .then(() => {
        authRequest({ url: "/user/session-logout", method: "get" })
          .then(({ data }) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getUserInfo = (): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: "/user/user-info", method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getProfile = ({
  teamId,
  customerId,
}: {
  teamId: string | string[];
  customerId?: string | string[];
}): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    let params = { team_id: teamId };
    if (customerId) {
      params["customer_id"] = customerId;
    }
    authRequest({ url: "/user/profile", method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const isEmailVerified = () => {
  return new Promise((resolve, reject) => {
    authRequest({ url: "/user/is-email-verified", method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const isPhoneVerified = () => {
  return new Promise((resolve, reject) => {
    authRequest({ url: "/user/is-phone-verified", method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getCustomToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    authRequest({ url: "/user/custom-token", method: "get" })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getCreditsUsageLastWeek = (
  customerId: string | string[]
): Promise<CreditPerDay[]> => {
  return new Promise((resolve, reject) => {
    const params = { customer_id: customerId };
    authRequest({
      url: "/user/credits-usage-last-7-days",
      method: "get",
      params,
    })
      .then(({ data }: { data: CreditPerDay[] }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const checkOldUser = (email: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const params = { email };
    request({ url: "/user/is-old-user", method: "get", params })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const checkUpdatedOneTimeCredits = (
  team_id: string | string[]
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/user/is-updated-one-time-credits",
      method: "get",
      params: { team_id },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const sendSMS = ({
  phone_number,
  resend = false,
  captcha,
}: {
  phone_number?: string;
  resend?: boolean;
  captcha: string;
}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/user/send-sms",
      method: "post",
      data: { phone_number: phone_number, captcha: captcha },
      params: { resend },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const checkDigitCode = (digit_code): Promise<CheckDigitCodeInfo> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/user/verify-digit-code",
      method: "post",
      data: { digit_code },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateEmail = (data: {
  pending_user_id: string;
  email: string;
  owner_id: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/user/update-email",
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
