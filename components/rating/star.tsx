import { StarIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { MouseEventHandler } from "react";

const delays = ["delay-75", "delay-100", "delay-150", "delay-200", "delay-300"];

const Star: React.FC<{
  selected?: boolean;
  focused?: boolean;
  index?: number;
  onClick?: MouseEventHandler<SVGSVGElement>;
  onMouseOver?: MouseEventHandler<SVGSVGElement>;
  className?: string;
}> = ({ selected, focused, onClick, onMouseOver, className, index }) => {
  return (
    <StarIcon
      onClick={onClick}
      onMouseOver={onMouseOver}
      className={classNames(
        selected
          ? "text-yellow-500"
          : focused
          ? `text-yellow-300 ${
              index > 0 && index < delays.length ? delays[index - 1] : ""
            }`
          : "text-gray-300",
        "w-8 h-8 cursor-pointer transition-colors duration-100 p-1",
        className ?? ""
      )}
    />
  );
};

export default Star;
