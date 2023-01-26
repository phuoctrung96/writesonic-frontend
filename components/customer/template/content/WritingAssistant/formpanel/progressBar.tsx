import { Transition } from "@headlessui/react";
import classNames from "classnames";
import { useEffect, useState } from "react";

const ProgressBar: React.FC<{
  len: number;
  value: number;
  className?: string;
}> = ({ len, value, className }) => {
  const [width, setWidth] = useState<number>(100);

  useEffect(() => {
    const newWidth = value >= len ? 100 : (value / len) * 100;
    setWidth(newWidth);
  }, [len, value]);

  return (
    <Transition
      show={width < 100}
      enter="transform transition ease-in-out duration-500 sm:duration-700 delay-200"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transform transition ease-in-out duration-500 sm:duration-700 delay-1000"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
      className={classNames("px-8", className ?? "")}
    >
      <p className="font-medium text-base select-none text-center">
        Write min. ({len}+ words) to train the AI.
      </p>
      <div className="block h-1.5 bg-gray-5 bg-opacity-1.2 relative rounded-full mt-2">
        <div
          className="h-1.5 bg-green-0 rounded-full transition-all duration-200"
          style={{ width: `${width}%` }}
        />
      </div>
    </Transition>
  );
};

export default ProgressBar;
