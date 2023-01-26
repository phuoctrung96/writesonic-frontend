import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  checkOldUser,
  isEmailVerified,
  isPhoneVerified,
  loginWithEmailAndPassword,
  registerWithGoogle,
  registerWithMicrosoft,
  SessionLoginResponse,
} from "../../api/user";
import { signWith } from "../../components/authApp";
import SmPinkButton from "../../components/buttons/smPinkButton";
import AlertError from "../../components/customer/alerts/alertError";
import Auth, { AuthType } from "../../components/customer/auth";
import FormCheckBox from "../../components/customer/auth/parts/formCheckBox";
import FormGrayText from "../../components/customer/auth/parts/FormGrayText";
import FormInput from "../../components/customer/auth/parts/formInput";
import FormLabel from "../../components/customer/auth/parts/formLabel";
import FormLink from "../../components/customer/auth/parts/formLink";
import FormSeparation from "../../components/customer/auth/parts/formSeparation";
import SocialButtonGroup from "../../components/customer/auth/parts/socialButtonGroup/index";
import SEOHead from "../../components/seoHead";
import acceptInvite from "../../utils/acceptInvite";
import capitalize from "../../utils/capitalize";
import { validateEmail } from "../../utils/validate";

export default function LoginPage() {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    invitedId,
    ref,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  } = router.query;
  const utmParams = JSON.stringify({
    source: utm_source,
    medium: utm_medium,
    name: utm_campaign,
    content: utm_content,
    keyword: utm_term,
  });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState<ReactNode | string>("");
  const [loading, setLoading] = useState(false);
  const [chromeExtCookie, setChromeExtCookie] = useState("");
  const [isSocialAuthorizing, setIsSocialAuthorizing] =
    useState<boolean>(false);
  const refDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setChromeExtCookie(Cookies.get("web-source"));
  }, []);

  useEffect(() => {
    setEmailError(false);
    setEmailFormatError(false);
    setError("");
  }, [email]);

  useEffect(() => {
    setPasswordError(false);
    setError("");
  }, [password]);

  const onSubmit = () => {
    let valid = true;
    if (!email) {
      setEmailError(!email);
      valid = false;
    }
    if (!validateEmail(email)) {
      setEmailFormatError(!validateEmail(email));
      valid = false;
    }
    if (!password) {
      setPasswordError(!password);
      valid = false;
    }

    if (!valid) {
      return;
    }

    setLoading(true);

    loginWithEmailAndPassword(email, password, router.locale)
      .then((data) => {
        goToText(data);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
      });
  };

  const onGoogle = async () => {
    try {
      setLoading(true);
      setIsSocialAuthorizing(true);
      const { is_new_user, id, email } = await registerWithGoogle(
        router.locale,
        null,
        ref,
        utmParams
      );
      const phoneVerified = await isPhoneVerified();
      if (!phoneVerified) {
        goToVerifyPhonePage();
      } else {
        goToHome({
          signWith: signWith.SIGN_WITH_GOOGLE,
          isNewUser: is_new_user,
          id,
          email,
        });
      }
    } catch (err) {
      if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "Your account already exists with a different provider, please use Microsoft/email-password instead."
        );
      } else {
        handleError(err);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
        setIsSocialAuthorizing(false);
      }
    }
  };
  const onMicrosoft = async () => {
    try {
      setLoading(true);
      setIsSocialAuthorizing(true);
      const { is_new_user, id, email } = await registerWithMicrosoft(
        router.locale,
        null,
        ref,
        utmParams
      );
      const phoneVerified = await isPhoneVerified();
      if (!phoneVerified) {
        goToVerifyPhonePage();
      } else {
        goToHome({
          signWith: signWith.SIGN_WITH_GOOGLE,
          isNewUser: is_new_user,
          id,
          email,
        });
      }
    } catch (err) {
      if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "Your account already exists with a different provider, please use Google/email-password instead."
        );
      } else {
        handleError(err);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
        setIsSocialAuthorizing(false);
      }
    }
  };
  async function goToText({ is_new_user, id, email }: SessionLoginResponse) {
    try {
      const emailVerified = await isEmailVerified();
      const phoneVerified = await isPhoneVerified();
      if (!emailVerified) {
        goToConfirmEmailPage();
      } else if (!phoneVerified) {
        goToVerifyPhonePage();
      } else {
        goToHome({
          id,
          email,
          signWith: signWith.SIGN_WITH_PASSWORD,
          isNewUser: is_new_user,
        });
      }
    } catch (err) {}
  }

  const goToConfirmEmailPage = () => {
    router.push(
      invitedId ? `\/join\/${invitedId}\/confirm-email` : "/confirm-email",
      undefined,
      { shallow: true }
    );
  };

  const goToVerifyPhonePage = () => {
    router.push(
      invitedId ? `\/join\/${invitedId}\/verify-phone` : "/verify-phone",
      undefined,
      { shallow: true }
    );
  };

  const goToHome = async ({
    id,
    email,
    signWith,
    isNewUser,
  }: {
    id: string;
    email: string;
    signWith: signWith;
    isNewUser: boolean;
  }) => {
    if (invitedId) {
      await acceptInvite({
        invitedId: router.query.invitedId,
        dispatch,
        router,
        signWith: signWith,
        isNewUser,
        userId: id,
        email,
      });
    } else {
      router.push(
        {
          pathname: `/`,
          query: { sign_with: signWith, first_visit: isNewUser },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const handleError = async (error) => {
    try {
      let message: string | ReactNode =
        error.response?.data?.detail ??
        capitalize(error?.code?.replace("auth/", "")?.replaceAll(/-/g, " "));
      message =
        message === null ? (
          "Unknown Server Error"
        ) : (await checkOldUser(email)) ? (
          <div>
            Looks like you are coming from our old platform. <br></br>
            <Link href={`/forgot-password?email=${email}`} passHref shallow>
              <a className="underline">Please reset your password</a>
            </Link>{" "}
            to continue.
          </div>
        ) : (
          message
        );
      setError(message);
    } catch {}
  };

  return (
    <>
      <SEOHead>
        <title>Login | Writesonic</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Login | Writesonic" />
        <meta property="og:description" content="" />
        <meta name="twitter:title" content="Login | Writesonic" />
        <meta name="twitter:description" content="" />
      </SEOHead>
      <Auth
        type={chromeExtCookie ? AuthType.ChromeLogin : AuthType.Login}
        isHasError={
          !!emailError || !!emailFormatError || !!passwordError || !!error
        }
      >
        <div ref={refDiv} className="bg-red">
          <div>
            {/* <FormLabel>Sign in with</FormLabel> */}
            <SocialButtonGroup
              onGoogle={onGoogle}
              onMicrosoft={onMicrosoft}
              disabled={loading}
              authType="login"
            />
            <FormSeparation>Or continue with</FormSeparation>
          </div>
          <div className="space-y-6">
            <FormInput
              label="Email address"
              name="email"
              id="email"
              type="email"
              autoComplete="email"
              required={true}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              error={
                emailError
                  ? "Please enter your email."
                  : emailFormatError
                  ? "Please enter a valid email."
                  : ""
              }
            />
            <FormInput
              label="Password"
              type="password"
              autoComplete="current-password"
              required={true}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              error={passwordError ? "Please enter your password." : ""}
            />

            <div className="flex items-center justify-between">
              <FormCheckBox id="remember_me" name="remember_me">
                <FormLabel className="ml-2" htmlFor="props.htmlFor">
                  Remember me
                </FormLabel>
              </FormCheckBox>
              <div className="text-sm">
                <FormLink href="/forgot-password">
                  Forgot your password?
                </FormLink>
              </div>
            </div>
            <AlertError message={error} />
            <div>
              <SmPinkButton
                className="w-full"
                onClick={onSubmit}
                disabled={loading}
                hideLoading={isSocialAuthorizing}
              >
                Sign in
              </SmPinkButton>
            </div>
          </div>
          <div className="flex items-center justify-center mt-6">
            <FormGrayText>New to Writesonic?</FormGrayText>
            <FormLink
              href={
                chromeExtCookie
                  ? "/signup?utm_source=chrome-extension"
                  : "/signup"
              }
            >
              Sign up
            </FormLink>
          </div>
        </div>
      </Auth>
    </>
  );
}
