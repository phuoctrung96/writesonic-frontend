import Image from "next/image";
import Link from "next/link";
import React, { MouseEventHandler, useState } from "react";
import { connect } from "react-redux";
import { SubscriptionV2 } from "../../api/credit_v2";
import credits from "../../public/images/credits.png";
import AlertModal from "../customer/modals/alertModal";
import SmPinkButton from "./smPinkButton";

interface GenerateButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  name?: string;
  reName?: string;
  numCredits?: number;
  onceGenerated?: boolean;
  disabled?: boolean;
  leftCredits?: number;
  isSubscriptionActivate: SubscriptionV2;
  isUnlimited: boolean;
  hideCredits?: boolean;
  hideLoading?: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  name,
  reName,
  numCredits,
  onceGenerated,
  disabled,
  leftCredits,
  isSubscriptionActivate,
  isUnlimited,
  hideLoading,
  hideCredits = false,
}) => {
  const [openAlert, setOpenAlert] = useState(false);
  const handleError = () => {
    setOpenAlert(true);
  };
  if (!leftCredits && !isSubscriptionActivate) {
    return (
      <>
        <SmPinkButton
          className="w-full py-2.5 h-12"
          disabled={disabled}
          onClick={handleError}
        >
          {!onceGenerated ? name ?? "Generate" : reName ?? "Regenerate"}
          {!isUnlimited && !hideCredits && (
            <span className="ml-3 inline-flex items-center opacity-50 pl-2 pr-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 transition-all ease-in-out">
              <Image
                className="w-5 h-5 mr-1"
                src={credits}
                width={18}
                height={18}
                alt="Credits"
              />
              <p className="text-sm ml-1">{numCredits}</p>
            </span>
          )}
        </SmPinkButton>
        <AlertModal
          openModal={openAlert}
          setOpenModal={setOpenAlert}
          message={
            <p className="text-sm text-gray-700">
              The payment for your last invoice failed.<br></br>
              <Link href="/settings/billing" shallow>
                <a className="font-medium underline text-gray-800 hover:text-yellow-600">
                  Please update your payment method and pay the invoice to keep
                  using our services.
                </a>
              </Link>
            </p>
          }
        />
      </>
    );
  }

  return (
    <SmPinkButton
      className="w-full py-2.5 h-12"
      onClick={onClick}
      disabled={disabled}
      hideLoading={hideLoading}
    >
      {!onceGenerated ? name ?? "Generate" : reName ?? "Regenerate"}
      {!isUnlimited && !hideCredits && (
        <span className="ml-3 inline-flex items-center pl-2 pr-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 transition-all ease-in-out">
          <Image
            className="w-5 h-5 mr-1"
            src={credits}
            width={18}
            height={18}
            alt="Credits"
          />
          <p className="text-sm ml-1">{numCredits}</p>
        </span>
      )}
    </SmPinkButton>
  );
};

const mapStateToProps = (state) => {
  return {
    leftCredits:
      (state.user?.credits?.one_time_credits ?? 0) +
      (state.user?.credits?.recurring_credits ?? 0),
    isUnlimited: state.user?.credits?.is_unlimited ?? false,
    isSubscriptionActivate: state.user?.subscription?.is_active ?? true,
  };
};

export default connect(mapStateToProps)(GenerateButton);
