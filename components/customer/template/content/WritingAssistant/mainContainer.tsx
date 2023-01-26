import classNames from "classnames";
import React, { ReactNode } from "react";

const MainContainer: React.FC<{
  leftContent: ReactNode;
  children: ReactNode;
  rightContent: ReactNode;
  mainClassName?: string;
  leftContentClassName?: string;
  rightContentClassName?: string;
}> = ({
  leftContent,
  children,
  rightContent,
  mainClassName,
  leftContentClassName,
  rightContentClassName,
}) => {
  return (
    <div
      className={classNames(
        mainClassName ?? "",
        "w-full bg-white border-t border-gray-200"
      )}
    >
      <div className={classNames(leftContentClassName ?? "", "lg:w-80")}>
        {leftContent}
      </div>
      <>{children}</>
      <div className={classNames(rightContentClassName ?? "", "lg:w-80")}>
        {rightContent}
      </div>
    </div>
  );
};

export default MainContainer;
