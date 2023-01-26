import classNames from "classnames";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { OutputGenerate } from "../../../../../api/content";
import {
  setIsShowPopupMenu,
  setIsShowVariationPanel,
} from "../../../../../store/writingAssistant/actions";
import Editor from "./editor";
import FormPanel from "./formpanel";
import MainContainer from "./mainContainer";
import ToolBar from "./toolbar";
import VariationPanel from "./variationPanel";

interface WritingAssistantProps {
  isShowVariationPanel: boolean;
  variation: { data: OutputGenerate; range; endpoint };
}

const delayTime = 300;

const WritingAssistant: React.FC<WritingAssistantProps> = ({
  variation,
  isShowVariationPanel,
}) => {
  const mounted = useRef(false);
  const formPanelRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [isShowVariation, setIsShowVariation] = useState<boolean>(false);
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (variation?.data?.count) {
      dispatch(setIsShowPopupMenu(false));
      if (mounted.current) {
        setIsShowVariation(true);
      }
      setTimeout(() => {
        dispatch(setIsShowVariationPanel(true));
      }, delayTime);
    }
  }, [dispatch, variation, variation?.data?.count]);

  const handleHotkey = (range, context) => {
    formPanelRef?.current?.generate();
  };

  const onShowVariationPanel = () => {
    const newData = !isShowVariation;
    if (newData) {
      dispatch(setIsShowPopupMenu(false));
      if (mounted.current) {
        setIsShowVariation(newData);
      }
      setTimeout(() => {
        dispatch(setIsShowVariationPanel(newData));
      }, delayTime);
    } else {
      dispatch(setIsShowVariationPanel(newData));
      setTimeout(() => {
        if (mounted.current) {
          setIsShowVariation(newData);
        }
      }, delayTime);
    }
  };

  useEffect(() => {
    if (!variation) {
      setTimeout(() => {
        if (mounted.current) {
          setIsShowVariation(false);
        }
      }, delayTime);
    }
  }, [variation]);

  return (
    <>
      <div className="flex-1 flex overflow-y-auto overflow-x-hidden ">
        <MainContainer
          mainClassName="block lg:flex justify-between flex-1 pb-12 overflow-y-hidden"
          leftContentClassName="flex flex-col overflow-y-auto overflow-x-hidden md:rounded-l-lg"
          rightContentClassName={classNames(
            "col-span-2 overflow-y-auto overflow-x-hidden transition-color duration-300",
            isShowVariationPanel ? "bg-root" : "bg-white",
            isShowVariation
              ? "transition-all duration-200 h-2/5 lg:h-full"
              : "h-full"
          )}
          leftContent={<FormPanel ref={formPanelRef} />}
          rightContent={<VariationPanel className="overflow-x-hidden" />}
        >
          <Editor
            className={classNames(
              "relative flex-1 overflow-y-hidden relative pt-2 sm:pt-0",
              isShowVariation
                ? "transition-all duration-200 h-3/5 lg:h-full shadow-md lg:shadow-none"
                : "h-full"
            )}
            handleHotkey={handleHotkey}
          />
        </MainContainer>
        <div className="w-full absolute left-0 right-0 bottom-0">
          <ToolBar onShowVariationPanel={onShowVariationPanel} />
        </div>
      </div>
    </>
  );
};

const Content: React.FC<{
  id?: string;
  children: ReactNode;
  className?: string;
}> = ({ id, children, className }) => {
  return (
    <div id={id} className={classNames("h-full pb-8", className ?? "")}>
      {children}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    variation: state.writingAssistant?.variation,
    isShowVariationPanel: state.writingAssistant?.isShowVariationPanel,
  };
};

export default connect(mapStateToPros)(WritingAssistant);
