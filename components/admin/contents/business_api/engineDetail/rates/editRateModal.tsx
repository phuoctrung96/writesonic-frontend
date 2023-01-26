import { Dialog, Transition } from "@headlessui/react";
import { PencilAltIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateRate, XRate } from "../../../../../../api/admin/rate";
import { setToastify, ToastStatus } from "../../../../../../store/main/actions";
import SmRedButton from "../../../../../buttons/smRedButton";
import SmWhiteButton from "../../../../../buttons/smWhiteButton";
import TextInput from "../../../../../textInput";

const EditRateModal: React.FC<{
  selectedRate: XRate;
  onUpdated: (rate: XRate) => void;
  isOpenModal: boolean;
  openModal: any;
}> = ({ selectedRate, onUpdated, isOpenModal, openModal }) => {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setAmount(selectedRate.amount.toString());
  }, [selectedRate]);

  const handleSubmit = async () => {
    let validate = true;
    if (!amount) {
      validate = false;
      setAmountError("Please insert an amount");
    }
    const value = parseFloat(amount);
    if (!value) {
      validate = false;
      setAmountError("Please insert a number");
    } else if (value < 0 || value > 1) {
      validate = false;
      setAmountError("Please insert a number between 0 and 1");
    }
    if (!validate) {
      return;
    }

    try {
      setIsUpdating(true);
      const rate = await updateRate({
        id: selectedRate.id,
        amount: value,
      });
      onUpdated(rate);
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Rate is updated",
        })
      );
      if (mounted.current) {
        setIsUpdating(false);
        openModal(false);
      }
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: errorDetail ?? "Updating is failed",
        })
      );
      if (mounted.current) {
        setIsUpdating(false);
      }
    }
  };

  const handleCancel = () => {
    if (isUpdating) {
      dispatch(
        setToastify({
          status: ToastStatus.warning,
          message: "Updating is canceled",
        })
      );
    }
    openModal(false);
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
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <PencilAltIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <Dialog.Title
                  as="h3"
                  className="ml-5 text-lg leading-6 font-medium text-gray-900"
                >
                  Update Rate
                </Dialog.Title>
              </div>
              <div className="mt-6">
                <div>
                  <TextInput
                    type="number"
                    value={amount}
                    step={0.001}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    error={amountError}
                    max={1}
                    min={0}
                  />
                  <div className="w-full sm:ml-auto sm:w-1/2 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <SmRedButton
                      className="w-full sm:ml-3"
                      onClick={handleSubmit}
                      disabled={isUpdating}
                    >
                      Update
                    </SmRedButton>
                    <SmWhiteButton
                      className="w-full mt-3 sm:mt-0"
                      onClick={handleCancel}
                    >
                      {t("common:Cancel")}
                    </SmWhiteButton>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditRateModal;
