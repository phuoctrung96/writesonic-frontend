import {
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CountTextInput from "./countTextInput";
import {
  ContentFormData,
  FormDataInput,
} from "./customer/template/content/contentInputs";
import ToolTip from "./tooltip/muiToolTip";

const DynamicTextInputList: React.FC<{
  input: FormDataInput;
  formData: ContentFormData;
  onChange?: Function;
  disabled?: boolean;
}> = ({ input, formData, onChange, disabled }) => {
  const {
    name,
    inputType,
    rows,
    label,
    maxLength,
    tooltip,
    placeholder,
    required,
    value,
    error,
    dynamic,
  } = input;
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    setIsDisabled(
      (formData?.button?.hideWhenHistory &&
        (!!router.query?.historyId || !!router.query?.copyId)) ||
        disabled
    );
  }, [
    disabled,
    formData?.button?.hideWhenHistory,
    router.query?.copyId,
    router.query?.historyId,
  ]);

  const { prefix, labelPreFix, maxCount, minCount } = dynamic;
  const values: string[] = value
    ? value?.replaceAll(/\n/g, "")?.replace(prefix, "")?.split(prefix)
    : Array(minCount).fill("");

  const handleChange = ({
    value: newValue,
    index: targetIndex,
  }: {
    value: string;
    index: number;
  }) => {
    let newValues = "";
    values.forEach((value, index) => {
      newValues += prefix + (targetIndex == index ? newValue : value) + "\n";
    });
    onChange(newValues);
  };

  const handleDelete = (index: number) => {
    let newValues = "";
    values
      .filter((item, idx) => index !== idx)
      .forEach((value) => {
        newValues += prefix + value + "\n";
      });
    onChange(newValues);
  };

  const handleAdd = () => {
    let newValues = "";
    [...values, ""].forEach((value, index) => {
      newValues += prefix + value + "\n";
    });
    onChange(newValues);
  };
  return (
    <div>
      <div className="flex flex-wrap mb-1 text-base items-center">
        <label className="block text-base font-medium text-gray-700">
          {label}
        </label>
        {tooltip && (
          <ToolTip message={tooltip} position="top">
            <InformationCircleIcon className="ml-1 w-4 h-4 text-gray-500" />
          </ToolTip>
        )}
        {required && <span className="ml-1 text-red-500">*</span>}
      </div>
      {values?.map((value, index) => (
        <div key={index}>
          <div
            className={classNames(
              "w-full flex items-center",
              index > 0 ? "mt-4" : ""
            )}
          >
            <div className="w-full">
              <CountTextInput
                maxLength={maxLength}
                value={value}
                leftLabel={`${labelPreFix} ${index + 1}`}
                onChange={(newValue) =>
                  handleChange({ value: newValue, index })
                }
                error={error}
                disabled={isDisabled}
              />
            </div>
            {values.length > minCount && (
              <TrashIcon
                className={classNames(
                  "w-5 h-5 mt-3 ml-2 text-gray-500 hover:text-gray-700 cursor-pointer",
                  isDisabled ? "invisible" : ""
                )}
                onClick={() => {
                  handleDelete(index);
                }}
              />
            )}
          </div>
        </div>
      ))}
      {values.length < maxCount && (
        <PlusIcon
          className={classNames(
            "w-5 h-5 ml-auto mt-4 text-gray-500 hover:text-gray-700 cursor-pointer",
            isDisabled ? "invisible" : ""
          )}
          onClick={handleAdd}
        />
      )}
    </div>
  );
};

export default DynamicTextInputList;
