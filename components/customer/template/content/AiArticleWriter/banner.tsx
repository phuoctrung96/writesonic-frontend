import { openHelpScout } from "../../../../../utils/helpScout";

const Banner: React.FC = () => {
  return (
    <p className="bg-red-50 px-3 py-2 rounded-sm text-base font-bold text-red-800 relative">
      We have improved our article AI. Try it out and{" "}
      <span
        className="cursor-pointer hover:text-indigo-700 underline"
        onClick={openHelpScout}
      >
        let us know what you think.
      </span>
      <span className="flex h-3 w-3 absolute -top-1 -right-1">
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        </span>
      </span>
    </p>
  );
};

export default Banner;
