// import { H, HighlightSegmentMiddleware } from "highlight.run";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sessionLogin } from "../api/user";
import { ToastInfo, ToastStatus } from "../store/main/actions";
import { setToken } from "../utils/auth";
import App from "./app";
import AuthApp from "./authApp";
import Overlay from "./customer/overlay";
import ToolTipContainer from "./tooltip/toolTipContainer";

interface MainInterface {
  Component: any;
  pageProps: any;
  toastify: ToastInfo;
}

const Main: React.FC<MainInterface> = ({ Component, pageProps, toastify }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState<boolean>(null);
  const [isProductFruitsReady, setIsProductFruitsReady] =
    useState<boolean>(false);

  // initialize Highlight
  // if (process.env.NEXT_PUBLIC_ENVIRONMENT === "production") {
  //   H.init(process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
  //     enableSegmentIntegration: true,
  //     networkRecording: {
  //       enabled: true,
  //     },
  //   });
  // }

  // useEffect(() => {
  //   try {
  //     // Enabling Track data forwarding
  //     window["analytics"].addSourceMiddleware(HighlightSegmentMiddleware);
  //   } catch (err) {}
  // }, []);

  useEffect(() => {
    async function init() {
      const { pathname, query } = router;
      const { securityKey: idToken, invite_id } = query;
      if (idToken && typeof idToken === "string") {
        const { data } = await sessionLogin(idToken);
        setToken(data?.token);
        router.push("/");
      }
      setIsAuth(
        pathname === "/join/[invitedId]/login" ||
          pathname === "/join/[invitedId]/signup" ||
          pathname === "/join/[invitedId]/confirm-email" ||
          pathname === "/join/[invitedId]/forgot-password" ||
          pathname === "/join/[invitedId]/verify-phone" ||
          pathname === "/join/[invitedId]/confirm-phone" ||
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/confirm-email" ||
          pathname === "/forgot-password" ||
          pathname === "/verify-phone" ||
          pathname === "/confirm-phone"
      );
    }
    init();
  }, [router]);

  useEffect(() => {
    switch (toastify && toastify.status) {
      case ToastStatus.success:
        toast.success(
          <div dangerouslySetInnerHTML={{ __html: toastify.message }} />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        break;
      case ToastStatus.warning:
        toast.warn(
          <div dangerouslySetInnerHTML={{ __html: toastify.message }} />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        break;
      case ToastStatus.failed:
        toast.error(
          <div dangerouslySetInnerHTML={{ __html: toastify.message }} />,
          {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
    }
  }, [toastify]);

  // check if the product fruits ready
  useEffect(() => {
    function productFruitsReady() {
      setIsProductFruitsReady(true);
    }
    window.addEventListener("productfruits_ready", productFruitsReady);

    return () => {
      window.removeEventListener("productfruits_ready", productFruitsReady);
      setIsProductFruitsReady(false);
    };
  }, []);

  useEffect(() => {
    // update product fruits
    const handleRouteChange = (url) => {
      if (!isProductFruitsReady) {
        return;
      }
      try {
        window["productFruits"].pageChanged();
      } catch (err) {}
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [isProductFruitsReady, router.events]);

  if (isAuth === null) {
    return <Overlay />;
  }
  return (
    <div className="flex flex-col h-screen">
      <ToastContainer />

      {isAuth ? (
        <AuthApp Component={Component} pageProps={pageProps} />
      ) : (
        <App
          Component={Component}
          pageProps={pageProps}
          isProductFruitsReady={isProductFruitsReady}
        />
      )}
      <ToolTipContainer />
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    toastify: state.main?.toastify,
    subscription: state.user?.subscription,
  };
};

export default connect(mapStateToPros)(Main);
