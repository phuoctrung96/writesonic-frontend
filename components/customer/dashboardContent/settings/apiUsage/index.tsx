import { Transition } from "@headlessui/react";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { XEngine } from "../../../../../api/admin/engine";
import {
  BusinessSummary,
  getBusinessSummary,
  getBusinessSummaryPerType,
  getSummaryFilterOptions,
  XCreditHistorySummaryFilterOptions,
} from "../../../../../api/business/business";
import PriceCard from "../../../../admin/contents/priceCard";
import Block from "../../../../block";
import BusinessUsageSummary, {
  BusinessUsageSummaryProps,
} from "../../../../businessUsageSummary";
import SmPinkButton from "../../../../buttons/smPinkButton";
import SelectBox from "../../selectBox";

const ApiUsage: React.FC<{ businessId: string }> = ({ businessId }) => {
  const [info, setInfo] = useState<BusinessSummary>({
    one_time_funds: 0,
    subscription_funds: 0,
    usage_this_month: 0,
    usage_to_day: 0,
  });
  const [options, setOptions] = useState<XCreditHistorySummaryFilterOptions[]>(
    []
  );
  const [months, setMonths] = useState<string[]>([]);
  const [month, setMonth] = useState<string>();
  const [usedEngines, setUsedEngines] = useState<XEngine[]>([]);
  const [usedEngineId, setUsedEngineId] = useState<string | number>(null);
  const [costs, setCosts] = useState<BusinessUsageSummaryProps[]>([]);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const data = await getBusinessSummary(businessId);
        if (mounted.current) {
          setInfo(data);
        }
      } catch (err) {}
    }
    if (businessId) {
      init();
    }
  }, [businessId]);

  useEffect(() => {
    async function initialize() {
      try {
        const data = await getSummaryFilterOptions(businessId);
        if (!mounted.current) {
          return;
        }
        setOptions(data);
        setMonths(data?.map(({ month }) => month));
        if (data.length > 0) {
          const months = data.map(({ month }) => month);
          const month = months[0];
          formatProps({ month, options: data });
        }
      } catch (err) {}
    }
    if (businessId) {
      initialize();
    }
  }, [businessId]);

  useEffect(() => {
    async function init() {
      try {
        const summary = await getBusinessSummaryPerType({
          business_id: businessId,
          month,
          x_engine_id: usedEngineId,
        });
        setCosts([
          {
            content_name: "Total",
            funds: summary.total,
          },
          ...summary.data,
        ]);
      } catch (err) {}
    }
    if (month && usedEngineId) {
      init();
    }
  }, [businessId, month, usedEngineId]);

  const onChangeEngine = (e) => {
    setUsedEngineId(e.target.value);
  };

  const onChangeMonth = (e) => {
    formatProps({ month: e.target.value, options });
  };

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

  const { one_time_funds, subscription_funds, usage_this_month, usage_to_day } =
    info;
  const total = one_time_funds + subscription_funds;
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          className="flex justify-center items-center w-full"
          href="https://api.writesonic.com/api-docs/"
          target="_blank"
          rel="noreferrer"
        >
          <SmPinkButton className="w-full mt-3">
            <ExternalLinkIcon className="h-4 w-4 text-white mr-1" />
            View API Docs
          </SmPinkButton>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <PriceCard name="Remaining Balance" price={total} />
        <PriceCard
          name="Usage for this month"
          price={usage_this_month}
          // percent={getPercent(usage_this_month, total)}
        />
        <PriceCard
          name="Usage for today"
          price={usage_to_day}
          // percent={getPercent(usage_to_day, total)}
        />
      </div>
      <Transition
        show={costs?.length > 0}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Block>
          <div className="pb-8 flex justify-between items-center">
            <p className="text-normal font-medium text-gray-800">
              Usage Summary
            </p>
            <div className="grid grid-cols-2 gap-x-2">
              <SelectBox
                id="engine_name"
                name="engine_name"
                value={usedEngineId}
                onChange={onChangeEngine}
              >
                {usedEngines?.map(({ id, name }) => (
                  <option key={id} value={id}>
                    Model: {name}
                  </option>
                ))}
              </SelectBox>
              <SelectBox
                id="month"
                name="month"
                className="appearance-none block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-400 focus:border-transparent text-sm"
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
      </Transition>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    businessId: state.user?.business_id ?? "",
  };
};

export default connect(mapStateToPros)(ApiUsage);
