import { MouseEventHandler } from "react";
import SmWhiteButton from "../../../../buttons/smWhiteButton";

export default function SocialButtonGroup({
  onFacebook,
  onGoogle,
  onMicrosoft,
  authType,
  disabled,
}: {
  onFacebook?: MouseEventHandler;
  onGoogle?: MouseEventHandler;
  onMicrosoft?: MouseEventHandler;
  authType: String;
  disabled: boolean;
}) {
  return (
    <div className="grid mt-1">
      <SmWhiteButton onClick={onGoogle} disabled={disabled} hideLoading>
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
          <span className="ml-4 text-base">
            {authType === "login" ? "Sign in" : "Continue"} with Google
          </span>
        </>
      </SmWhiteButton>
      <SmWhiteButton
        onClick={onMicrosoft}
        disabled={disabled}
        className="mt-3"
        hideLoading
      >
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 23 23"
          >
            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          <span className="ml-4 text-base">
            {authType === "login" ? "Sign in" : "Continue"} with Microsoft
          </span>
        </>
      </SmWhiteButton>
      {/* <SocialButton onClick={onFacebook} disabled={disabled}>
        <>
          <span className="sr-only">Sign in with Facebook</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            version="1.1"
            viewBox="0 0 127 127"
          >
            <defs>
              <clipPath id="clipPath18" clipPathUnits="userSpaceOnUse">
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
                <stop offset="0" stopColor="#18adff" stopOpacity="1"></stop>
                <stop offset="1" stopColor="#0164de" stopOpacity="1"></stop>
              </linearGradient>
              <clipPath id="clipPath38" clipPathUnits="userSpaceOnUse">
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
        </>
      </SocialButton> */}
    </div>
  );
}
