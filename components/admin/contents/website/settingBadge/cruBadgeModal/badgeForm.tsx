import useTranslation from "next-translate/useTranslation";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { useDispatch } from "react-redux";
import {
  BadgeData,
  createBadge,
  updateBadge,
} from "../../../../../../api/admin/badge";
import { setToastify, ToastStatus } from "../../../../../../store/main/actions";
import getErrorMessage from "../../../../../../utils/getErrorMessage";
import SmPinkButton from "../../../../../buttons/smPinkButton";
import SmWhiteButton from "../../../../../buttons/smWhiteButton";
import Ribbon from "../../../../../ribbon";

const BadgeForm: React.FC<{
  initData: BadgeData;
  onChange: (data: BadgeData) => void;
  closeModal: Function;
}> = ({ initData, onChange, closeModal }) => {
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [name, setName] = useState<string>(initData?.name ?? "");
  const [nameError, setNameError] = useState<string>("");
  const [textColor, setTextColor] = useState(initData?.text_color ?? "#fff");
  const [backgroundColor, setBackgroundColor] = useState(
    initData?.background_color ?? "#000"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    setNameError("");
    if (!name) {
      setNameError("Please insert the name");
      return;
    }
    try {
      setIsLoading(true);
      const axiosFunction = initData ? updateBadge : createBadge;
      const data = {
        name,
        text_color: textColor,
        background_color: backgroundColor,
      };
      if (initData?.id) {
        data["id"] = initData?.id;
      }
      const newBadge = await axiosFunction(data);
      onChange(newBadge);
      closeModal();
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

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div>
      <div>
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          error={nameError}
        />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-10">
        <div>
          <label className="block text-base font-medium text-gray-700">
            Text Color:
          </label>
          <div className="mt-5">
            <ChromePicker
              color={textColor}
              onChange={(ev) => {
                setTextColor(ev.hex);
              }}
            />
          </div>
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700">
            Background Color:
          </label>
          <div className="mt-5">
            <ChromePicker
              color={backgroundColor}
              onChange={(ev) => {
                setBackgroundColor(ev.hex);
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-full sm:ml-auto sm:w-1/2 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <SmPinkButton
          className="w-full sm:ml-3"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {initData ? "Update" : "Create"}
        </SmPinkButton>
        <SmWhiteButton className="w-full mt-3 sm:mt-0" onClick={handleCancel}>
          Cancel
        </SmWhiteButton>
      </div>

      <div className="absolute right-0 top-5">
        {!!name && (
          <Ribbon color={textColor} backgroundColor={backgroundColor}>
            {name}
          </Ribbon>
        )}
      </div>
    </div>
  );
};

function TextInput({
  value,
  onChange,
  error,
  label,
  placeholder,
}: {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <>
      <label className="block text-base font-medium text-gray-700">
        {label}
      </label>
      <input
        value={value}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent text-base"
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && (
        <h3 className="text-base font-medium text-red-600 mt-1">{error}</h3>
      )}
    </>
  );
}

export default BadgeForm;
