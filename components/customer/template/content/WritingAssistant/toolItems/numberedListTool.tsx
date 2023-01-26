import { MouseEventHandler } from "react";
import ToolItem from "./toolItem";

const NumberedListTool: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected: boolean;
}> = ({ onClick, selected }) => {
  return (
    <ToolItem onClick={onClick} selected={selected}>
      <svg width="24" viewBox="0 0 24 24">
        <rect stroke="none" fill="none" width="24" height="24" rx="4"></rect>
        <path
          d="M7.28569043 17H9v1H6v-.7643054c0-.2985079.13335599-.5814079.36361705-.7713733l1.45457443-1.2000239C7.933322 15.1693147 8 15.0278648 8 14.8786108V14.425c0-.234721-.19027898-.425-.425-.425H7.5c-.27614237 0-.5.2238576-.5.5v.5H6v-.5c0-.8284271.67157288-1.5 1.5-1.5h.075C8.36200577 13 9 13.6379942 9 14.425v.4536108c0 .4477619-.20003399.8721118-.54542557 1.1570599L7.28569043 17zM9 10v1H6v-1h1V7H6V6h2v4h1zm2.5-2c-.2761424 0-.5-.22385763-.5-.5 0-.27614237.2238576-.5.5-.5h7c.2761424 0 .5.22385763.5.5 0 .27614237-.2238576.5-.5.5h-7zm0 10c-.2761424 0-.5-.2238576-.5-.5s.2238576-.5.5-.5h7c.2761424 0 .5.2238576.5.5s-.2238576.5-.5.5h-7zm0-5c-.2761424 0-.5-.2238576-.5-.5s.2238576-.5.5-.5h7c.2761424 0 .5.2238576.5.5s-.2238576.5-.5.5h-7z"
          stroke="currentColor"
          fill="currentColor"
        ></path>
      </svg>
    </ToolItem>
  );
};

export default NumberedListTool;
