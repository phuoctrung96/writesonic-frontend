import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getAllXPlanHistory,
  XPlanHistory,
} from "../../../../../../api/admin/businessPlanHistory";
import { Customer } from "../../../../../../api/admin/user";
import convertTimezone from "../../../../../../utils/convertTimezone";
import Block from "../../../../../block";

const BusinessPlanHistory: React.FC<{ info: Customer }> = ({ info }) => {
  const router = useRouter();
  const { locale } = router;
  const [planHistory, setPlanHistory] = useState<XPlanHistory[]>([]);
  useEffect(() => {
    async function initialize() {
      try {
        const data = await getAllXPlanHistory({ owner_id: info.id });
        setPlanHistory(data);
      } catch (err) {}
    }
    initialize();
  }, [info]);

  return (
    <Block title="Business Plan History">
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Plan Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Interval
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Credits
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {planHistory?.map(({ id, created_date, x_plan }) => {
              return (
                <tr key={id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {convertTimezone(created_date, locale)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {x_plan.name[locale]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {x_plan.interval}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {x_plan.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $ {x_plan.price / 100}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Block>
  );
};

export default BusinessPlanHistory;
