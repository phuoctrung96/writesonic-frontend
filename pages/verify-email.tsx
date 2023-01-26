import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateEmail } from "../api/user";
import Overlay from "../components/customer/overlay";
import { setToastify, ToastStatus } from "../store/main/actions";
import { clearAllCookie } from "../utils/auth";
import clearReduxStore from "../utils/clearReduxtStore";
import getErrorMessage from "../utils/getErrorMessage";

const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const { pUserId, email, ownerId } = router.query;
  const dispatch = useDispatch();

  useEffect(() => {
    async function initialize() {
      if (
        typeof pUserId !== "string" ||
        typeof email !== "string" ||
        typeof ownerId !== "string"
      ) {
        return;
      }

      try {
        await updateEmail({
          email,
          pending_user_id: pUserId,
          owner_id: ownerId,
        });
        clearReduxStore(dispatch);
        clearAllCookie();
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message:
              "Your email has been changed successfully. Please log in again",
          })
        );
      } catch (err) {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message:
              getErrorMessage(err) ??
              "Sorry, we couldn't change your email due to some reason. Pleases contact our support team.",
          })
        );
      } finally {
        router.push("/");
      }
    }
    initialize();
  }, [dispatch, email, ownerId, pUserId, router]);

  return <Overlay />;
};

export default VerifyEmail;
