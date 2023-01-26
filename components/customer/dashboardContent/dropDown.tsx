import { Transition } from "@headlessui/react";
import Select, { components } from "react-select";

const Input = (props) => {
  const { autoComplete = props.autoComplete } = props.selectProps;
  return (
    <components.Input
      style={{ opacity: "0" }}
      {...props}
      autoComplete={autoComplete}
    />
  );
};

export default function DropDown({
  label,
  autoComplete,
  options,
  value,
  onChange,
  menuPortalTarget,
  disabled,
}: {
  label?: string;
  autoComplete?: string;
  options?: any[];
  value?: any;
  onChange?: any;
  menuPortalTarget?: HTMLElement;
  disabled?: boolean;
}) {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: null,
      borderRadius: 5,
    }),
    menu: (provided, state) => ({
      ...provided,
    }),
  };

  return (
    <>
      <label className="block text-base font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <Select
          className="text-base font-medium text-gray-700 mt-1"
          styles={customStyles}
          options={options ?? []}
          components={{ Input }}
          autoComplete={autoComplete}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: "rgba(252, 231, 243, var(--tw-text-opacity))",
              primary50: "rgba(251, 207, 232, var(--tw-text-opacity))",
              primary: "rgba(244, 114, 182, var(--tw-text-opacity))",
            },
          })}
          onChange={onChange}
          value={value}
          menuPortalTarget={menuPortalTarget}
          menuContainerStyle={{ marginBottom: "10px" }}
          menuPlacement="auto"
        />
        <Transition
          show={!!disabled}
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-20" />
        </Transition>
      </div>
    </>
  );
}
