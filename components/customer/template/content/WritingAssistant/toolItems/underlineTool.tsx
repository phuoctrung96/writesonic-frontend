import { MouseEventHandler } from "react";
import ToolItem from "./toolItem";

const UnderlineTool: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
}> = ({ onClick, selected }) => {
  return (
    <ToolItem onClick={onClick} selected={selected}>
      <svg width="24" viewBox="0 0 24 24">
        <rect stroke="none" fill="none" width="24" height="24" rx="4"></rect>
        <path
          d="M7.5 6h1v6.5c0 1.9329966 1.5670034 3.5 3.5 3.5s3.5-1.5670034 3.5-3.5V6h1v6.5c0 2.4852814-2.0147186 4.5-4.5 4.5-2.48528137 0-4.5-2.0147186-4.5-4.5V6zM6 20v-1h12v1H6z"
          stroke="currentColor"
          fill="currentColor"
        ></path>
      </svg>
    </ToolItem>
  );
};

export default UnderlineTool;
