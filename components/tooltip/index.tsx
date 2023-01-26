import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch } from "react-redux";
import { setToolTipContent } from "../../store/tooltip/actions";
import {
  hotKeyMaps,
  hotKeyOption,
} from "../customer/template/content/contentInputs";

export enum Position {
  top,
  left,
  bottom,
  right,
}

interface ToolTipProps {
  className?: string;
  toolTipClassName?: string;
  message: ReactNode | string;
  children: ReactNode;
  position?: Position;
  targetElClassName?: string;
}

const ToolTip = forwardRef((props: ToolTipProps, ref: any) => {
  const {
    className,
    message,
    position = Position.bottom,
    children,
    targetElClassName,
    toolTipClassName,
  } = props;
  const refTarget = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const closeTooltip = useCallback(() => {
    dispatch(setToolTipContent(null));
  }, [dispatch]);

  useHotkeys(
    hotKeyMaps,
    () => {
      closeTooltip();
    },
    hotKeyOption
  );
  const changeToolTipContent = useCallback(() => {
    if (!message) {
      return;
    }
    const boundTarget = (
      targetElClassName
        ? refTarget.current.querySelector(`.${targetElClassName}`)
        : refTarget.current
    ).getBoundingClientRect();
    dispatch(
      setToolTipContent({
        message: message,
        boundTarget,
        position,
        className: toolTipClassName ?? "",
      })
    );
  }, [dispatch, message, position, targetElClassName, toolTipClassName]);

  useEffect(() => {
    function onScroll(e) {
      closeTooltip();
    }
    document.addEventListener("scroll", onScroll, true);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [closeTooltip, dispatch]);

  const handleToolTip = (event) => {
    const { type, target } = event;
    if (type === "mouseover") {
      changeToolTipContent();
    } else {
      closeTooltip();
    }
  };

  useEffect(() => {
    if (!ref || !changeToolTipContent || !closeTooltip) {
      return;
    }
    ref.current = {};
    ref.current.changeToolTipContent = changeToolTipContent;
    ref.current.closeTooltip = closeTooltip;
  }, [changeToolTipContent, closeTooltip, ref]);

  return (
    <div
      className={className}
      onMouseOver={handleToolTip}
      onMouseOut={handleToolTip}
      onMouseLeave={handleToolTip}
      ref={refTarget}
    >
      {children}
    </div>
  );
});

ToolTip.displayName = "ToolTip";

export default ToolTip;
