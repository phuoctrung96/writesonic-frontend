import { useRouter } from "next/router";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import {
  approvedPaypalSubscription,
  createPaypalSubscription,
} from "../../../../../api/credit_v2";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { setSubscription } from "../../../../../store/user/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import SmPinkButton from "../../../../buttons/smPinkButton";

const PaypalButtonWrapper: React.FC<{
  paypalPlanId: string;
  setIsSubscribing: Dispatch<SetStateAction<boolean>>;
  setIsInitializingPaypalButton: Dispatch<SetStateAction<boolean>>;
}> = ({ paypalPlanId, setIsSubscribing, setIsInitializingPaypalButton }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { teamId } = router.query;
  const mounted = useRef(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const onInit = (data, actions) => {
    setIsInitializingPaypalButton(false);
  };

  const createSubscription = (data, actions) => {
    const options = {
      plan_id: paypalPlanId,
    };
    return actions.subscription.create(options).then((orderId) => {
      // Your code here after create the order
      return orderId;
    });
  };

  const paypalOnApprove = (data, detail) => {
    const subscriptionID = data.subscriptionID;
    if (subscriptionID) {
      setIsSubscribing(true);
      approvedPaypalSubscription({ teamId, subscriptionID })
        .then((resData) => {
          dispatch(setSubscription(resData));
        })
        .catch((err) => {})
        .finally(() => {
          setIsSubscribing(false);
        });
    }

    return detail.order.capture().then(function (details) {
      // console.log(details);
    });
  };

  const redirect_if_success = (data) => {
    if (data.status == "success") {
      window.location.href = data.url;
    }
    return null;
  };

  const create_subscription = async () => {
    setLoading(true);
    const response = await createPaypalSubscription(paypalPlanId)
      .then((data) => {
        redirect_if_success(data);
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
      })
      .finally(() => {
        if (!mounted.current) {
          return;
        }
        setLoading(false);
        setIsSubscribing(false);
      });
  };

  const onError = (err) => {};
  return (
    <SmPinkButton
      className="w-full"
      onClick={create_subscription}
      disabled={isLoading}
    >
      Subscribe using PayPal
    </SmPinkButton>
    // <SmPinkButton
    //   className="w-full"
    //   onClick={onSubmit}
    // >
    //   {subscription
    //     ? t("settings:change_plan_btn")
    //     : t("settings:subscribe_btn")}
    // </SmPinkButton>

    // <PayPalButtons
    //   key={paypalPlanId}
    //   createSubscription={createSubscription}
    //   onApprove={paypalOnApprove}
    //   style={{
    //     label: "subscribe",
    //   }}
    //   onError={onError}
    //   onInit={onInit}
    // />
  );
};

export default PaypalButtonWrapper;
