/* This example requires Tailwind CSS v2.0+ */
import { Menu, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";

export interface FilterProp {
  name: string;
  checked: boolean;
}

interface FilterMenuPros {
  filters: FilterProp[];
  onSelectFilters: Dispatch<SetStateAction<FilterProp[]>>;
}

const FilterMenu: React.FC<FilterMenuPros> = ({ filters, onSelectFilters }) => {
  if (!filters?.length) {
    return null;
  }

  const onChange = (e, name) => {
    onSelectFilters(
      filters.map((filter) => {
        if (name == filter.name) {
          return { ...filter, checked: e.target.checked };
        }
        return filter;
      })
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-20">
      <div className="flex items-center">
        <Menu.Button className="max-w-max text-gray-900 hover:text-gray-700 rounded-l-lg group relative flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:shadow focus:shadow-none border border-gray-200 focus:z-10 cursor-pointer select-none">
          Filter
        </Menu.Button>
        <p className="max-w-max text-gray-900 hover:text-gray-700 rounded-r-lg group relative flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:shadow focus:shadow-none border border-gray-200 focus:z-10 cursor-pointer select-none">
          {filters?.filter(({ checked }) => checked === true).length}
        </p>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="p-2 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          {filters?.map(({ name, checked }) => {
            return (
              <div key={name} className="relative flex items-start py-1.5">
                <div className="flex items-center h-5">
                  <input
                    id={name}
                    name={name}
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    onChange={(e) => onChange(e, name)}
                    checked={checked}
                    value={name}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor={name}
                    className="font-medium text-gray-700 capitalize"
                  >
                    {name}
                  </label>
                </div>
              </div>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default FilterMenu;
