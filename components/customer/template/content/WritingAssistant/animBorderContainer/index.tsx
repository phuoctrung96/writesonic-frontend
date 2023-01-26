import classNames from "classnames";
import React, { ReactNode } from "react";
import styles from "./index.module.scss";

const AnimBorderContainer: React.FC<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={classNames(styles["rainbow"], className ?? "")}>
      {children}
    </div>
  );
};

export default AnimBorderContainer;
