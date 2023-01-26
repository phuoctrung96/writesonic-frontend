import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  createBusinessCustomPortalSession,
  XSubscription,
} from "../../../../../api/credit_v2";
import { SettingNavItems } from "../../../../../data/settingNavItems";
import Block from "../../../../block";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import CardBrand from "../cardBrand";
import ConfirmChangeCardModal from "./confirmChangeCardModal";

function PaymentMethod({ subscription }: { subscription: XSubscription }) {
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { teamId } = router.query;

  const handleChange = (session_type: string) => async () => {
    try {
      setLoading(true);
      const url = await createBusinessCustomPortalSession({
        session_type,
        team_id: teamId,
        return_path: SettingNavItems.apiBilling,
      });
      setLoading(false);
      window.location.href = url;
    } catch (err) {
      setLoading(false);
    }
  };

  if (!subscription) {
    return null;
  }

  return (
    <>
      <Block
        title={t("settings:payment_method")}
        message={t("settings:payment_method_description")}
      >
        <div className="flex items-center justify-between mt-5 rounded-lg border-2 border-solid border-gray-1 rounded-lg px-5 py-3 mt-8 bg-gray-0">
          <div className="flex items-center">
            <CardBrand brand={subscription.x_default_card.brand} />
            <p className="text-medium text-base text-gray-1 ml-2">
              **** **** **** {subscription.x_default_card.last4}
            </p>
          </div>
          <SmWhiteButton
            className="w-1/6 py-2.5"
            disabled={isLoading}
            onClick={handleChange("change_card")}
          >
            {t("settings:edit")}
          </SmWhiteButton>
        </div>
      </Block>
      <ConfirmChangeCardModal />
    </>
  );
}

export default PaymentMethod;
