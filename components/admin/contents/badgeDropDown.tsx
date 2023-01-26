import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { Fragment, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { BadgeData } from "../../../api/admin/badge";
import { updateContentTypeBadge } from "../../../api/admin/contentType";
import { getCategories } from "../../../api/category";
import {
  setCategories,
  setToastify,
  ToastStatus,
} from "../../../store/main/actions";

const BadgeDropDown: React.FC<{
  contentId: string;
  className?: string;
  badges: BadgeData[];
  isGroup: boolean;
  groupId?: string;
  onChange: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  contentId,
  badges,
  className,
  isGroup,
  onChange,
  setIsLoading,
  groupId,
}) => {
  const dispatch = useDispatch();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const onSelect = async (id?: number) => {
    try {
      setIsLoading(true);
      const list = await updateContentTypeBadge({
        id: contentId,
        badge_id: id ?? null,
        is_group: isGroup,
        group_id: groupId,
      });
      dispatch(setCategories(await getCategories()));
      onChange(list);
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: "Sorry, we weren't able to set the badge.",
        })
      );
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };
  return (
    <Menu
      as="div"
      className={classNames("relative inline-block text-left", className ?? "")}
    >
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          Badge
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
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
        <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {badges?.map(({ id, name }) => (
              <Menu.Item key={id} onClick={() => onSelect(id)}>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    {name}
                  </div>
                )}
              </Menu.Item>
            ))}
            <Menu.Item onClick={() => onSelect()}>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? "bg-gray-100 text-red-900" : "text-red-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  None
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default BadgeDropDown;
