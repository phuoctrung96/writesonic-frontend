import { ArrowSmRightIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";

const PromotionBanner: React.FC<{ hideLink?: boolean }> = ({
  hideLink = false,
}) => {
  const router = useRouter();
  const handleFix = () => {
    router.push("/settings/billing", undefined, { shallow: true });
  };
  return (
    <div className="block sm:flex justify-center items-center bg-red-600 px-2 py-2 text-normal text-gray-100 font-medium">
      <div className="flex justify-center items-start sm:items-center px-2">
        <p>
          <b>System Notice:</b> We are doing some maintenance and will be back
          soon!
        </p>
      </div>
      {!hideLink && (
        <Link href="/settings/billing" shallow>
          <a
            // target="_blank"
            className="px-2 underline flex justify-center items-center font-bold hover:text-red-100"
          >
            <span>Subscribe now</span>
            <ArrowSmRightIcon className="w-7" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default PromotionBanner;
