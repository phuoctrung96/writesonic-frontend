import { ReactNode } from "react";
import { Position } from "../../components/tooltip";

export const SET_TOOL_TIP_CONTENT: string = "SET_TOOL_TIP_CONTENT";

export interface ToolTipContentData {
  message: string | ReactNode;
  boundTarget: {
    readonly bottom: number;
    readonly height: number;
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly width: number;
    readonly x: number;
    readonly y: number;
    toJSON(): any;
  };
  position: Position;
  className: string;
}

export const setToolTipContent = (content: ToolTipContentData) => {
  return { type: SET_TOOL_TIP_CONTENT, payload: content };
};
