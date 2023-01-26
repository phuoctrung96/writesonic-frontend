import { useRouter } from "next/router";

const AntivirusBanner: React.FC = () => {
  const router = useRouter();
  return (
    <div className="block sm:flex justify-center items-center bg-yellow-500 px-2 py-2 text-xs text-gray-100 font-medium mb-4">
      <div className="flex justify-center items-start sm:items-center px-2">
        <p>
          <b>Getting Unknown Server Error?</b> Please disable your antivirus and
          try again!
        </p>
      </div>
    </div>
  );
};

export default AntivirusBanner;
