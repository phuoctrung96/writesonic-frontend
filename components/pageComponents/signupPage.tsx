import HCaptcha from "@hcaptcha/react-hcaptcha";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { checkEmail } from "../../api/admin/user";
import { getInviteInfo, InviteInfo } from "../../api/invte";
import {
  checkOldUser,
  isPhoneVerified,
  registerWithEmailAndPassword,
  registerWithGoogle,
  registerWithMicrosoft,
} from "../../api/user";
import { signWith } from "../../components/authApp";
import SmPinkButton from "../../components/buttons/smPinkButton";
import AlertError from "../../components/customer/alerts/alertError";
import Auth, { AuthType } from "../../components/customer/auth";
import FormGrayText from "../../components/customer/auth/parts/FormGrayText";
import FormInput from "../../components/customer/auth/parts/formInput";
import FormLink from "../../components/customer/auth/parts/formLink";
import FormSeparation from "../../components/customer/auth/parts/formSeparation";
import SocialButtonGroup from "../../components/customer/auth/parts/socialButtonGroup/index";
import SEOHead from "../../components/seoHead";
import { setToastify, ToastStatus } from "../../store/main/actions";
import acceptInvite from "../../utils/acceptInvite";
import { getToken } from "../../utils/auth";
import capitalize from "../../utils/capitalize";
import { validateEmail } from "../../utils/validate";
import Overlay from "../customer/overlay";

export default function SignUpPage() {
  const mounted = useRef(false);
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
  const dispatch = useDispatch();

  // form data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // handle error
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [error, setError] = useState<ReactNode | string>("");
  const [isSocialAuthorizing, setIsSocialAuthorizing] =
    useState<boolean>(false);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo>(null);
  const [loading, setLoading] = useState(false);

  // captcha
  const captchaRef = useRef<any>();
  const [captcha, setCaptcha] = useState("");

  useEffect(() => {
    if (captcha !== "") {
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captcha]);

  useEffect(() => {
    if (utm_source === "chrome-extension") {
      Cookies.set("web-source", utm_source, { expires: 7 });
    }
  }, [utm_source]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const info = await getInviteInfo(invitedId);
        setInviteInfo(info);
      } catch (err) {
        router.push("/login", undefined, { shallow: true });
        if (!getToken()) {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: err.response?.data?.detail ?? "Failed to join the team.",
            })
          );
        }
      }
    }
    if (invitedId) {
      init();
    }
  }, [dispatch, invitedId, router]);

  useEffect(() => {
    setFullNameError(false);
  }, [fullName]);
  useEffect(() => {
    setEmailError(false);
    setEmailFormatError(false);
  }, [email]);
  useEffect(() => {
    setPasswordError(false);
    setPasswordLengthError(false);
  }, [password]);
  useEffect(() => {
    setConfirmPasswordError(false);
    setMatchError(false);
  }, [confirmPassword]);

  const onSubmit = async () => {
    let valid = true;
    if (!fullName) {
      setFullNameError(!fullName);
      valid = false;
    }
    if (!email) {
      setEmailError(!email);
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailFormatError(!validateEmail(email));
      valid = false;
    }
    if (!password) {
      setPasswordError(!password);
      valid = false;
    }
    if (password.length < 6) {
      setPasswordLengthError(password.length < 6);
      valid = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError(!confirmPassword);
      valid = false;
    }
    if (password !== confirmPassword) {
      setMatchError(password !== confirmPassword);
      valid = false;
    }

    if (!valid) {
      return;
    }
    if (captcha === "") {
      captchaRef.current.execute();
      return;
    }

    setLoading(true);
    try {
      const { block, disposable } = await checkEmail(email);
      if (block || disposable) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message:
              "Sorry, we don't support your email's domain. Please sign up using your company email address.",
          })
        );
        return;
      }
      await registerWithEmailAndPassword({
        fullName,
        email,
        password,
        invitedId,
        ref,
        locale: router.locale,
        utmParams,
        captcha,
      });
      goToConfirmEmailPage();
    } catch (error) {
      handleError(error);
    } finally {
      if (mounted.current) {
        captchaRef.current.resetCaptcha();
        setCaptcha("");
        setLoading(false);
      }
    }
  };

  const onGoogle = async () => {
    try {
      setLoading(true);
      setIsSocialAuthorizing(true);
      const { is_new_user, id, email } = await registerWithGoogle(
        router.locale,
        invitedId,
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
        invitedId,
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
    signWith,
    isNewUser,
    id: userId,
    email,
  }: {
    signWith: signWith;
    isNewUser: boolean;
    id: string;
    email: string;
  }) => {
    if (invitedId) {
      await acceptInvite({
        invitedId: router.query.invitedId,
        dispatch,
        router,
        signWith,
        isNewUser,
        userId,
        email,
        isSignUp: true,
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

  if (invitedId && !inviteInfo) {
    return <Overlay />;
  }

  return (
    <>
      <SEOHead>
        <title>Sign Up | Writesonic</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Sign Up | Writesonic" />
        <meta property="og:description" content="" />
        <meta name="twitter:title" content="Sign Up | Writesonic" />
        <meta name="twitter:description" content="" />
      </SEOHead>
      <Auth
        type={
          utm_source === "chrome-extension"
            ? AuthType.ChromeSignUp
            : AuthType.SignUp
        }
        initTitle={
          invitedId
            ? `Join the ${inviteInfo.team_name} team members in a minute`
            : null
        }
        initMessage={
          inviteInfo
            ? `${inviteInfo.sender_first_name} has invited you to join ${inviteInfo.team_name} team on Writesonic`
            : null
        }
        isHasError={
          !!fullNameError ||
          !!emailError ||
          !!emailFormatError ||
          !!passwordError ||
          !!passwordLengthError ||
          !!confirmPasswordError ||
          !!matchError ||
          !!error
        }
      >
        <div>
          {/* <FormLabel>Sign up with</FormLabel> */}
          <SocialButtonGroup
            onGoogle={onGoogle}
            onMicrosoft={onMicrosoft}
            disabled={loading}
            authType="signup"
          />
          <FormSeparation>Or</FormSeparation>
        </div>
        <div>
          <div className="space-y-6">
            <FormInput
              label="Full Name"
              id="fullname"
              name="fullname"
              type="text"
              required={true}
              placeholder="Enter your full name here"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              error={fullNameError ? "Please enter your full name" : ""}
            />
            <FormInput
              label="Email"
              id="email"
              name="email"
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
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required={true}
              placeholder="6+ characters required, 1 capital letter"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              error={
                passwordError
                  ? "Please enter a password."
                  : passwordLengthError
                  ? "Please use at least 6 characters."
                  : ""
              }
            />
            <FormInput
              label="Repeat password"
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              required={true}
              placeholder="Once again, please"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              error={
                confirmPasswordError
                  ? "Please enter your password again."
                  : matchError
                  ? "Passwords don't match!"
                  : ""
              }
            />
            <AlertError message={error} />
            <HCaptcha
              onVerify={(e) => {
                setCaptcha(e);
              }}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
              ref={captchaRef}
            />
            <div>
              <SmPinkButton
                className="w-full"
                onClick={onSubmit}
                disabled={loading}
                hideLoading={isSocialAuthorizing}
              >
                Sign up
              </SmPinkButton>
            </div>
          </div>
          <div className="flex items-center justify-center mt-6">
            <FormGrayText>Already have an account?</FormGrayText>
            <FormLink
              href={
                utm_source === "chrome-extension"
                  ? "/login?utm_source=chrome-extension"
                  : "/login"
              }
            >
              Sign in
            </FormLink>
          </div>
          <div className="mt-5 text-center">
            <p className="text-xxs text-gray-400">
              By creating an account, you are agreeing to our
              <FormLink
                className="text-xxs"
                href="https://writesonic.com/terms"
              >
                Terms of Service
              </FormLink>{" "}
              and
              <FormLink
                className="text-xxs"
                href="https://writesonic.com/privacy"
              >
                Privacy Policy
              </FormLink>
              . You also agree to receive product-related marketing emails from
              Writesonic, which you can unsubscribe from at any time.
            </p>
          </div>
        </div>
      </Auth>
    </>
  );
}
