import Image from "next/image";
import { ReactNode } from "react";

const IntegrationBlock: React.FC<{
  imageSrc: any;
  title: string;
  description: string;
  children: ReactNode;
  width: number;
  height: number;
}> = ({ imageSrc, title, description, children, width, height }) => {
  return (
    <div className="w-full bg-white shadow px-4 py-4 mx-auto rounded-lg">
      <div className="flex items-center">
        <Image src={imageSrc} alt="Semrush" width={width} height={height} />
        <p className="ml-2 text-medium text-lg font-medium text-gray-900">
          {title}
        </p>
      </div>
      <p className="mt-2 mb-4 text-medium text-sm font-medium text-gray-700">
        {description}
      </p>
      {children}
    </div>
  );
};

export default IntegrationBlock;
