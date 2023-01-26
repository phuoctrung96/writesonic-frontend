import classNames from "classnames";
import { ReactNode } from "react";

export default function Block({
  title,
  message,
  children,
  className,
}: {
  title?: string | ReactNode;
  message?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "w-full bg-white shadow p-6 mx-auto rounded-lg relative",
        className ?? ""
      )}
    >
      {
        <div
          className={classNames(
            className && className.includes("p") ? "px-6" : "",
            "sm:col-span-6"
          )}
        >
          <div className="text-medium text-lg font-medium text-gray-900">
            {title}
          </div>
          <p className="text-normal text-sm text-gray-500 pt-2">{message}</p>
        </div>
      }
      {children}
    </div>
  );
}
