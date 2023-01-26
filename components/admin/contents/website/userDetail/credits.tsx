import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Customer, updateCredits } from "../../../../../api/admin/user";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import TextInput from "../../../../textInput";
import ConfirmUpdateInfoModal from "../../conformUpdateInfoModal";

export default function Credits({
  info,
  onChange,
}: {
  info: Customer;
  onChange: Function;
}) {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [subscriptionCredits, setSubscriptionCredits] = useState(
    info.recurring_credits.toString()
  );
  const [subscriptionCreditsError, setSubscriptionCreditsError] =
    useState(false);
  const [oneTimeCredits, setOneTimeCredits] = useState(
    info.one_time_credits.toString()
  );
  const [oneTimeCreditsError, setOneTimeCreditsError] = useState(false);

  const [lifetimeDealCredits, setLifetimeDealCredits] = useState(
    info.lifetime_deal_credits.toString()
  );
  const [lifetimeDealCreditsError, setLifetimeDealCreditsError] =
    useState(false);

  const [rewardCredits, setRewardCredits] = useState(
    info.reward_credits.toString()
  );
  const [rewardCreditsError, setRewardCreditsError] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [isOpenModal, openModal] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setSubscriptionCreditsError(false);
  }, [subscriptionCredits]);

  useEffect(() => {
    setOneTimeCreditsError(false);
  }, [oneTimeCredits]);

  const onUpdateCredits = () => {
    let validate = true;
    if (parseFloat(subscriptionCredits) < 0) {
      setSubscriptionCreditsError(true);
      validate = false;
    }
    if (parseFloat(oneTimeCredits) < 0) {
      setOneTimeCreditsError(true);
      validate = false;
    }
    if (parseFloat(lifetimeDealCredits) < 0) {
      setLifetimeDealCreditsError(true);
      validate = false;
    }
    if (parseFloat(rewardCredits) < 0) {
      setRewardCreditsError(true);
      validate = false;
    }
    if (!validate) {
      return;
    }
    setLoading(true);
    updateCredits({
      id: info.id,
      recurring_credits: parseFloat(subscriptionCredits),
      one_time_credits: parseFloat(oneTimeCredits),
      lifetime_deal_credits: parseFloat(lifetimeDealCredits),
      reward_credits: parseFloat(rewardCredits),
    })
      .then((res) => {
        onChange(res);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Updated the user's information",
          })
        );
      })
      .catch((err) => {
        const errorCode = err.response?.status;
        const errorDetail = err.response?.data?.detail;
        if (errorCode === 406 && errorDetail === "You don't have permission") {
          router.push("/", undefined, { shallow: true });
        }
      })
      .finally(() => {
        if (mounted.current) {
          setLoading(false);
        }
      });
  };

  return (
    <Block title="Change User's Credits" message="">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 mt-6 place-items-end">
        <div className="w-full col-span-1">
          <TextInput
            htmlFor="subscription_credits"
            label="Subscription Credits"
            type="number"
            name="subscription_credits"
            id="subscription_credits"
            value={subscriptionCredits}
            min={0}
            onChange={(e) => {
              setSubscriptionCredits(e.target.value);
            }}
            error={
              subscriptionCreditsError
                ? "Please enter the subscription credits"
                : ""
            }
          />
        </div>
        <div className="w-full col-span-1">
          <TextInput
            htmlFor="lifetime_deal_credits"
            label="Lifetime deal Credits"
            type="number"
            name="lifetime_deal_credits"
            id="lifetime_deal_credits"
            value={lifetimeDealCredits}
            min={0}
            onChange={(e) => {
              setLifetimeDealCredits(e.target.value);
            }}
            error={
              lifetimeDealCreditsError
                ? "Please enter the lifetime credits"
                : ""
            }
          />
        </div>
        <div className="w-full col-span-1">
          <TextInput
            htmlFor="one_time_credits"
            label="One-time Credits"
            type="number"
            name="one_time_credits"
            id="one_time_credits"
            value={oneTimeCredits}
            min={0}
            onChange={(e) => {
              setOneTimeCredits(e.target.value);
            }}
            error={
              oneTimeCreditsError ? "Please enter the one-time credits" : ""
            }
          />
        </div>

        <div className="w-full col-span-1">
          <TextInput
            htmlFor="reward_credits"
            label="Reward Credits"
            type="number"
            name="reward_credits"
            id="reward_credits"
            value={rewardCredits}
            min={0}
            onChange={(e) => {
              setRewardCredits(e.target.value);
            }}
            error={rewardCreditsError ? "Please enter the reward credits" : ""}
          />
        </div>
      </div>

      <div className="sm:col-span-6 mt-6">
        <SmPinkButton
          className="w-full sm:w-1/2 py-2.5"
          onClick={() => {
            openModal(true);
          }}
          disabled={isLoading}
        >
          Update Credits
        </SmPinkButton>
      </div>
      <ConfirmUpdateInfoModal
        title="Update Amount of Credits"
        message="Are you sure you want to update this user's credits?"
        isOpenModal={isOpenModal}
        openModal={openModal}
        handleOkay={onUpdateCredits}
      />
    </Block>
  );
}
