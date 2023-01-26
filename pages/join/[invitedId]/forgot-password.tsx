import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { resetPassword } from "../../../api/user";
import SmPinkButton from "../../../components/buttons/smPinkButton";
import AlertError from "../../../components/customer/alerts/alertError";
import Auth, { AuthType } from "../../../components/customer/auth";
import FormInput from "../../../components/customer/auth/parts/formInput";
import FormLink from "../../../components/customer/auth/parts/formLink";
import Overlay from "../../../components/customer/overlay";
import SEOHead from "../../../components/seoHead";
import { validateEmail } from "../../../utils/validate";

function ForgotPassword() {
  const mounted = useRef(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, sent] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (count <= 0) {
      return;
    }
    const id = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [count]);

  useEffect(() => {
    const { email } = router.query;
    if (!email) {
      router.replace("/forgot-password");
      sent(false);
      setIsLoading(false);
      return;
    } else if (!validateEmail(email)) {
      router.replace("/forgot-password");
      sent(false);
      setIsLoading(false);
      return;
    } else
      resetPassword({ email, locale: router.locale })
        .then(() => {
          sent(true);
          setCount(60);
        })
        .catch(({ code }) => {})
        .finally(() => {
          if (mounted.current) {
            setIsLoading(false);
          }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setError("");
  }, [email]);

  const onSubmit = (e) => {
    if (!email) {
      setError("Please enter your email.");
      return;
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    resetPassword({ email, locale: router.locale })
      .then(() => {
        if (mounted.current) {
          sent(true);
          setCount(60);
        }
      })
      .catch(({ code }) => {
        switch (code) {
          case "auth/user-not-found":
            setError("User Not Found");
            break;
          case "auth/too-many-requests":
            setError("Too Many Requests");
            break;
        }
      });
  };

  if (isLoading) {
    return <Overlay />;
  }

  return (
    <>
      <SEOHead>
        <title>Reset Password | Writesonic</title>
        <meta name="description" content="" />
        <meta property="og:title" content="Reset Password | Writesonic" />
        <meta property="og:description" content="" />
        <meta name="twitter:title" content="Reset Password | Writesonic" />
        <meta name="twitter:description" content="" />
      </SEOHead>
      <Auth
        type={success ? AuthType.ResetPassword : AuthType.ForgotPassword}
        isHasError={!!error}
      >
        {!success ? (
          <div>
            <div className="space-y-6 auth-break-0mt-9">
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
              />
              <AlertError message={error} />
              <div>
                <SmPinkButton className="w-full" onClick={onSubmit}>
                  Continue
                </SmPinkButton>
              </div>
            </div>
            <div className="flex items-center justify-center mt-6">
              <FormLink href={`/join/${router.query.invitedId}/login`}>
                Back to login
              </FormLink>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-6 auth-break-0mt-9">
              <div>
                <SmPinkButton
                  className="w-full"
                  onClick={() => {
                    sent(false);
                  }}
                  disabled={count > 0}
                  hideLoading={true}
                >
                  {count > 0 ? `${count} s` : "Send again"}
                </SmPinkButton>
              </div>
            </div>
            <div className="flex items-center justify-center mt-6">
              <FormLink href={`/join/${router.query.invitedId}/login`}>
                Back to login
              </FormLink>
            </div>
          </div>
        )}
      </Auth>
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    projects: state.main?.projects,
    currentProject: state.main?.currentProject,
    toastify: state.main?.toastify,
  };
};
export default connect(mapStateToPros)(ForgotPassword);
