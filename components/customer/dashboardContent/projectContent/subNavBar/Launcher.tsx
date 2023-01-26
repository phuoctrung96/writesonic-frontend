import { SearchIcon } from "@heroicons/react/solid";
import React from "react";
import { osControlKey } from "./os";

const Launcher = () => {
  return (
    <div
      id="commandbar-user-launcher-component"
      className="w-full md:w-56 relative px-2 text-sidebar text-sm bg-white py-2 border border-gray-300 rounded-md transition ease-in-out delay-300 cursor-text"
      onClick={() => {
        window?.CommandBar?.open();
      }}
    >
      <div className="flex items-center justify-between font-normal text-sm">
        <div className="flex items-center text-gray-400">
          <SearchIcon
            className="h-5 w-5 mr-2 text-gray-500"
            aria-hidden="true"
          />
          Search
        </div>
        <div className="text-sm">
          <span
            style={{ marginRight: 3 }}
            // className="commandbar-user-launcher__tag"
            className="inline-flex justify-center align-middle text-xs px-1.5 py-1 box-border bg-gray-300 text-white rounded-md"
          >
            {osControlKey()}
          </span>
          <span className="mr-1 text-gray-500">+</span>
          <span className="inline-flex justify-center align-middle text-xs px-2 py-1 box-border bg-gray-300 text-white rounded-md">
            K
          </span>
        </div>
      </div>
    </div>
  );
};

export default Launcher;
