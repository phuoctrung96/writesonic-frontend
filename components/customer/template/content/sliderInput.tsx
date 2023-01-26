import { InformationCircleIcon } from "@heroicons/react/outline";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";
import React, { ReactNode } from "react";
import ToolTip from "../../../tooltip/muiToolTip";

const SonicSlider = withStyles({
  root: {
    color: "rgba(93, 97, 154)",
    height: 8,
  },
  thumb: {
    height: 15,
    width: 15,
    backgroundColor: "rgba(93, 97, 154)",
    border: "2px solid currentColor",
    marginTop: -5,
    marginLeft: -8,
    "&:focus": {
      boxShadow: "none",
    },
    "&:hover": {
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 6,
    borderRadius: 3,
  },
  rail: {
    height: 6,
    borderRadius: 3,
  },
  mark: {
    height: 0,
    width: 0,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor",
  },
})(Slider);

const SliderInput: React.FC<{
  label?: ReactNode;
  tooltip?: string;
  max?: number;
  min?: number;
  value?: number | number[];
  valueInString?: string;
  step?: number;
  onChange?: (event: React.ChangeEvent<{}>, value: number | number[]) => void;
}> = ({ label, tooltip, max, min, value, onChange, step, valueInString }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        {!!label && (
          <div className="flex flex-wrap text-base items-center relative">
            <label className="block text-base font-medium text-gray-700">
              {label}
            </label>
            {tooltip && (
              <ToolTip message={tooltip} position="top">
                <InformationCircleIcon className="ml-1 w-4 h-4 text-gray-500" />
              </ToolTip>
            )}
          </div>
        )}
        {!valueInString ? (
          <p className="text-base">{value ?? 0}</p>
        ) : (
          <p className="text-base">{valueInString ?? 0}</p>
        )}
      </div>
      <SonicSlider
        value={value}
        onChange={onChange}
        aria-labelledby="continuous-slider"
        max={max}
        min={min}
        step={step}
      />
    </div>
  );
};

export default SliderInput;
