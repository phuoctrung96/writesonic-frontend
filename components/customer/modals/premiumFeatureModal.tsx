/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { Fragment } from "react";
import SmPinkButton from "../../buttons/smPinkButton";
import SmWhiteButton from "../../buttons/smWhiteButton";

const PremiumFeatureModal = ({
  openModal,
  setOpenModal,
  text,
  heading,
  learnMoreLink,
}: {
  openModal: boolean;
  text?: string;
  heading?: string;
  setOpenModal: any;
  learnMoreLink?: string;
}) => {
  const handleClick = () => {
    setOpenModal(false);
  };

  return (
    <Transition.Root show={openModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleClick}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <LockClosedIcon
                    className="h-6 w-6 text-yellow-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    You discovered a Premium feature!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Upgrading to Startup or Agency plans will unlock it.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <SmWhiteButton onClick={handleClick}>
                  Skip for now
                </SmWhiteButton>

                <Link href={learnMoreLink} passHref>
                  <SmPinkButton>Upgrade Now</SmPinkButton>
                </Link>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PremiumFeatureModal;
