import { useEffect, useState } from "react";
import { getAllPlans } from "../../../../../api/admin/credit";
import { Interval, SubscriptionProduct } from "../../../../../api/credit_v2";
import AnnualSwitch from "../../../../annualSwitch";
import DraggablePlans from "./draggablePlans";

const SettingPlanUI: React.FC = () => {
  const [isAnnual, setAnnual] = useState(false);
  const [plans, setPlans] = useState<SubscriptionProduct[]>([]);
  useEffect(() => {
    async function initialize() {
      try {
        const plans = await getAllPlans({
          interval: isAnnual ? Interval.annual : Interval.monthly,
        });
        setPlans(plans);
      } catch (err) {
      } finally {
      }
    }
    initialize();
  }, [isAnnual]);
  return (
    <div className="max-w-3xl mx-auto">
      <AnnualSwitch enabled={isAnnual} setEnabled={setAnnual} />
      <div className="mt-10">
        <DraggablePlans plans={plans} />
      </div>
    </div>
  );
};

export default SettingPlanUI;
