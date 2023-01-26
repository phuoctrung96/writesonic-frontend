import { MouseEventHandler } from "react";
import ToolItem from "./toolItem";

const BoldTool: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
}> = ({ onClick, selected }) => {
  return (
    <ToolItem onClick={onClick} selected={selected}>
      <svg width="24" viewBox="0 0 24 24">
        <path
          d="M17 14.5c0 1.9329966-1.5670034 3.5-3.5 3.5H8V6h4.5C14.4329966 6 16 7.56700338 16 9.5c0 .7565678-.240051 1.4570687-.6481422 2.029492C16.3415826 12.1478064 17 13.2470124 17 14.5zM10 8v3h2.5c.8284271 0 1.5-.6715729 1.5-1.5 0-.82842712-.6715729-1.5-1.5-1.5H10zm0 5v3h3.5c.8284271 0 1.5-.6715729 1.5-1.5s-.6715729-1.5-1.5-1.5H10z"
          stroke="currentColor"
          fill="currentColor"
        ></path>
      </svg>
    </ToolItem>
  );
};

export default BoldTool;
