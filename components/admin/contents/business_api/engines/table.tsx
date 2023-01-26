import classNames from "classnames";
import { useRouter } from "next/router";
import { XEngine } from "../../../../../api/admin/engine";

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

const Table: React.FC<{ data: XEngine[] }> = ({ data }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                  >
                    OpenAI Engine
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map(({ id, name, open_ai_engine_name }, personIdx) => (
                  <tr
                    key={id}
                    className={classNames(
                      personIdx % 2 === 0 ? "bg-white" : "bg-gray-50",
                      "hover:bg-indigo-50 cursor-pointer transition-color duration-200"
                    )}
                    onClick={() =>
                      router.push(`/dashboard/x-engines/${id}`, undefined, {
                        shallow: true,
                      })
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {open_ai_engine_name}
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

export default Table;
