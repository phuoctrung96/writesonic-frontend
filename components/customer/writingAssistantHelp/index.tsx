import { VideoCameraIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";

export default function WritingAssistantHelp({ className }) {
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const [isShowing, setIsShowing] = useState(false);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          !ref?.current?.contains(event.target) &&
          !buttonRef?.current?.contains(event.target)
        ) {
          setIsShowing(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div className={`${className} text-right`}>
      <a
        type="button"
        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 mb-5 invisible md:visible"
        href="https://www.youtube.com/watch?v=imQT8LM_7uU"
        target="_blank"
        rel="noreferrer"
      >
        <VideoCameraIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
        Tutorial
      </a>
    </div>
  );
}
