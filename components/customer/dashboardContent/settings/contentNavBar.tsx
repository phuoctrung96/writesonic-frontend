import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { connect } from "react-redux";
import { NavItem } from "../../../../store/options/reducer";

function TeamContentNavBar({
  navItems,
  providers,
}: {
  navItems: NavItem[];
  providers: string[];
}) {
  const router = useRouter();
  const { teamId, category } = router.query;

  return (
    <div className="relative flex justify-between h-14 ">
      <div className="flex-1 flex justify-start items-end bg-white pl-20 sm:pl-24 md:pl-9 overflow-x-auto">
        <div className="flex space-x-8">
          {navItems?.map(({ key, name, childrenItems }) => {
            if (childrenItems) {
              return (
                <div key={key}>
                  <PopupMenu
                    currentKey={key}
                    name={name}
                    childrenItems={childrenItems}
                  />
                </div>
              );
            }
            return (
              <Link
                key={key}
                href={
                  teamId
                    ? `\/${teamId}\/settings\/${key}`
                    : `\/settings\/${key}`
                }
                shallow
              >
                <a
                  className={classNames(
                    "py-3 transition-colors duration-100 cursor-pointer inline-flex items-center pt-1 border-b-2 text-sm font-medium",
                    category === key
                      ? "border-indigo-500 text-indigo-0"
                      : "border-transparent text-gray-2 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {name}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    providers: state.user?.providers,
  };
};

export default connect(mapStateToPros)(TeamContentNavBar);

const PopupMenu: React.FC<{
  currentKey: string;
  name: string;
  childrenItems: {
    key: string;
    name: string;
    description?: string;
    component: Function;
  }[];
}> = ({ currentKey, name, childrenItems }) => {
  const router = useRouter();
  const { teamId, category } = router.query;
  return (
    <Popover className="block relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              "mt-auto py-3 transition-colors duration-100 cursor-pointer inline-flex items-center pt-1 border-b-2 text-sm font-medium",
              category === currentKey
                ? "border-indigo-500 text-indigo-0"
                : "border-transparent text-gray-2 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            <span>{name}</span>
            {open ? (
              <ChevronUpIcon
                className={classNames(
                  open ? "text-gray-600" : "text-gray-400",
                  "ml-2 h-5 w-5 group-hover:text-gray-500"
                )}
                aria-hidden="true"
              />
            ) : (
              <ChevronDownIcon
                className={classNames(
                  open ? "text-gray-600" : "text-gray-400",
                  "ml-2 h-5 w-5 group-hover:text-gray-500"
                )}
                aria-hidden="true"
              />
            )}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                  {childrenItems.map(({ key, name, description }) => (
                    <Link
                      key={key}
                      href={
                        teamId
                          ? `\/${teamId}\/settings\/${currentKey}/${key}`
                          : `\/settings\/${currentKey}/${key}`
                      }
                      shallow
                    >
                      <a className="-m-3 p-3 block rounded-md hover:bg-gray-50 transition ease-in-out duration-150">
                        <p className="text-base font-medium text-gray-900">
                          {name}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {description}
                        </p>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
