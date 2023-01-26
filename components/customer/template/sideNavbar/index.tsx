import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import useContentType from "../../../../hooks/useContentType";
import { openTemplateSidebar } from "../../../../store/modals/actions";
import SideBarContent from "./sideBarContent";

function SideBar({
  isOpenTemplateSideBar,
  className,
}: {
  isOpenTemplateSideBar: boolean;
  className: string;
}) {
  const dispatch = useDispatch();
  const setSidebarOpen = (open) => {
    dispatch(openTemplateSidebar(open));
  };

  const [currentContentType, currentTemplate] = useContentType();

  return (
    <>
      <Transition.Root show={isOpenTemplateSideBar} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-20 inset-0 flex"
          open={isOpenTemplateSideBar}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-50 bg-gray-100 overflow-y-scroll">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <>
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </>
                  </button>
                </div>
              </Transition.Child>
              <SideBarContent />
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      {currentTemplate?.key !== "ai-article-writer-v3" &&
      currentTemplate?.key !== "ai-article-writer-v2" ? (
        <div className={`${className}`}>
          <div className="flex flex-col w-72">
            <div className="flex flex-col flex-grow overflow-y-auto">
              <SideBarContent />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    isOpenTemplateSideBar: state.modals?.isOpenTemplateSideBar,
  };
};

export default connect(mapStateToPros)(SideBar);
