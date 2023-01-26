import { ExternalLinkIcon } from "@heroicons/react/outline";
import SmPinkButton from "../../../../buttons/smPinkButton";
import ApiKey from "./apiKey";
import Rates from "./rates";

const ApiDetail: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <a
          className="flex justify-center items-center w-full"
          href="https://api.writesonic.com/api-docs/"
          target="_blank"
          rel="noreferrer"
        >
          <SmPinkButton className="w-full mt-3">
            <ExternalLinkIcon className="h-4 w-4 text-white mr-1" />
            View API Docs
          </SmPinkButton>
        </a>
      </div>
      <ApiKey />
      <Rates />
    </div>
  );
};
export default ApiDetail;
