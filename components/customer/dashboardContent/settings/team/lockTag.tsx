import { LockClosedIcon } from "@heroicons/react/outline";
import { ReactNode } from "react";

interface LockTagInteface {
  children: ReactNode;
}
const LockTag: React.FC<LockTagInteface> = ({ children }) => {
  return (
    <div className="mx-auto rounded-lg w-full px-5 py-3 bg-white flex justify-center items-center space-x-3">
      <div>
        <LockClosedIcon className="text-gray-400 w-5 h-5" aria-hidden="true" />
      </div>
      <p className="text-gray-700 text-md font-medium text-center">
        {children}
      </p>
    </div>
  );
};

export default LockTag;
