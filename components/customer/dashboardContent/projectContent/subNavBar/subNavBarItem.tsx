import classNames from "classnames";

export default function SubNavBarItem({ selected, children }) {
  return (
    <div
      className={classNames(
        selected
          ? "bg-indigo-0 text-white border-none"
          : "bg-white text-gray-2 border border-gray-300",
        "mr-2 my-1 font-normal text-sm px-4 py-1.5 shadow-sm rounded-2xl focus:outline-none hover:shadow-md transition-shadow transition-colors whitespace-nowrap"
      )}
    >
      {children}
    </div>
  );
}
