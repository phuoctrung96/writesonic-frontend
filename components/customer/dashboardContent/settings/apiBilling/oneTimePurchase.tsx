import { Slider, withStyles } from "@material-ui/core";
import AnimatedNumber from "animated-number-react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  BusinessBallance,
  getCurrentBallance,
} from "../../../../../api/business/business";
import { createBusinessCheckout } from "../../../../../api/credit_v2";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
const PrestoSlider = withStyles({
  root: {
    color: "rgba(93, 97, 154)",
    height: 8,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "rgba(93, 97, 154)",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -10,
    "&:focus": {
      boxShadow: "none",
    },
    "&:hover": {
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  mark: {
    height: 0,
    width: 0,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor",
  },
})(Slider);

const MAX_VALUE = 1000;
const MIN_VALUE = 50;

const OneTimePurchase: React.FC<{ businessId: string }> = ({ businessId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(500);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentBallance, setCurrentBallance] =
    useState<BusinessBallance>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    getCurrentBallance(businessId)
      .then((data) => {
        setCurrentBallance(data);
      })
      .catch((err) => {});
  }, [businessId]);

  const handleChange = (event: object, value: number) => {
    setValue(value);
  };

  const onPurchase = async () => {
    try {
      setIsLoading(true);
      const checkoutUrl = await createBusinessCheckout({
        business_id: businessId,
        amount: value,
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  const formatValue = (value) => `+$ ${Number(value).toFixed(3)}`;

  return (
    <Block title="Billing Information">
      <PrestoSlider
        defaultValue={50}
        step={50}
        min={MIN_VALUE}
        max={MAX_VALUE}
        value={value}
        onChange={handleChange}
      />
      <div className="mt-5">
        <p className="text-medium font-bold text-gray-700">Current Ballance</p>
        <AnimatedNumber
          className="mt-1 text-xl font-bold text-green-500"
          value={currentBallance?.one_time_funds ?? 0}
          formatValue={formatValue}
          duration={400}
        />
      </div>
      <div className="mt-5">
        <p className="text-medium font-bold text-gray-700">Add Funds</p>
        <p className="mt-1 text-sm font-normal text-gray-700">
          How much would you like to add to your account balance today?
        </p>
      </div>
      <div className="mt-6">
        <SmPinkButton
          className="w-full py-2.5"
          onClick={onPurchase}
          disabled={isLoading}
        >
          {`Add $${value} to Ballance`}
        </SmPinkButton>
      </div>
    </Block>
  );
};

export default OneTimePurchase;
