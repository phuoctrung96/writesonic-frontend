import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import logo_white from "../../../public/images/logo_white.png";
import AuthHeader from "./authHeader";
import AuthIntro from "./authIntro";
import AuthText from "./parts/authText";

export enum AuthType {
  Login,
  SignUp,
  ChromeLogin,
  ChromeSignUp,
  ForgotPassword,
  ResetPassword,
  ConfirmEmail,
  VerifyPhone,
  ConfirmPhone,
}

const headers = {
  Login: {
    title: "Welcome Back",
    message: "Have we met before?",
  },
  SignUp: {
    title: "Start for Free Today",
    message: "Access to all features. No credit card required.",
  },
  ChromeLogin: {
    title: "Welcome back. Login to use Chrome Extension",
    message: "Login for access to all features. No credit card required.",
  },
  ChromeSignUp: {
    title: "Chrome Extension - Start for Free Today",
    message: "Signup for access to all features. No credit card required.",
  },
  ForgotPassword: {
    title: "Reset Your Password",
    message: "We'll send you an email to reset your password.",
  },
  ResetPassword: {
    title: "Reset Your Password",
    message: "We sent you an email to reset your password.",
  },
  ConfirmEmail: {
    title: "Confirm your account",
    message:
      "Please check your inbox — you should have received an email with a confirmation link.",
  },
  VerifyPhone: {
    title: "Verify your phone number",
    message: "Please input your phone number — you will get a code.",
  },
  ConfirmPhone: {
    title: "Confirm your phone number",
    message:
      "Please check your phone — you should have received a 6-digit code.",
  },
};

const Auth: React.FC<{
  type?: AuthType;
  initTitle?: string;
  initMessage?: string;
  children: ReactNode;
  isHasError?: boolean;
}> = ({ type, initTitle, initMessage, children, isHasError }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    switch (type) {
      case AuthType.Login:
        setTitle(initTitle ?? headers.Login.title);
        setMessage(initMessage ?? headers.Login.message);
        break;
      case AuthType.SignUp:
        setTitle(initTitle ?? headers.SignUp.title);
        setMessage(initMessage ?? headers.SignUp.message);
        break;
      case AuthType.ChromeLogin:
        setTitle(initTitle ?? headers.ChromeLogin.title);
        setMessage(initMessage ?? headers.ChromeLogin.message);
        break;
      case AuthType.ChromeSignUp:
        setTitle(initTitle ?? headers.ChromeSignUp.title);
        setMessage(initMessage ?? headers.ChromeSignUp.message);
        break;
      case AuthType.ForgotPassword:
        setTitle(initTitle ?? headers.ForgotPassword.title);
        setMessage(initMessage ?? headers.ForgotPassword.message);
        break;
      case AuthType.ResetPassword:
        setTitle(initTitle ?? headers.ResetPassword.title);
        setMessage(initMessage ?? headers.ResetPassword.message);
        break;
      case AuthType.ConfirmEmail:
        setTitle(initTitle ?? headers.ConfirmEmail.title);
        setMessage(initMessage ?? headers.ConfirmEmail.message);
        break;
      case AuthType.VerifyPhone:
        setTitle(initTitle ?? headers.VerifyPhone.title);
        setMessage(initMessage ?? headers.VerifyPhone.message);
        break;
      case AuthType.ConfirmPhone:
        setTitle(initTitle ?? headers.ConfirmPhone.title);
        setMessage(initMessage ?? headers.ConfirmPhone.message);
        break;
    }
  }, [initMessage, initTitle, type]);

  return (
    <div className="flex-1 flex flex-col lg:grid grid-cols-10 xl:grid-cols-11 2xl:grid-cols-12 bg-gray-50 overflow-auto">
      <aside className="col-span-4 xl:col-span-3 2xl:col-span-3 flex flex-col hidden relative lg:flex lg:flex-col flex-shrink-0 pl-6 py-6">
        {/* Start Introduction column */}
        <AuthIntro />
        {/* End Introduction column */}
      </aside>
      <main className="flex-1 col-span-6 xl:col-span-8 2xl:col-span-9 flex flex-col p-0 lg:p-6 relative bg-auth lg:bg-none bg-no-repeat">
        {/* Start main area*/}
        <div className="flex-1 flex justify-center items-start lg:items-center">
          <div className="lg:bg-white py-8 rounded-md lg:px-8 lg:shadow sm:rounded-2xl sm:px-16 w-auth-form sm:w-auth-form-sm">
            <div className="text-center lg:text-left mb-10 lg:mb-0">
              <div className="lg:hidden">
                <Image src={logo_white} alt="logo" width={139.5} height={36} />
              </div>
              <AuthHeader className="mt-8 lg:mt-0">{title}</AuthHeader>
              <AuthText>{message}</AuthText>
            </div>
            <div className="mx-6 sm:mx-0 pt-6 pb-6 lg:pb-0 px-6 lg:px-0 bg-white rounded-2xl">
              {children}
            </div>
          </div>
        </div>
        {/* End main area */}
      </main>
    </div>
  );
};

export default Auth;
