import React from "react";
import SkeletonLoader from "./skeletonLoader";

function SkeletonLoaderTemplate() {
  return (
    <div className="p-3 relative">
      <div className="block rounded-md bg-white p-3 sm:p-6 mb-4 w-full px-3 py-6">
        <div className="block sm:flex justify-between items-center">
          <SkeletonLoader loaderType={"short-line-x"} />
          <SkeletonLoader loaderType={"short-line-y"} />
        </div>
        <div className="mt-2 w-full">
          <SkeletonLoader loaderType="bullet-list" height={100} />
        </div>
        <div className="flex justify-between items-center w-full mt-4">
          <SkeletonLoader loaderType={"short-line-x"} />
          <SkeletonLoader loaderType={"short-line-y"} />
        </div>
      </div>
      <div className="block rounded-md bg-white p-3 sm:p-6 mb-4 w-full px-3 py-6">
        <div className="block sm:flex justify-between items-center">
          <SkeletonLoader loaderType={"short-line-x"} />
          <SkeletonLoader loaderType={"short-line-y"} />
        </div>
        <div className="mt-2 w-full">
          <SkeletonLoader loaderType="bullet-list" height={100} />
        </div>
        <div className="flex justify-between items-center w-full mt-4">
          <SkeletonLoader loaderType={"short-line-x"} />
          <SkeletonLoader loaderType={"short-line-y"} />
        </div>
      </div>
      <div className="block rounded-md bg-white p-3 sm:p-6 mb-4 w-full px-3 py-6">
        <div className="block sm:flex justify-between items-center">
          <SkeletonLoader loaderType={"short-line-x"} />
          <SkeletonLoader loaderType={"short-line-y"} />
        </div>
        <div className="mt-2 w-full">
          <SkeletonLoader loaderType="bullet-list" height={100} />
        </div>
        <div className="flex justify-between items-center w-full mt-4">
          <SkeletonLoader loaderType={"short-line-x"} />
          <SkeletonLoader loaderType={"short-line-y"} />
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoaderTemplate;
