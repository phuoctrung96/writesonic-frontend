import { MouseEventHandler } from "react";
import ToolItem from "./toolItem";

const BulletListTool: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
}> = ({ onClick, selected }) => {
  return (
    <ToolItem onClick={onClick} selected={selected}>
      <svg width="24" viewBox="0 0 24 24">
        <path
          d="M10.5 8c-.2761424 0-.5-.22385763-.5-.5 0-.27614237.2238576-.5.5-.5h7c.2761424 0 .5.22385763.5.5 0 .27614237-.2238576.5-.5.5h-7zm-4 5.5c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1 1 .4477153 1 1-.44771525 1-1 1zm0 5c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1 1 .4477153 1 1-.44771525 1-1 1zm0-10c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1 1 .44771525 1 1-.44771525 1-1 1zm4 9.5c-.2761424 0-.5-.2238576-.5-.5s.2238576-.5.5-.5h7c.2761424 0 .5.2238576.5.5s-.2238576.5-.5.5h-7zm0-5c-.2761424 0-.5-.2238576-.5-.5s.2238576-.5.5-.5h7c.2761424 0 .5.2238576.5.5s-.2238576.5-.5.5h-7z"
          stroke="currentColor"
          fill="currentColor"
        ></path>
      </svg>
    </ToolItem>
  );
};

export default BulletListTool;
