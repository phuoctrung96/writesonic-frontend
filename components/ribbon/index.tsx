import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./index.module.scss";

const Ribbon: React.FC<{
  color: string;
  backgroundColor: string;
  children: ReactNode;
  className?: string;
}> = ({ color, backgroundColor, children, className }) => {
  return (
    <div
      className={classNames(
        styles["ribbon"],
        "text-xs font-normal py-1.5",
        className ?? ""
      )}
      style={{ color, backgroundColor }}
    >
      {children}
    </div>
  );
};

export default Ribbon;
