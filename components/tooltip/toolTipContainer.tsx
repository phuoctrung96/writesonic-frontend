import { Transition } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Position } from ".";
import { ToolTipContentData } from "../../store/tooltip/actions";

const ENTER_DELAY = 75;
const ENTER_DURATION = 300;
const LEAVE_DURATION = 200;

interface PositionData {
  left: string;
  top: string;
}

const ToolTipContainer: React.FC<{ content: ToolTipContentData }> = ({
  content,
}) => {
  const [tempContent, setTempContent] = useState<ToolTipContentData>(null);
  const [position, setPosition] = useState<PositionData>({
    left: "0px",
    top: "0px",
  });
  const refToolTip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeId = null;
    if (content) {
      setPosition({ left: "0px", top: "0px" });
      setTempContent(content);
    } else {
      timeId = setTimeout(() => {
        setTempContent(null);
      }, LEAVE_DURATION);
    }

    return () => {
      clearTimeout(timeId);
    };
  }, [content]);

  useEffect(() => {
    if (!tempContent) {
      return;
    } else {
      const { boundTarget, position } = tempContent;
      const contentWidth = refToolTip.current?.clientWidth ?? 0;
      const contentHeight = refToolTip.current?.clientHeight ?? 0;
      if (!contentWidth || !contentHeight) {
        return;
      }
      let left = boundTarget.left + (boundTarget.width - contentWidth) / 2;
      if (left < 0) {
        left = 5;
      }
      let top =
        position === Position.top
          ? boundTarget.top - contentHeight - 10
          : boundTarget.bottom + 10;

      setPosition({ left: `${left}px`, top: `${top}px` });
    }
  }, [tempContent]);

  const styles = () => {
    const commonStyles =
      "select-none rounded shadow-lg bg-gray-700 text-gray-100 min-w-min max-w-sm ";
    if (
      tempContent?.className.includes("p-") ||
      tempContent?.className.includes("px-") ||
      tempContent?.className.includes("py-")
    ) {
      return commonStyles + tempContent?.className;
    } else {
      return commonStyles + "px-3.5 py-2";
    }
  };

  return (
    <div id="__tooltip" className="absolute z-30" style={position}>
      <Transition
        show={!!content}
        enter={`transition-opacity duration-${ENTER_DURATION} delay-${ENTER_DELAY}`}
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave={`transition-opacity duration-${LEAVE_DURATION}`}
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {typeof tempContent?.message === "string" ? (
          <div
            ref={refToolTip}
            className={styles()}
            dangerouslySetInnerHTML={{
              __html: tempContent?.message,
            }}
          />
        ) : (
          <div ref={refToolTip} className={styles()}>
            {tempContent?.message}
          </div>
        )}
      </Transition>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    content: state.tooltip.content,
  };
};
export default connect(mapStateToProps)(ToolTipContainer);
