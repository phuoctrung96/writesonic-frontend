import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";

const ItemBlock: React.FC<{
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}> = ({ className, children, onClick }) => {
  return (
    <div
      className={classNames(
        "transition cursor-pointer flex justify-between hover:text-pink-500 items-center text-normal text-sm py-4",
        className ?? ""
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ItemBlock;
