import { BadgeData } from "../../../../../api/admin/badge";
import Ribbon from "../../../../ribbon";
const Table: React.FC<{
  data: BadgeData[];
  clickEdit: Function;
  clickRemove: Function;
}> = ({ data, clickEdit, clickRemove }) => {
  if (!data.length) {
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Text Color
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Background Color
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Preview
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map(
                  ({ id, name, text_color, background_color }, index) => (
                    <tr
                      key={id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {text_color}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {background_color}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Ribbon
                          className="ml-auto"
                          color={text_color}
                          backgroundColor={background_color}
                        >
                          {name}
                        </Ribbon>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium grid grid-cols-2 gap-x-4">
                        <p
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          onClick={() => {
                            clickEdit({
                              id,
                              name,
                              text_color,
                              background_color,
                            });
                          }}
                        >
                          Edit
                        </p>
                        <p
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          onClick={() => {
                            clickRemove({
                              id,
                              name,
                              text_color,
                              background_color,
                            });
                          }}
                        >
                          Remove
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
};

export default Table;
