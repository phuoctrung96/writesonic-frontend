import { Transition } from "@headlessui/react";
import classNames from "classnames";
import { connect } from "react-redux";
import SelectVariation from "./selectVariation";

interface VariationPanelProps {
  isShow: boolean;
  className?: string;
}

const VariationPanel: React.FC<VariationPanelProps> = ({
  isShow,
  className,
}) => {
  return (
    <Transition
      show={isShow}
      enter="transform transition ease-in-out duration-500 sm:duration-800"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transform transition ease-in-out duration-500 sm:duration-800"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
      className={classNames("px-4 pt-10 pb-4", className ?? "")}
    >
      <p className="text-gray-800 font-bold">Variations</p>
      <div className="mt-6">
        <SelectVariation />
      </div>
    </Transition>
  );
};

const mapStateToPros = (state) => {
  return {
    isShow: state.writingAssistant?.isShowVariationPanel,
  };
};

export default connect(mapStateToPros)(VariationPanel);
