import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { XEngine } from "../../../../../../api/admin/engine";
import { XRate } from "../../../../../../api/admin/rate";
import { UserRole } from "../../../../../../api/user";
import Block from "../../../../../block";
import SearchInput from "../../../../../searchInput";
import EditRateModal from "./editRateModal";

const Rates: React.FC<{
  info: XEngine;
  onChange: Function;
  myRole: UserRole;
}> = ({ info, onChange, myRole }) => {
  const [selected, setSelected] = useState<XRate>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<XRate[]>([]);
  const handleUpdated = (rate: XRate) => {
    onChange({
      ...info,
      x_rates:
        Array.isArray(info?.x_rates) &&
        info?.x_rates?.map((item) => {
          return item.id === rate.id ? rate : item;
        }),
    });
  };

  useEffect(() => {
    setFilteredItems(
      info?.x_rates?.filter((item) =>
        item.content_type.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
  }, [info?.x_rates, searchKey]);

  return (
    <Block
      title={
        <p>
          <span className="mr-2 text-sm text-gray-500">
            {info?.x_rates?.length ?? 0}
          </span>
          Rates
        </p>
      }
      message="Update rate"
      className="h-full"
    >
      <div className="mt-5">
        <SearchInput
          initValue={searchKey}
          onChange={setSearchKey}
          placeholder="search for content type"
        />
      </div>
      <div className="mt-5 flex flex-col overflow-y-auto h-99">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Content Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                Rate
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems?.map((rate) => {
              const { id, content_type, amount } = rate;
              return (
                <tr key={id} className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {content_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{amount}</td>
                  {myRole === UserRole.super_admin && (
                    <td
                      className="px-6 py-4 text-sm text-indigo-900 hover:text-indigo-600 cursor-pointer"
                      onClick={() => {
                        setSelected(rate);
                        setIsOpenModal(true);
                      }}
                    >
                      Edit
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selected && (
        <EditRateModal
          selectedRate={selected}
          onUpdated={handleUpdated}
          isOpenModal={isOpenModal}
          openModal={setIsOpenModal}
        />
      )}
    </Block>
  );
};

const mapStateToPros = (state) => {
  return {
    myRole: state?.user?.role ?? UserRole.member,
  };
};

export default connect(mapStateToPros)(Rates);
