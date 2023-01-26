import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../../../../../api/admin/user";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import getErrorMessage from "../../../../../utils/getErrorMessage";
import { validateEmail } from "../../../../../utils/validate";
import SmPinkButton from "../../../../buttons/smPinkButton";
import TextInput from "../../../../textInput";

const CreateUser: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [fullNameError, setFullNameError] = useState<string>("");
  const [credits, setCredits] = useState<string>("0");
  const [creditsError, setCreditsError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    setEmailError("");
    setFullNameError("");
    setCreditsError("");
    let validate = true;
    if (!email) {
      setEmailError("Please enter the email");
      validate = false;
    } else if (!validateEmail(email)) {
      setEmailError("The email field must be a valid email");
      validate = false;
    }
    if (!fullName) {
      setFullNameError("Please enter the full name");
      validate = false;
    }
    if (!credits || parseInt(credits) < 0) {
      setCreditsError("Please enter valid number of credits");
      validate = false;
    }
    if (!validate) {
      return;
    }
    try {
      setIsLoading(true);
      const data = await createUser({
        full_name: fullName,
        email: email,
        one_time_credits: parseInt(credits),
      });
      setPassword(data.password);
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "User added successfully",
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
    <>
      {password ? (
        <div className="max-w-2xl">
          <div className="text-medium text-lg font-medium text-gray-900">
            User Details
          </div>
          <div className="mt-5">
            <div className="mt-6 flex justify-start items-center">
              <p className="block text-sm font-medium text-gray-700">
                Full Name:
              </p>
              <p className="ml-2 text-gray-800 text-md font-bold">{fullName}</p>
            </div>

            <div className="mt-6 flex justify-start items-center">
              <p className="block text-sm font-medium text-gray-700">Email:</p>
              <p className="ml-2 text-gray-800 text-md font-bold">{email}</p>
            </div>

            <div className="mt-6 flex justify-start items-center">
              <p className="block text-sm font-medium text-gray-700">
                Password:
              </p>
              <p className="ml-2 text-gray-800 text-md font-bold">{password}</p>
            </div>
          </div>

          <div className="mt-5 w-full">
            <SmPinkButton
              onClick={() => {
                setPassword(null);
                setEmail("");
                setCredits("0");
                setFullName("");
              }}
              className="ml-auto w-full sm:w-1/3"
            >
              Clear
            </SmPinkButton>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="text-medium text-lg font-medium text-gray-900">
            Add New User
          </div>
          <div className="mt-5">
            <TextInput
              htmlFor="fullName"
              label="Full Name"
              type="text"
              name="fullName"
              id="fullName"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              error={fullNameError}
            />
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
              error={emailError}
            />
          </div>

          <div className="mt-5">
            <TextInput
              htmlFor="credits"
              label="Initial One Time Credits"
              type="number"
              name="credits"
              id="credits"
              value={credits}
              min={0}
              onChange={(e) => {
                setCredits(e.target.value);
              }}
              error={creditsError}
            />
          </div>

          <div className="mt-5 w-full">
            <SmPinkButton
              onClick={handleSubmit}
              className="ml-auto w-full sm:w-1/3"
              disabled={isLoading}
            >
              Submit
            </SmPinkButton>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUser;
