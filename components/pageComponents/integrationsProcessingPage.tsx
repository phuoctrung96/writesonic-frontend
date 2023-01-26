import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { semrushLoginByCode } from "../../api/semrush";
import { wordpressLogin } from "../../api/thirdparty";
import { setToastify, ToastStatus } from "../../store/main/actions";
import {
  setIsAuthorizedBySemrush,
  setIsAuthorizedByWordpress,
} from "../../store/user/actions";
import getErrorMessage from "../../utils/getErrorMessage";
import SideNavbar from "../customer/dashboard/sideNavbar";
import Overlay from "../customer/overlay";

const SEMRUSH: string = "semrush";
const WORDPRESS: string = "wordpress";

const IntegrationsProcessingPage: React.FC = () => {
  const router = useRouter();
  const { category, teamId, code } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    if (category !== SEMRUSH) {
      router.push(teamId ? `/${teamId}` : "/", undefined, { shallow: true });
    }
  }, [category, router, teamId]);

  useEffect(() => {
    async function checkValidation() {
      let message = "";
      try {
        switch (category) {
          case SEMRUSH:
            message = "Successfully connected with Semrush!";
            await semrushLoginByCode({ code });
            dispatch(setIsAuthorizedBySemrush(true));
            break;
          case WORDPRESS:
            message = "Successfully connected with Wordpress!";
            await wordpressLogin({ code });
            dispatch(setIsAuthorizedByWordpress(true));
            break;
        }
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message,
          })
        );

        router.push(teamId ? `/${teamId}` : "/", undefined, { shallow: true });
      } catch (err) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
        router.push(teamId ? `/${teamId}` : "/", undefined, { shallow: true });
      }
    }
    checkValidation();
  }, [category, code, dispatch, router, teamId]);

  return (
    <>
      <Head>
        <title>Writesonic</title>
      </Head>
      <div className="flex-1 flex overflow-hidden bg-root">
        <SideNavbar className="hidden md:flex md:flex-shrink-0" />
        <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
          <Overlay message="Processing Integration..." />;
        </div>
      </div>
    </>
  );
};

export default IntegrationsProcessingPage;
