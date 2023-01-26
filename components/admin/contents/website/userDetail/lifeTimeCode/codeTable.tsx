import classNames from "classnames";
import { LifeTimeCode } from "../../../../../../api/admin/user";

/* This example requires Tailwind CSS v2.0+ */
const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "jane.cooper@example.com",
  },
  {
    name: "Cody Fisher",
    title: "Product Directives Officer",
    role: "Owner",
    email: "cody.fisher@example.com",
  },
  // More people...
];

const CodeTable: React.FC<{ data: LifeTimeCode[]; className?: string }> = ({
  data,
  className,
}) => {
  return (
    <div className={classNames("flex flex-col", className ?? "")}>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                  >
                    Is Redeemed
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map(({ id, code, is_redeemed }, index) => (
                  <tr
                    key={id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {code}
                    </td>
                    <td
                      className={classNames(
                        "px-6 py-4 whitespace-nowrap text-sm text-center text-bold",
                        is_redeemed ? "text-blue-600" : "text-red-600"
                      )}
                    >
                      {is_redeemed ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeTable;
