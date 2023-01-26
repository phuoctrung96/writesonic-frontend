import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import SmPinkButton from "../../buttons/smPinkButton";
import XsCloseButton from "../../buttons/xsCloseButton";
import TextInput from "../../textInput";

interface AddImageModalProps {
  isOpenModal: boolean;
  setIsOpenModal: any;
  onAdd: (url: string) => void;
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

const CreateProjectModal: React.FC<AddImageModalProps> = ({
  isOpenModal,
  setIsOpenModal,
  onAdd,
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageUrlError, setImageUrlError] = useState<string>("");

  const handleSubmit = () => {
    let validate = true;
    if (!imageUrl) {
      setImageUrlError("please insert an image url");
      validate = false;
    } else if (!isImage(imageUrl)) {
      setImageUrlError("please add an image url");
      validate = false;
    }
    if (!validate) {
      return;
    }
    onAdd(imageUrl);
    setImageUrl("");
    setImageUrlError("");
    setIsOpenModal(false);
  };

  return (
    <Transition.Root show={isOpenModal} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-20 inset-0 overflow-y-auto"
        open={isOpenModal}
        onClose={() => {}}
      >
        <div className="flex items-cener justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <XsCloseButton onClick={() => setIsOpenModal(false)} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Insert an Image
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please paste your image URL.
                  </p>
                </div>
                <div className="mt-6">
                  <TextInput
                    label="Image URL"
                    type="text"
                    autoComplete="false"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                    }}
                    error={imageUrlError}
                  />
                </div>
                <SmPinkButton className="w-full mt-10" onClick={handleSubmit}>
                  <div className="flex items-center">Insert this image</div>
                </SmPinkButton>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateProjectModal;
