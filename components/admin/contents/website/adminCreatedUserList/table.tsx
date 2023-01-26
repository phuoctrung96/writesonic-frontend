import { useRouter } from "next/router";
import { AdminCreatedUsersDashboardOutput } from "../../../../../api/admin/user";
import SmPinkButton from "../../../../buttons/smPinkButton";

const columns = [
  "name",
  "email",
  "initial one time credits",
  "profile dashboard",
];

function Table({ data }: { data: AdminCreatedUsersDashboardOutput[] }) {
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 capitalize tracking-wider whitespace-nowrap"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.map(
                  ({ user_id, full_name, email, one_time_credits }) => {
                    return (
                      <tr key={user_id}>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            {full_name}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            {email}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            {one_time_credits}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 select-none">
                          <p className="whitespace-nowrap font-medium px-2 py-1">
                            <SmPinkButton
                              onClick={() => {
                                router.push(
                                  `/dashboard/users/${user_id}`,
                                  undefined,
                                  { shallow: true }
                                );
                              }}
                              className=""
                            >
                              Visit Profile
                            </SmPinkButton>
                          </p>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
