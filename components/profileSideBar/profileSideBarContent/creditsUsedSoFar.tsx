import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { connect, useDispatch } from "react-redux";
import { SubscriptionV2 } from "../../../api/credit_v2";
import { CreditsData } from "../../../api/user";
import { openProfilebar } from "../../../store/modals/actions";

function CreditsUsedSoFar({
  credits,
  subscription,
}: {
  credits: CreditsData;
  subscription: SubscriptionV2;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { teamId, customerId } = router.query;
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-between items-center text-sm font-medium">
        <p className="text-gray-600 capitalize">
          {t("nav_bar:one_time_credits")}:
        </p>
        <p className="text-gray-700">{credits?.one_time_credits ?? 0}</p>
      </div>
      <div className="mt-2 flex justify-between items-center text-sm font-medium">
        <p className="text-gray-600 capitalize">
          {t("nav_bar:recurring_credits")}:
        </p>
        <p className="text-gray-700">
          {credits?.is_unlimited
            ? "Unlimited"
            : credits?.recurring_credits ?? 0}
        </p>
      </div>
      {credits.lifetime_deal_credits > 0 && (
        <div className="mt-2 flex justify-between items-center text-sm font-medium">
          <p className="text-gray-600 capitalize">
            {t("nav_bar:lifetime_deal_credits")}:
          </p>
          <p className="text-gray-700">{credits.lifetime_deal_credits}</p>
        </div>
      )}
      {credits.reward_credits > 0 && (
        <div className="mt-2 flex justify-between items-center text-sm font-medium">
          <p className="text-gray-600 capitalize">
            {t("nav_bar:reward_credits")}:
          </p>
          <p className="text-gray-700">{credits.reward_credits}</p>
        </div>
      )}
      {!customerId &&
        subscription?.subscription_product?.name["en"] !== "Agency" && (
          <div className="text-right mt-5">
            <Link
              href={
                teamId ? `\/${teamId}\/settings\/billing` : "/settings/billing"
              }
              shallow
            >
              <a
                className="text-right text-pink-0 hover:text-pink-1 text-xs font-medium cursor-pointer"
                onClick={() => {
                  dispatch(openProfilebar(false));
                }}
              >
                {t("side_bar:upgrade_now")}!
              </a>
            </Link>
          </div>
        )}
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    credits: state.user?.credits,
    subscription: state.user?.subscription,
  };
};

export default connect(mapStateToPros)(CreditsUsedSoFar);
