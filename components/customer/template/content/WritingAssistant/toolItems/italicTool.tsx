import { MouseEventHandler } from "react";
import ToolItem from "./toolItem";

const ItalicTool: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
}> = ({ onClick, selected }) => {
  return (
    <ToolItem onClick={onClick} selected={selected}>
      <svg width="24" viewBox="0 0 24 24">
        <path
          d="M10.5827118 17l1.8181818-10H10V6h6v1h-2.5827118l-1.8181818 10H14v1H8v-1h2.5827118z"
          stroke="currentColor"
          fill="currentColor"
        ></path>
      </svg>
    </ToolItem>
  );
};

export default ItalicTool;
