import { ExclamationIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
import { createCustomPortalSession } from "../../api/credit_v2";
import { TeamMemberRole } from "../../api/team";
import { SettingNavItems } from "../../data/settingNavItems";
import XsWhiteButton from "../buttons/xsWhiteButton";

const PaymentFailedBanner: React.FC<{ roleInTeam: TeamMemberRole }> = ({
  roleInTeam,
}) => {
  const router = useRouter();
  const { teamId } = router.query;
  const [isLoading, setLoading] = useState(false);
  const handleFix = async () => {
    try {
      setLoading(true);
      const url = await createCustomPortalSession({
        session_type: "change_card",
        team_id: teamId,
        return_path: SettingNavItems.billing,
      });
      setLoading(false);
      window.location.href = url;
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <div className="bg-red-600 px-2 py-2 xl:px-32 flex justify-between items-center">
      <div className="flex items-start sm:items-center">
        <div className="p-1 bg-red-800 rounded-md">
          <ExclamationIcon
            className="h-5 w-5 text-gray-100"
            aria-hidden="true"
          />
        </div>
        <p className="ml-5 text-xs sm:text-sm text-gray-100 font-medium">
          {teamId && roleInTeam === TeamMemberRole.member ? (
            <span>
              Please ask your team admin to update their payment method.
            </span>
          ) : (
            <span>
              The payment for your last invoice failed. Please update your
              payment method and pay the invoice to keep using our services.
            </span>
          )}
        </p>
      </div>
      {!router.pathname.includes("/dashboard/users/[customerId]/virtual") &&
        !(teamId && roleInTeam === TeamMemberRole.member) && (
          <XsWhiteButton
            className="text-red-500 focus:ring-red-500 border-none"
            onClick={handleFix}
            disabled={isLoading}
          >
            Fix it now
          </XsWhiteButton>
        )}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    roleInTeam: state.user?.role_in_team ?? TeamMemberRole.owner,
  };
};
export default connect(mapStateToPros)(PaymentFailedBanner);
