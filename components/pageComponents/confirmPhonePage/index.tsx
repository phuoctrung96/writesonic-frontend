import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { checkDigitCode, isEmailVerified, sendSMS } from "../../../api/user";
import { getIpLookup } from "../../../api/util";
import acceptInvite from "../../../utils/acceptInvite";
import { getToken } from "../../../utils/auth";
import getErrorMessage from "../../../utils/getErrorMessage";
import { signWith } from "../../authApp";
import SmPinkButton from "../../buttons/smPinkButton";
import SmWhiteButton from "../../buttons/smWhiteButton";
import AlertError from "../../customer/alerts/alertError";
import Auth, { AuthType } from "../../customer/auth";
import FormSeparation from "../../customer/auth/parts/formSeparation";
import Overlay from "../../customer/overlay";
import SEOHead from "../../seoHead";
import CodeInput from "./codeInput";

const DelayTime = 60;

export default function ConfirmPhonePage() {
  const mounted = useRef(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { invitedId } = router.query;
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(DelayTime);
  const [error, setError] = useState<string>("");
  const [captcha, setCaptcha] = useState("");
  const captchaRef = useRef<any>();
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (captcha !== "") {
      onResend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captcha]);

  useEffect(() => {
    getIpLookup().then((res) => {
      if (
        res["data"]["continent_code"] == "EU" ||
        res["data"]["continent_code"] == "NA"
      ) {
        const timer = setTimeout(() => {
          window["Beacon"]("prefill", {
            subject: "Phone Verification Issue",
          });
          window["Beacon"]("config", {
            docsEnabled: false,
          });
          window["Beacon"](
            "show-message",
            "59f87a6e-eba1-4524-b8e1-682903213a6c",
            {
              force: true,
            }
          );
        }, 45000);
        return () => clearTimeout(timer);
      }
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (seconds < 1) {
        clearInterval(id);
      }
      setSeconds(seconds - 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [seconds]);

  useEffect(() => {
    if (!getToken()) {
      router.push(
        invitedId ? `\/join\/${router.query.invitedId}\/login` : "/login",
        undefined,
        { shallow: true }
      );
    } else {
      isEmailVerified()
        .then((value) => {
          if (!value) {
            router.push(
              invitedId
                ? `\/join\/${router.query.invitedId}\/confirm-email`
                : "/confirm-email",
              undefined,
              { shallow: true }
            );
          }
        })
        .catch((err) => {});
    }
  }, [invitedId, router]);

  const onBack = () => {
    router.push(
      invitedId ? `/join/${invitedId}/verify-phone` : "/verify-phone",
      undefined,
      { shallow: true }
    );
  };

  const onResend = async () => {
    if (captcha === "") {
      captchaRef.current.execute();
      return;
    }
    setError("");
    try {
      setIsSending(true);
      await sendSMS({ resend: true, captcha: captcha });
      setSeconds(DelayTime);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      if (mounted.current) {
        captchaRef.current.resetCaptcha();
        setCaptcha("");
        setIsSending(false);
      }
    }
  };

  const goToHome = useCallback(
    async ({
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
    },
    [dispatch, invitedId, router]
  );

  const onSubmit = useCallback(
    async (code) => {
      try {
        setError("");
        setIsConfirming(true);
        const { id, email, phone_verified, sign_in_provider } =
          await checkDigitCode(code);
        if (phone_verified) {
          let signWithVal = signWith.SIGN_WITH_PASSWORD;
          if (sign_in_provider === "google.com") {
            signWithVal = signWith.SIGN_WITH_GOOGLE;
          }
          goToHome({ id, email, signWith: signWithVal, isNewUser: true });
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        if (mounted.current) {
          setIsConfirming(false);
        }
        5;
      }
    },
    [goToHome]
  );

  return (
    <>
      <SEOHead>
        <title>Confirm Your Phone | Writesonic</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Confirm Your Phone | Writesonic" />
        <meta property="og:description" content="" />
        <meta name="twitter:title" content="Confirm Your Phone | Writesonic" />
        <meta name="twitter:description" content="" />
      </SEOHead>
      <Auth type={AuthType.ConfirmPhone}>
        <CodeInput onSubmit={onSubmit} />
        <div className="lg:mt-10">
          <FormSeparation>Didn’t receive the code?</FormSeparation>
        </div>
        <div>
          <div className="space-y-6 mt-6">
            <AlertError message={error} />
            <HCaptcha
              onVerify={(e) => {
                setCaptcha(e);
              }}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
              ref={captchaRef}
            />
            <div className="grid grid-cols-2 gap-2">
              <SmWhiteButton className="col-span-1" onClick={onBack}>
                Back
              </SmWhiteButton>
              <SmPinkButton
                className="col-span-1"
                onClick={onResend}
                disabled={seconds > 0 || isSending}
                hideLoading={seconds > 0}
              >
                {seconds > 0 ? `${seconds} s` : "Resend"}
              </SmPinkButton>
            </div>
          </div>
        </div>
        <Overlay isShowing={isConfirming} />
      </Auth>
    </>
  );
}
