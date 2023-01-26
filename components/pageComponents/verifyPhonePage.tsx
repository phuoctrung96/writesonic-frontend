import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { isEmailVerified, sendSMS } from "../../api/user";
import { getToken } from "../../utils/auth";
import getErrorMessage from "../../utils/getErrorMessage";
import SmPinkButton from "../buttons/smPinkButton";
import AlertError from "../customer/alerts/alertError";
import Auth, { AuthType } from "../customer/auth";
import PhoneNumberInput from "../phoneNumberInput";
import SEOHead from "../seoHead";

export default function VerifyPhonePage() {
  const mounted = useRef(false);
  const router = useRouter();
  const { invitedId } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
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
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captcha]);

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

  const onSubmit = async () => {
    if (captcha === "") {
      captchaRef.current.execute();
      return;
    }
    setError("");

    try {
      setIsLoading(true);

      if (!phoneInput.isValidNumber()) {
        setError("Please input a valid phone number");
        return;
      }
      await sendSMS({ phone_number: phoneNumber, captcha: captcha });
      router.push(
        invitedId ? `/join/${invitedId}/confirm-phone` : "/confirm-phone",
        undefined,
        { shallow: true }
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      if (mounted.current) {
        captchaRef.current.resetCaptcha();
        setCaptcha("");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <SEOHead>
        <title>Verify Your Phone | Writesonic</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Verify Your Phone | Writesonic" />
        <meta property="og:description" content="" />
        <meta name="twitter:title" content="Verify Your Phone | Writesonic" />
        <meta name="twitter:description" content="" />
      </SEOHead>
      <Auth type={AuthType.VerifyPhone}>
        <PhoneNumberInput
          onChange={setPhoneNumber}
          phoneInput={phoneInput}
          setPhoneInput={setPhoneInput}
        />

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
            <div>
              <SmPinkButton
                className="w-full"
                onClick={onSubmit}
                disabled={isLoading}
              >
                Send
              </SmPinkButton>
            </div>
          </div>
        </div>
      </Auth>
    </>
  );
}
