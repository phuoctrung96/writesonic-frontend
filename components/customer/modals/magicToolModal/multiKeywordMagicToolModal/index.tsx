import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction } from "react";
import { SemrushSearchOutput } from "../../../../../api/semrush";
import semrushLogo from "../../../../../public/images/semrush.png";
import XsCloseButton from "../../../../buttons/xsCloseButton";
import Content from "./content";

export default function MultiKeywordMagicToolModal({
  isOpenModal,
  setIsOpenModal,
  defaultSearchKey,
  onSelectKeywords,
  data,
  setData,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  defaultSearchKey?: string;
  onSelectKeywords: (primary: string, secondary: string) => void;
  data: SemrushSearchOutput;
  setData: Dispatch<SetStateAction<SemrushSearchOutput>>;
}) {
  return (
    <>
      <Transition.Root show={isOpenModal} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          open={isOpenModal}
          onClose={() => {}}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
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
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
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
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle px-4 pt-4 pb-4">
                <div className="flex items-center border-b border-gray-200 pb-3">
                  <Image
                    src={semrushLogo}
                    alt="Semrush"
                    width={45}
                    height={30}
                  />
                  <div className="ml-1 text-center sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Get Keyword Ideas
                    </Dialog.Title>
                  </div>
                  <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <XsCloseButton onClick={() => setIsOpenModal(false)} />
                  </div>
                </div>
                <div className="my-6"></div>
                <Content
                  data={data}
                  setData={setData}
                  defaultSearchKey={defaultSearchKey}
                  onSelectKeywords={onSelectKeywords}
                  setIsOpenModal={setIsOpenModal}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
