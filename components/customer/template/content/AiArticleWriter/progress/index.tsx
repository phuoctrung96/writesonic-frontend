import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./index.module.scss";

function Progress({
  step,
  onChangeStep,
  articleTitles,
  articleOutlines,
  copies,
  generatingCopies,
}: {
  step: number;
  onChangeStep: Function;
  articleTitles: string[];
  articleOutlines: string[][];
  copies: [];
  generatingCopies: boolean;
}) {
  const router = useRouter();
  const { generateCopy } = router.query;

  const [items, setItems] = useState([
    { id: 0, message: "Come up with ideas for your article", active: false },
    {
      id: 1,
      message: "Write an intro and outline for your article",
      active: false,
    },
    { id: 2, message: "Generate your draft article", active: false },
  ]);

  useEffect(() => {
    setItems((prev) => {
      const updated = [...prev];
      updated.splice(0, 1, {
        ...items[0],
        active: articleTitles?.length > 0,
      });
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleTitles]);

  useEffect(() => {
    setItems((prev) => {
      const updated = [...prev];
      updated.splice(1, 1, {
        ...items[1],
        active: articleOutlines?.length > 0,
      });
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleOutlines]);

  useEffect(() => {
    setItems((prev) => {
      const updated = [...prev];
      updated.splice(2, 1, {
        ...items[2],
        active: copies?.length > 0,
      });
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copies]);

  return (
    <div className="grid grid-cols-3 relative bg-white relative">
      {items?.map(({ id, message, active }, index) => (
        <div
          className={classNames(
            styles["right-arrow"],
            "border-r flex col-span-1 px-2 py-2 sm:py-3.5 justify-center items-center border-t border-b border-solid hover:shadow transition-all duration-500 cursor-pointer"
          )}
          key={id}
          onClick={() => {
            onChangeStep(index);
          }}
        >
          <p
            className={classNames(
              "font-medium text-sm border-3 border-solid rounded-full w-10 h-10 flex justify-center items-center transition-all duration-500 relative select-none",
              step === id
                ? "text-indigo-0 border-indigo-0"
                : "text-gray-500 border-gray-2"
            )}
          >
            {generatingCopies && !active && step === id ? (
              <svg
                className="animate-spin h-5 w-5 text-indigo-0 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <span>{active ? "" : `0${id + 1}`}</span>
            )}
            <CheckCircleIcon
              className={classNames(
                "transition-opacity duration-500 absolute w-12 h-12 text-indigo-0 absolute",
                active ? "opacity-100" : "opacity-0"
              )}
            />
          </p>
          <div className="ml-3">
            <p
              className={classNames(
                "`hidden sm:block font-semibold text-base transition-all duration-500 select-none",
                step === id ? "text-indigo-0" : "text-gray-500"
              )}
            >
              STEP {id + 1}
            </p>
            <p className="hidden xl:block font-medium text-gray-500 text-xs select-none">
              {message}
            </p>
          </div>
        </div>
      ))}
      <div
        className={`transition-all duration-500 absolute border-2 bottom-0 ${
          step < 1 ? "left-0" : step > 2 ? "left-2/3" : `left-${step}/3`
        } border-b border-indigo-0 bg-indigo-0 w-1/3`}
      />
      <Transition
        as={Fragment}
        show={generatingCopies || !generateCopy}
        enter="transition-opacity duration-400"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-600"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={classNames(
            "absolute w-full h-full left-0 top-0 bg-gray-300 bg-opacity-5",
            generateCopy ? "" : "cursor-not-allowed"
          )}
        />
      </Transition>
    </div>
  );
}

const mapStateToPros = (state) => {
  return {
    articleTitles: state?.articleWriter?.articleTitles ?? [],
    articleOutlines: state?.articleWriter?.articleOutlines ?? [],
    copies: state?.template?.copies ?? [],
    generatingCopies: state?.template?.generatingCopy,
  };
};

export default connect(mapStateToPros)(Progress);
