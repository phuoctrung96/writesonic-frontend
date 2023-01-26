import { MouseEventHandler } from "react";
import ToolItem from "./toolItem";

const Head2SizeTool: React.FC<{
  onClick?: MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
}> = ({ onClick, selected }) => {
  return (
    <ToolItem onClick={onClick} selected={selected}>
      <svg width="24" viewBox="0 0 24 24">
        <rect stroke="none" fill="none" width="24" height="24" rx="4"></rect>
        <path
          d="M6 11h5V6h1v12h-1v-6H6v6H5V6h1v5zm7.9034082 7v-.7670447l2.8806791-3.1534061c1.0099422-1.1036921 1.4829531-1.7002825 1.4829531-2.5056794 0-.9204523-.7244311-1.4999986-1.6704529-1.4999986-1.0099422 0-1.6534075.6605107-1.6534075 1.6534075h-1.0056809c0-1.5340894 1.1633512-2.57386117 2.6931793-2.57386117 1.5340894 0 2.6249975 1.07386257 2.6249975 2.42045227 0 .9673286-.4431814 1.7173279-1.94318 3.3238604l-1.9602254 2.0965889v.0681818h4.0568143V18h-5.5056766z"
          stroke="currentColor"
          fill="currentColor"
        ></path>
      </svg>
    </ToolItem>
  );
};

export default Head2SizeTool;
