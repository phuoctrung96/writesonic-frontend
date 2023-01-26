import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { updatePass } from "../../../../api/user";
import { setToastify, ToastStatus } from "../../../../store/main/actions";
import Block from "../../../block";
import SmPinkButton from "../../../buttons/smPinkButton";
import TextInput from "../../../textInput";

function Password({ currentEmail }: { currentEmail: string }) {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [matchError, setMatchError] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (oldPassword) {
      setOldPasswordError(false);
    }
    if (password) {
      setPasswordError(false);
      setPasswordLengthError(false);
    }
    if (confirmPassword) {
      setConfirmPasswordError(false);
      setMatchError(false);
    }
  }, [oldPassword, password, confirmPassword]);

  const onChange = () => {
    let validate = true;
    if (!oldPassword) {
      setOldPasswordError(true);
      validate = false;
    }
    if (!password) {
      setPasswordError(!password);
      validate = false;
    }
    if (password.length < 6) {
      setPasswordLengthError(password.length < 6);
      validate = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError(!confirmPassword);
      validate = false;
    }
    if (password !== confirmPassword) {
      setMatchError(password !== confirmPassword);
      validate = false;
    }

    if (!validate) {
      return;
    }
    setLoading(true);
    updatePass(
      currentEmail,
      oldPassword,
      password,
      router.query.teamId,
      router.locale
    )
      .then(() => {
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Password was changed",
          })
        );
      })
      .catch((err) => {
        if (err.code === "auth/wrong-password") {
          dispatch(
            setToastify({
              status: ToastStatus.failed,
              message: "Wrong password",
            })
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Block
      title="Password"
      message="Set a password of at least 8 characters with letters and numbers. Your new password must be different from previous used passwords."
    >
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-t border-b border-solid border-gray-0 py-6 mt-6">
        <div className="sm:col-span-6">
          <TextInput
            htmlFor="old_password"
            label="Old Password"
            type="password"
            name="old_password"
            id="old_password"
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            error={oldPasswordError ? "You must enter your password" : ""}
          />
        </div>
        <div className="sm:col-span-6">
          <TextInput
            htmlFor="new_password"
            label="New Password"
            type="password"
            name="new_password"
            id="new_password"
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
        <div className="sm:col-span-6">
          <TextInput
            htmlFor="comfirm_password"
            label="Confirm New Password"
            type="password"
            name="comfirm_password"
            id="comfirm_password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            error={
              confirmPasswordError
                ? "You must enter your password again"
                : matchError
                ? "Passwords don't match"
                : ""
            }
          />
        </div>
      </div>

      <div className="sm:col-span-6 mt-6">
        <SmPinkButton
          className="py-2.5"
          onClick={onChange}
          disabled={isLoading}
        >
          Update Password
        </SmPinkButton>
      </div>
    </Block>
  );
}

const mapStateToPros = (state) => {
  return {
    currentEmail: state.user?.email,
  };
};

export default connect(mapStateToPros)(Password);
