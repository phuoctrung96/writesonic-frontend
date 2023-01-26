/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { openProjectSideBar } from "../../store/modals/actions";
import ProjectNavbar from "./projectNavbar";

function ProjectSidebar({ isOpenModal }: { isOpenModal: boolean }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openModal = (open: boolean) => {
    dispatch(openProjectSideBar(open));
  };

  return (
    <Transition.Root show={isOpenModal} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden z-20"
        open={isOpenModal}
        onClose={openModal}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-indigo-500 bg-opacity-30 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="w-screen max-w-md overflow-y-auto">
                <div className="min-h-300 h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-xl font-medium">
                        <p className="text-white text-lg font-medium">
                          {t("common:Projects")}
                        </p>
                        <p className="mt-1 text-sm text-indigo-300">
                          {t(
                            "common:Projects_let_you_arrange_your_generated_content_systematically"
                          )}
                        </p>
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="inline-flex items-center border border-transparent rounded-sm shadow-sm text-white bg-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-indigo-700"
                          onClick={() => openModal(false)}
                        >
                          <>
                            <span className="sr-only">Close panel</span>
                            <XIcon width={24} height={24} aria-hidden="true" />
                          </>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    <div className="absolute inset-0">
                      <div className="h-full" aria-hidden="true">
                        <ProjectNavbar />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const mapStateToPros = (state) => {
  return {
    isOpenModal: state.modals?.isOpenProjectSidebar,
  };
};

export default connect(mapStateToPros)(ProjectSidebar);
