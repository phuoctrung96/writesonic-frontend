import { useRouter } from "next/dist/client/router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getUserInfo,
  isEmailVerified as isEmailVerifiedAxios,
  isPhoneVerified as isPhoneVerifiedAxios,
  UserInfo,
} from "../api/user";
import { getToken } from "../utils/auth";
import Overlay from "./customer/overlay";

export enum signWith {
  SIGN_WITH_PASSWORD = "password",
  SIGN_WITH_GOOGLE = "google",
}

interface AuthAppInterface {
  Component: any;
  pageProps: any;
}

const AuthApp: React.FC<AuthAppInterface> = ({ Component, pageProps }) => {
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const mounted = useRef(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(null);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const checking = useCallback(async () => {
    try {
      const { teamId } = router.query;
      const isEmailVerified = await isEmailVerifiedAxios();
      const isPhoneVerified = await isPhoneVerifiedAxios();
      if (isEmailVerified && isPhoneVerified) {
        router.push(teamId ? `/${teamId}` : "/", undefined, { shallow: true });
      }
    } catch (err) {
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [router]);

  useEffect(() => {
    checking();
  }, [checking]);

  useEffect(() => {
    // get user info
    getUserInfo()
      .then((data) => {
        setUserInfo(data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    // get user simple information
    const handleRouteChange = async (url?: any) => {
      if (!getToken() || !userInfo) {
        return;
      }
      const { firstName, lastName, email, id } = userInfo;
      // Identify Users in Segment
      window["analytics"]?.identify(id, {
        firstName,
        lastName,
        email,
      });
    };

    handleRouteChange();

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, userInfo]);

  return (
    <>
      {isLoading ? (
        <Overlay />
      ) : (
        <div className="flex-1 flex flex-col overflow-auto">
          {/* <PromotionBanner hideLink /> */}
          <div className="flex-1 flex flex-col overflow-auto">
            <Component {...pageProps} />
          </div>
        </div>
      )}
    </>
  );
};

export default AuthApp;
