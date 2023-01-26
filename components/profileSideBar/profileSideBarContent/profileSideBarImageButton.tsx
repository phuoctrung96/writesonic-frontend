import { MouseEventHandler, ReactNode } from "react";

const ProfileSideBarImageButton: React.FC<{
  name: string;
  detail: string;
  children: ReactNode;
  className: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}> = ({ name, detail, children, className, onClick }) => {
  return (
    <div
      className="flex items-center cursor-pointer hover:bg-profile-h pr-3 py-2.5 px-4 sm:px-6"
      onClick={onClick}
    >
      <div
        className={`${className} bg-opacity-10 rounded-xl w-9 h-9 flex justify-center items-center`}
      >
        {children}
      </div>
      <div className="pl-3">
        <p className="text-gray-0 text-sm font-medium">{name}</p>
        <p className="text-gray-500 text-xs font-normal">{detail}</p>
      </div>
    </div>
  );
};

export default ProfileSideBarImageButton;
