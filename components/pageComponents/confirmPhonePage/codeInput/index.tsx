import classNames from "classnames";
import { useEffect, useState } from "react";
import useDigitInput from "react-digit-input";
import styles from "./index.module.scss";

const CodeInput: React.FC<{ onSubmit: Function }> = ({ onSubmit }) => {
  const [value, onChange] = useState("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 6,
    value,
    onChange,
  });

  useEffect(() => {
    const id = setTimeout(() => {
      const code = value?.trim();
      if (code.length === 6) {
        onSubmit(code);
      }
    }, 500);
    return () => {
      clearTimeout(id);
    };
  }, [onSubmit, value]);

  return (
    <>
      <div className="grid grid-cols-19 gap-3 place-content-center place-items-center">
        {Array(7)
          ?.fill(null)
          ?.map((val: any, index) => {
            if (index === 3) {
              return (
                <span
                  key={index}
                  className="col-span-1 w-full h-0.5 bg-gray-500 rounded-full"
                />
              );
            }

            return (
              <>
                <input
                  key={index}
                  autoFocus={index === 0}
                  type="text"
                  className={classNames(
                    styles["code-input"],
                    "col-span-3 appearance-none block w-full px-2 py-2 border border-gray-200 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent text-3xl text-center text-gray-700"
                  )}
                  inputMode="decimal"
                  {...digits[index < 3 ? index : index - 1]}
                />
              </>
            );
          })}
      </div>
      {/* <div>
    <SmPinkButton
        className="w-full mt-8"
        onClick={() => {
          const code = value?.trim();
          onSubmit(code)
        }}
        disabled={disabled}
        hideLoading={disabled}
      >Submit
      </SmPinkButton>
    </div> */}
    </>
  );
};

export default CodeInput;
