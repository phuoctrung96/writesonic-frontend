import { useRouter } from "next/router";
import { connect } from "react-redux";
import { Customer } from "../../../../../api/admin/user";
import { Plan } from "../../../../../api/credit_v2";
import convertTimezone from "../../../../../utils/convertTimezone";

const columns = [
  "name",
  "email",
  "plan",
  "monthly/annual",
  "plan amount",
  "last payment on",
];

function Table({
  plans,
  data,
  onSelect,
}: {
  plans: Plan[];
  data: Customer[];
  onSelect?: Function;
}) {
  const router = useRouter();
  if (!data || !data.length) {
    return null;
  }
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns?.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.map(
                  ({
                    id,
                    firstName,
                    lastName,
                    email,
                    x_subscription,
                    last_payment_on,
                  }) => (
                    <tr
                      key={id}
                      className={`${
                        onSelect ? "hover:bg-indigo-50 cursor-pointer" : ""
                      } transition-colors`}
                      onClick={() => {
                        if (onSelect) onSelect(id);
                      }}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 select-none">
                        <p className="whitespace-nowrap font-medium px-2 py-1">
                          {`${firstName} ${lastName}`}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 select-none">
                        <p className="whitespace-nowrap font-medium px-2 py-1">
                          {email}
                        </p>
                      </td>
                      <td className="px-6 py-4 select-none">
                        {x_subscription?.x_plan?.name["en"] && (
                          <p
                            className="whitespace-nowrap font-medium px-2 py-1 rounded-2xl text-xs uppercase w-max"
                            style={{
                              color: x_subscription?.x_plan?.color ?? "#000",
                              backgroundColor:
                                `${x_subscription?.x_plan?.color}20` ??
                                "#00000020",
                            }}
                          >
                            {x_subscription?.x_plan?.name["en"] ?? ""}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 select-none">
                        {x_subscription?.x_plan?.interval
                          .toLowerCase()
                          .includes("annual") && (
                          <p className="whitespace-nowrap font-medium px-2 py-1 text-green-500 bg-green-100 rounded-2xl text-xs uppercase w-max">
                            {x_subscription?.x_plan?.interval ?? ""}
                          </p>
                        )}
                        {x_subscription?.x_plan?.interval
                          .toLowerCase()
                          .includes("monthly") && (
                          <p className="whitespace-nowrap font-medium px-2 py-1 text-gray-500 bg-gray-100 rounded-2xl text-xs uppercase w-max">
                            {x_subscription?.x_plan?.interval ?? ""}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 select-none">
                        {x_subscription?.x_plan?.price && (
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            $ {x_subscription?.x_plan?.price / 100 ?? ""}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 select-none">
                        <p className="whitespace-nowrap font-medium px-2 py-1">
                          {last_payment_on &&
                            convertTimezone(last_payment_on, router.locale)}
                        </p>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    plans: state.options?.plans ?? [],
  };
};

export default connect(mapStateToPros)(Table);
