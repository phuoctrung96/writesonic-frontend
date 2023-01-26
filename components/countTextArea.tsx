import { InformationCircleIcon } from "@heroicons/react/outline";
import TextArea from "./customer/dashboardContent/textArea";
import { ArticleOutlineText } from "./customer/template/content/AiArticleWriterV2";
import ToolTip from "./tooltip/muiToolTip";

export default function CountTextArea({
  value,
  onChange,
  error,
  maxLength,
  rows,
  children,
  disabled,
  label,
  tooltip,
  placeholder,
  required,
  articleOutlineTexts,
}: {
  value?: string;
  onChange?: Function;
  error?: string;
  maxLength?: number;
  rows?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  label?: string | React.ReactNode;
  required?: boolean;
  placeholder?: string;
  tooltip?: string;
  articleOutlineTexts?: ArticleOutlineText[];
}) {
  return (
    <TextArea
      label={
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap text-base items-center relative">
            <label className="block text-base font-medium text-gray-700">
              {label}
            </label>
            {tooltip && (
              <ToolTip message={tooltip} position="top">
                <InformationCircleIcon className="ml-1 w-4 h-4 text-gray-500" />
              </ToolTip>
            )}
            {required && <span className="ml-1 text-red-500">*</span>}
            {children}
          </div>
          {maxLength && (
            <p
              className={`text-xs text-${
                value?.length < maxLength ? "gray-400" : "red-500"
              }`}
            >
              {value ? value.length : 0} / {maxLength}
            </p>
          )}
        </div>
      }
      rows={rows}
      value={value}
      onChange={(value) => {
        if (onChange) {
          onChange(
            value.length > maxLength ? value.substring(0, maxLength) : value
          );
        }
      }}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
      articleOutlineTexts={articleOutlineTexts}
    />
  );
}
