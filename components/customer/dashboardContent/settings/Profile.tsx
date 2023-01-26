import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { updateName } from "../../../../api/user";
import { setToastify, ToastStatus } from "../../../../store/main/actions";
import { setName } from "../../../../store/user/actions";
import { segmentTrack } from "../../../../utils/segment";
import { validateEmail } from "../../../../utils/validate";
import Block from "../../../block";
import SmPinkButton from "../../../buttons/smPinkButton";
import TextInput from "../../../textInput";
import ConfirmPasswordModal from "./confirmPasswordModal";

function Profile({
  providers,
  currentFirstName,
  currentLastName,
  currentEmail,
  userId,
}: {
  providers: string[];
  currentFirstName: string;
  currentLastName: string;
  currentEmail: string;
  userId: string;
}) {
  const mounted = useRef(false);
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState(currentFirstName);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState(currentLastName);
  const [lastNameError, setLastNameError] = useState(false);
  const [email, setEmail] = useState(currentEmail);
  const [emailError, setEmailError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);

  const [isOpenModal, openModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [isShowEmailField, showEmailField] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      providers &&
      providers.filter((provider) => provider === "google.com").length === 0
    ) {
      showEmailField(true);
    }
  }, [providers]);

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

  const onUpdateInformation = () => {
    let validate = true;
    if (!firstName) {
      setFirstNameError(true);
      validate = false;
    }
    if (!lastName) {
      setLastNameError(true);
      validate = false;
    }
    if (validate) {
      setLoading(true);
      updateName(firstName, lastName)
        .then((res) => {
          dispatch(setName(res.firstName, res.lastName));
          dispatch(
            setToastify({
              status: ToastStatus.success,
              message: "Your name has been updated successfully.",
            })
          );
          // track by segment
          segmentTrack("Profile Information Changed", {
            userId,
            email: currentEmail,
            oldFirstName: currentFirstName,
            oldLastName: currentLastName,
            newFirstName: firstName,
            newLastName: lastName,
          });
          // track end
        })
        .catch((err) => {})
        .finally(() => {
          if (mounted.current) {
            setLoading(false);
          }
        });
    }
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
    if (validate) {
      openModal(true);
    }
  };

  return (
    <>
      <div>
        <Block
          title={t("settings:personal_information")}
          message={t("settings:update_name")}
        >
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-t border-b border-solid border-gray-0 py-6 mt-6">
            <div className="sm:col-span-3">
              <TextInput
                htmlFor="first_name"
                label={t("settings:first_name")}
                type="text"
                name="first_name"
                id="first_name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                error={firstNameError ? "Please enter your first name" : ""}
              />
            </div>
            <div className="sm:col-span-3">
              <TextInput
                htmlFor="last_name"
                label={t("settings:last_name")}
                type="text"
                name="last_name"
                id="last_name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                error={lastNameError ? "Please enter your last name" : ""}
              />
            </div>
          </div>
          <div className="sm:col-span-6 mt-6 w-full">
            <SmPinkButton
              className="w-1/3 py-2.5"
              onClick={onUpdateInformation}
              disabled={isLoading}
            >
              {t("settings:update_information_btn")}
            </SmPinkButton>
          </div>
        </Block>
      </div>
      <div className="mt-6">
        <Block
          title={t("settings:email_address")}
          // message={t("settings:update_email")}
        >
          <div
            className={`grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-t ${
              isShowEmailField ? "border-b" : ""
            } border-solid border-gray-0 py-6 mt-6`}
          >
            <div className="sm:col-span-6">
              <TextInput
                htmlFor="email"
                label={t("settings:email")}
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
                    ? "Please enter your email"
                    : emailFormatError
                    ? "The email field must be a valid email"
                    : ""
                }
                disabled={!isShowEmailField}
              />
            </div>
          </div>
          {isShowEmailField && (
            <div className="sm:col-span-6 mt-6">
              <SmPinkButton className="py-2.5" onClick={onUpdateEmail}>
                {t("settings:update_email_btn")}
              </SmPinkButton>
            </div>
          )}
        </Block>
      </div>
      <ConfirmPasswordModal
        email={email}
        isOpenModal={isOpenModal}
        openModal={openModal}
      />
    </>
  );
}

const mapStateToPros = (state) => {
  return {
    providers: state.user?.providers,
    currentFirstName: state.user?.firstName,
    currentLastName: state.user?.lastName,
    currentEmail: state.user?.email,
    userId: state.user?.id,
  };
};

export default connect(mapStateToPros)(Profile);
