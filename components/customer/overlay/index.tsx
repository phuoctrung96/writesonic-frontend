import { Transition } from "@headlessui/react";
import classNames from "classnames";
import Image from "next/image";
import { Fragment } from "react";
import logo_src from "./../../../public/images/logo_b.png";
import styles from "./index.module.scss";

export default function Overlay({
  hideLoader,
  isShowing,
  message,
}: {
  hideLoader?: boolean;
  isShowing?: boolean;
  message?: string;
}) {
  if (isShowing === undefined) {
    return (
      <div className="absolute flex justify-center items-center w-full h-full top-0 left-0 backdrop-filter backdrop-blur-sm bg-gray-100 bg-opacity-5 transition-color z-10">
        <div className="block text-center">
          {message && (
            <p className="animate-pulse text-xl font-medium text-indigo-900">
              {message}
            </p>
          )}
          {!hideLoader && (
            <div className={classNames(styles["loader"], "mx-auto mt-8")}>
              <Image
                width={120}
                height={120}
                className={classNames(styles["imageLogo"])}
                src={logo_src}
                alt="Loading Logo"
                priority={true}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <Transition
      as={Fragment}
      show={isShowing}
      enter="transition-opacity duration-400"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-600"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute flex justify-center items-center w-full h-full top-0 left-0 backdrop-filter backdrop-blur-sm bg-white bg-opacity-5 transition-color z-10">
        <div className="block text-center">
          {message && (
            <p className="animate-pulse text-xl font-medium text-indigo-900">
              {message}
            </p>
          )}
          {!hideLoader && (
            <div className={classNames(styles["loader"], "mx-auto mt-8")}>
              <Image
                width={120}
                height={120}
                className={classNames(styles["imageLogo"])}
                src={logo_src}
                alt="Loading Logo"
                priority={true}
              />
            </div>
          )}
        </div>
      </div>
    </Transition>
  );
}
