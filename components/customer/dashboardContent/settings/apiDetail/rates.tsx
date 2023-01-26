import { useEffect, useRef, useState } from "react";
import { XEngine } from "../../../../../api/admin/engine";
import { XRate } from "../../../../../api/admin/rate";
import { getAllEngine } from "../../../../../api/business/engine";
import { getRatesByEngine } from "../../../../../api/business/rate";
import Block from "../../../../block";
import SearchInput from "../../../../searchInput";
import SelectBox from "../../selectBox";

const Rates: React.FC = () => {
  const [engines, setEngines] = useState<XEngine[]>([]);
  const [engineId, setEngineId] = useState<string | number>("");
  const [rates, setRates] = useState<XRate[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<XRate[]>([]);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const data = await getAllEngine();
        if (mounted.current) {
          setEngines(data);
          if (data.length > 0) {
            setEngineId(data[0].id);
          }
        }
      } catch (err) {}
    }
    initialize();
  }, []);

  const onChangeEngine = (e) => {
    setEngineId(e.target.value);
  };

  useEffect(() => {
    setFilteredItems(
      rates?.filter((item) =>
        item.content_type.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
  }, [rates, searchKey]);

  useEffect(() => {
    async function getRates() {
      try {
        const data = await getRatesByEngine(engineId);
        if (mounted.current) {
          setRates(data);
        }
      } catch (err) {}
    }
    if (engineId) {
      getRates();
    }
  }, [engineId]);

  if (engines.length == 0) {
    return null;
  }

  return (
    <Block
      title="API Rates"
      message="Cost of generating specific content types using the API for different AI models."
    >
      <SelectBox
        id="engine_name"
        name="engine_name"
        className="mr-auto mt-3"
        value={engineId}
        onChange={onChangeEngine}
      >
        {engines?.map(({ id, name }) => (
          <option key={id} value={id}>
            Model: {name}
          </option>
        ))}
      </SelectBox>
      <div className="mt-5">
        <SearchInput
          initValue={searchKey}
          onChange={setSearchKey}
          placeholder="search for content type"
        />
      </div>
      <div className="mt-5 flex flex-col overflow-y-auto max-h-96">
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Block>
  );
};

export default Rates;
