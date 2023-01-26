import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getAllSubscriptionHistory,
  SubscriptionHistory as SubscriptionHistoryInterface,
} from "../../../../../../api/admin/subscriptionHistory";
import { Customer } from "../../../../../../api/admin/user";
import convertTimezone from "../../../../../../utils/convertTimezone";
import Block from "../../../../../block";

const SubscriptionHistory: React.FC<{ info: Customer }> = ({ info }) => {
  const router = useRouter();
  const { locale } = router;
  const [subscriptionHistory, setSubscriptionHistory] = useState<
    SubscriptionHistoryInterface[]
  >([]);
  useEffect(() => {
    async function initialize() {
      try {
        const data = await getAllSubscriptionHistory({ owner_id: info.id });
        setSubscriptionHistory(data);
      } catch (err) {}
    }
    initialize();
  }, [info]);

  return (
    <Block title="Subscription History">
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
            {subscriptionHistory?.map(
              ({
                id,
                created_date,
                subscription_plan,
                subscription_product,
              }) => {
                return (
                  <tr key={id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {convertTimezone(created_date, locale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription_product?.name[locale]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription_plan?.interval}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription_plan?.credits ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $ {subscription_plan?.price / 100 ?? 0}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </Block>
  );
};

export default SubscriptionHistory;
