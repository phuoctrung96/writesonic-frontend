import { useEffect, useRef, useState } from "react";
import { XEngine } from "../../../../../api/admin/engine";
import {
  Customer,
  getBusinessSummaryPerTypeOnAdmin,
  getCurrentBallanceOnAdmin,
  getSummaryFilterOptionsOnAdmin,
} from "../../../../../api/admin/user";
import {
  BusinessBallance,
  XCreditHistorySummaryFilterOptions,
} from "../../../../../api/business/business";
import Block from "../../../../block";
import BusinessUsageSummary, {
  BusinessUsageSummaryProps,
} from "../../../../businessUsageSummary";
import SelectBox from "../../../../customer/dashboardContent/selectBox";

const BusinessUsage: React.FC<{ info: Customer }> = ({ info }) => {
  const [options, setOptions] = useState<XCreditHistorySummaryFilterOptions[]>(
    []
  );
  const [months, setMonths] = useState<string[]>([]);
  const [month, setMonth] = useState<string>("");
  const [usedEngines, setUsedEngines] = useState<XEngine[]>([]);
  const [usedEngineId, setUsedEngineId] = useState<string | number>(null);
  const [costs, setCosts] = useState<BusinessUsageSummaryProps[]>([]);
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
    async function initialize() {
      try {
        const data = await getSummaryFilterOptionsOnAdmin(
          info.business.id,
          info.id
        );
        setOptions(data);
        setMonths(data?.map(({ month }) => month));
        if (data.length > 0) {
          const months = data?.map(({ month }) => month);
          const month = months[0];
          formatProps({ month, options: data });
        }
      } catch (err) {}
    }
    if (info?.business?.id && info?.id) {
      initialize();
    }
  }, [info.business.id, info.id]);

  const formatProps = ({
    month,
    options,
  }: {
    month: string;
    options: XCreditHistorySummaryFilterOptions[];
  }) => {
    setMonth(month);
    const usedEngines =
      options.find(({ month: m }) => m == month)?.engines ?? [];
    setUsedEngines(usedEngines);
    if (usedEngines.length > 0) {
      setUsedEngineId(usedEngines[0].id);
    }
  };

  useEffect(() => {
    if (!month || !usedEngineId || !info?.business?.id || !info?.id) {
      return;
    }
    getBusinessSummaryPerTypeOnAdmin(
      { business_id: info.business.id, month, x_engine_id: usedEngineId },
      info.id
    )
      .then((summery) => {
        setCosts([
          {
            content_name: "Total",
            funds: summery.total,
          },
          ...summery.data,
        ]);
      })
      .catch((err) => {});
  }, [info.business.id, info.id, month, usedEngineId]);

  useEffect(() => {
    if (!info?.business?.id || !info?.id) {
      return;
    }
    getCurrentBallanceOnAdmin(info.business.id, info.id)
      .then((data) => {
        setCurrentBallance(data);
      })
      .catch((err) => {});
  }, [info.business.id, info.id]);

  const onChangeEngine = (e) => {
    setUsedEngineId(e.target.value);
  };

  const onChangeMonth = (e) => {
    formatProps({ month: e.target.value, options });
  };

  if (!costs?.length) {
    return null;
  }

  console.log(currentBallance?.one_time_funds);

  return (
    <Block title="Business Usage Summary">
      <div className="py-3 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">Current Currency</p>
          <p className="text-xl text-green-700">{`+$${
            (currentBallance?.one_time_funds ?? 0) +
            (currentBallance?.subscription_funds ?? 0)
          }`}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <SelectBox
            id="engine_name"
            name="engine_name"
            value={usedEngineId}
            onChange={onChangeEngine}
          >
            {usedEngines?.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </SelectBox>
          <SelectBox
            id="month"
            name="month"
            value={month}
            onChange={onChangeMonth}
          >
            {months?.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </SelectBox>
        </div>
      </div>
      <BusinessUsageSummary costs={costs} />
    </Block>
  );
};

export default BusinessUsage;
