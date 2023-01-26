import { NextRouter } from "next/router";
import { Dispatch } from "redux";
import { acceptInvitation } from "../api/invte";
import { getProfile } from "../api/user";
import { signWith } from "../components/authApp";
import { setToastify, ToastStatus } from "../store/main/actions";
import { setUser } from "../store/user/actions";
import { clearAllCookie } from "./auth";

export default async function acceptInvite({
  invitedId,
  dispatch,
  router,
  signWith,
  isNewUser = false,
  userId,
  email,
  isSignUp = false,
}: {
  invitedId: string | string[];
  dispatch: Dispatch<any>;
  router: NextRouter;
  signWith?: signWith;
  isNewUser?: boolean;
  userId?: string;
  email?: string;
  isSignUp?: boolean;
}) {
  try {
    const { team_id } = await acceptInvitation(invitedId);
    setUser(await getProfile({ teamId: team_id }));
    dispatch(
      setToastify({
        status: ToastStatus.success,
        message: "Yay, you have joined the team.",
      })
    );
    router.replace(`/${team_id}?sign_with=${signWith}`, undefined, {
      shallow: true,
    });

    if (!userId || !!email) {
      return;
    }
  } catch (err) {
    const message = err.response?.data?.detail;
    if (message) {
      clearAllCookie();
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: message ?? "Failed to join the team.",
        })
      );
    }
    router.push("/login", undefined, { shallow: true });
  }
}
