import classNames from "classnames";
import { MouseEventHandler } from "react";
import { OutputGenerate } from "../../../../../../api/content";
import BoldTool from "../toolItems/boldTool";
import BulletListTool from "../toolItems/bulletListTool";
import ClearFormatTool from "../toolItems/clearFormatTool";
import Head1SizeTool from "../toolItems/head1SizeTool";
import Head2SizeTool from "../toolItems/head2SizeTool";
import ItalicTool from "../toolItems/italicTool";
import LinkTool from "../toolItems/linkTool";
import NumberedListTool from "../toolItems/numberedListTool";
import UnderlineTool from "../toolItems/underlineTool";

export const BULLET: string = "bullet";
export const ORDERED: string = "ordered";

interface PopupToolbarProps {
  variation: { data: OutputGenerate; range; endpoint };
  handleBorder: MouseEventHandler<HTMLDivElement>;
  handleItalic: MouseEventHandler<HTMLDivElement>;
  handleUnderline: MouseEventHandler<HTMLDivElement>;
  handleHeaderFormat: Function;
  handleLink: MouseEventHandler<HTMLDivElement>;
  handleNumberedList: MouseEventHandler<HTMLDivElement>;
  handleBullet: MouseEventHandler<HTMLDivElement>;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  listFormat: string;
  headerFormat: number;
  handleRemoveFormat: MouseEventHandler<HTMLDivElement>;
}

const PopupToolbar: React.FC<PopupToolbarProps> = ({
  variation,
  handleBorder,
  handleItalic,
  handleUnderline,
  handleHeaderFormat,
  handleLink,
  handleNumberedList,
  handleBullet,
  isBold,
  isItalic,
  isUnderline,
  listFormat,
  headerFormat,
  handleRemoveFormat,
}) => {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-sm shadow-md">
      <div
        className={classNames(
          (variation?.data?.count ?? 0) > 0 ? "flex" : "hidden",
          "justify-center items-center"
        )}
      >
        <BoldTool onClick={handleBorder} selected={isBold} />
        <ItalicTool onClick={handleItalic} selected={isItalic} />
        <UnderlineTool onClick={handleUnderline} selected={isUnderline} />
      </div>
      <div className="flex justify-center items-center border-l border-gray-200">
        <Head1SizeTool
          onClick={() => handleHeaderFormat(1)}
          selected={headerFormat === 1}
        />
        <Head2SizeTool
          onClick={() => handleHeaderFormat(2)}
          selected={headerFormat === 2}
        />
      </div>
      <div className="flex justify-center items-center border-l border-gray-200">
        <LinkTool onClick={handleLink} />
      </div>
      <div className="flex justify-center items-center border-l border-gray-200">
        <NumberedListTool
          onClick={handleNumberedList}
          selected={listFormat === ORDERED}
        />
        <BulletListTool
          onClick={handleBullet}
          selected={listFormat === BULLET}
        />
      </div>
      <div className="flex justify-center items-center border-l border-gray-200">
        <ClearFormatTool onClick={handleRemoveFormat} />
      </div>
    </div>
  );
};

export default PopupToolbar;
