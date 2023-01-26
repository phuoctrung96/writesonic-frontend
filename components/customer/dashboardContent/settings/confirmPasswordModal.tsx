import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { sendVerificationEmail } from "../../../../api/pendingUser";
import { setToastify, ToastStatus } from "../../../../store/main/actions";
import getErrorMessage from "../../../../utils/getErrorMessage";
import { segmentTrack } from "../../../../utils/segment";
import SmPinkButton from "../../../buttons/smPinkButton";
import SmWhiteButton from "../../../buttons/smWhiteButton";
import TextInput from "../../../textInput";
import AlertError from "../../alerts/alertError";

interface ConfirmPasswordModalProps {
  email: string;
  isOpenModal: boolean;
  openModal: any;
  currentEmail: string;
  userId: string;
  firstName: string;
  lastName: string;
}

const ConfirmPasswordModal: React.FC<ConfirmPasswordModalProps> = ({
  email,
  isOpenModal,
  openModal,
  currentEmail,
  userId,
  firstName,
  lastName,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale } = router;

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [password]);

  const onSubmit = () => {
    if (!password) {
      setError("Please enter your password.");
      return;
    } else {
      setError("");
    }

    setLoading(true);

    sendVerificationEmail({
      email: currentEmail,
      newEmail: email,
      password,
      locale,
    })
      .then((res) => {
        setPassword("");
        openModal(false);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message:
              "Please check your inbox — you should have received an email with a confirmation link.",
          })
        );
        // track by segment
        segmentTrack("Email Changed", {
          userId,
          email: currentEmail,
          firstName,
          lastName,
        });
        // track end
      })
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: "Email is already in use",
            })
          );
        } else if (err.code === "auth/wrong-password") {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: "Wrong Password",
            })
          );
        } else if (err.code === "auth/too-many-requests") {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: "Too many requests",
            })
          );
        } else {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message:
                getErrorMessage(err) ??
                "Sorry, We cannot update your email because some reason. Please contact the support team.",
            })
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
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
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4"></div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Update Profile
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please enter your password
                    </p>
                  </div>
                  <div className="mt-6">
                    <TextInput
                      label={
                        <div className="flex items-center">
                          Password
                          <span className="text-red-600"> *</span>
                        </div>
                      }
                      type="password"
                      autoComplete="false"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>

                  <div className="mt-10">
                    <AlertError message={error} />
                    <div className="w-full sm:ml-auto sm:w-1/2 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <SmPinkButton
                        className="w-full sm:ml-3"
                        onClick={onSubmit}
                        disabled={isLoading}
                      >
                        <div className="flex items-center">Submit</div>
                      </SmPinkButton>
                      <SmWhiteButton
                        className="w-full mt-3 sm:mt-0"
                        onClick={() => {
                          openModal(false);
                        }}
                      >
                        <div className="flex items-center">Cancel</div>
                      </SmWhiteButton>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    userId: state.user?.id,
    currentEmail: state.user?.email,
    firstName: state.user?.firstName,
    lastName: state.user?.lastName,
  };
};

export default connect(mapStateToPros)(ConfirmPasswordModal);
