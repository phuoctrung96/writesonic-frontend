import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  createCheckoutBusinessSubscription,
  Plan,
  XSubscription,
} from "../../../../../api/credit_v2";
import { TeamMemberRole } from "../../../../../api/team";
import {
  openConfirmCancelXPlanModal,
  openConfirmChangeXPlanModal,
} from "../../../../../store/modals/actions";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import ConfirmCancelPlanModal from "./confirmCancelPlanModal";
import ConfirmChangePlanModal from "./confirmChangePlanModal";
import PlanForm from "./planForm";

function YourPlan({
  subscription,
  roleInTeam,
  businessId,
}: {
  subscription: XSubscription;
  roleInTeam: TeamMemberRole;
  businessId: string;
}) {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { teamId } = router.query;

  const [plan, selectPlan] = useState<Plan>(null);
  const [coupon, setCoupon] = useState<string>("null");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const onSubmit = async () => {
    try {
      if (subscription) {
        dispatch(openConfirmChangeXPlanModal(true));
      } else {
        setLoading(true);
        const checkoutUrl = await createCheckoutBusinessSubscription(
          plan.price_id,
          coupon,
          window["Rewardful"]?.referral ?? "",
          businessId
        );

        window.location.href = checkoutUrl;
      }
    } catch (err) {
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const onCancel = () => {
    dispatch(openConfirmCancelXPlanModal(true));
  };

  return (
    <>
      <Block
        title={
          roleInTeam === TeamMemberRole.owner
            ? t("settings:your_plan")
            : "Team Plan"
        }
        message={t("settings:your_plan_description")}
      >
        <div className="mt-5">
          {/* {!subscription && <PromotionBannerNoButton />} */}
          <PlanForm
            plan={plan}
            selectPlan={selectPlan}
            coupon={coupon}
            setCoupon={setCoupon}
          />
        </div>
        <div className="flex w-full items-center pt-5 mt-6 border-t border-solid border-gray-0">
          {plan && (
            <>
              {subscription &&
              subscription?.x_plan?.price_id === plan.price_id ? null : (
                <SmPinkButton
                  className="w-1/2 py-2.5"
                  onClick={onSubmit}
                  disabled={isLoading}
                >
                  {subscription
                    ? t("settings:change_plan_btn")
                    : t("settings:subscribe_btn")}
                </SmPinkButton>
              )}
            </>
          )}
          {subscription &&
            plan &&
            subscription?.x_plan?.price_id === plan.price_id && (
              <SmWhiteButton
                className="w-1/2 py-2.5"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t("settings:cancel_plan_btn")}
              </SmWhiteButton>
            )}
        </div>
      </Block>
      {plan && <ConfirmChangePlanModal plan={plan} coupon={coupon} />}
      <ConfirmCancelPlanModal />
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    subscription: state.user?.x_subscription,
    roleInTeam: state.user?.role_in_team ?? TeamMemberRole.owner,
  };
};

export default connect(mapStateToPros)(YourPlan);
