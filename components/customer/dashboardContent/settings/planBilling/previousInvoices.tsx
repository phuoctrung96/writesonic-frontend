import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
import {
  createCustomPortalSession,
  SubscriptionV2,
} from "../../../../../api/credit_v2";
import { SettingNavItems } from "../../../../../data/settingNavItems";
import Block from "../../../../block";
import SmWhiteButton from "../../../../buttons/smWhiteButton";
import ConfirmChangeCardModal from "./confirmChangeCardModal";

function PreviousInvoices({ subscription }: { subscription: SubscriptionV2 }) {
  const [isLoadingBillingDetail, setIsLoadingBillingDetail] = useState(false);
  const [isLoadingViewInvoices, setIsLoadingViewInvoices] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { teamId } = router.query;

  const clickBillingDetails = async () => {
    try {
      setIsLoadingBillingDetail(true);
      const url = await createCustomPortalSession({
        session_type: "update_billing_details",
        team_id: teamId,
        return_path: SettingNavItems.billing,
      });
      setIsLoadingBillingDetail(false);
      window.location.href = url;
    } catch (err) {
      setIsLoadingBillingDetail(false);
    }
  };

  const clickViewInvoices = async () => {
    try {
      setIsLoadingViewInvoices(true);
      const url = await createCustomPortalSession({
        session_type: "view_invoices",
        team_id: teamId,
        return_path: SettingNavItems.billing,
      });
      setIsLoadingViewInvoices(false);
      window.location.href = url;
    } catch (err) {
      setIsLoadingViewInvoices(false);
    }
  };

  return (
    <>
      <Block
        title={t("settings:pre_invoice")}
        message={t("settings:pre_invoice_description")}
      >
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="col-span-4 sm:col-span-2">
            <SmWhiteButton
              className="w-full py-2.5"
              disabled={isLoadingBillingDetail}
              onClick={clickBillingDetails}
            >
              {t("settings:edit_billing_details_btn")}
            </SmWhiteButton>
          </div>
          <div className="col-span-4 sm:col-span-2">
            <SmWhiteButton
              className="w-full py-2.5"
              disabled={isLoadingViewInvoices}
              onClick={clickViewInvoices}
            >
              {t("settings:view_invoices_btn")}
            </SmWhiteButton>
          </div>
        </div>
      </Block>
      <ConfirmChangeCardModal />
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    subscription: state.user?.subscription,
  };
};

export default connect(mapStateToPros)(PreviousInvoices);
