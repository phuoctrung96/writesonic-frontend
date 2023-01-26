import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  closeHelpScout,
  openHelpScout as openHelpScoutUtil,
} from "../../../utils/helpScout";
import ItemBlock from "./itemBlock";

export default function ChatBot({ className }) {
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const [isShowing, setIsShowing] = useState(false);
  const [isOpenHelpScout, setIsOpenHelpScout] = useState(false);

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

  const eventHandler = () => {
    if (isOpenHelpScout) {
      closeHelpScout();
      return;
    }
    setIsShowing(!isShowing);
  };

  //  open help scout
  const OpenHelpScout = () => {
    openHelpScoutUtil();
    closePopup();
  };

  const openUserback = () => {
    closePopup();
    try {
      window["Userback"].show();
      window["Userback"].open();
    } catch (e) {}
  };

  window.CommandBar.addCallback("helpScout", () => OpenHelpScout());
  window.CommandBar.addCallback("reportIssue", () => openUserback());

  const closePopup = () => {
    setIsShowing(false);
  };

  useEffect(() => {
    function handleOpen() {
      setIsOpenHelpScout(true);
    }
    function handleClose() {
      setIsOpenHelpScout(false);
    }

    if (window["Beacon"]) {
      window["Beacon"]("on", "open", handleOpen);
      window["Beacon"]("on", "close", handleClose);
    }

    return () => {
      if (window["Beacon"]) {
        window["Beacon"]("off", "open", handleOpen);
        window["Beacon"]("off", "close", handleClose);
      }
    };
  }, []);

  return (
    <div className={`${className} text-right`}>
      <Transition
        show={isShowing}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="shadow-chat bg-gray-3 rounded-lg px-4 mb-4 text-left text-white min-w-max relative"
          ref={wrapperRef}
        >
          <ItemBlock
            className="border-b border-gray-1 border-opacity-10 border-solid"
            onClick={closePopup}
          >
            <Link href="https://help.writesonic.com/" shallow>
              <a target="_blank" rel="noreferrer" className="w-full pr-8">
                Help Center
              </a>
            </Link>
          </ItemBlock>
          <ItemBlock onClick={closePopup}>
            <Link href="/feedback" shallow>
              <a>Request a Feature</a>
            </Link>
          </ItemBlock>
          <ItemBlock>
            <Link href="https://www.facebook.com/groups/writesonic" shallow>
              <a target="_blank" rel="noreferrer" className="w-full pr-8">
                Ask the Community
              </a>
            </Link>
          </ItemBlock>
          <ItemBlock
            className="border-t border-gray-1 border-opacity-10 border-solid"
            onClick={openUserback}
          >
            Report Issues
          </ItemBlock>
          <ItemBlock
            className="border-t border-gray-1 border-opacity-10 border-solid"
            onClick={OpenHelpScout}
          >
            Contact Support
          </ItemBlock>
        </div>
      </Transition>
      <button
        type="button"
        className="border border-transparent rounded-full shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        onClick={eventHandler}
        ref={buttonRef}
      >
        <p className="w-12 h-12 flex justify-center items-center text-lg">
          {isShowing || isOpenHelpScout ? <XIcon className="w-5 h-5" /> : "?"}
        </p>
      </button>
    </div>
  );
}
