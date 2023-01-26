import { useRouter } from "next/router";

const PromotionBannerNoButton: React.FC = () => {
  const router = useRouter();
  const handleFix = () => {
    router.push("/settings/billing", undefined, { shallow: true });
  };
  return (
    <div className="block sm:flex justify-center items-center bg-yellow-500 px-2 py-2 text-normal text-gray-100 font-medium mb-4">
      <div className="flex justify-center items-start sm:items-center px-2">
        <p>
          &#10024; <b>Extended New Year Offer:</b> Save <b>20%</b> for one year
          on any of our plans with the code <b>NEWYEAR</b> &#10024;
        </p>
      </div>
    </div>
  );
};

export default PromotionBannerNoButton;
