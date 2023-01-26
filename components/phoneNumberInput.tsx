import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import intlTelInputUtils from "intl-tel-input/build/js/utils";
import { Dispatch, useEffect } from "react";
import { getIpLookup } from "../api/util";
import TextInput from "./textInput";

const PhoneNumberInput: React.FC<{
  onChange: (phoneNumber: string) => void;
  phoneInput: any;
  setPhoneInput: Dispatch<any>;
}> = ({ onChange, phoneInput, setPhoneInput }) => {
  useEffect(() => {
    let phone = null;
    const input = document.querySelector("#phone");
    if (input) {
      phone = intlTelInput(input, {
        utilsScript: intlTelInputUtils,
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: function (success, failure) {
          getIpLookup()
            .then((res) => {
              success(res["data"]["country_code2"]);
            })
            .catch((res) => {
              failure(res);
            });
        },
      });
      setPhoneInput(phone);
    }
    return () => {
      phone.destroy();
    };
  }, [setPhoneInput]);

  useEffect(() => {
    function onChangeCountry() {
      onChange(phoneInput.getNumber());
    }
    const input = document.querySelector("#phone");
    if (input) {
      input.addEventListener("countrychange", onChangeCountry);
    }

    return () => {
      if (input) {
        input.removeEventListener("countrychange", onChangeCountry);
      }
    };
  }, [onChange, phoneInput]);

  return (
    <div>
      <TextInput
        type="tel"
        id="phone"
        name="phone"
        className="w-full"
        onChange={() => {
          onChange(phoneInput.getNumber());
        }}
      />
    </div>
  );
};

export default PhoneNumberInput;
