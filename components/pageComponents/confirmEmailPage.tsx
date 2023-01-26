import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { getCustomToken, verifyEmail } from "../../api/user";
import SmPinkButton from "../../components/buttons/smPinkButton";
import Auth, { AuthType } from "../../components/customer/auth";
import FormGrayText from "../../components/customer/auth/parts/FormGrayText";
import FormLink from "../../components/customer/auth/parts/formLink";
import SEOHead from "../../components/seoHead";
import { getToken } from "../../utils/auth";
import FormSeparation from "../customer/auth/parts/formSeparation";

export default function ConfirmEmailPage() {
  const mounted = useRef(false);
  const router = useRouter();
  const { invitedId } = router.query;
  const [count, setCount] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.push(
        invitedId ? `\/join\/${router.query.invitedId}\/login` : "/login",
        undefined,
        { shallow: true }
      );
    }
    if (count <= 0) {
      return;
    }

    const id = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [count, invitedId, router]);

  const onSubmit = () => {
    if (count > 0) {
      return;
    }
    setLoading(true);
    getCustomToken()
      .then((customToken) => {
        if (customToken) {
          verifyEmail(customToken, router.locale, invitedId).catch((err) => {});
          setCount(60);
        }
      })
      .catch((err) => {
        router.push(
          invitedId ? `\/join\/${router.query.invitedId}\/login` : "/login",
          undefined,
          { shallow: true }
        );
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
      });
  };

  return (
    <>
      <SEOHead>
        <title>Confirm Your Email | Writesonic</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Confirm Your Email | Writesonic" />
        <meta property="og:description" content="" />
        <meta name="twitter:title" content="Confirm Your Email | Writesonic" />
        <meta name="twitter:description" content="" />
      </SEOHead>
      <Auth type={AuthType.ConfirmEmail}>
        <div className="lg:mt-10">
          <FormSeparation>Didn’t get an email?</FormSeparation>
        </div>
        <div>
          <div className="space-y-6 mt-6">
            <div>
              <SmPinkButton
                className="w-full"
                onClick={onSubmit}
                disabled={isLoading}
              >
                {count > 0 ? `${count} s` : "Resend"}
              </SmPinkButton>
            </div>
          </div>
          <div></div>
          <div className="flex items-center justify-center mt-6">
            <FormGrayText>Already have an account?</FormGrayText>
            <FormLink
              href={
                invitedId ? `/join/${router.query.invitedId}/login` : "/login"
              }
            >
              Sign in
            </FormLink>
          </div>
        </div>
      </Auth>
    </>
  );
}
