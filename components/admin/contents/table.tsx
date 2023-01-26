/* This example requires Tailwind CSS v2.0+ */
const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "jane.cooper@example.com",
  },
  // More people...
];

export default function Table({
  columns,
  data,
  onSelect,
}: {
  columns: string[];
  data: { [key: string]: any }[];
  onSelect?: Function;
}) {
  if (!data || !data.length) {
    return null;
  }
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
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
                {data?.map((item) => (
                  <tr
                    key={item.id}
                    className={`${
                      onSelect ? "hover:bg-indigo-50 cursor-pointer" : ""
                    } transition-colors`}
                    onClick={() => {
                      if (onSelect) onSelect(item.id);
                    }}
                  >
                    {Object.keys(item)?.map((key) => {
                      const { value, className } = item[key];
                      if (key !== "id") {
                        return (
                          <td
                            key={key}
                            className="px-6 py-4 text-sm text-gray-500 select-none"
                          >
                            <p
                              className={`${
                                className ? className : ""
                              } whitespace-nowrap font-medium px-2 py-1`}
                            >
                              {value}
                            </p>
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
