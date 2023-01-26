import { Switch } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Customer,
  setBannedUser as setBannedUserAxios,
  setEmailVerified as setEmailVerifiedAxios,
  setGreyUser as setGreyUserAxios,
  setPhoneVerified as setPhoneVerifiedAxios,
  updateEmail,
  updateName,
  updatePassword,
} from "../../../../../api/admin/user";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import { validateEmail } from "../../../../../utils/validate";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import TextInput from "../../../../textInput";
import ConfirmUpdateInfoModal from "../../conformUpdateInfoModal";

const MyProfile: React.FC<{
  info: Customer;
  onChange: Function;
  myId: string;
}> = ({ info, onChange, myId }) => {
  const mounted = useRef(false);
  const [firstName, setFirstName] = useState(info.firstName);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState(info.lastName);
  const [lastNameError, setLastNameError] = useState(false);
  const [email, setEmail] = useState(info.email);
  const [emailError, setEmailError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);

  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isOpenNameModal, setIsOpenNameModal] = useState<boolean>(false);
  const [isOpenEmailModal, setIsOpenEmailModal] = useState<boolean>(false);
  const [isOpenPasswordModal, setIsOpenPasswordModal] =
    useState<boolean>(false);

  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [isGreyUser, setIsGreyUser] = useState<boolean>(false);
  const [isBannedUser, setIsBannedUser] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  const setPhoneVerified = async (checked) => {
    setIsPhoneVerified(checked);
    try {
      const res = await setPhoneVerifiedAxios(info.id, checked);
      onChange(res);
    } catch (err) {
    } finally {
    }
  };

  const setEmilVerified = async (checked) => {
    setIsEmailVerified(checked);
    try {
      const res = await setEmailVerifiedAxios(info.id, checked);
      onChange(res);
    } catch (err) {
    } finally {
    }
  };

  const setGreyUser = async (checked) => {
    setIsGreyUser(checked);
    try {
      const res = await setGreyUserAxios(info.id, checked);
      onChange(res);
    } catch (err) {
    } finally {
    }
  };

  const setBannedUser = async (checked) => {
    setIsBannedUser(checked);
    try {
      const res = await setBannedUserAxios(info.id, checked);
      onChange(res);
    } catch (err) {
    } finally {
    }
  };

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsPhoneVerified(info?.phone_verified);
    setIsEmailVerified(info?.email_verified);
    setIsGreyUser(info?.is_grey_user);
    setIsBannedUser(info?.is_banned_user);
  }, [
    info?.email_verified,
    info?.is_banned_user,
    info?.is_grey_user,
    info?.phone_verified,
  ]);

  useEffect(() => {
    setFirstNameError(false);
  }, [firstName]);

  useEffect(() => {
    setLastNameError(false);
  }, [lastName]);

  useEffect(() => {
    setEmailError(false);
    setEmailFormatError(false);
  }, [email]);

  useEffect(() => {
    setPasswordError(false);
    setPasswordLengthError(false);
  }, [password]);

  const onUpdateName = () => {
    let validate = true;
    if (!firstName) {
      setFirstNameError(true);
      validate = false;
    }
    if (!lastName) {
      setLastNameError(true);
      validate = false;
    }

    if (!validate) {
      return;
    }
    setIsUpdatingName(true);
    updateName({
      id: info.id,
      first_name: firstName,
      last_name: lastName,
    })
      .then((data) => {
        onChange(data);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Updated the user's information",
          })
        );
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setIsUpdatingName(false);
        }
      });
  };

  const onUpdateEmail = () => {
    let validate = true;

    if (!email) {
      setEmailError(true);
      validate = false;
    } else if (!validateEmail(email)) {
      setEmailFormatError(true);
      validate = false;
    }

    if (!validate) {
      return;
    }
    setIsUpdatingEmail(true);
    updateEmail({
      id: info.id,
      email,
    })
      .then((data) => {
        onChange(data);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Updated the user's information",
          })
        );
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setIsUpdatingEmail(false);
        }
      });
  };

  const onUpdatePassword = () => {
    let validate = true;

    if (password && password.length < 6) {
      setPasswordLengthError(true);
      validate = false;
    }
    if (!validate) {
      return;
    }
    setIsUpdatingPassword(true);
    updatePassword({
      id: info.id,
      password,
    })
      .then((data) => {
        onChange(data);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Updated the user's information",
          })
        );
      })
      .catch((err) => {
        dispatch(
          setToastify({
            status: ToastStatus.failed,
            message: getErrorMessage(err),
          })
        );
      })
      .finally(() => {
        if (mounted.current) {
          setIsUpdatingPassword(false);
        }
      });
  };

  return (
    <Block
      title="Personal Information"
      message="Update the user's first, last name, email and password."
    >
      <div className="mt-6 flex justify-start items-center">
        <p className="block text-sm font-medium text-gray-700">ID:</p>
        <p className="ml-2 text-gray-600 text-xs font-normal">{info.id}</p>
      </div>
      <div className="mt-6 flex justify-start items-center">
        <p className="block text-sm font-medium text-gray-700">
          Is in the Firebase:
        </p>
        <p className="ml-2 text-gray-800 text-md font-bold">
          {info.is_in_fb ? "Yes" : "No"}
        </p>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <p className="block text-sm font-medium text-gray-700">
          Is Email Verified:
        </p>
        <Switch
          checked={isEmailVerified}
          onChange={setEmilVerified}
          disabled={
            !!info?.providers?.find((provider) => provider === "google.com")
          }
          className={classNames(
            !!info?.providers?.find((provider) => provider === "google.com")
              ? "opacity-30"
              : "",
            isEmailVerified ? "bg-indigo-600" : "bg-gray-200",
            "h-auto relative inline-flex flex-shrink-0 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={classNames(
              isEmailVerified ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            )}
          />
        </Switch>
      </div>
      <div className="mt-6 flex justify-start items-center">
        <p className="block text-sm font-medium text-gray-700">Phone Number:</p>
        <p className="ml-2 text-gray-800 text-md font-bold">
          {info.phone_number}
        </p>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <p className="block text-sm font-medium text-gray-700">
          Is Phone Verified:
        </p>
        <Switch
          checked={isPhoneVerified}
          onChange={setPhoneVerified}
          className={classNames(
            isPhoneVerified ? "bg-indigo-600" : "bg-gray-200",
            "h-auto relative inline-flex flex-shrink-0 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={classNames(
              isPhoneVerified ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            )}
          />
        </Switch>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <p className="block text-sm font-medium text-gray-700">Is Grey User:</p>
        <Switch
          checked={isGreyUser}
          onChange={setGreyUser}
          className={classNames(
            isGreyUser ? "bg-indigo-600" : "bg-gray-200",
            "h-auto relative inline-flex flex-shrink-0 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={classNames(
              isGreyUser ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            )}
          />
        </Switch>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <p className="block text-sm font-medium text-gray-700">
          Is Banned User:
        </p>
        <Switch
          checked={isBannedUser}
          onChange={setBannedUser}
          className={classNames(
            isBannedUser ? "bg-indigo-600" : "bg-gray-200",
            "h-auto relative inline-flex flex-shrink-0 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={classNames(
              isBannedUser ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            )}
          />
        </Switch>
      </div>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mt-6">
        <div className="sm:col-span-3">
          <TextInput
            htmlFor="first_name"
            label="First name"
            type="text"
            name="first_name"
            id="first_name"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            error={firstNameError ? "Please enter the first name" : ""}
          />
        </div>
        <div className="sm:col-span-3">
          <TextInput
            htmlFor="last_name"
            label="Last name"
            type="text"
            name="last_name"
            id="last_name"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            error={lastNameError ? "Please enter the last name" : ""}
          />
        </div>
      </div>
      <div className="sm:col-span-6 mt-6">
        <SmPinkButton
          className="ml-auto w-full sm:w-1/2 py-2.5"
          onClick={() => {
            setIsOpenNameModal(true);
          }}
          disabled={isUpdatingName}
        >
          Update Name
        </SmPinkButton>
      </div>
      <div className="mt-5">
        <TextInput
          htmlFor="email"
          label="Email address"
          type="text"
          name="email"
          id="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          error={
            emailError
              ? "Please enter the email"
              : emailFormatError
              ? "The email field must be a valid email"
              : ""
          }
        />
        <div className="mt-3">
          {info?.providers?.map((provider) => {
            if (provider === "google.com") {
              return (
                <div
                  className="text-sm font-medium text-gray-700 flex items-center"
                  key={provider}
                >
                  <span>Signed up using:</span>
                  {provider === "google.com" ? (
                    <div className="ml-1.5">
                      <span className="sr-only">Sign in with Google</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#4285F4"
                          d="M-3.264 51.509c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                          transform="translate(27.009 -39.239)"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M-14.754 63.239c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                          transform="translate(27.009 -39.239)"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M-21.484 53.529c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
                          transform="translate(27.009 -39.239)"
                        ></path>
                        <path
                          fill="#EA4335"
                          d="M-14.754 43.989c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                          transform="translate(27.009 -39.239)"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <div className="ml-1.5">
                      <span className="sr-only">Sign in with Facebook</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        version="1.1"
                        viewBox="0 0 127 127"
                      >
                        <defs>
                          <clipPath
                            id="clipPath18"
                            clipPathUnits="userSpaceOnUse"
                          >
                            <path d="M180 360C80.589 360 0 279.411 0 180S80.589 0 180 0s180 80.589 180 180-80.589 180-180 180z"></path>
                          </clipPath>
                          <linearGradient
                            id="linearGradient28"
                            x1="0"
                            x2="1"
                            y1="0"
                            y2="0"
                            gradientTransform="matrix(0 -360 -360 0 180 360)"
                            gradientUnits="userSpaceOnUse"
                            spreadMethod="pad"
                          >
                            <stop
                              offset="0"
                              stopColor="#18adff"
                              stopOpacity="1"
                            ></stop>
                            <stop
                              offset="1"
                              stopColor="#0164de"
                              stopOpacity="1"
                            ></stop>
                          </linearGradient>
                          <clipPath
                            id="clipPath38"
                            clipPathUnits="userSpaceOnUse"
                          >
                            <path d="M0 360h360V0H0z"></path>
                          </clipPath>
                        </defs>
                        <g transform="translate(-24.818 -48.876) matrix(.35278 0 0 -.35278 24.818 175.876)">
                          <g>
                            <g clipPath="url(#clipPath18)">
                              <g>
                                <g>
                                  <path
                                    fill="url(#linearGradient28)"
                                    stroke="none"
                                    d="M180 360C80.589 360 0 279.411 0 180S80.589 0 180 0s180 80.589 180 180-80.589 180-180 180z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </g>
                          <g>
                            <g clipPath="url(#clipPath38)">
                              <g transform="translate(250.066 127.957)">
                                <path
                                  fill="#fefefe"
                                  fillOpacity="1"
                                  fillRule="nonzero"
                                  stroke="none"
                                  d="M0 0l7.974 52.043h-49.917v33.768c0 14.226 6.961 28.122 29.337 28.122H10.1v44.298s-20.605 3.519-40.298 3.519c-41.109 0-67.991-24.909-67.991-70.042V52.043h-45.715V0h45.715v-125.78a180.698 180.698 0 0128.123-2.177c9.568 0 18.959.76 28.123 2.177V0z"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="sm:col-span-6 mt-6">
        <SmPinkButton
          className="ml-auto w-full sm:w-1/2 py-2.5"
          onClick={() => {
            setIsOpenEmailModal(true);
          }}
          disabled={isUpdatingEmail}
        >
          Update Email
        </SmPinkButton>
      </div>
      <div className="mt-5">
        <TextInput
          htmlFor="password"
          label="Password"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          error={
            passwordError
              ? "You must enter a password"
              : passwordLengthError
              ? "Use at least 6 characters"
              : ""
          }
        />
      </div>
      <div className="sm:col-span-6 mt-6">
        <SmPinkButton
          className="ml-auto w-full sm:w-1/2 py-2.5"
          onClick={() => {
            setIsOpenPasswordModal(true);
          }}
          disabled={isUpdatingPassword}
        >
          Update Password
        </SmPinkButton>
      </div>
      <ConfirmUpdateInfoModal
        title="Update Full Name"
        message="Are you sure you want to update this user's name?"
        isOpenModal={isOpenNameModal}
        openModal={setIsOpenNameModal}
        handleOkay={onUpdateName}
      />
      <ConfirmUpdateInfoModal
        title="Update Email"
        message="Are you sure you want to update this user's email?"
        isOpenModal={isOpenEmailModal}
        openModal={setIsOpenEmailModal}
        handleOkay={onUpdateEmail}
      />
      <ConfirmUpdateInfoModal
        title="Update Password"
        message="Are you sure you want to update this user's password?"
        isOpenModal={isOpenPasswordModal}
        openModal={setIsOpenPasswordModal}
        handleOkay={onUpdatePassword}
      />
    </Block>
  );
};

const mapStateToPros = (state) => {
  return {
    myId: state?.user?.id,
  };
};

export default connect(mapStateToPros)(MyProfile);
