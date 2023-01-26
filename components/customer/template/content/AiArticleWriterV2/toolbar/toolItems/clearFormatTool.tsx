import { MouseEventHandler } from "react";
import ToolItem from "./toolItem";

const ClearFormatTool: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
  className?: string;
}> = ({ onClick, selected }) => {
  return (
    <ToolItem onClick={onClick} selected={selected}>
      <svg width="24" viewBox="0 0 24 24">
        <rect stroke="none" fill="none" width="24" height="24" rx="4"></rect>
        <path
          d="M16.8328726 18L5.29441111 6h1.37271624L18.2055889 18h-1.3727163zm-5.7179705 0h-1.0214709l.953124-4.574995.8395651.8731477L11.1149021 18zm1.5097756-7.2469228l-.8395651-.87314768L12.3850979 7H9.01594957l-.96153846-1H18v1h-4.5934312l-.7818911 3.7530772z"
          stroke="currentColor"
          fill="currentColor"
        ></path>
      </svg>
    </ToolItem>
  );
};

export default ClearFormatTool;
