import Image from "next/image";
import { MouseEventHandler } from "react";
import iconImage from "../../../../../../../public/images/icon-image.png";
import XsWhiteButton from "../../../../../../buttons/xsWhiteButton";

const ImageTool: React.FC<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ onClick }) => {
  return (
    <XsWhiteButton onClick={onClick}>
      <Image src={iconImage} alt="image" width={20} height={20} />
    </XsWhiteButton>
  );
};

export default ImageTool;
