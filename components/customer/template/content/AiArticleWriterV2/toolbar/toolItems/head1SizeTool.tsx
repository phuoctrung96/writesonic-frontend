import { MouseEventHandler } from "react";
import ToolItem from "./toolItem";

const Head1SizeTool: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
}> = ({ onClick, selected }) => {
  return (
    <ToolItem onClick={onClick} selected={selected}>
      <svg width="24" viewBox="0 0 24 24">
        <rect stroke="none" fill="none" width="24" height="24" rx="4"></rect>
        <path
          d="M6 11h5V6h1v12h-1v-6H6v6H5V6h1v5zm11.6477238-1.7272644V18h-1.0056809v-7.193175h-.0681817c-.1235794.2386362-.8394879.6477267-1.8409074.6477267v-.8863628c1.3465897 0 1.9730095-1.20596475 2.0284072-1.2954533h.8863628z"
          stroke="currentColor"
          fill="currentColor"
        ></path>
      </svg>
    </ToolItem>
  );
};

export default Head1SizeTool;
