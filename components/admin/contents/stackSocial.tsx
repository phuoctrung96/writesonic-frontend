import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateStackSocial } from "../../../api/admin/user";
import { setToastify, ToastStatus } from "../../../store/main/actions";
import getErrorMessage from "../../../utils/getErrorMessage";
import { validateEmail } from "../../../utils/validate";
import Block from "../../block";
import SmPinkButton from "../../buttons/smPinkButton";
import TextInput from "../../textInput";

const StackSocial: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleUpdate = async () => {
    setEmailError("");
    setCodeError("");
    let validate = true;
    if (!email) {
      setEmailError("Please enter the email");
      validate = false;
    } else if (!validateEmail(email)) {
      setEmailError("The email field must be a valid email");
      validate = false;
    }
    if (!code) {
      setCodeError("Please enter the code");
      validate = false;
    }
    if (!validate) {
      return;
    }
    try {
      setIsLoading(true);
      await updateStackSocial({ email, code });
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Successfully, updated",
        })
      );
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <Block title="Redeem StackSocial Code" className="max-w-2xl">
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
          error={emailError}
        />
      </div>
      <div className="mt-5">
        <TextInput
          htmlFor="code"
          label="StackSocial Code"
          type="text"
          name="code"
          id="code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
          error={codeError}
        />
      </div>
      <div className="mt-5 w-full">
        <SmPinkButton
          onClick={handleUpdate}
          className="ml-auto w-full sm:w-1/3"
          disabled={isLoading}
        >
          Submit
        </SmPinkButton>
      </div>
    </Block>
  );
};

export default StackSocial;
