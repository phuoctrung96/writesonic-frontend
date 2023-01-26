/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import useTranslation from "next-translate/useTranslation";
import { Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { openProfilebar } from "../../store/modals/actions";
import XsCloseButton from "../buttons/xsCloseButton";
import ProfileSideBarContent from "./profileSideBarContent";

function ProfileSideBar({
  isOpenModal,
  setLoading,
}: {
  isOpenModal: boolean;
  setLoading: (isLoading: boolean) => void;
}) {
  const dispatch = useDispatch();
  const openModal = (open: boolean) => {
    dispatch(openProfilebar(open));
  };
  const { t } = useTranslation();

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

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen sidebar:w-profilebar">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-auto">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-xl font-medium text-gray-0">
                        {t("common:settings")}
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <XsCloseButton onClick={() => openModal(false)} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    {/* Replace with your content */}
                    <div className="absolute inset-0">
                      <div className="h-full" aria-hidden="true">
                        <ProfileSideBarContent setLoading={setLoading} />
                      </div>
                    </div>
                    {/* /End replace */}
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
    isOpenModal: state.modals?.isProfileSidebarOpen,
  };
};

export default connect(mapStateToPros)(ProfileSideBar);
